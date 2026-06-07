import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DeviceCard } from './src/components/DeviceCard';
import {
  API_BASE_URL,
  acknowledgeAlert,
  activateApp,
  getAppAlerts,
  getDeviceByCode,
  getDevices
} from './src/services/api';
import { colors } from './src/theme/colors';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.maxFontSizeMultiplier = 1;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.maxFontSizeMultiplier = 1;

const IS_ANDROID = Platform.OS === 'android';
const HEADER_TOP_PADDING = IS_ANDROID
  ? Math.max(28, (StatusBar.currentHeight || 0) + 10)
  : 16;
const HEADER_ICON_TILE_SIZE = IS_ANDROID ? 62 : 64;
const HEADER_ICON_SIZE = IS_ANDROID ? 48 : 50;
const REFRESH_BUTTON_HEIGHT = IS_ANDROID ? 38 : 40;
const REFRESH_BUTTON_MIN_WIDTH = IS_ANDROID ? 86 : 90;
const REFRESH_TEXT_SIZE = IS_ANDROID ? 11.5 : 12;
const UNIT_TEXT_SIZE = IS_ANDROID ? 12.5 : 13;

const tabs = [
  { id: 'home', icon: 'information-circle-outline', label: 'Informação', tone: 'green' },
  { id: 'alerts', icon: 'notifications-outline', label: 'Alertas', tone: 'red' },
  { id: 'scan', icon: 'qr-code-outline', label: 'Escanear', tone: 'green' },
  { id: 'settings', icon: 'options-outline', label: 'Config.', tone: 'blue' }
];

const ADMIN_PROFILES = new Set(['master', 'admin1', 'admin2']);
const SESSION_STORAGE_KEY = 'idsensor.activeSession.v1';
const DAY_MS = 24 * 60 * 60 * 1000;

const fallbackAreas = [
  { id: 'unidade_banco_sangue', nome: 'Banco de Sangue', devices_count: 24 },
  { id: 'unidade_laboratorio', nome: 'Laboratório', devices_count: 0 }
];

function clientDisplayName(session) {
  return (session?.cliente?.nome || 'Laboratório IDvida').replace('Laboratorio', 'Laboratório');
}

function userProfile(session) {
  return String(session?.usuario?.perfil || 'area').toLowerCase();
}

function isAdminSession(session) {
  return ADMIN_PROFILES.has(userProfile(session));
}

function unitDisplayName(session) {
  return isAdminSession(session)
    ? 'Unidade Bela Vista - Administrativo'
    : 'Unidade Bela Vista - Banco de Sangue';
}

function userDisplayName(session) {
  const name = String(session?.usuario?.nome || 'IDvida').trim();
  if (name.replace(/\s+/g, '').toLowerCase() === 'idvida') return 'IDvida';
  return name;
}

function sessionAreas(session) {
  const areas = Array.isArray(session?.areas) && session.areas.length ? session.areas : fallbackAreas;
  const hasLaboratorio = areas.some((area) => String(area?.nome || '').toLowerCase().includes('laborat'));
  const merged = hasLaboratorio ? areas : [...areas, fallbackAreas[1]];
  return merged.map((area) => ({
    ...area,
    nome: String(area?.nome || '').replace('Laboratorio', 'Laboratório'),
    devices_count: Number(area?.devices_count || 0)
  }));
}

function filterDevicesByArea(devices, areaId) {
  if (!areaId) return devices;
  return devices.filter((device) => device?.unitId === areaId || device?.unit_id === areaId);
}

function panelFilterValue(kind) {
  if (kind === 'all') return 'all';
  if (kind === 'crit') return 'crit';
  if (kind === 'warn') return 'warn';
  if (kind === 'offline') return 'offline';
  return 'all';
}

function openPanel(session, kind, areaName) {
  const role = isAdminSession(session) ? userProfile(session) : 'area';
  const filter = panelFilterValue(kind);
  const query = [
    `role=${encodeURIComponent(role)}`,
    `filter=${encodeURIComponent(filter)}`,
    `area=${encodeURIComponent(areaName || 'Banco de Sangue')}`
  ].join('&');
  Linking.openURL(`${API_BASE_URL}/?${query}`);
}

function extractActivationCode(input) {
  const raw = decodeURIComponent(String(input || '').trim());
  const direct = raw.match(/APP-[A-Z0-9]+/i);
  if (direct) return direct[0].toUpperCase();

  try {
    const url = new URL(raw);
    const fromQuery = url.searchParams.get('codigo') || url.searchParams.get('code');
    if (fromQuery) return extractActivationCode(fromQuery);
    return extractActivationCode(url.pathname);
  } catch {
    return raw.toUpperCase();
  }
}

function buildStats(devices) {
  return devices.reduce(
    (acc, device) => {
      acc.total += 1;
      if (device?.online === false) acc.offline += 1;
      else if (device?.state === 'crit') acc.crit += 1;
      else if (device?.state === 'warn') acc.warn += 1;
      else acc.normal += 1;
      return acc;
    },
    { total: 0, normal: 0, warn: 0, crit: 0, offline: 0 }
  );
}

function isAlertFromLast24Hours(alert, now = Date.now()) {
  const createdAt = new Date(alert?.criado_em || 0).getTime();
  return Number.isFinite(createdAt) && now - createdAt <= DAY_MS;
}

function isAlertViewed(alert) {
  return !!(alert?.visualizado || alert?.visualizado_em);
}

function PoweredByFooter() {
  return (
    <View style={styles.powered}>
      <Text style={styles.poweredText}>Powered by</Text>
      <Image source={require('./assets/idvida-logo.png')} style={styles.idvidaLogo} resizeMode="contain" />
    </View>
  );
}

function SectionHeader({ title, caption, actionLabel, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {caption ? <Text style={styles.sectionCaption}>{caption}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} style={styles.smallAction}>
          <Text style={styles.smallActionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function EmptyState({ title, caption }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyCaption}>{caption}</Text>
    </View>
  );
}

function OverviewCard({ label, value, icon, tone, disabled, onPress }) {
  const toneStyle = styles[`overviewCard${tone}`] || styles.overviewCardGreen;
  const iconStyle = styles[`overviewIcon${tone}`] || styles.overviewIconGreen;
  const valueStyle = styles[`overviewValue${tone}`] || styles.overviewValueGreen;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.overviewCard, toneStyle, disabled && styles.overviewCardDisabled]}
    >
      <View style={[styles.overviewIcon, iconStyle]}>
        <Ionicons name={icon} size={25} color={colors.white} />
      </View>
      <Text style={[styles.overviewValue, valueStyle]}>{value}</Text>
      <Text style={styles.overviewLabel}>{label}</Text>
    </Pressable>
  );
}

function AreaSelector({ areas, selectedAreaId, onSelect }) {
  const [open, setOpen] = useState(false);
  const selected = areas.find((area) => area.id === selectedAreaId) || areas[0] || fallbackAreas[0];

  return (
    <View style={styles.areaPickerWrap}>
      <Pressable onPress={() => setOpen((current) => !current)} style={styles.areaPicker}>
        <View style={styles.areaIconBox}>
          <Ionicons name="business-outline" size={25} color={colors.greenDark} />
        </View>
        <View style={styles.areaTextBlock}>
          <Text style={styles.areaLabel}>Área selecionada</Text>
          <Text style={styles.areaName}>{selected?.nome || 'Banco de Sangue'}</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={24} color={colors.navy} />
      </Pressable>
      {open ? (
        <View style={styles.areaOptions}>
          {areas.map((area) => {
            const active = area.id === selected?.id;
            return (
              <Pressable
                key={area.id}
                onPress={() => {
                  onSelect(area.id);
                  setOpen(false);
                }}
                style={[styles.areaOption, active && styles.areaOptionActive]}
              >
                <View>
                  <Text style={[styles.areaOptionName, active && styles.areaOptionNameActive]}>{area.nome}</Text>
                  <Text style={styles.areaOptionCount}>{area.devices_count} dispositivos</Text>
                </View>
                {active ? <Ionicons name="checkmark-circle" size={21} color={colors.green} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

function CurrentStatusBox({ pendingCount, currentIssueCount, onOpenAlerts }) {
  if (pendingCount > 0) {
    return (
      <Pressable onPress={onOpenAlerts} style={styles.lastAlertBox}>
        <View style={[styles.lastAlertIcon, styles.lastAlertIconWarn]}>
          <Ionicons name="notifications-outline" size={24} color={colors.white} />
        </View>
        <Text style={styles.lastAlertTitle}>{pendingCount} alerta(s) recente(s)</Text>
        <Text style={styles.lastAlertCaption}>Toque para ver o histórico de eventos.</Text>
      </Pressable>
    );
  }

  if (currentIssueCount > 0) {
    return (
      <Pressable onPress={onOpenAlerts} style={styles.lastAlertBox}>
        <View style={[styles.lastAlertIcon, styles.lastAlertIconWarn]}>
          <Ionicons name="notifications-outline" size={24} color={colors.white} />
        </View>
        <Text style={styles.lastAlertTitle}>{currentIssueCount} ocorrência(s) agora</Text>
        <Text style={styles.lastAlertCaption}>Toque para conferir a situação atual.</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.lastAlertBox}>
      <View style={styles.lastAlertIcon}>
        <Ionicons name="checkmark" size={27} color={colors.greenDark} />
      </View>
      <Text style={styles.lastAlertTitle}>Nenhum alerta recente</Text>
      <Text style={styles.lastAlertCaption}>Tudo está dentro dos parâmetros.</Text>
    </View>
  );
}

function ReportHistoryBox({ count, onOpenHistory }) {
  return (
    <Pressable onPress={onOpenHistory} style={styles.reportBox}>
      <View style={styles.reportIcon}>
        <Ionicons name="document-text-outline" size={23} color={colors.navy} />
      </View>
      <View style={styles.reportTextBlock}>
        <Text style={styles.reportTitle}>Histórico das últimas 24h</Text>
        <Text style={styles.reportCaption}>{count} evento(s). Toque para ver o histórico.</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}

function CurrentStatusBoxV2({ currentIssueCount, onOpenAlerts }) {
  if (currentIssueCount > 0) {
    return (
      <Pressable onPress={onOpenAlerts} style={styles.lastAlertBox}>
        <View style={[styles.lastAlertIcon, styles.lastAlertIconWarn]}>
          <Ionicons name="notifications-outline" size={24} color={colors.white} />
        </View>
        <Text style={styles.lastAlertTitle}>{currentIssueCount} ocorrência(s) agora</Text>
        <Text style={styles.lastAlertCaption}>Toque para conferir a situação atual.</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.lastAlertBox}>
      <View style={styles.lastAlertIcon}>
        <Ionicons name="checkmark" size={27} color={colors.greenDark} />
      </View>
      <Text style={styles.lastAlertTitle}>Nenhum alerta recente</Text>
      <Text style={styles.lastAlertCaption}>Tudo está dentro dos parâmetros.</Text>
    </View>
  );
}

function PendingAlertsBox({ count, onOpenAlerts }) {
  if (count <= 0) return null;

  return (
    <Pressable onPress={onOpenAlerts} style={styles.pendingAlertBox}>
      <View style={[styles.reportIcon, styles.pendingAlertIcon]}>
        <Ionicons name="notifications-outline" size={22} color={colors.white} />
      </View>
      <View style={styles.reportTextBlock}>
        <Text style={styles.reportTitle}>{count} pendência(s) de ciência</Text>
        <Text style={styles.reportCaption}>Toque para ver os alertas ainda não visualizados.</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}

function normalizeAlertText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function alertKind(alert) {
  const text = normalizeAlertText(`${alert?.tipo_alerta || ''} ${alert?.mensagem || ''} ${alert?.severidade || ''}`);
  if (text.includes('offline') || text.includes('comunic')) return 'offline';
  if (text.includes('critico') || text.includes('critica')) return 'crit';
  return 'warn';
}

function alertTone(alert) {
  return alertKind(alert) === 'warn' ? 'warn' : 'crit';
}

function alertLabel(alert) {
  const kind = alertKind(alert);
  if (kind === 'offline') return 'OFFLINE';
  if (kind === 'crit') return 'CRÍTICO';
  return 'ATENÇÃO';
}

function alertDisplayMessage(alert) {
  const kind = alertKind(alert);
  if (kind === 'offline') return 'Dispositivo sem comunicação.';
  if (kind === 'crit') return 'Temperatura fora do limite estabelecido.';
  return 'Temperatura próxima do limite estabelecido.';
}

function AlertCard({ alert, onAcknowledge, busy, showAction = true, compact = false }) {
  const tone = alertTone(alert);
  const critical = tone === 'crit';
  const viewed = isAlertViewed(alert);
  const canAcknowledge = showAction && !viewed;

  return (
    <View style={[styles.alertCard, compact && styles.alertCardCompact, critical && styles.alertCardCritical]}>
      <View style={styles.alertTop}>
        <View style={styles.alertTitleBlock}>
          <Text style={[styles.alertTitle, compact && styles.alertTitleCompact]}>{alert?.dispositivo?.nome || 'Alerta'}</Text>
          <Text style={styles.alertMeta}>{alert?.dispositivo?.local || 'Banco de Sangue'}</Text>
        </View>
        <View style={[styles.alertBadge, critical && styles.alertBadgeCritical]}>
          <Text style={styles.alertBadgeText}>{alertLabel(alert)}</Text>
        </View>
      </View>
      <Text style={[styles.alertMessage, compact && styles.alertMessageCompact]}>{alertDisplayMessage(alert)}</Text>
      <Text style={[styles.alertTime, compact && styles.alertTimeCompact]}>{alert?.criado_em ? new Date(alert.criado_em).toLocaleString() : 'Agora'}</Text>
      {canAcknowledge ? (
        <Pressable onPress={() => onAcknowledge(alert)} disabled={busy} style={styles.ackButton}>
          <Text style={styles.ackButtonText}>{busy ? 'Registrando...' : 'Estou ciente'}</Text>
        </Pressable>
      ) : showAction && viewed ? (
        <Text style={styles.acknowledgedText}>Ciência registrada</Text>
      ) : null}
    </View>
  );
}

function ActivationScreen({ onActivated }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanLocked, setScanLocked] = useState(false);

  async function activateWithCode(rawCode) {
    const activationCode = extractActivationCode(rawCode);
    if (!activationCode) {
      setError('QR de ativação inválido.');
      return;
    }

    setCode(activationCode);
    setLoading(true);
    setError('');
    try {
      const result = await activateApp(activationCode);
      setCameraOpen(false);
      await onActivated(result);
    } catch (err) {
      setError(err.message || 'Não foi possível ativar este aparelho.');
    } finally {
      setLoading(false);
      setTimeout(() => setScanLocked(false), 900);
    }
  }

  async function submit() {
    await activateWithCode(code);
  }

  async function openActivationCamera() {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        setError('Permita o uso da câmera para escanear o QR de ativação.');
        return;
      }
    }
    setError('');
    setScanLocked(false);
    setCameraOpen(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.panel} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.activation}>
        <View style={styles.logoCard}>
          <Image source={require('./assets/idsensor-logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.activationTitle}>Ativar aparelho celular</Text>
          <Text style={styles.activationCopy}>
            Digite o código enviado pelo painel ou escaneie o QR de ativação para vincular este celular ao cliente.
          </Text>
        </View>

        <View style={styles.formBox}>
          <Text style={styles.inputLabel}>Código de ativação</Text>
          <TextInput
            autoCapitalize="characters"
            value={code}
            onChangeText={setCode}
            placeholder="Digite ou escaneie o código atual"
            placeholderTextColor="#9aacc1"
            style={styles.input}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Pressable onPress={submit} disabled={loading} style={[styles.primaryButton, loading && styles.disabledButton]}>
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryButtonText}>Entrar no IDsensor</Text>}
          </Pressable>
          <Pressable onPress={openActivationCamera} disabled={loading} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Escanear QR de ativação</Text>
          </Pressable>
          {cameraOpen ? (
            <View style={styles.activationCameraBox}>
              <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanLocked ? undefined : ({ data }) => {
                  setScanLocked(true);
                  activateWithCode(data);
                }}
              />
              <Pressable onPress={() => setCameraOpen(false)} style={styles.closeCameraButton}>
                <Text style={styles.closeCameraText}>Fechar câmera</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <PoweredByFooter />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Header({ session, loading, onRefresh }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTopSurface}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconTile}>
            <Image source={require('./assets/icon.png')} style={styles.brandIcon} resizeMode="contain" />
          </View>
          <View style={styles.brandTextBlock}>
            <Text style={styles.clientName}>{clientDisplayName(session)}</Text>
          </View>
        </View>
        <Pressable onPress={onRefresh} style={styles.refreshButton}>
          {loading ? <ActivityIndicator size="small" color={colors.navy} /> : <Text style={styles.refreshText}>Atualizar</Text>}
        </Pressable>
      </View>
      <Text style={styles.unitName}>{unitDisplayName(session)}</Text>
      <View style={styles.greetingRow}>
        <Text style={styles.greetingText}>Olá, </Text>
        <Text style={styles.userName}>{userDisplayName(session)}</Text>
      </View>
    </View>
  );
}

function HomeScreen({ devices, alerts, session, onOpenAlerts, onOpenHistory }) {
  const areas = useMemo(() => sessionAreas(session), [session]);
  const [selectedAreaId, setSelectedAreaId] = useState(areas[0]?.id || 'unidade_banco_sangue');
  const admin = isAdminSession(session);
  const selectedArea = areas.find((area) => area.id === selectedAreaId) || areas[0] || fallbackAreas[0];
  const scopedDevices = admin ? filterDevicesByArea(devices, selectedArea?.id) : devices;
  const stats = useMemo(() => buildStats(scopedDevices), [scopedDevices]);
  const totalDevices = stats.total || (admin ? selectedArea?.devices_count : session?.devices_count) || 0;
  const recentAlerts = useMemo(() => {
    const now = Date.now();
    return alerts.filter((alert) => isAlertFromLast24Hours(alert, now));
  }, [alerts]);
  const pendingAlerts = recentAlerts.filter((alert) => !isAlertViewed(alert));
  const currentIssueCount = stats.crit + stats.warn + stats.offline;
  const areaName = selectedArea?.nome || 'Banco de Sangue';
  const overviewCards = [
    {
      key: 'all',
      label: 'Dispositivos',
      value: totalDevices,
      icon: 'thermometer-outline',
      tone: 'Green',
      disabled: false
    },
    {
      key: 'crit',
      label: 'Críticos',
      value: stats.crit,
      icon: 'alert-circle-outline',
      tone: 'Red',
      disabled: stats.crit <= 0
    },
    {
      key: 'warn',
      label: 'Atenção',
      value: stats.warn,
      icon: 'notifications-outline',
      tone: 'Orange',
      disabled: stats.warn <= 0
    },
    ...(admin ? [{
      key: 'offline',
      label: 'Sem comunicação',
      value: stats.offline,
      icon: 'cloud-offline-outline',
      tone: 'Gray',
      disabled: stats.offline <= 0
    }] : [])
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {admin ? (
        <AreaSelector
          areas={areas}
          selectedAreaId={selectedAreaId}
          onSelect={setSelectedAreaId}
        />
      ) : null}

      <SectionHeader title="Visão geral" />
      <View style={styles.overviewGrid}>
        {overviewCards.map((card) => (
          <OverviewCard
            key={card.key}
            label={card.label}
            value={card.value}
            icon={card.icon}
            tone={card.tone}
            disabled={card.disabled}
            onPress={() => openPanel(session, card.key, areaName)}
          />
        ))}
      </View>

      <SectionHeader
        title="Últimos alertas"
        actionLabel={recentAlerts.length ? 'Ver alertas' : null}
        onAction={recentAlerts.length ? onOpenAlerts : undefined}
      />
      <CurrentStatusBoxV2
        currentIssueCount={currentIssueCount}
        onOpenAlerts={onOpenAlerts}
      />
      <PendingAlertsBox count={pendingAlerts.length} onOpenAlerts={onOpenAlerts} />
      <ReportHistoryBox count={recentAlerts.length} onOpenHistory={onOpenHistory} />
    </ScrollView>
  );
}

function AlertsScreenLegacy({ alerts, onAcknowledge, acknowledgingId }) {
  const visibleAlerts = useMemo(() => {
    const now = Date.now();
    return alerts.filter((alert) => isAlertFromLast24Hours(alert, now)).slice(0, 24);
  }, [alerts]);
  const activeCount = visibleAlerts.filter((alert) => alert?.status === 'ativo').length;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader
        title="Alertas"
        caption={visibleAlerts.length ? `${activeCount} ativo(s) - últimos ${visibleAlerts.length} evento(s)` : 'Histórico de eventos do cliente'}
      />
      {visibleAlerts.length ? visibleAlerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          busy={acknowledgingId === alert.id}
          onAcknowledge={onAcknowledge}
        />
      )) : (
        <EmptyState title="Sem alertas" caption="Quando o simulador gerar atenção, crítico ou offline, os eventos aparecem aqui." />
      )}
    </ScrollView>
  );
}

function AlertsScreen({ alerts, mode, viewedSnapshot, onAcknowledge, acknowledgingId }) {
  const recentAlerts = useMemo(() => {
    const now = Date.now();
    return alerts.filter((alert) => isAlertFromLast24Hours(alert, now));
  }, [alerts]);

  const visibleAlerts = useMemo(() => {
    if (mode === 'history') return recentAlerts.slice(0, 24);

    const snapshot = Array.isArray(viewedSnapshot) ? viewedSnapshot : [];
    if (snapshot.length) return snapshot.slice(0, 5);

    const pending = recentAlerts.filter((alert) => !isAlertViewed(alert));
    return (pending.length ? pending : recentAlerts).slice(0, 5);
  }, [mode, recentAlerts, viewedSnapshot]);

  const pendingCount = visibleAlerts.filter((alert) => !isAlertViewed(alert)).length;
  const caption = mode === 'history'
    ? `${recentAlerts.length} evento(s) nas últimas 24h`
    : pendingCount
      ? `${pendingCount} pendente(s) - mostrando os últimos ${visibleAlerts.length}`
      : visibleAlerts.length
        ? `Mostrando os últimos ${visibleAlerts.length} alerta(s)`
        : 'Nenhum alerta recente';

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader
        title={mode === 'history' ? 'Histórico 24h' : 'Alertas'}
        caption={caption}
      />
      {visibleAlerts.length ? visibleAlerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          busy={acknowledgingId === alert.id || acknowledgingId === 'bulk'}
          onAcknowledge={onAcknowledge}
          showAction={mode !== 'history'}
        />
      )) : (
        <EmptyState title="Sem alertas" caption="Quando o simulador gerar atenção, crítico ou offline, os eventos aparecem aqui." />
      )}
    </ScrollView>
  );
}

function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanLocked, setScanLocked] = useState(false);
  const [device, setDevice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (code) => {
    const cleanCode = String(code || '').trim();
    if (!cleanCode) return;

    setLoading(true);
    setError('');
    setDevice(null);
    try {
      const result = await getDeviceByCode(cleanCode);
      setDevice(result.card || result.device);
      setCameraOpen(false);
    } catch (err) {
      setError(err.message || 'Não foi possível localizar este equipamento.');
    } finally {
      setLoading(false);
      setTimeout(() => setScanLocked(false), 900);
    }
  }, []);

  async function openCamera() {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setDevice(null);
    setError('');
    setScanLocked(false);
    setCameraOpen(true);
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Escanear equipamento" />

      {cameraOpen ? (
        <View style={styles.cameraBox}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanLocked ? undefined : ({ data }) => {
              setScanLocked(true);
              lookup(data);
            }}
          />
          <Pressable onPress={() => setCameraOpen(false)} style={styles.closeCameraButton}>
            <Text style={styles.closeCameraText}>Fechar câmera</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={openCamera} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Escanear equipamento</Text>
        </Pressable>
      )}

      {loading ? <Text style={styles.scanStatus}>Localizando equipamento...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {device ? (
        <View style={styles.scannedCardWrap}>
          <DeviceCard device={device} />
        </View>
      ) : null}
    </ScrollView>
  );
}

function SettingsRow({ label, value, onToggle }) {
  return (
    <View style={styles.settingsRow}>
      <View>
        <Text style={styles.settingsLabel}>{label}</Text>
        <Text style={styles.settingsCaption}>{value ? 'Ligado' : 'Desligado'}</Text>
      </View>
      <Pressable onPress={onToggle} style={[styles.switch, value && styles.switchOn]}>
        <View style={[styles.switchThumb, value && styles.switchThumbOn]} />
      </Pressable>
    </View>
  );
}

function SettingsScreen({ settings, setSettings, session }) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Configurações" caption="Alertas e dados deste aparelho vinculado" />
      <View style={styles.settingsBox}>
        <SettingsRow
          label="Notificações"
          value={settings.push}
          onToggle={() => setSettings((current) => ({ ...current, push: !current.push }))}
        />
        <SettingsRow
          label="Som dos alertas"
          value={settings.sound}
          onToggle={() => setSettings((current) => ({ ...current, sound: !current.sound }))}
        />
        <SettingsRow
          label="Atualização automática"
          value={settings.autoRefresh}
          onToggle={() => setSettings((current) => ({ ...current, autoRefresh: !current.autoRefresh }))}
        />
      </View>

      <View style={styles.linkedBox}>
        <Text style={styles.linkedTitle}>Aparelho vinculado</Text>
        <Text style={styles.linkedLine}>{clientDisplayName(session)}</Text>
        <Text style={styles.linkedLine}>{unitDisplayName(session)}</Text>
        <Text style={styles.linkedLine}>Usuário: {userDisplayName(session)}</Text>
        <Text style={styles.linkedCode}>{session?.app_device_id || 'Aparelho ativo'}</Text>
      </View>

      <PoweredByFooter />
    </ScrollView>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [tab, setTab] = useState('home');
  const [alertViewMode, setAlertViewMode] = useState('latest');
  const [viewedAlertsSnapshot, setViewedAlertsSnapshot] = useState([]);
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acknowledgingId, setAcknowledgingId] = useState('');
  const [settings, setSettings] = useState({
    push: true,
    sound: true,
    autoRefresh: true
  });

  useEffect(() => {
    let mounted = true;

    async function loadStoredSession() {
      try {
        const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (!stored) return;

        const parsed = JSON.parse(stored);
        if (mounted && parsed?.app_device_id) {
          setSession(parsed);
        }
      } catch (err) {
        if (mounted) {
          setError('Não foi possível carregar o aparelho vinculado.');
        }
      } finally {
        if (mounted) {
          setSessionLoading(false);
        }
      }
    }

    loadStoredSession();

    return () => {
      mounted = false;
    };
  }, []);

  const handleActivated = useCallback(async (activatedSession) => {
    setSession(activatedSession);
    try {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activatedSession));
    } catch (err) {
      setError('Aparelho ativado, mas a sessão não foi salva no celular.');
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError('');
    try {
      const [deviceList, alertList] = await Promise.all([
        getDevices(),
        getAppAlerts(session.app_device_id)
      ]);
      setDevices(deviceList);
      setAlerts(alertList);
    } catch (err) {
      setError('Servidor indisponível. Toque em Atualizar.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  const openAlertsView = useCallback((mode = 'latest') => {
    setAlertViewMode(mode);
    setTab('alerts');

    const now = Date.now();
    const recentAlerts = alerts.filter((alert) => isAlertFromLast24Hours(alert, now));
    const pendingAlerts = recentAlerts.filter((alert) => !isAlertViewed(alert) && alert?.id);

    if (mode === 'history') {
      setViewedAlertsSnapshot([]);
      return;
    }

    const snapshotSource = pendingAlerts.length ? pendingAlerts : recentAlerts;
    setViewedAlertsSnapshot(
      snapshotSource.slice(0, 5).map((alert) => (
        pendingAlerts.length ? { ...alert, visualizado: true, visualizado_em: new Date().toISOString() } : alert
      ))
    );

    if (!pendingAlerts.length || !session?.app_device_id) return;

    setAcknowledgingId('bulk');
    Promise.all(pendingAlerts.map((alert) => acknowledgeAlert(alert.id, session.app_device_id)
      .then(() => true)
      .catch(() => false)))
      .then((results) => {
        if (results.some((ok) => !ok)) {
          setError('Não foi possível registrar ciência de todos os alertas.');
        }
        return loadData();
      })
      .finally(() => {
        setAcknowledgingId('');
      });
  }, [alerts, loadData, session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!session || !settings.autoRefresh) return undefined;
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, [loadData, session, settings.autoRefresh]);

  useEffect(() => {
    if (!session) return undefined;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') loadData();
    });
    return () => subscription.remove();
  }, [loadData, session]);

  async function handleAcknowledge(alert) {
    setAcknowledgingId(alert.id);
    setError('');
    try {
      await acknowledgeAlert(alert.id, session.app_device_id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Não foi possível registrar ciência.');
    } finally {
      setAcknowledgingId('');
    }
  }

  const unseenAlertCount = useMemo(() => {
    const now = Date.now();
    return alerts.filter((alert) => isAlertFromLast24Hours(alert, now) && !isAlertViewed(alert)).length;
  }, [alerts]);

  if (sessionLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.panel} />
        <View style={styles.sessionLoader}>
          <ActivityIndicator color={colors.navy} />
          <Text style={styles.sessionLoaderText}>Abrindo aparelho vinculado...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) return <ActivationScreen onActivated={handleActivated} />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.panel} />
      <Header session={session} loading={loading} onRefresh={loadData} />
      {error ? <Text style={styles.topError}>{error}</Text> : null}

      <View style={styles.bodyArea}>
        {tab === 'home' ? (
          <HomeScreen
            devices={devices}
            alerts={alerts}
            session={session}
            onOpenAlerts={() => openAlertsView('latest')}
            onOpenHistory={() => openAlertsView('history')}
          />
        ) : null}
        {tab === 'alerts' ? (
          <AlertsScreen
            alerts={alerts}
            mode={alertViewMode}
            viewedSnapshot={viewedAlertsSnapshot}
            onAcknowledge={handleAcknowledge}
            acknowledgingId={acknowledgingId}
          />
        ) : null}
        {tab === 'scan' ? <ScanScreen /> : null}
        {tab === 'settings' ? <SettingsScreen settings={settings} setSettings={setSettings} session={session} /> : null}
      </View>

      <View style={styles.tabBar}>
        {tabs.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              if (item.id === 'alerts') openAlertsView('latest');
              else setTab(item.id);
            }}
            style={[styles.tabItem, tab === item.id && styles.tabItemActive]}
          >
            <View style={styles.tabIconWrap}>
              <Ionicons
                name={item.icon}
                size={25}
                color={item.tone === 'red' ? colors.crit : item.tone === 'green' ? colors.green : colors.navy}
              />
              {item.id === 'alerts' && unseenAlertCount > 0 ? (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{unseenAlertCount > 99 ? '99+' : unseenAlertCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.tabLabel, tab === item.id && styles.tabTextActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.panel,
    flex: 1
  },
  activation: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 22
  },
  sessionLoader: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24
  },
  sessionLoaderText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center'
  },
  logoCard: {
    alignItems: 'center',
    marginTop: 12
  },
  logo: {
    height: 132,
    width: '92%'
  },
  activationTitle: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 26,
    textAlign: 'center'
  },
  activationCopy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
    textAlign: 'center'
  },
  formBox: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 3,
    gap: 12,
    marginTop: 18,
    padding: 16,
    shadowColor: '#102a4a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12
  },
  inputLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800'
  },
  input: {
    backgroundColor: '#f7fbff',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 14
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900'
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.chip,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  secondaryButtonText: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: '900'
  },
  disabledButton: {
    opacity: 0.65
  },
  errorText: {
    color: colors.crit,
    fontSize: 13,
    fontWeight: '700'
  },
  powered: {
    alignItems: 'center',
    gap: 7,
    marginTop: 20
  },
  poweredText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700'
  },
  idvidaLogo: {
    height: 32,
    width: 96
  },
  header: {
    backgroundColor: '#eef5fc',
    borderBottomColor: '#d7e5f4',
    borderBottomWidth: 1,
    paddingBottom: 14,
    paddingHorizontal: 18,
    paddingTop: HEADER_TOP_PADDING
  },
  headerTopSurface: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingRight: 12
  },
  brandIconTile: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#d9e8f5',
    borderRadius: 15,
    borderWidth: 1,
    elevation: 3,
    height: HEADER_ICON_TILE_SIZE,
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#0b2f55',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    width: HEADER_ICON_TILE_SIZE
  },
  brandIcon: {
    height: HEADER_ICON_SIZE,
    width: HEADER_ICON_SIZE
  },
  brandTextBlock: {
    flex: 1
  },
  headerLogoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerLogo: {
    height: 54,
    width: 164
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: REFRESH_BUTTON_HEIGHT,
    justifyContent: 'center',
    minWidth: REFRESH_BUTTON_MIN_WIDTH,
    paddingHorizontal: 12
  },
  refreshText: {
    color: colors.navy,
    fontSize: REFRESH_TEXT_SIZE,
    fontWeight: '900'
  },
  clientName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 0
  },
  unitName: {
    color: colors.muted,
    fontSize: UNIT_TEXT_SIZE,
    fontWeight: '700',
    marginTop: 4
  },
  greetingRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginTop: 6
  },
  greetingText: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800'
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 14
  },
  userLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8
  },
  userName: {
    color: colors.greenDark,
    fontSize: 22,
    fontWeight: '900'
  },
  topError: {
    backgroundColor: '#fff3f5',
    color: colors.crit,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 18,
    paddingVertical: 7
  },
  bodyArea: {
    flex: 1
  },
  content: {
    paddingBottom: 22,
    paddingHorizontal: 18
  },
  sectionHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 20
  },
  sectionHeaderText: {
    flex: 1,
    paddingRight: 12
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0
  },
  sectionCaption: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3
  },
  smallAction: {
    backgroundColor: colors.chip,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  smallActionText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900'
  },
  areaPickerWrap: {
    marginTop: 18
  },
  areaPicker: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#dce8f4',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 3,
    flexDirection: 'row',
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#0b2f55',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16
  },
  areaIconBox: {
    alignItems: 'center',
    backgroundColor: '#eef9f3',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    marginRight: 14,
    width: 44
  },
  areaTextBlock: {
    flex: 1
  },
  areaLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800'
  },
  areaName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3
  },
  areaOptions: {
    backgroundColor: colors.white,
    borderColor: '#dce8f4',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
    overflow: 'hidden'
  },
  areaOption: {
    alignItems: 'center',
    borderBottomColor: '#edf3f9',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  areaOptionActive: {
    backgroundColor: '#eef9f3'
  },
  areaOptionName: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900'
  },
  areaOptionNameActive: {
    color: colors.greenDark
  },
  areaOptionCount: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  overviewCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    minHeight: 122,
    padding: 13,
    shadowColor: '#0b2f55',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    width: '48%'
  },
  overviewCardDisabled: {
    opacity: 0.78
  },
  overviewCardGreen: {
    borderColor: '#cdeedd'
  },
  overviewCardRed: {
    borderColor: '#ffd2d7'
  },
  overviewCardOrange: {
    borderColor: '#ffdcb7'
  },
  overviewCardGray: {
    borderColor: '#d9e0ea'
  },
  overviewIcon: {
    alignItems: 'center',
    borderRadius: 25,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  overviewIconGreen: {
    backgroundColor: colors.green
  },
  overviewIconRed: {
    backgroundColor: '#ff413c'
  },
  overviewIconOrange: {
    backgroundColor: '#ff7a1a'
  },
  overviewIconGray: {
    backgroundColor: '#798394'
  },
  overviewValue: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 8
  },
  overviewValueGreen: {
    color: colors.greenDark
  },
  overviewValueRed: {
    color: '#ef3430'
  },
  overviewValueOrange: {
    color: '#ef6c13'
  },
  overviewValueGray: {
    color: '#626b7a'
  },
  overviewLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 2
  },
  lastAlertBox: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#dce8f4',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 12,
    minHeight: 112,
    padding: 14,
    shadowColor: '#0b2f55',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12
  },
  lastAlertIcon: {
    alignItems: 'center',
    backgroundColor: '#e9f8ef',
    borderRadius: 22,
    height: 42,
    justifyContent: 'center',
    marginBottom: 8,
    width: 42
  },
  lastAlertIconWarn: {
    backgroundColor: colors.warn
  },
  lastAlertTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center'
  },
  lastAlertCaption: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
    textAlign: 'center'
  },
  reportBox: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#dce8f4',
    borderRadius: 14,
    borderWidth: 1,
    elevation: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#0b2f55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10
  },
  pendingAlertBox: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#ffdcb7',
    borderRadius: 14,
    borderWidth: 1,
    elevation: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#0b2f55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10
  },
  reportIcon: {
    alignItems: 'center',
    backgroundColor: colors.chip,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36
  },
  pendingAlertIcon: {
    backgroundColor: colors.warn
  },
  reportTextBlock: {
    flex: 1
  },
  reportTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900'
  },
  reportCaption: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 2
  },
  totalCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#c9ecd8',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 132,
    padding: 22
  },
  totalValue: {
    color: colors.ink,
    fontSize: 48,
    fontWeight: '900'
  },
  totalSuffix: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2
  },
  emptyState: {
    backgroundColor: colors.white,
    borderColor: '#c9ecd8',
    borderRadius: 8,
    borderWidth: 1,
    padding: 18
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900'
  },
  emptyCaption: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5
  },
  scannedCardWrap: {
    marginBottom: 18,
    marginTop: 14
  },
  alertCard: {
    backgroundColor: colors.white,
    borderColor: '#d8e4f2',
    borderLeftColor: colors.warn,
    borderLeftWidth: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 15
  },
  alertCardCompact: {
    borderLeftWidth: 4,
    marginBottom: 10,
    padding: 13
  },
  alertCardCritical: {
    borderLeftColor: colors.crit
  },
  alertTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between'
  },
  alertTitleBlock: {
    flex: 1
  },
  alertTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900'
  },
  alertTitleCompact: {
    fontSize: 15
  },
  alertMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  alertBadge: {
    backgroundColor: '#fff3de',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  alertBadgeCritical: {
    backgroundColor: '#ffe7eb'
  },
  alertBadgeText: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900'
  },
  alertMessage: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 11
  },
  alertMessageCompact: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8
  },
  alertTime: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 7
  },
  alertTimeCompact: {
    fontSize: 11,
    marginTop: 5
  },
  ackButton: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 12
  },
  ackButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900'
  },
  acknowledgedText: {
    color: colors.greenDark,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 12
  },
  cameraBox: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    height: 420,
    overflow: 'hidden'
  },
  activationCameraBox: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    height: 280,
    marginTop: 6,
    overflow: 'hidden'
  },
  camera: {
    flex: 1
  },
  closeCameraButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 13
  },
  closeCameraText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '900'
  },
  scanStatus: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center'
  },
  settingsBox: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden'
  },
  settingsRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  settingsLabel: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900'
  },
  settingsCaption: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  switch: {
    backgroundColor: '#ccd8e7',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    padding: 3,
    width: 54
  },
  switchOn: {
    backgroundColor: colors.green
  },
  switchThumb: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 24,
    width: 24
  },
  switchThumbOn: {
    alignSelf: 'flex-end'
  },
  linkedBox: {
    backgroundColor: colors.navy,
    borderRadius: 8,
    marginTop: 18,
    padding: 17
  },
  linkedTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900'
  },
  linkedLine: {
    color: '#d9e7f7',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6
  },
  linkedCode: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12
  },
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: '#cfe0f2',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: 16,
    paddingHorizontal: 10,
    paddingTop: 10
  },
  tabItem: {
    alignItems: 'center',
    borderTopColor: 'transparent',
    borderTopWidth: 3,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 64,
    paddingVertical: 6
  },
  tabItemActive: {
    backgroundColor: colors.chip,
    borderTopColor: colors.green
  },
  tabIcon: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '900'
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2
  },
  tabTextActive: {
    color: colors.navy
  },
  tabIconWrap: {
    position: 'relative'
  },
  tabBadge: {
    alignItems: 'center',
    backgroundColor: colors.crit,
    borderColor: colors.white,
    borderRadius: 9,
    borderWidth: 2,
    minWidth: 18,
    paddingHorizontal: 4,
    position: 'absolute',
    right: -10,
    top: -8
  },
  tabBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
    lineHeight: 14
  }
});
