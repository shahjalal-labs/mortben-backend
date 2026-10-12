import * as z from 'zod';

export const createPaymentSchema = z.object({
  // Define fields
  name: z.string(),
});

export const PaymentSchemaValidation = {
createPaymentSchema
};
  