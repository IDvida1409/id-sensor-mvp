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

function formatDecimal(value, digits = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '0';
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
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

function reportDayKey(value) {
  const parts = dateParts(value);
  if (!parts) return '';
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
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
  const firstDayKey = reportDayKey(periodStart);
  const lastDayKey = reportDayKey(lastSample);
  const dayCount = Math.max(
    1,
    Math.round(((localDayStartMs(lastSample) ?? Date.now()) - (localDayStartMs(periodStart) ?? Date.now())) / (24 * 60 * 60 * 1000)) + 1
  );
  const firstDayExchanges = exchanges.filter((exchange) => reportDayKey(exchange.ts) === firstDayKey).length;
  const lastDayExchanges = exchanges.filter((exchange) => reportDayKey(exchange.ts) === lastDayKey).length;
  const firstDayAlerts = criticalAlerts.filter((alert) => reportDayKey(alert.ts) === firstDayKey).length;
  const lastDayAlerts = criticalAlerts.filter((alert) => reportDayKey(alert.ts) === lastDayKey).length;
  const firstDayPeak = fills.filter((_, index) => reportDayKey(samples[index]?.ts) === firstDayKey);
  const lastDayPeak = fills.filter((_, index) => reportDayKey(samples[index]?.ts) === lastDayKey);

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
    lastSample,
    dayCount,
    firstDayExchanges,
    lastDayExchanges,
    firstDayAlerts,
    lastDayAlerts,
    firstDayPeak: firstDayPeak.length ? Math.max(...firstDayPeak) : 0,
    lastDayPeak: lastDayPeak.length ? Math.max(...lastDayPeak) : 0
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

function buildDayTicks(startMs, endMs) {
  const ticks = [];
  let cursor = startMs;
  while (cursor <= endMs) {
    ticks.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return ticks.length ? ticks : [startMs];
}

function chartDateLabelStep(totalTicks) {
  if (totalTicks <= 15) return 1;
  if (totalTicks <= 45) return 3;
  if (totalTicks <= 90) return 7;
  return 14;
}

function shouldShowChartDateLabel(index, totalTicks, step) {
  return index === 0 || index === totalTicks - 1 || index % step === 0;
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
  const left = 38;
  const right = 20;
  const top = 20;
  const bottom = 68;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const startMs = localDayStartMs(metrics.periodStart) ?? parseTime(metrics.periodStart) ?? Date.now();
  const endMs = localDayStartMs(metrics.lastSample || metrics.periodEnd) ?? localDayStartMs(metrics.periodEnd) ?? Date.now();
  const span = Math.max(1, endMs - startMs);
  const x = (time) => left + ((time - startMs) / span) * plotW;
  const y = (fill) => top + (1 - clamp(fill, 0, 100) / 100) * plotH;
  const samples = buildDailyOccupancyPoints(metrics, startMs, endMs);
  const ticks = buildDayTicks(startMs, endMs);
  const yTicks = [0, 25, 50, 75, 100];
  const slots = Math.max(1, ticks.length);
  const slotW = plotW / slots;
  const xDay = (time) => {
    const dayIndex = Math.round((time - startMs) / (24 * 60 * 60 * 1000));
    return left + slotW * (dayIndex + 0.5);
  };
  const exchangesByDay = new Map();
  for (const exchange of metrics.exchanges) {
    const day = localDayStartMs(exchange.ts);
    if (day === null) continue;
    exchangesByDay.set(day, (exchangesByDay.get(day) || 0) + 1);
  }
  const maxDailyExchanges = Math.max(...Array.from(exchangesByDay.values()), 1);
  const barW = Math.max(6, slotW * 0.42);
  const bars = samples.map((sample, index) => {
    const dayExchanges = exchangesByDay.get(sample.time) || 0;
    const greenPercent = dayExchanges ? Math.min(18, 5 + (dayExchanges / maxDailyExchanges) * 13) : 0;
    const fill = clamp(sample.fill, 0, 100);
    const normalPercent = Math.min(fill, metrics.criticalPercent);
    const criticalPercent = Math.max(0, fill - metrics.criticalPercent);
    const normalHeight = (normalPercent / 100) * plotH;
    const exchangeHeight = (greenPercent / 100) * plotH;
    const criticalHeight = Math.max(0, (criticalPercent / 100) * plotH - exchangeHeight);
    const center = xDay(sample.time);
    const bx = center - barW / 2;
    let cursor = top + plotH;
    const parts = [];
    if (normalHeight > 0.5) {
      parts.push(`<rect x="${bx.toFixed(1)}" y="${(cursor - normalHeight).toFixed(1)}" width="${barW.toFixed(1)}" height="${normalHeight.toFixed(1)}" fill="#1269d3"/>`);
      cursor -= normalHeight;
    }
    if (exchangeHeight > 0.5) {
      parts.push(`<rect x="${bx.toFixed(1)}" y="${(cursor - exchangeHeight).toFixed(1)}" width="${barW.toFixed(1)}" height="${exchangeHeight.toFixed(1)}" fill="#0ca66c"/>`);
      cursor -= exchangeHeight;
    }
    if (criticalHeight > 0.5) {
      parts.push(`<rect x="${bx.toFixed(1)}" y="${(cursor - criticalHeight).toFixed(1)}" width="${barW.toFixed(1)}" height="${criticalHeight.toFixed(1)}" fill="#ef334e"/>`);
    }
    return parts.join('');
  }).join('');
  const grid = yTicks.map((tick) => `
    <line x1="${left}" y1="${y(tick).toFixed(1)}" x2="${left + plotW}" y2="${y(tick).toFixed(1)}" stroke="#d8e6f6" stroke-dasharray="4 6"/>
    <text x="${left - 10}" y="${(y(tick) + 3).toFixed(1)}" text-anchor="end">${tick}%</text>
  `).join('');
  const labelStep = chartDateLabelStep(ticks.length);
  const xGrid = ticks.map((tick, index) => {
    const dayX = xDay(tick).toFixed(1);
    const label = shouldShowChartDateLabel(index, ticks.length, labelStep)
      ? `<text x="${dayX}" y="${top + plotH + 22}" text-anchor="middle">${formatDateShort(tick)}</text>`
      : '';
    return `
      <line x1="${dayX}" y1="${top}" x2="${dayX}" y2="${top + plotH}" stroke="#d8e6f6" stroke-dasharray="4 6"/>
      ${label}
    `;
  }).join('');
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
      <line x1="${left}" y1="${criticalY.toFixed(1)}" x2="${left + plotW}" y2="${criticalY.toFixed(1)}" stroke="#ef334e" stroke-width="1.2" stroke-dasharray="5 5"/>
      ${bars}
      <line x1="${left}" y1="${top + plotH + 45}" x2="${left + 54}" y2="${top + plotH + 45}" stroke="#ef334e" stroke-width="1.2" stroke-dasharray="5 5"/>
      <text x="${left + 62}" y="${top + plotH + 48}" fill="#61738c" font-size="8.2" font-weight="800">Limite estabelecido como crítico: ${metrics.criticalPercent}%</text>
    </svg>
  `;
}

function buildActivityRows(metrics) {
  const periodTimes = {
    Madrugada: '00h-06h',
    Manhã: '06h-12h',
    Tarde: '12h-18h',
    Noite: '18h-00h'
  };
  const maxExchanges = Math.max(...metrics.activity.map((period) => period.exchanges), 0);
  return metrics.activity.map((period) => `
    <tr>
      <td><strong>${escapeHtml(period.label)}</strong><br>${periodTimes[period.label] || ''}</td>
      <td>${period.alerts}</td>
      <td>${period.exchanges}</td>
      <td>${period.exchanges === 0 ? 'Sem trocas registradas' : period.exchanges === maxExchanges ? 'Maior atividade' : period.exchanges <= 4 ? 'Baixa atividade' : 'Alta atividade'}</td>
    </tr>
  `).join('');
}

function buildCartAnalyticReportHtml(dataset) {
  const metrics = buildReportMetrics(dataset);
  const periodLabel = `${formatDate(metrics.periodStart)} a ${formatDate(metrics.periodEnd)}`;
  const statusText = metrics.criticalAlerts.length
    ? 'Foram registradas ocorrências críticas'
    : 'Não foram registradas ocorrências críticas';
  const busiest = [...metrics.activity].sort((a, b) => b.total - a.total)[0] || { label: '--', total: 0 };
  const busiestAlerts = [...metrics.activity].sort((a, b) => b.alerts - a.alerts)[0] || { label: '--', alerts: 0 };
  const busiestExchanges = [...metrics.activity].sort((a, b) => b.exchanges - a.exchanges)[0] || { label: '--', exchanges: 0 };
  const periodRanges = { Madrugada: '00h às 06h', Manhã: '06h às 12h', Tarde: '12h às 18h', Noite: '18h às 00h' };
  const totalOperationalMinutes = Math.max(1, metrics.freeMinutes + metrics.criticalMinutes);
  const responseVisualMinutes = Math.max(0, metrics.avgResponseMinutes);
  const conditionTotalMinutes = Math.max(1, metrics.freeMinutes + metrics.criticalMinutes + responseVisualMinutes);
  const freeWidth = Math.max(0, (metrics.freeMinutes / conditionTotalMinutes) * 100);
  const responseWidth = Math.max(0, (responseVisualMinutes / conditionTotalMinutes) * 100);
  const criticalWidth = Math.max(0, (metrics.criticalMinutes / conditionTotalMinutes) * 100);
  const withAlert = metrics.responseWindows.length;
  const alertsPerDay = formatDecimal(metrics.criticalAlerts.length / Math.max(1, metrics.dayCount));
  const exchangesPerDay = formatDecimal(metrics.exchanges.length / Math.max(1, metrics.dayCount));

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
    .pdf-action{position:fixed;top:18px;right:22px;z-index:20;appearance:none;border:1px solid #bfd4ef;border-radius:7px;background:#fff;color:var(--navy);box-shadow:0 8px 24px rgba(10,30,60,.14);cursor:pointer;font:inherit;font-size:10px;font-weight:900;padding:8px 12px}
    .pdf-action:hover{background:#f5f9ff;border-color:#9fc0e7}
    .sheet{width:794px;min-height:1123px;margin:22px auto;background:#fff;border-top:8px solid var(--navy);box-shadow:0 16px 55px rgba(10,30,60,.18);padding:24px 28px 28px;display:flex;flex-direction:column}
    .report-header{display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:center;padding-bottom:16px;border-bottom:1px solid var(--line)}
    .logo-row{display:flex;align-items:center;gap:16px}.logo-row img{object-fit:contain}.idvida{width:82px;height:36px}.einstein{width:104px;height:36px;border-left:1px solid var(--line);padding-left:14px}
    h1{margin:0;color:var(--navy);font-size:20px;line-height:1.1;text-transform:uppercase}.subtitle{margin:5px 0 0;color:#60738d;font-size:10px;font-weight:700}.period{text-align:right;color:#5d7088;font-size:9px;font-weight:800}.period strong{display:block;margin-top:3px;color:var(--navy);font-size:10px}.badge{display:inline-grid;place-items:center;margin-top:8px;width:102px;height:18px;border-radius:4px;background:var(--navy);color:#fff;font-size:9px;font-weight:900}
    .device-strip{margin-top:14px;border:1px solid #bfd4ef;border-radius:5px;display:block;padding:15px 18px}.device-strip h2{margin:0 0 9px;color:#064ca8;font-size:15.5px}.device-meta{display:grid;grid-template-columns:115px 120px 1fr;align-items:start;gap:16px;color:#3d5069;font-size:9px;font-weight:800;padding-top:9px;border-top:1px solid #e4edf8}.device-meta span{display:inline-flex;flex-direction:column;gap:3px}.device-meta b{display:inline;margin:0;color:#657891;font-size:8px;text-transform:uppercase}.device-meta .scope-item strong{color:var(--navy);font-size:9.5px;line-height:1.3}
    .kpis{display:grid;grid-template-columns:repeat(7,1fr);margin-top:12px;border:1px solid var(--line);border-radius:5px;overflow:hidden}.kpi{min-height:62px;padding:10px 7px;text-align:center;border-right:1px solid var(--line)}.kpi:last-child{border-right:0}.kpi small{display:block;color:#62758d;font-size:8px;font-weight:900}.kpi strong{display:block;margin-top:4px;color:#1577ff;font-size:17px;line-height:1}.kpi strong.red{color:var(--red)}.kpi strong.green{color:var(--green)}.kpi strong.orange{color:var(--orange)}.kpi span{display:block;margin-top:5px;color:#6d7e94;font-size:7.5px;font-weight:800}
    .section{margin-top:12px;border:1px solid #bfd4ef;border-radius:5px;padding:12px;break-inside:avoid}.section-title{display:flex;gap:8px;margin-bottom:9px}.section-title b{width:18px;height:18px;display:grid;place-items:center;border-radius:4px;background:#0753b5;color:#fff;font-size:9px}.section-title h3{margin:0;color:#0753b5;font-size:10.5px;line-height:1.15;text-transform:uppercase}.section-title p{margin:3px 0 0;color:#687b94;font-size:8.4px;font-weight:700;line-height:1.35}
    .history-grid{display:grid;grid-template-columns:1fr;gap:10px}.chart-card{min-height:315px;padding:8px 0 2px}.chart-head{display:flex;justify-content:center;gap:20px;color:#425776;font-size:7.8px;font-weight:900;margin-bottom:2px}.chart-head i,.legend i{display:inline-block;width:12px;height:8px;margin-right:4px;vertical-align:-1px;border-radius:2px;background:var(--blue)}.chart-head .crit i{background:var(--red)}.chart-head .exchange i{background:var(--green)}.axis-labels text{fill:#082a5d;font-size:8px;font-weight:900}.reading-box{border-top:1px solid var(--line);padding-top:9px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.reading-box h4{grid-column:1/-1;margin:0 0 2px;padding-bottom:5px;color:var(--navy);font-size:9px;text-transform:uppercase;border-bottom:1px solid var(--line)}.reading-box div{min-height:42px;padding:7px 8px;border:1px solid var(--line);border-radius:4px;background:#fbfdff}.reading-box small{display:block;color:#64768f;font-size:7.8px;font-weight:900}.reading-box strong{display:block;margin-top:2px;color:var(--navy);font-size:12px}.reading-box .red{color:var(--red)}.reading-box .green{color:var(--green)}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.condition-bar{height:26px;display:flex;overflow:hidden;border-radius:5px;border:1px solid rgba(5,38,88,.08);margin:14px 0 10px}.condition-bar span{display:block}.condition-bar .normal{background:var(--blue)}.condition-bar .attention{background:var(--orange)}.condition-bar .critical{background:var(--red)}.legend{display:grid;grid-template-columns:1fr 1fr;gap:7px 10px;color:#53647b;font-size:7.2px;font-weight:800}.legend div{display:grid;grid-template-columns:9px 1fr auto;align-items:center;gap:5px}.legend i{width:9px;height:9px;border-radius:2px;margin:0}.legend i.blue{background:var(--blue)}.legend i.red{background:var(--red)}.legend i.green{background:var(--green)}.legend i.attention{background:var(--orange)}.legend i.critical{background:var(--red)}.condition-total{text-align:center;padding-top:9px;margin-top:10px;border-top:1px solid var(--line)}.condition-total small{color:#708097;font-size:7px;font-weight:800}.condition-total strong{display:block;margin-top:2px;color:var(--navy);font-size:14px}
    .mini-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.mini{border:1px solid var(--line);border-radius:4px;min-height:48px;display:grid;place-items:center;text-align:center;padding:7px 6px;background:#fff}.mini small{color:#60738c;font-size:7.2px;font-weight:900;text-transform:uppercase}.mini strong{color:var(--blue);font-size:14px;margin-top:2px}.green{color:var(--green)!important}.red{color:var(--red)!important}.orange{color:var(--orange)!important}
    table{width:100%;border-collapse:collapse;font-size:8px;color:#263c5d}th,td{padding:7px 8px;border:1px solid var(--line);text-align:center;white-space:nowrap}th{background:#f5f9ff;color:#395171;font-size:7.2px;text-transform:uppercase}td:first-child,th:first-child{text-align:left}td strong{color:var(--navy)}.note{margin-top:9px;padding:8px 9px;color:#546881;background:var(--soft);border-left:3px solid var(--blue);border-radius:4px;font-size:8.2px;font-weight:700;line-height:1.45}.analysis{display:grid;gap:7px;color:#344b68;font-size:8.6px;line-height:1.5;font-weight:700}.analysis p{margin:0}.signature{margin:18px 0 10px;display:flex;align-items:flex-end;justify-content:space-between;gap:40px}.signature .line{width:260px;text-align:center;color:#53647b;font-size:8px;font-weight:800}.signature .line:before{content:"";display:block;height:28px;border-bottom:1px solid #53647b;margin-bottom:5px}.generated{text-align:right;color:#718197;font-size:7.5px;font-weight:800}.generated strong{display:block;color:var(--navy);font-size:9px;margin-top:2px}footer{margin:10px -28px -28px;margin-top:auto;padding:11px 28px;min-height:42px;display:flex;align-items:center;justify-content:space-between;background:var(--navy);color:#dce9fb;font-size:8px;font-weight:800}.powered{display:flex;align-items:center;gap:8px}.powered img{width:64px;height:24px;object-fit:contain;padding:3px 5px;border-radius:4px;background:#fff}
    @media print{body{background:#fff}.pdf-action{display:none!important}.sheet{box-shadow:none;margin:0;width:794px}}
  </style>
</head>
<body>
  <button class="pdf-action" type="button" onclick="window.print()">Baixar PDF</button>
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
            <span><i></i>Dentro do limite</span>
            <span class="crit"><i></i>Em crítico</span>
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

    <div class="two-col">
      <section class="section">
        <div class="section-title"><b>2</b><div><h3>Tempo operacional da sala</h3><p>Mostra quanto tempo a sala permaneceu abaixo do limite, em condição crítica e aguardando retirada após alerta crítico.</p></div></div>
        <div class="condition-bar">
          <span class="normal" style="width:${freeWidth}%"></span>
          <span class="attention" style="width:${responseWidth}%"></span>
          <span class="critical" style="width:${criticalWidth}%"></span>
        </div>
        <div class="legend">
          <div><i class="blue"></i><span>Dentro do limite</span><strong>${formatDuration(metrics.freeMinutes)}</strong></div>
          <div><i class="red"></i><span>Em crítico</span><strong>${formatDuration(metrics.criticalMinutes)}</strong></div>
          <div><i class="attention"></i><span>Tempo médio até a retirada</span><strong>${formatDuration(metrics.avgResponseMinutes)}</strong></div>
          <div><i class="critical"></i><span>Maior tempo até a retirada</span><strong>${formatDuration(metrics.maxResponseMinutes)}</strong></div>
        </div>
        <div class="condition-total">
          <small>Período operacional analisado</small>
          <strong>${formatDuration(totalOperationalMinutes)}</strong>
        </div>
        <p class="note">Dentro do limite indica ocupação abaixo de ${metrics.criticalPercent}%. O tempo até a retirada considera o intervalo entre o alerta crítico e a troca do carrinho.</p>
      </section>

      <section class="section">
        <div class="section-title"><b>3</b><div><h3>Alertas e trocas por horário</h3><p>Mostra a incidência de alertas críticos e trocas por faixa do dia.</p></div></div>
        <table>
          <thead><tr><th>Período</th><th>Alertas críticos</th><th>Trocas</th><th>Interpretação</th></tr></thead>
          <tbody>${buildActivityRows(metrics)}</tbody>
        </table>
      </section>
    </div>

    <section class="section">
      <div class="section-title"><b>4</b><div><h3>Trocas de carrinho</h3><p>Mostra o total de trocas e o tempo em que os carrinhos permaneceram acima do limite após alerta crítico.</p></div></div>
      <div class="two-col" style="margin-top:0">
        <div class="mini-grid">
          <div class="mini"><small>Total de trocas</small><strong class="green">${metrics.exchanges.length}</strong></div>
          <div class="mini"><small>Trocas após alerta crítico</small><strong class="red">${withAlert}</strong></div>
          <div class="mini"><small>Tempo médio até a retirada</small><strong class="orange">${formatDuration(metrics.avgResponseMinutes)}</strong></div>
          <div class="mini"><small>Maior tempo até a retirada</small><strong class="red">${formatDuration(metrics.maxResponseMinutes)}</strong></div>
          <div class="mini"><small>Tempo em crítico</small><strong class="red">${formatDuration(metrics.criticalMinutes)}</strong></div>
          <div class="mini"><small>Alertas críticos</small><strong class="red">${metrics.criticalAlerts.length}</strong></div>
        </div>
        <div class="note" style="margin-top:0">
          <strong>Tempo até a retirada:</strong> Este indicador mostra quanto tempo os carrinhos permaneceram acima do limite crítico até a troca registrada.
        </div>
      </div>
    </section>

    <div class="two-col">
      <section class="section">
        <div class="section-title"><b>5</b><div><h3>Tempo após alerta crítico</h3><p>Consolida o tempo em que os carrinhos permaneceram acima do limite após alerta crítico.</p></div></div>
        <div class="legend">
          <div><i class="red"></i><span>Alertas críticos</span><strong>${metrics.criticalAlerts.length}</strong></div>
          <div><i class="green"></i><span>Com retirada registrada</span><strong>${withAlert}</strong></div>
          <div><i class="attention"></i><span>Tempo médio até a retirada</span><strong>${formatDuration(metrics.avgResponseMinutes)}</strong></div>
          <div><i class="critical"></i><span>Maior tempo até a retirada</span><strong>${formatDuration(metrics.maxResponseMinutes)}</strong></div>
        </div>
        <p class="note">Quanto maior esse tempo, maior foi o período com carrinho acima do limite crítico na sala.</p>
      </section>

      <section class="section">
        <div class="section-title"><b>6</b><div><h3>Horários de maior atividade</h3><p>Mostra as faixas do dia com maior concentração de alertas críticos e trocas.</p></div></div>
        <table>
          <tbody>
            <tr><td><strong>Período com mais alertas críticos</strong></td><td>${escapeHtml(busiestAlerts.label)}</td></tr>
            <tr><td><strong>Período com mais trocas</strong></td><td>${escapeHtml(busiestExchanges.label)}</td></tr>
            <tr><td><strong>Faixa de maior atividade</strong></td><td>${escapeHtml(periodRanges[busiest.label] || busiest.label)}</td></tr>
            <tr><td><strong>Observação</strong></td><td>${metrics.activity.find((period) => period.label === 'Madrugada')?.exchanges ? 'Houve trocas registradas na madrugada' : 'Não houve trocas registradas na madrugada'}</td></tr>
          </tbody>
        </table>
      </section>
    </div>

    <section class="section">
      <div class="section-title"><b>7</b><div><h3>Indicadores do período</h3><p>Consolida os principais indicadores operacionais do período analisado.</p></div></div>
      <div class="two-col" style="margin-top:0">
        <div class="mini-grid">
          <div class="mini"><small>Alertas críticos</small><strong class="red">${metrics.criticalAlerts.length}</strong></div>
          <div class="mini"><small>Trocas</small><strong class="green">${metrics.exchanges.length}</strong></div>
          <div class="mini"><small>Alertas por dia</small><strong>${alertsPerDay}</strong></div>
          <div class="mini"><small>Trocas por dia</small><strong>${exchangesPerDay}</strong></div>
          <div class="mini"><small>Ocupação média</small><strong>${metrics.avgFill}%</strong></div>
          <div class="mini"><small>Tempo em crítico</small><strong class="red">${formatDuration(metrics.criticalMinutes)}</strong></div>
        </div>
        <table>
          <thead><tr><th>Indicador</th><th>Primeiro dia</th><th>Último dia</th><th>Total no período</th></tr></thead>
          <tbody>
            <tr><td>Dias analisados</td><td>${formatDateShort(metrics.periodStart)}</td><td>${formatDateShort(metrics.lastSample)}</td><td>${metrics.dayCount} dias</td></tr>
            <tr><td>Trocas</td><td>${metrics.firstDayExchanges}</td><td>${metrics.lastDayExchanges}</td><td>${metrics.exchanges.length}</td></tr>
            <tr><td>Alertas críticos</td><td>${metrics.firstDayAlerts}</td><td>${metrics.lastDayAlerts}</td><td>${metrics.criticalAlerts.length}</td></tr>
            <tr><td>Pico</td><td>${metrics.firstDayPeak}%</td><td>${metrics.lastDayPeak}%</td><td>${metrics.maxFill}%</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><b>8</b><div><h3>Análise do período</h3><p>Resumo objetivo da ocupação, dos alertas e das trocas registradas neste relatório.</p></div></div>
      <div class="analysis">
        <p><strong>Ocupação:</strong> A sala registrou pico de ${metrics.maxFill}% e ocupação média de ${metrics.avgFill}%. O tempo acumulado em condição crítica foi de ${formatDuration(metrics.criticalMinutes)}.</p>
        <p><strong>Alertas:</strong> Foram registrados ${metrics.criticalAlerts.length} alertas críticos no período, quando a ocupação atingiu ou ultrapassou o limite configurado.</p>
        <p><strong>Retirada:</strong> Foram registradas ${metrics.exchanges.length} trocas. O tempo médio até a retirada foi de ${formatDuration(metrics.avgResponseMinutes)}, com maior tempo registrado de ${formatDuration(metrics.maxResponseMinutes)}.</p>
        <p><strong>Operação:</strong> ${escapeHtml(busiest.label)} concentrou ${busiest.alerts} alertas críticos e ${busiest.exchanges} trocas, indicando maior demanda de acompanhamento nesse período.</p>
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
