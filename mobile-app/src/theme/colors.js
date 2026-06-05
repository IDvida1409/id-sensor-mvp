export const colors = {
  navy: '#0b2f55',
  navyDeep: '#08213d',
  blueCard: '#243f7d',
  blueCardDark: '#1d326c',
  warn: '#d99135',
  warnDark: '#b87522',
  crit: '#b83246',
  critDark: '#8f2334',
  green: '#27b36a',
  greenDark: '#159552',
  aqua: '#39b8a5',
  ink: '#14243b',
  muted: '#65758f',
  softText: '#edf5ff',
  border: '#d8e4f2',
  panel: '#f4f8fc',
  white: '#ffffff',
  chip: '#eaf2fb'
};

export const stateColors = {
  blue: {
    start: colors.blueCard,
    end: colors.blueCardDark,
    accent: '#35a9ff',
    label: 'Normal'
  },
  warn: {
    start: '#df9b3f',
    end: colors.warnDark,
    accent: '#ffcf79',
    label: 'Atencao'
  },
  crit: {
    start: colors.crit,
    end: colors.critDark,
    accent: '#ff7480',
    label: 'Critico'
  },
  offline: {
    start: colors.crit,
    end: colors.critDark,
    accent: '#ff7480',
    label: 'Sem comunicacao'
  }
};
