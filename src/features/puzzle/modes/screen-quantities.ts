import type { SkinPresentation } from '../../skins';
import type { ScreenQuantity } from './mode';

export function toScreenQuantities(
  skin: SkinPresentation,
): readonly ScreenQuantity[] {
  return skin.facts.map((fact) => ({
    id: fact.skinQuantityId,
    skinQuantityId: fact.skinQuantityId,
    label: fact.label,
    variableName: fact.variableName,
    displayValue:
      fact.visibility === 'known' ? `${fact.value} ${fact.unit}` : '?',
    role: fact.role,
    given:
      fact.visibility === 'known' && fact.value !== undefined
        ? { kind: 'known' as const, value: fact.value }
        : { kind: 'hidden' as const },
  }));
}
