import * as z from 'zod';

export const createCaloriesSchema = z.object({
  // Define fields
  name: z.string(),
});

export const CaloriesSchemaValidation = {
createCaloriesSchema
};
  