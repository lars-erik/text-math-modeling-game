import type { Relation } from '../problem-model/expression';

export type TextEquationAnswer = {
  kind: 'text';
  input: string;
};

export type RelationChoiceAnswer = {
  kind: 'relation-choice';
  choiceId: string;
  label: string;
  relation: Relation;
};

export type NamedEquationChoice = {
  id: string;
  label: string;
  relation: Relation;
};

export type LearnerAnswer = TextEquationAnswer | RelationChoiceAnswer;
