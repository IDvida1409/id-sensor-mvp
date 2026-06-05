/**
 * Estado global do painel (blueprint).
 * Migrar gradualmente os estados atualmente globais (window.* e variáveis de script.js).
 */
export const appState = {
  currentUser: null,
  selectedArea: null,
  selectedClient: null,
  activeFilter: null,
  nocFilters: ['all'],
  accessibility: {
    colorblind: false,
    contrast: false,
    compact: false,
    showCommIcon: true,
    showMinMax: true,
    showBattery: true,
    visibleFilters: {
      normal: true,
      warn: true,
      crit: true,
      offline: true,
      maint: true,
      defrost: true,
      restock: true,
      inventory: true
    }
  }
};

export function patchState(partial){
  Object.assign(appState, partial || {});
}
