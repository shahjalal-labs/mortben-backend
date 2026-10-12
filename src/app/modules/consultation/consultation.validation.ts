import * as z from 'zod';

export const createConsultationSchema = z.object({
  // Define fields
  name: z.string(),
});

export const ConsultationSchemaValidation = {
createConsultationSchema
};
  