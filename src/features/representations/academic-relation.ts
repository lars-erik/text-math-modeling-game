import type { Expression, Relation } from '../problem-model/expression';
import type { AcademicSymbolMap } from './academic-symbol-map';

type AcademicStyle = 'input' | 'display';

export function formatAcademicInput(
  relation: Relation,
  symbols: AcademicSymbolMap,
): string {
  return formatRelation(relation, symbols, 'input');
}

// This is our AST visitor. Display libraries receive only its output and never
// become part of the semantic model.
export function renderToString(
  relation: Relation,
  symbols: AcademicSymbolMap,
): string {
  return formatRelation(relation, symbols, 'display');
}

function formatRelation(
  relation: Relation,
  symbols: AcademicSymbolMap,
  style: AcademicStyle,
): string {
  return `${formatExpression(relation.left, symbols, style, 0)} = ${formatExpression(
    relation.right,
    symbols,
    style,
    0,
  )}`;
}

function formatExpression(
  expression: Expression,
  symbols: AcademicSymbolMap,
  style: AcademicStyle,
  parentPrecedence: number,
): string {
  const precedence = precedenceOf(expression);
  let formatted: string;
  switch (expression.kind) {
    case 'literal':
      formatted = String(expression.value);
      break;
    case 'quantity':
      formatted = requireSymbol(symbols, expression.id);
      break;
    case 'add':
      formatted = `${formatExpression(expression.left, symbols, style, precedence)} + ${formatExpression(
        expression.right,
        symbols,
        style,
        precedence,
      )}`;
      break;
    case 'multiply': {
      const left = formatExpression(expression.left, symbols, style, precedence);
      const right = formatExpression(expression.right, symbols, style, precedence);
      formatted =
        style === 'display' && canUseJuxtaposition(expression.left, expression.right)
          ? `${left}${right}`
          : `${left}${style === 'input' ? '*' : ' \\cdot '}${right}`;
      break;
    }
  }
  return precedence < parentPrecedence ? `(${formatted})` : formatted;
}

function canUseJuxtaposition(left: Expression, right: Expression): boolean {
  return left.kind === 'literal' && right.kind === 'quantity';
}

function precedenceOf(expression: Expression): number {
  switch (expression.kind) {
    case 'add':
      return 1;
    case 'multiply':
      return 2;
    case 'literal':
    case 'quantity':
      return 3;
  }
}

function requireSymbol(symbols: AcademicSymbolMap, id: string): string {
  const symbol = symbols[id];
  if (symbol === undefined) {
    throw new Error(`No academic symbol for canonical quantity ${id}.`);
  }
  return symbol;
}
