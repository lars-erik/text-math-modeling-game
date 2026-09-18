import * as ohm from 'ohm-js';

export const problemGrammar = ohm.grammar(String.raw`
  ProblemDsl {
    Problem = "problem" metadataIdentifier "{" Concepts Quantity* Equation Scenario Symbol* Replay? "}"

    Concepts = "concepts" "{" metadataIdentifier* "}"
    Quantity = "quantity" identifier ":" dimension Role? "=" Given
    Role = "role" metadataIdentifier
    Given
      = "?"      -- hidden
      | integer  -- known
    Equation = "equation" "{" equationText "}"
    Scenario = "scenario" metadataIdentifier
    Symbol = "symbol" identifier "=" identifier
    Replay = "replay" "{" "seed" integer "generator" metadataIdentifier "}"

    dimension = "powerPerItem" | "power" | "item" | "scalar"
    equationText = (~"}" any)*
    metadataIdentifier = letter (alnum | "-" | ".")*
    identifier = letter alnum*
    integer = digit+
  }
`);
