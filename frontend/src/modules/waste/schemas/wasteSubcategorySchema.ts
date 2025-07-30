import { z } from 'zod';

export const wasteSubcategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres').optional(),
  description: z.string().min(1, 'La descripción es requerida').max(255, 'La descripción no puede exceder 255 caracteres'),
  fk_waste: z.number().min(1, 'Debe seleccionar un residuo'),
  is_active: z.boolean(),
});

export type WasteSubcategoryFormData = z.infer<typeof wasteSubcategorySchema>;
