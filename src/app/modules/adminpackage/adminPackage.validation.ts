import * as z from 'zod';

export const createAdminPackageSchema = z.object({
  // Define fields
  name: z.string(),
});

export const AdminPackageSchemaValidation = {
createAdminPackageSchema
};
  