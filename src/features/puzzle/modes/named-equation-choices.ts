import type { Relation } from '../../problem-model/expression';
import type { SkinPresentation } from '../../skins';
import type { NamedEquationChoice } from '../learner-answer';

export function createNamedEquationChoices(
  relation: Relation,
  skin: SkinPresentation,
): readonly NamedEquationChoice[] {
  const namesByRole = new Map(
    skin.facts.map((fact) => [fact.role, fact.variableName]),
  );
  const base = requireRoleName(namesByRole, 'base');
  const count = requireRoleName(namesByRole, 'count');
  const unit = requireRoleName(namesByRole, 'per-item');
  const total = requireRoleName(namesByRole, 'total');
  return [
    {
      id: 'matching',
      label: `${total} = ${base} + ${count} * ${unit}`,
      relation,
    },
    {
      id: 'base-per-item',
      label: `${total} = ${count} * (${base} + ${unit})`,
      relation: {
        kind: 'equation',
        left: { kind: 'quantity', id: 'total' },
        right: {
          kind: 'multiply',
          left: { kind: 'quantity', id: 'count' },
          right: {
            kind: 'add',
            left: { kind: 'quantity', id: 'base' },
            right: { kind: 'quantity', id: 'unitValue' },
          },
        },
      },
    },
  ];
}

function requireRoleName(
  namesByRole: ReadonlyMap<string, string>,
  role: string,
): string {
  const name = namesByRole.get(role);
  if (name === undefined) {
    throw new Error(`Named-equation choices need a quantity with role ${role}.`);
  }
  return name;
}
