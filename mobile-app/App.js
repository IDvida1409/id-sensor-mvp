import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
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
import { DeviceCard } from './src/components/DeviceCard';
import {
  acknowledgeAlert,
  activateApp,
  getAppAlerts,
  getDeviceByCode,
  getDevices
} from './src/services/api';
import { colors } from './src/theme/colors';

const tabs = [
  { id: 'home', icon: 'IN', label: 'Inicio' },
  { id: 'alerts', icon: '!', label: 'Alertas' },
  { id: 'scan', icon: 'QR', label: 'Escanear' },
  { id: 'settings', icon: 'CFG', label: 'Config.' }
];

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

function TotalDevicesCard({ total, issueCount }) {
  return (
    <View style={styles.totalCard}>
      <View>
        <Text style={styles.totalValue}>{total}</Text>
        <Text style={styles.totalLabel}>Total de dispositivos monitorados</Text>
      </View>
      <View style={styles.totalBadge}>
        <Text style={styles.totalBadgeText}>{issueCount ? `${issueCount} em evento` : 'Operacao normal'}</Text>
      </View>
    </View>
  );
}

function alertTone(alert) {
  const text = `${alert?.tipo_alerta || ''} ${alert?.mensagem || ''}`.toLowerCase();
  if (text.includes('offline') || text.includes('comunic') || alert?.severidade === 'critica') return 'crit';
  return 'warn';
}

function alertLabel(alert) {
  const text = `${alert?.tipo_alerta || ''} ${alert?.mensagem || ''}`.toLowerCase();
  if (text.includes('offline') || text.includes('comunic')) return 'OFFLINE';
  if (alert?.severidade === 'critica') return 'CRITICO';
  return 'ATENCAO';
}

function AlertCard({ alert, onAcknowledge, busy, showAction = true }) {
  const tone = alertTone(alert);
  const critical = tone === 'crit';
  const canAcknowledge = showAction && alert?.status === 'ativo';

  return (
    <View style={[styles.alertCard, critical && styles.alertCardCritical]}>
      <View style={styles.alertTop}>
        <View style={styles.alertTitleBlock}>
          <Text style={styles.alertTitle}>{alert?.dispositivo?.nome || 'Alerta'}</Text>
          <Text style={styles.alertMeta}>{alert?.dispositivo?.local || 'Banco de Sangue'}</Text>
        </View>
        <View style={[styles.alertBadge, critical && styles.alertBadgeCritical]}>
          <Text style={styles.alertBadgeText}>{alertLabel(alert)}</Text>
        </View>
      </View>
      <Text style={styles.alertMessage}>{alert?.mensagem || 'Evento de monitoramento ativo.'}</Text>
      <Text style={styles.alertTime}>{alert?.criado_em ? new Date(alert.criado_em).toLocaleString() : 'Agora'}</Text>
      {canAcknowledge ? (
        <Pressable onPress={() => onAcknowledge(alert)} disabled={busy} style={styles.ackButton}>
          <Text style={styles.ackButtonText}>{busy ? 'Registrando...' : 'Estou ciente'}</Text>
        </Pressable>
      ) : showAction ? (
        <Text style={styles.acknowledgedText}>Ciencia registrada</Text>
      ) : null}
    </View>
  );
}

function ActivationScreen({ onActivated }) {
  const [code, setCode] = useState('APP-DEMO-11');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setLoading(true);
    setError('');
    try {
      const result = await activateApp(code.trim());
      onActivated(result);
    } catch (err) {
      setError(err.message || 'Nao foi possivel ativar este aparelho.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.panel} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.activation}>
        <View style={styles.logoCard}>
          <Image source={require('./assets/idsensor-logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.activationTitle}>Ativar aparelho celular</Text>
          <Text style={styles.activationCopy}>
            Digite o codigo enviado pelo painel ou escaneie o QR de ativacao para vincular este celular ao cliente.
          </Text>
        </View>

        <View style={styles.formBox}>
          <Text style={styles.inputLabel}>Codigo de ativacao</Text>
          <TextInput
            autoCapitalize="characters"
            value={code}
            onChangeText={setCode}
            placeholder="APP-DEMO-11"
            placeholderTextColor="#9aacc1"
            style={styles.input}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Pressable onPress={submit} disabled={loading} style={[styles.primaryButton, loading && styles.disabledButton]}>
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryButtonText}>Entrar no IDsensor</Text>}
          </Pressable>
        </View>

        <PoweredByFooter />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Header({ session, loading, onRefresh }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLogoRow}>
        <Image source={require('./assets/idsensor-logo.png')} style={styles.headerLogo} resizeMode="contain" />
        <Pressable onPress={onRefresh} style={styles.refreshButton}>
          {loading ? <ActivityIndicator size="small" color={colors.navy} /> : <Text style={styles.refreshText}>Atualizar</Text>}
        </Pressable>
      </View>
      <Text style={styles.clientName}>{session?.cliente?.nome || 'Laboratorio IDvida'}</Text>
      <Text style={styles.unitName}>{session?.unidade?.nome || 'Banco de Sangue'} - Banco de Sangue</Text>
    </View>
  );
}

function HomeScreen({ devices, alerts, session, onAcknowledge, acknowledgingId, setTab }) {
  const stats = useMemo(() => buildStats(devices), [devices]);
  const totalDevices = stats.total || session?.devices_count || 0;
  const visibleAlerts = alerts.slice(0, 4);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Informacoes" caption="Equipamentos vinculados a este setor" />
      <TotalDevicesCard total={totalDevices} issueCount={stats.warn + stats.crit + stats.offline} />

      <SectionHeader
        title="Ultimos alertas"
        caption={visibleAlerts.length ? 'Eventos mais recentes do cliente' : 'Nenhum alerta pendente'}
        actionLabel={alerts.length ? 'Ver alertas' : null}
        onAction={() => setTab('alerts')}
      />
      {visibleAlerts.length ? visibleAlerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          busy={acknowledgingId === alert.id}
          onAcknowledge={onAcknowledge}
          showAction={false}
        />
      )) : (
        <EmptyState title="Nenhum alerta pendente" caption="Os eventos de atencao, critico ou offline aparecem aqui." />
      )}
    </ScrollView>
  );
}

function AlertsScreen({ alerts, onAcknowledge, acknowledgingId }) {
  const visibleAlerts = alerts.slice(0, 24);
  const activeCount = alerts.filter((alert) => alert?.status === 'ativo').length;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader
        title="Alertas"
        caption={visibleAlerts.length ? `${activeCount} ativo(s) - ultimos ${visibleAlerts.length} evento(s)` : 'Historico de eventos do cliente'}
      />
      {visibleAlerts.length ? visibleAlerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          busy={acknowledgingId === alert.id}
          onAcknowledge={onAcknowledge}
        />
      )) : (
        <EmptyState title="Sem alertas" caption="Quando o simulador gerar atencao, critico ou offline, os eventos aparecem aqui." />
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
    try {
      const result = await getDeviceByCode(cleanCode);
      setDevice(result.card || result.device);
      setCameraOpen(false);
    } catch (err) {
      setError(err.message || 'Nao foi possivel localizar este equipamento.');
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
    setError('');
    setScanLocked(false);
    setCameraOpen(true);
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Escanear equipamento" caption="O mesmo QR abre no app ou no navegador do celular" />

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
            <Text style={styles.closeCameraText}>Fechar camera</Text>
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
        <View style={styles.fullCardWrap}>
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
      <SectionHeader title="Configuracoes" caption="Alertas e dados deste aparelho vinculado" />
      <View style={styles.settingsBox}>
        <SettingsRow
          label="Notificacoes"
          value={settings.push}
          onToggle={() => setSettings((current) => ({ ...current, push: !current.push }))}
        />
        <SettingsRow
          label="Som dos alertas"
          value={settings.sound}
          onToggle={() => setSettings((current) => ({ ...current, sound: !current.sound }))}
        />
        <SettingsRow
          label="Atualizacao automatica"
          value={settings.autoRefresh}
          onToggle={() => setSettings((current) => ({ ...current, autoRefresh: !current.autoRefresh }))}
        />
      </View>

      <View style={styles.linkedBox}>
        <Text style={styles.linkedTitle}>Aparelho vinculado</Text>
        <Text style={styles.linkedLine}>{session?.cliente?.nome || 'Laboratorio IDvida'}</Text>
        <Text style={styles.linkedLine}>{session?.unidade?.nome || 'Unidade Banco de Sangue'}</Text>
        <Text style={styles.linkedCode}>{session?.app_device_id || 'APP-DEMO-11'}</Text>
      </View>

      <PoweredByFooter />
    </ScrollView>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState('home');
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
      setError('Servidor indisponivel. Toque em Atualizar.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!session || !settings.autoRefresh) return undefined;
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData, session, settings.autoRefresh]);

  async function handleAcknowledge(alert) {
    setAcknowledgingId(alert.id);
    setError('');
    try {
      await acknowledgeAlert(alert.id, session.app_device_id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Nao foi possivel registrar ciencia.');
    } finally {
      setAcknowledgingId('');
    }
  }

  if (!session) return <ActivationScreen onActivated={setSession} />;

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
            onAcknowledge={handleAcknowledge}
            acknowledgingId={acknowledgingId}
            setTab={setTab}
          />
        ) : null}
        {tab === 'alerts' ? (
          <AlertsScreen alerts={alerts} onAcknowledge={handleAcknowledge} acknowledgingId={acknowledgingId} />
        ) : null}
        {tab === 'scan' ? <ScanScreen /> : null}
        {tab === 'settings' ? <SettingsScreen settings={settings} setSettings={setSettings} session={session} /> : null}
      </View>

      <View style={styles.tabBar}>
        {tabs.map((item) => (
          <Pressable key={item.id} onPress={() => setTab(item.id)} style={[styles.tabItem, tab === item.id && styles.tabItemActive]}>
            <Text style={[styles.tabIcon, tab === item.id && styles.tabTextActive]}>{item.icon}</Text>
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
    backgroundColor: colors.panel,
    paddingBottom: 10,
    paddingHorizontal: 18,
    paddingTop: 14
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
    height: 38,
    justifyContent: 'center',
    minWidth: 86,
    paddingHorizontal: 12
  },
  refreshText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900'
  },
  clientName: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8
  },
  unitName: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3
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
  totalCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderLeftColor: colors.navy,
    borderLeftWidth: 5,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18
  },
  totalValue: {
    color: colors.ink,
    fontSize: 42,
    fontWeight: '900'
  },
  totalLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2
  },
  totalBadge: {
    backgroundColor: colors.chip,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  totalBadgeText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900'
  },
  emptyState: {
    backgroundColor: colors.white,
    borderColor: colors.border,
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
  fullCardWrap: {
    marginBottom: 14
  },
  alertCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderLeftColor: colors.warn,
    borderLeftWidth: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 15
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
  alertTime: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 7
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
    paddingBottom: 8,
    paddingHorizontal: 10,
    paddingTop: 8
  },
  tabItem: {
    alignItems: 'center',
    borderTopColor: 'transparent',
    borderTopWidth: 3,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 54,
    paddingVertical: 6
  },
  tabItemActive: {
    backgroundColor: colors.chip,
    borderTopColor: colors.navy
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
  }
});
