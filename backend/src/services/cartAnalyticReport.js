const REPORT_TIME_ZONE = 'America/Sao_Paulo';
const CRITICAL_DEFAULT_PERCENT = 50;
const FILL_BUCKETS = [0, 25, 50, 75, 100];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function nearestFillBucket(value) {
  const number = finiteNumber(value);
  if (number === null) return 0;
  return FILL_BUCKETS.reduce((best, bucket) => (
    Math.abs(bucket - number) < Math.abs(best - number) ? bucket : best
  ), FILL_BUCKETS[0]);
}

function parseTime(value) {
  const time = new Date(value || '').getTime();
  return Number.isFinite(time) ? time : null;
}

function formatDate(value) {
  const time = parseTime(value);
  if (time === null) return '--';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: REPORT_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(time));
}

function formatDateShort(value) {
  const time = parseTime(value);
  if (time === null) return '--';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: REPORT_TIME_ZONE,
    day: '2-digit',
    month: '2-digit'
  }).format(new Date(time));
}

function formatTime(value) {
  const time = parseTime(value);
  if (time === null) return '--';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: REPORT_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(time));
}

function dateParts(value) {
  const time = parseTime(value);
  if (time === null) return null;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date(time));
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(byType.year),
    month: Number(byType.month),
    day: Number(byType.day)
  };
}

function localDayStartMs(value) {
  const parts = dateParts(value);
  if (!parts) return null;
  return Date.UTC(parts.year, parts.month - 1, parts.day, 3, 0, 0, 0);
}

function addDays(ms, days) {
  return ms + days * 24 * 60 * 60 * 1000;
}

function formatDuration(minutes) {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value <= 0) return '0 min';
  if (value < 60) return `${Math.round(value)} min`;
  const hours = Math.floor(value / 60);
  const rest = Math.round(value % 60);
  return rest ? `${hours}h${String(rest).padStart(2, '0')}` : `${hours}h`;
}

function average(values) {
  const valid = values.map(finiteNumber).filter((value) => value !== null);
  if (!valid.length) return 0;
  return Math.round(valid.reduce((sum, value) => sum + value, 0) / valid.length);
}

function sortByTime(items) {
  return [...(Array.isArray(items) ? items : [])]
    .map((item) => ({ ...item, _time: parseTime(item.ts || item.createdAt || item.receivedAt) }))
    .filter((item) => item._time !== null)
    .sort((a, b) => a._time - b._time);
}

function criticalPercentFromSamples(samples) {
  const sample = samples.find((item) => finiteNumber(item.criticalPercent) !== null);
  return finiteNumber(sample?.criticalPercent) ?? CRITICAL_DEFAULT_PERCENT;
}

function operationalMinutes(samples, criticalPercent) {
  const sorted = sortByTime(samples);
  let free = 0;
  let critical = 0;

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const current = sorted[index];
    const next = sorted[index + 1];
    const diff = Math.max(0, Math.round((next._time - current._time) / 60000));
    if (finiteNumber(current.fill) >= criticalPercent) critical += diff;
    else free += diff;
  }

  return { free, critical };
}

function buildResponseWindows(alerts, exchanges) {
  const criticalAlerts = sortByTime(alerts).filter((alert) => ['critical', 'recurrence'].includes(alert.type));
  const sortedExchanges = sortByTime(exchanges);
  const windows = [];
  let usedUntil = 0;

  for (const exchange of sortedExchanges) {
    const alert = criticalAlerts.find((item) => item._time > usedUntil && item._time <= exchange._time);
    if (!alert) continue;
    const minutes = Math.max(0, Math.round((exchange._time - alert._time) / 60000));
    windows.push({ alert, exchange, minutes });
    usedUntil = exchange._time;
  }

  return windows;
}

function bucketPeriodLabel(hour) {
  if (hour >= 6 && hour < 12) return 'Manhã';
  if (hour >= 12 && hour < 18) return 'Tarde';
  if (hour >= 18 && hour < 24) return 'Noite';
  return 'Madrugada';
}

function hourInReportTimeZone(value) {
  const time = parseTime(value);
  if (time === null) return 0;
  const hour = new Intl.DateTimeFormat('pt-BR', {
    timeZone: REPORT_TIME_ZONE,
    hour: '2-digit',
    hour12: false
  }).format(new Date(time));
  return Number(hour);
}

function activityByPeriod(alerts, exchanges) {
  const periods = new Map(['Madrugada', 'Manhã', 'Tarde', 'Noite'].map((label) => [label, {
    label,
    alerts: 0,
    exchanges: 0
  }]));

  for (const alert of alerts.filter((item) => item.type === 'critical')) {
    periods.get(bucketPeriodLabel(hourInReportTimeZone(alert.ts))).alerts += 1;
  }
  for (const exchange of exchanges) {
    periods.get(bucketPeriodLabel(hourInReportTimeZone(exchange.ts))).exchanges += 1;
  }

  return Array.from(periods.values()).map((period) => ({
    ...period,
    total: period.alerts + period.exchanges
  }));
}

function buildReportMetrics(dataset) {
  const samples = sortByTime(dataset?.chart?.samples || []);
  const exchanges = sortByTime(dataset?.chart?.validatedExchanges || []);
  const alerts = sortByTime(dataset?.alerts || []);
  const criticalPercent = criticalPercentFromSamples(samples);
  const fills = samples.map((sample) => nearestFillBucket(sample.fill));
  const operations = operationalMinutes(samples, criticalPercent);
  const responseWindows = buildResponseWindows(alerts, exchanges);
  const responseMinutes = responseWindows.map((item) => item.minutes);
  const generatedAt = dataset?.generatedAt || new Date().toISOString();
  const firstSample = samples[0]?.ts || generatedAt;
  const lastSample = samples[samples.length - 1]?.ts || generatedAt;
  const periodStart = firstSample;
  const periodEnd = generatedAt;
  const criticalAlerts = alerts.filter((alert) => alert.type === 'critical');

  return {
    generatedAt,
    samples,
    exchanges,
    alerts,
    criticalAlerts,
    criticalPercent,
    periodStart,
    periodEnd,
    minFill: fills.length ? Math.min(...fills) : 0,
    maxFill: fills.length ? Math.max(...fills) : 0,
    avgFill: average(fills),
    freeMinutes: operations.free,
    criticalMinutes: operations.critical,
    avgResponseMinutes: average(responseMinutes),
    maxResponseMinutes: responseMinutes.length ? Math.max(...responseMinutes) : 0,
    responseWindows,
    activity: activityByPeriod(alerts, exchanges),
    lastSample
  };
}

function buildAxisTicks(startMs, endMs) {
  const ticks = [];
  let cursor = startMs;
  while (cursor <= endMs) {
    ticks.push(cursor);
    cursor = addDays(cursor, 1);
  }
  if (!ticks.length || ticks[ticks.length - 1] < endMs) ticks.push(endMs);
  return ticks;
}

function buildDailyOccupancyPoints(metrics, startMs, endMs) {
  const byDay = new Map();
  for (const sample of metrics.samples) {
    const day = localDayStartMs(sample.ts);
    if (day === null) continue;
    const fill = nearestFillBucket(sample.fill);
    const current = byDay.get(day);
    byDay.set(day, current === undefined ? fill : Math.max(current, fill));
  }

  const points = [];
  let cursor = startMs;
  let lastFill = 0;
  while (cursor <= endMs) {
    if (byDay.has(cursor)) lastFill = byDay.get(cursor);
    points.push({ time: cursor, fill: lastFill });
    cursor = addDays(cursor, 1);
  }
  return points.length ? points : [{ time: startMs, fill: 0 }];
}

function buildOccupancyChart(metrics) {
  const width = 760;
  const height = 300;
  const left = 45;
  const right = 30;
  const top = 26;
  const bottom = 64;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const startMs = localDayStartMs(metrics.periodStart) ?? parseTime(metrics.periodStart) ?? Date.now();
  const endMs = Math.max(
    addDays(localDayStartMs(metrics.periodEnd) ?? Date.now(), 1),
    parseTime(metrics.periodEnd) || Date.now()
  );
  const span = Math.max(1, endMs - startMs);
  const x = (time) => left + ((time - startMs) / span) * plotW;
  const y = (fill) => top + (1 - clamp(fill, 0, 100) / 100) * plotH;
  const samples = buildDailyOccupancyPoints(metrics, startMs, endMs);
  const points = samples.map((sample) => `${x(sample.time).toFixed(1)},${y(sample.fill).toFixed(1)}`).join(' ');
  const areaPoints = `${left},${y(0).toFixed(1)} ${points} ${x(samples[samples.length - 1].time).toFixed(1)},${y(0).toFixed(1)}`;
  const ticks = buildAxisTicks(startMs, endMs);
  const yTicks = [0, 25, 50, 75, 100];
  const exchangeDots = metrics.exchanges.map((exchange) => {
    const cx = x(exchange._time).toFixed(1);
    return `<line x1="${cx}" y1="${top}" x2="${cx}" y2="${top + plotH + 16}" stroke="#0ca66c" stroke-width="1.1" stroke-dasharray="5 5"/><circle cx="${cx}" cy="${y(100).toFixed(1)}" r="3.4" fill="#0ca66c" stroke="#fff" stroke-width="1.7"/>`;
  }).join('');
  const grid = yTicks.map((tick) => `
    <line x1="${left}" y1="${y(tick).toFixed(1)}" x2="${left + plotW}" y2="${y(tick).toFixed(1)}" stroke="#d8e6f6" stroke-dasharray="4 6"/>
    <text x="${left - 10}" y="${(y(tick) + 3).toFixed(1)}" text-anchor="end">${tick}%</text>
  `).join('');
  const xGrid = ticks.map((tick) => `
    <line x1="${x(tick).toFixed(1)}" y1="${top}" x2="${x(tick).toFixed(1)}" y2="${top + plotH}" stroke="#d8e6f6" stroke-dasharray="4 6"/>
    <text x="${x(tick).toFixed(1)}" y="${top + plotH + 22}" text-anchor="middle">${formatDateShort(tick)}</text>
  `).join('');
  const criticalY = y(metrics.criticalPercent);

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="315" role="img" aria-label="Evolução da ocupação dos carrinhos">
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#1577ff" stop-opacity=".22"/>
          <stop offset="100%" stop-color="#1577ff" stop-opacity=".06"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>
      <g class="axis-labels">${grid}${xGrid}</g>
      <polygon points="${areaPoints}" fill="url(#area)"/>
      <line x1="${left}" y1="${criticalY.toFixed(1)}" x2="${left + plotW}" y2="${criticalY.toFixed(1)}" stroke="#ef334e" stroke-width="1.2" stroke-dasharray="5 5"/>
      <rect class="critical-label-bg" x="${left + 8}" y="${(criticalY - 20).toFixed(1)}" width="116" height="16" rx="3" fill="#fff" opacity=".96"/>
      <text x="${left + 12}" y="${(criticalY - 8).toFixed(1)}" fill="#ef334e" font-weight="900">Limite crítico ${metrics.criticalPercent}%</text>
      <polyline points="${points}" fill="none" stroke="#1269d3" stroke-width="3.5" stroke-linejoin="round"/>
      ${exchangeDots}
    </svg>
  `;
}

function buildActivityRows(metrics) {
  return metrics.activity.map((period) => `
    <tr>
      <td>${escapeHtml(period.label)}</td>
      <td>${period.alerts}</td>
      <td>${period.exchanges}</td>
      <td>${period.total}</td>
    </tr>
  `).join('');
}

function buildExchangeSummary(metrics) {
  const withAlert = metrics.responseWindows.length;
  const noAlert = Math.max(0, metrics.exchanges.length - withAlert);
  return `
    <div class="mini-grid two">
      <div><small>Total de trocas</small><strong class="green">${metrics.exchanges.length}</strong><span>No período</span></div>
      <div><small>Trocas após alerta</small><strong class="red">${withAlert}</strong><span>Com tempo de retirada calculado</span></div>
      <div><small>Trocas sem alerta anterior</small><strong>${noAlert}</strong><span>Sem alerta crítico no intervalo</span></div>
      <div><small>Maior tempo até retirada</small><strong class="orange">${formatDuration(metrics.maxResponseMinutes)}</strong><span>Após alerta crítico</span></div>
    </div>
  `;
}

function buildCartAnalyticReportHtml(dataset) {
  const metrics = buildReportMetrics(dataset);
  const periodLabel = `${formatDate(metrics.periodStart)} a ${formatDate(metrics.periodEnd)}`;
  const statusText = metrics.criticalAlerts.length
    ? 'Foram registradas ocorrências críticas'
    : 'Não foram registradas ocorrências críticas';
  const busiest = [...metrics.activity].sort((a, b) => b.total - a.total)[0] || { label: '--', total: 0 };

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Relatório Analítico - Carrinhos</title>
  <style>
    :root{--navy:#072b63;--blue:#1269d3;--blue-2:#1577ff;--soft:#f4f8fd;--line:#d9e5f3;--muted:#61738c;--green:#0ca66c;--red:#ef334e;--orange:#e9850e;--gray:#7d8ca3}
    *{box-sizing:border-box}
    body{margin:0;background:#e8f0f8;color:#10284f;font-family:Arial,Helvetica,sans-serif}
    .sheet{width:794px;min-height:1123px;margin:22px auto;background:#fff;border-top:8px solid var(--navy);box-shadow:0 16px 55px rgba(10,30,60,.18);padding:24px 28px 28px;display:flex;flex-direction:column}
    .report-header{display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:center;padding-bottom:16px;border-bottom:1px solid var(--line)}
    .logo-row{display:flex;align-items:center;gap:16px}.logo-row img{object-fit:contain}.idvida{width:82px;height:36px}.einstein{width:104px;height:36px;border-left:1px solid var(--line);padding-left:14px}
    h1{margin:0;color:var(--navy);font-size:20px;line-height:1.1;text-transform:uppercase}.subtitle{margin:5px 0 0;color:#60738d;font-size:10px;font-weight:700}.period{text-align:right;color:#5d7088;font-size:9px;font-weight:800}.period strong{display:block;margin-top:3px;color:var(--navy);font-size:10px}.badge{display:inline-grid;place-items:center;margin-top:8px;width:102px;height:18px;border-radius:4px;background:var(--navy);color:#fff;font-size:9px;font-weight:900}
    .device-strip{margin-top:14px;border:1px solid #bfd4ef;border-radius:5px;display:block;padding:15px 18px}.device-strip h2{margin:0 0 9px;color:#064ca8;font-size:15.5px}.device-meta{display:grid;grid-template-columns:115px 120px 1fr;align-items:start;gap:16px;color:#3d5069;font-size:9px;font-weight:800;padding-top:9px;border-top:1px solid #e4edf8}.device-meta span{display:inline-flex;flex-direction:column;gap:3px}.device-meta b{display:inline;margin:0;color:#657891;font-size:8px;text-transform:uppercase}.device-meta .scope-item strong{color:var(--navy);font-size:9.5px;line-height:1.3}
    .kpis{display:grid;grid-template-columns:repeat(7,1fr);margin-top:12px;border:1px solid var(--line);border-radius:5px;overflow:hidden}.kpi{min-height:62px;padding:10px 7px;text-align:center;border-right:1px solid var(--line)}.kpi:last-child{border-right:0}.kpi small{display:block;color:#62758d;font-size:8px;font-weight:900}.kpi strong{display:block;margin-top:4px;color:#1577ff;font-size:17px;line-height:1}.kpi strong.red{color:var(--red)}.kpi strong.green{color:var(--green)}.kpi strong.orange{color:var(--orange)}.kpi span{display:block;margin-top:5px;color:#6d7e94;font-size:7.5px;font-weight:800}
    .section{margin-top:12px;border:1px solid #bfd4ef;border-radius:5px;padding:12px;break-inside:avoid}.section-title{display:flex;gap:8px;margin-bottom:9px}.section-title b{width:18px;height:18px;display:grid;place-items:center;border-radius:4px;background:#0753b5;color:#fff;font-size:9px}.section-title h3{margin:0;color:#0753b5;font-size:11px;line-height:1.15;text-transform:uppercase}.section-title p{margin:3px 0 0;color:#687b94;font-size:8.5px;font-weight:700;line-height:1.35}
    .history-grid{display:grid;grid-template-columns:1fr;gap:10px}.chart-card{min-height:315px;padding:8px 0 2px}.chart-head{display:flex;justify-content:center;gap:20px;color:#425776;font-size:7.8px;font-weight:900;margin-bottom:2px}.chart-head i,.legend i{display:inline-block;width:12px;height:3px;margin-right:4px;vertical-align:2px;border-radius:3px;background:var(--blue)}.chart-head .crit i{background:var(--red)}.chart-head .exchange i{background:var(--green)}.axis-labels text{fill:#082a5d;font-size:8px;font-weight:900}.reading-box{border-top:1px solid var(--line);padding-top:9px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.reading-box h4{grid-column:1/-1;margin:0 0 2px;padding-bottom:5px;color:var(--navy);font-size:9px;text-transform:uppercase;border-bottom:1px solid var(--line)}.reading-box div{min-height:42px;padding:7px 8px;border:1px solid var(--line);border-radius:4px;background:#fbfdff}.reading-box small{display:block;color:#64768f;font-size:7.8px;font-weight:900}.reading-box strong{display:block;margin-top:2px;color:var(--navy);font-size:12px}.reading-box .red{color:var(--red)}.reading-box .green{color:var(--green)}.mini-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.mini-grid div{border:1px solid var(--line);border-radius:4px;min-height:48px;display:grid;place-items:center;text-align:center;padding:7px 6px;background:#fff}.mini-grid small{color:#60738c;font-size:7.2px;font-weight:900;text-transform:uppercase}.mini-grid strong{color:var(--blue);font-size:14px;margin-top:2px}.mini-grid.two{grid-template-columns:repeat(4,1fr)}.green{color:var(--green)!important}.red{color:var(--red)!important}.orange{color:var(--orange)!important}
    .bar-wrap{height:28px;border-radius:5px;overflow:hidden;background:#eef5fd;border:1px solid var(--line);display:flex}.bar{height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:900}.bar.free{background:#1269d3}.bar.critical{background:#ef334e}
    table{width:100%;border-collapse:collapse;font-size:8px;color:#263c5d}th,td{padding:7px 8px;border:1px solid var(--line);text-align:center;white-space:nowrap}th{background:#f5f9ff;color:#395171;font-size:7.2px;text-transform:uppercase}td:first-child,th:first-child{text-align:left}td strong{color:var(--navy)}.note{margin-top:9px;padding:8px 9px;color:#546881;background:var(--soft);border-left:3px solid var(--blue);border-radius:4px;font-size:8.2px;font-weight:700;line-height:1.45}.analysis{display:grid;gap:7px;color:#344b68;font-size:8.6px;line-height:1.5;font-weight:700}.analysis p{margin:0}.signature{margin:18px 0 10px;display:flex;align-items:flex-end;justify-content:space-between;gap:40px}.signature .line{width:260px;text-align:center;color:#53647b;font-size:8px;font-weight:800}.signature .line:before{content:"";display:block;height:28px;border-bottom:1px solid #53647b;margin-bottom:5px}.generated{text-align:right;color:#718197;font-size:7.5px;font-weight:800}.generated strong{display:block;color:var(--navy);font-size:9px;margin-top:2px}footer{margin:10px -28px -28px;margin-top:auto;padding:11px 28px;min-height:42px;display:flex;align-items:center;justify-content:space-between;background:var(--navy);color:#dce9fb;font-size:8px;font-weight:800}.powered{display:flex;align-items:center;gap:8px}.powered img{width:64px;height:24px;object-fit:contain;padding:3px 5px;border-radius:4px;background:#fff}
    @media print{body{background:#fff}.sheet{box-shadow:none;margin:0;width:794px}}
  </style>
</head>
<body>
  <main class="sheet">
    <header class="report-header">
      <div class="logo-row">
        <img class="idvida" src="/assets/idvida-logo.png" alt="IDvida">
        <img class="einstein" src="/assets/einstein-logo.png" alt="Hospital Einstein">
      </div>
      <div>
        <h1>Relatório Analítico</h1>
        <p class="subtitle">Análise da ocupação dos carrinhos e da resposta operacional da sala.</p>
      </div>
      <div class="period">Período analisado<strong>${escapeHtml(periodLabel)}</strong><span class="badge">POC</span></div>
    </header>

    <section class="device-strip">
      <h2>Hospital Einstein</h2>
      <div class="device-meta">
        <span><b>Sala</b>2° Bloco A</span>
        <span><b>Limite crítico</b>${metrics.criticalPercent}%</span>
        <span class="scope-item"><b>Escopo do relatório</b><strong>Ocupação dos carrinhos, alertas críticos e tempo de retirada após alerta.</strong></span>
      </div>
    </section>

    <section class="kpis">
      <div class="kpi"><small>Menor ocupação</small><strong>${metrics.minFill}%</strong><span>Menor faixa registrada</span></div>
      <div class="kpi"><small>Maior ocupação</small><strong class="red">${metrics.maxFill}%</strong><span>Pico registrado</span></div>
      <div class="kpi"><small>Ocupação média</small><strong>${metrics.avgFill}%</strong><span>Período analisado</span></div>
      <div class="kpi"><small>Tempo em crítico</small><strong class="red">${formatDuration(metrics.criticalMinutes)}</strong><span>Tempo acumulado</span></div>
      <div class="kpi"><small>Tempo médio até a retirada</small><strong class="orange">${formatDuration(metrics.avgResponseMinutes)}</strong><span>Após alerta</span></div>
      <div class="kpi"><small>Alertas críticos</small><strong class="red">${metrics.criticalAlerts.length}</strong><span>No período</span></div>
      <div class="kpi"><small>Trocas</small><strong class="green">${metrics.exchanges.length}</strong><span>No período</span></div>
    </section>

    <section class="section">
      <div class="section-title"><b>1</b><div><h3>Evolução da ocupação</h3><p>Mostra a ocupação dos carrinhos, o limite crítico configurado, os alertas críticos e as trocas registradas.</p></div></div>
      <div class="history-grid">
        <div class="chart-card">
          <div class="chart-head">
            <span><i></i>Ocupação</span>
            <span class="crit"><i></i>Limite crítico</span>
            <span class="exchange"><i></i>Troca</span>
          </div>
          ${buildOccupancyChart(metrics)}
        </div>
        <aside class="reading-box">
          <h4>Leitura da ocupação</h4>
          <div><small>Status do período</small><strong class="${metrics.criticalAlerts.length ? 'red' : 'green'}">${escapeHtml(statusText)}</strong></div>
          <div><small>Ocupação média</small><strong>${metrics.avgFill}%</strong></div>
          <div><small>Pico registrado</small><strong>${metrics.maxFill}%</strong></div>
          <div><small>Tempo em crítico</small><strong class="red">${formatDuration(metrics.criticalMinutes)}</strong></div>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><b>2</b><div><h3>Tempo operacional da sala</h3><p>Mostra quanto tempo a sala ficou livre e quanto tempo permaneceu acima do limite crítico.</p></div></div>
      <div class="bar-wrap">
        <div class="bar free" style="width:${Math.max(4, (metrics.freeMinutes / Math.max(1, metrics.freeMinutes + metrics.criticalMinutes)) * 100)}%">Livre</div>
        <div class="bar critical" style="width:${Math.max(4, (metrics.criticalMinutes / Math.max(1, metrics.freeMinutes + metrics.criticalMinutes)) * 100)}%">Crítico</div>
      </div>
      <div class="mini-grid two" style="margin-top:8px">
        <div><small>Tempo livre</small><strong>${formatDuration(metrics.freeMinutes)}</strong><span>Abaixo do limite crítico</span></div>
        <div><small>Tempo em crítico</small><strong class="red">${formatDuration(metrics.criticalMinutes)}</strong><span>Acima do limite configurado</span></div>
        <div><small>Tempo médio até retirada</small><strong class="orange">${formatDuration(metrics.avgResponseMinutes)}</strong><span>Após alerta crítico</span></div>
        <div><small>Maior tempo até retirada</small><strong class="red">${formatDuration(metrics.maxResponseMinutes)}</strong><span>Após alerta crítico</span></div>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><b>3</b><div><h3>Alertas e trocas por horário</h3><p>Mostra em quais períodos houve maior concentração de alertas críticos e trocas.</p></div></div>
      <table>
        <thead><tr><th>Período</th><th>Alertas críticos</th><th>Trocas</th><th>Total operacional</th></tr></thead>
        <tbody>${buildActivityRows(metrics)}</tbody>
      </table>
    </section>

    <section class="section">
      <div class="section-title"><b>4</b><div><h3>Trocas de carrinho</h3><p>Consolida as trocas registradas e o tempo entre alerta crítico e retirada.</p></div></div>
      ${buildExchangeSummary(metrics)}
      <p class="note">As trocas são exibidas no gráfico pelos pontos verdes. A contagem é recalculada com os dados disponíveis no momento da abertura do relatório.</p>
    </section>

    <section class="section">
      <div class="section-title"><b>5</b><div><h3>Tempo após alerta crítico</h3><p>Mostra quanto tempo a operação levou para retirar o carrinho após o alerta crítico.</p></div></div>
      <div class="mini-grid two">
        <div><small>Alertas críticos</small><strong class="red">${metrics.criticalAlerts.length}</strong><span>Enviados no período</span></div>
        <div><small>Retiradas após alerta</small><strong class="green">${metrics.responseWindows.length}</strong><span>Com tempo calculado</span></div>
        <div><small>Tempo médio</small><strong class="orange">${formatDuration(metrics.avgResponseMinutes)}</strong><span>Até a troca</span></div>
        <div><small>Maior exposição</small><strong class="red">${formatDuration(metrics.maxResponseMinutes)}</strong><span>Após alerta crítico</span></div>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><b>6</b><div><h3>Horários de maior atividade</h3><p>Identifica o período com mais pressão operacional, combinando alertas críticos e trocas.</p></div></div>
      <div class="analysis">
        <p>Período de maior movimento: <strong>${escapeHtml(busiest.label)}</strong>, com ${busiest.total} evento(s) operacional(is).</p>
        <p>Esse indicador ajuda a verificar se a equipe de retirada está concentrada nos horários de maior demanda da sala.</p>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><b>7</b><div><h3>Indicadores do período</h3><p>Consolida os principais indicadores operacionais do período analisado.</p></div></div>
      <div class="mini-grid two">
        <div><small>Leituras consideradas</small><strong>${metrics.samples.length}</strong><span>Leituras oficiais</span></div>
        <div><small>Primeira leitura</small><strong>${formatDateShort(metrics.periodStart)}</strong><span>${formatTime(metrics.periodStart)}</span></div>
        <div><small>Última leitura</small><strong>${formatDateShort(metrics.lastSample)}</strong><span>${formatTime(metrics.lastSample)}</span></div>
        <div><small>Relatório gerado</small><strong>${formatDateShort(metrics.generatedAt)}</strong><span>${formatTime(metrics.generatedAt)}</span></div>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><b>8</b><div><h3>Análise do período</h3><p>Resumo objetivo da ocupação, dos alertas críticos e das trocas registradas neste relatório.</p></div></div>
      <div class="analysis">
        <p>A sala teve ocupação média de ${metrics.avgFill}% e pico de ${metrics.maxFill}% no período analisado.</p>
        <p>Foram enviados ${metrics.criticalAlerts.length} alertas críticos e registradas ${metrics.exchanges.length} trocas de carrinho.</p>
        <p>O tempo médio até a retirada após alerta crítico foi de ${formatDuration(metrics.avgResponseMinutes)}.</p>
      </div>
    </section>

    <section class="signature">
      <div class="line">Assinatura do responsável<br><small>Nome e identificação</small></div>
      <div class="generated">Relatório gerado em<strong>${formatDate(metrics.generatedAt)} ${formatTime(metrics.generatedAt)}</strong><span>ID: RA-CR-2A-POC</span></div>
    </section>

    <footer>
      <div class="powered"><span>Powered by</span><img src="/assets/idvida-logo.png" alt="IDvida"></div>
      <strong>ID Sensor - Relatório Analítico</strong>
      <span>Página 1 de 1</span>
    </footer>
  </main>
</body>
</html>`;
}

module.exports = {
  buildCartAnalyticReportHtml,
  buildReportMetrics
};
