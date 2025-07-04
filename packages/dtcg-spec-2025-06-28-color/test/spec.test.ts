import { describe, expect, it } from 'vitest';
import { buildValidator } from '@designtoken/core';
import { promises as fs } from 'fs';
import { join } from 'path';


describe('DTCG examples', async () => {
  const validate = await buildValidator([{id:'color', snapshot: '2025-06-28'}]);

  it('color.token.json passes', async() => {
    const filePath = join(process.cwd(), 'test', 'color.tokens.json');
    const raw = await fs.readFile(filePath, 'utf8');

    const { schemaErrs, ruleErrs } = validate(raw);
    expect(schemaErrs).toEqual([
        //  {
        //    "line": 9,
        //    "msg": "must NOT have additional properties",
        //  },
       ]);
    expect(ruleErrs).toEqual([]);
  });
});
