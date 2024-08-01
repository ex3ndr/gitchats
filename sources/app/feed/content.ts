import { z } from 'zod';

//
// Base Types
//

const textContentCodec = z.object({
    kind: z.literal('text'),
    text: z.string()
});
export type TextContent = z.TypeOf<typeof textContentCodec>;

const serviceContentCodec = z.object({
    kind: z.literal('service'),
    text: z.string()
});
export type ServiceContent = z.TypeOf<typeof serviceContentCodec>;

//
// Content kinds
//

export type ContentKind = 'home' | 'security';
const homeCodec = textContentCodec;
const securityCodec = z.union([textContentCodec, serviceContentCodec]);
export const contentCodecs: { [K in ContentKind]: z.ZodSchema<any> } = { home: homeCodec, security: securityCodec };
export type Content<T extends ContentKind> = z.TypeOf<typeof contentCodecs[T]>;