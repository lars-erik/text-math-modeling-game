import * as ohm from 'ohm-js';

export const problemGrammar = ohm.grammar(String.raw`
  ProblemDsl {
    Problem = "problem" metadataIdentifier "{" Concepts Quantity* Equation Guidance? Replay? "}"

    Concepts = "concepts" "{" metadataIdentifier* "}"
    Quantity = "quantity" identifier ":" dimension Role? "=" Given
    Role = "role" role
    Given
      = "?"      -- hidden
      | integer  -- known
    Equation = "equation" "{" equationText "}"
    Replay = "replay" "{" "seed" integer "generator" metadataIdentifier "}"
    Guidance = "guidance" "{" Watch* "}"
    Watch = "watch" metadataIdentifier "{" GuidanceRef* "}"
    GuidanceRef = identifier metadataIdentifier

    dimension = "amountPerItem" | "amount" | "item" | "scalar"
    role = "per-item" | "base" | "count" | "total"
    equationText = (~"}" any)*
    metadataIdentifier = letter (alnum | "-" | ".")*
    identifier = letter alnum*
    integer = digit+
  }
`);
