/**
 * Inicialização de aplicação modular (blueprint).
 */
import { loadAccessibility, applyAccessibility } from './accessibility-controller.js';
import { renderGrid } from './ui-renderers.js';

export function bootstrap(){
  loadAccessibility();
  applyAccessibility();
  renderGrid();
}
