export type ISODate = `${number}-${number}-${number}`;  // YYYY-MM-DD

export interface TokenNode {
  $value: unknown;
  $type?: string;
  $extensions?: Record<string, unknown>;
  // …other standard keys
}

export interface TokenMap {
  [fullPath: string]: TokenNode;
}

export interface ValidationError {
  code: string;
  message: string;
  path: string[];         // e.g. ['button', 'primary', '$value']
  snapshot: ISODate;      // spec version that triggered the error
}

export interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface SchemaBundle {
  snapshot: ISODate;
  schema: object;                                   // raw JSON Schema
}

export interface SemanticRuleCtx {
  tokenMap: TokenMap;
  snapshot: ISODate;
  report: (err: ValidationError) => void;
}

export type SemanticRule = (ctx: SemanticRuleCtx) => Promise<void> | void;

export interface SpecModule {
  id: string;                       // 'format', 'color', 'animation'…
  snapshot: ISODate;
  schema: object;
  rules?: SemanticRule[];  // array of functions
}
