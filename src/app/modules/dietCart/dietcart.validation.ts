import * as z from 'zod';

export const createCartSchema = z.object({
  // Define fields
  name: z.string(),
});

export const CartSchemaValidation = {
createCartSchema
};
  