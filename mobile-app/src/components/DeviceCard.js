import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
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
  const batteryValue = Number(device?.battery);
  const batteryWidth = Number.isFinite(batteryValue) ? Math.max(6, Math.min(100, batteryValue)) : 6;
  const isWarn = visualState === 'warn';
  const commIcon = device?.online === false
    ? require('../../assets/comm-offline.png')
    : require('../../assets/comm-online.png');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        compact && styles.compactCard,
        visualState === 'crit' || visualState === 'offline' ? styles.criticalCard : null,
        isWarn ? styles.warnCard : null,
        { backgroundColor: meta.start, borderColor: 'rgba(255,255,255,0.12)' }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.deviceName, isWarn && styles.warnText]}>{device?.name || 'Equipamento'}</Text>
        <View style={styles.commBadge}>
          <Image source={commIcon} style={styles.commIcon} resizeMode="cover" />
        </View>
      </View>

      <Text style={[styles.temperature, isWarn && styles.warnText]}>{formatTemp(device?.temp)}</Text>

      <View style={styles.middle}>
        <View style={styles.metrics}>
          <View style={[styles.metricBox, isWarn && styles.warnMetricBox]}>
            <Text style={[styles.metricLabel, isWarn && styles.warnMetricText]}>MIN</Text>
            <Text style={[styles.metricValue, isWarn && styles.warnMetricText]}>{formatTemp(minReading)}</Text>
          </View>
          <View style={[styles.metricBox, isWarn && styles.warnMetricBox]}>
            <Text style={[styles.metricLabel, isWarn && styles.warnMetricText]}>MAX</Text>
            <Text style={[styles.metricValue, isWarn && styles.warnMetricText]}>{formatTemp(maxReading)}</Text>
          </View>
        </View>

        <View style={styles.thermo}>
          <View style={styles.thermoTrack}>
            <View style={[styles.thermoFill, { height: `${level}%`, backgroundColor: meta.accent }]} />
          </View>
          <View style={[styles.thermoBulb, { backgroundColor: meta.accent }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <View style={styles.batteryIcon}>
            <View style={[styles.batteryLevel, { width: `${batteryWidth}%` }]} />
          </View>
          <Text style={[styles.footerText, isWarn && styles.warnText]}>{device?.battery ?? '--'}%</Text>
        </View>
        <View style={[styles.metaItem, styles.humidityItem]}>
          <Ionicons name="water" size={17} color="#70cfff" style={styles.humidityIcon} />
          <Text style={[styles.footerText, isWarn && styles.warnText]}>{device?.hum1 ?? '--'}%</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    elevation: 6,
    height: 322,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#092343',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12
  },
  warnCard: {
    backgroundColor: colors.warn
  },
  criticalCard: {
    backgroundColor: colors.crit
  },
  compactCard: {
    height: 306,
    marginRight: 14,
    width: 292
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: 42,
    justifyContent: 'space-between',
    left: 18,
    position: 'absolute',
    right: 14,
    top: 18
  },
  deviceName: {
    color: colors.white,
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
    paddingRight: 50
  },
  commBadge: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: -4,
    width: 38
  },
  commIcon: {
    height: 38,
    width: 38
  },
  warnText: {
    color: '#4f5869'
  },
  temperature: {
    color: colors.white,
    fontSize: 66,
    fontWeight: '300',
    letterSpacing: 0,
    lineHeight: 76,
    left: 0,
    position: 'absolute',
    right: 66,
    textAlign: 'center',
    top: 76
  },
  middle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    left: 38,
    position: 'absolute',
    right: 28,
    top: 176
  },
  metrics: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    marginRight: 88
  },
  metricBox: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    minHeight: 64,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  warnMetricBox: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderColor: 'rgba(255,255,255,0.08)'
  },
  metricLabel: {
    color: '#d5e3f6',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 7
  },
  metricValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900'
  },
  warnMetricText: {
    color: '#4f5869'
  },
  thermo: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: 'rgba(188,198,212,0.92)',
    borderRadius: 22,
    borderWidth: 3,
    height: 132,
    justifyContent: 'flex-start',
    overflow: 'visible',
    position: 'absolute',
    right: 0,
    top: -44,
    width: 34
  },
  thermoTrack: {
    alignItems: 'center',
    backgroundColor: '#c6ced8',
    borderRadius: 12,
    bottom: 20,
    justifyContent: 'flex-end',
    left: 10,
    overflow: 'hidden',
    position: 'absolute',
    top: 6,
    width: 8
  },
  thermoFill: {
    borderRadius: 10,
    width: 8
  },
  thermoBulb: {
    borderColor: '#cad7e6',
    borderRadius: 21,
    borderWidth: 3,
    bottom: -8,
    height: 42,
    left: -4,
    position: 'absolute',
    width: 42
  },
  footer: {
    alignItems: 'center',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 18,
    position: 'absolute',
    right: 18
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7
  },
  humidityItem: {
    gap: 9,
    marginRight: 36
  },
  humidityIcon: {
    marginRight: 0
  },
  batteryIcon: {
    borderColor: 'rgba(255,255,255,0.9)',
    borderRadius: 4,
    borderWidth: 2,
    height: 12,
    justifyContent: 'center',
    padding: 2,
    position: 'relative',
    width: 22
  },
  batteryLevel: {
    backgroundColor: '#53d769',
    borderRadius: 2,
    height: 4
  },
  footerText: {
    color: '#f1f7ff',
    fontSize: 20,
    fontWeight: '800'
  }
});
