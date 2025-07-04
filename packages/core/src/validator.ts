import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { registry } from './registry';
import { parse } from 'json-source-map';



function dataPointerFor(err: ErrorObject): string {
  switch (err.keyword) {
    case 'additionalProperties':
      return `${err.instancePath}/${(err.params as any).additionalProperty}`;
    case 'required':
      return `${err.instancePath}/${(err.params as any).missingProperty}`;
    default:
      return err.instancePath || '/';
  }
}

export async function buildValidator(domains: {id: string, snapshot: string}[]) {
  const ajv = new Ajv({ strict: false, allErrors: false });
  addFormats(ajv);

  await Promise.all(
    domains.map(async d => {
      (await import(`@designtoken/dtcg-spec-${d.snapshot}-${d.id}`)).default;      
    }),
  )

 
  const schemas = registry.all.map(p => p.schema)
  const root = {
    
    type   : 'object',
    allOf  : schemas,
  };

  console.log('Validating schema:', schemas[0]);
  const validate = ajv.compile(schemas[0]);
  const extra    = registry.all.flatMap(p => p.rules);

  // const errors = (validate.errors ?? []).map(err => {
  //   const ptr = err.instancePath || '/';           // root = "/"
  //   const pos = pointers[ptr]?.key ?? pointers[ptr]?.value;
  //   const line = pos ? pos.line + 1 : -1;          // convert 0-based → 1-based
  //   return { line, msg: err.message ?? '' };
  // }

  return (json: string) => {
    const { data, pointers } = parse(json);

    validate(data);
    //const ok = validate(data);
    //const schemaErrs = ok ? [] : validate.errors ?? [];
    //const ruleErrs   = extra.flatMap(fn => fn(data));

    const schemaErrs = (validate.errors ?? []).map(e => {
      const ptr = dataPointerFor(e);
      const pos = pointers[ptr]?.key ?? pointers[ptr]?.value;
      return {
        line: pos ? pos.line + 1 : -1,      // 1-based, -1 = unknown
        msg : e.message ?? 'validation error',
      };
    })

    return { schemaErrs: validate.errors ?? [], ruleErrs: [] };
  };

}