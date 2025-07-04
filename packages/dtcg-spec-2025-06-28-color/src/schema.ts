import { z } from 'zod/v3';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

 export const ColorSpaceEnum = z
  .enum([
    'srgb',
    'srgb-linear',
    'display-p3',
    'a98-rgb',
    'prophoto-rgb',
    'rec-2020',
    'xyz',
    'lab',
    'lch',
    'oklab',
    'oklch',
    'hsl',
    'hwb',
  ])
  .describe('ColorSpaceEnum');

const ColorValue = z.object({
    colorSpace: ColorSpaceEnum,
    components: z.array(z.union([z.number(), z.literal('none')])),
    alpha: z.number().min(0).max(1).optional(),
    hex: z
      .string()
      .regex(/^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i)
      .optional()
});//.describe('ColorValue');//.describe('ColorValue');

export const ColorToken = z
  .object({
    $type: z.literal('color').optional(),
    $value: ColorValue,
    $description: z.string().optional(),
    //$extensions: z.record(z.any()).optional(),
  })
  .openapi({ref:'ColorToken'});



namespace Recursive {
  export type Node = z.infer<typeof ColorToken> | {[key: string]: Node;};  
}


const nodeSchema: z.ZodType<Recursive.Node> = z.lazy(() => z.union([ColorToken, z.record(z.string(), nodeSchema)])).openapi({ref: "Node"});

export const colorTokenFile = z.record(z.string(), nodeSchema).openapi({ref: "ColorTokenFile"});

  
