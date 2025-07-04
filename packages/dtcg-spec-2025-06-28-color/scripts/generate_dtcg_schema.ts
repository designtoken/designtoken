// import {z } from 'zod/v4';

import { mkdirSync, writeFileSync } from 'fs'; 
import { join } from 'path'; 
import { colorTokenFile } from '../src/schema';

import { createSchema } from 'zod-openapi';

// ---- 2. Export schema ----
//const schema = z.toJSONSchema(DesignTokenFile, {target: 'draft-7',  reused: "ref" })   

const schema = createSchema(colorTokenFile, {unionOneOf: true})
const outDir = join(process.cwd(), 'src'); 
mkdirSync(outDir, { recursive: true }); 
const outFile = join(outDir, 'schema.json'); 
writeFileSync(outFile, JSON.stringify(schema, null, 2)); 
console.log(`✅ wrote ${outFile}`);