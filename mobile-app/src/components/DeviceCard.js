import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, stateColors } from '../theme/colors';

function getVisualState(device) {
  if (device?.online === false) return 'offline';
  if (device?.state === 'crit') return 'crit';
  if (device?.state === 'warn') return 'warn';
  return 'blue';
}

function formatTemp(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '--';
  return `${number.toFixed(1)}\u00b0C`;
}

function thermometerLevel(device) {
  const temp = Number(device?.temp);
  const min = Number(device?.min ?? 2);
  const max = Number(device?.max ?? 8);
  if (!Number.isFinite(temp)) return 18;
  const ratio = (temp - min) / Math.max(0.1, max - min);
  return Math.max(12, Math.min(100, Math.round(22 + ratio * 66)));
}

export function DeviceCard({ device, compact = false, onPress }) {
  const visualState = getVisualState(device);
  const meta = stateColors[visualState] || stateColors.blue;
  const level = thermometerLevel(device);
  const minReading = Number.isFinite(Number(device?.dailyMin)) ? Number(device.dailyMin) : Number(device?.temp);
  const maxReading = Number.isFinite(Number(device?.dailyMax)) ? Number(device.dailyMax) : Number(device?.temp);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        compact && styles.compactCard,
        { backgroundColor: meta.start, borderColor: `${meta.accent}55` }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.deviceName}>{device?.name || 'Equipamento'}</Text>
          <Text style={styles.sector}>{device?.sector || device?.local || 'Banco de Sangue'}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: meta.accent }]} />
      </View>

      <View style={styles.body}>
        <View style={styles.readingArea}>
          <Text style={styles.temperature}>{formatTemp(device?.temp)}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{device?.online === false ? 'SEM COMUNICACAO' : meta.label.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.thermo}>
          <View style={styles.thermoTrack}>
            <View style={[styles.thermoFill, { height: `${level}%`, backgroundColor: meta.accent }]} />
          </View>
          <View style={[styles.thermoBulb, { backgroundColor: meta.accent }]} />
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>MIN</Text>
          <Text style={styles.metricValue}>{formatTemp(minReading)}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>MAX</Text>
          <Text style={styles.metricValue}>{formatTemp(maxReading)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Bateria {device?.battery ?? '--'}%</Text>
        <Text style={styles.footerText}>Umidade {device?.hum1 ?? '--'}%</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    elevation: 6,
    minHeight: 268,
    padding: 18,
    shadowColor: '#092343',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14
  },
  compactCard: {
    marginRight: 14,
    minHeight: 238,
    width: 292
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between'
  },
  titleBlock: {
    flex: 1
  },
  deviceName: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800'
  },
  sector: {
    color: '#d7e6ff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  statusDot: {
    borderColor: 'rgba(255,255,255,0.65)',
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    width: 20
  },
  body: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  readingArea: {
    flex: 1
  },
  temperature: {
    color: colors.white,
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: 0
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  statusText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800'
  },
  thermo: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 14,
    width: 46
  },
  thermoTrack: {
    alignItems: 'center',
    backgroundColor: '#e9edf4',
    borderColor: '#bac7d8',
    borderRadius: 16,
    borderWidth: 4,
    height: 102,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: 28
  },
  thermoFill: {
    borderRadius: 10,
    width: 12
  },
  thermoBulb: {
    borderColor: '#cad7e6',
    borderRadius: 21,
    borderWidth: 4,
    height: 42,
    marginTop: -8,
    width: 42
  },
  metrics: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22
  },
  metricBox: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  metricLabel: {
    color: '#d5e3f6',
    fontSize: 11,
    fontWeight: '900'
  },
  metricValue: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 3
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14
  },
  footerText: {
    color: '#f1f7ff',
    fontSize: 14,
    fontWeight: '700'
  }
});
