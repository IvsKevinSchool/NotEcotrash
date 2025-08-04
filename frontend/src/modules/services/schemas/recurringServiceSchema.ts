import { z } from 'zod';

export const recurringServiceSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  fk_client: z.number({
    required_error: 'Debe seleccionar un cliente',
  }).min(1, 'Debe seleccionar un cliente válido'),
  
  fk_location: z.number({
    required_error: 'Debe seleccionar una ubicación',
  }).min(1, 'Debe seleccionar una ubicación válida'),
  
  fk_type_service: z.number({
    required_error: 'Debe seleccionar un tipo de servicio',
  }).min(1, 'Debe seleccionar un tipo de servicio válido'),
  
  fk_waste: z.number().optional(),
  
  fk_waste_subcategory: z.number().optional(),
  
  frequency: z.enum(['daily', 'weekly', 'monthly', 'custom'], {
    required_error: 'Debe seleccionar una frecuencia',
  }),
  
  custom_days: z.number()
    .min(1, 'Los días personalizados deben ser al menos 1')
    .max(365, 'Los días personalizados no pueden exceder 365')
    .optional(),
  
  start_date: z.string({
    required_error: 'La fecha de inicio es requerida',
  }).min(1, 'La fecha de inicio es requerida'),
  
  end_date: z.string().optional(),
  
  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional(),
}).refine((data) => {
  // Si la frecuencia es personalizada, custom_days es requerido
  if (data.frequency === 'custom' && !data.custom_days) {
    return false;
  }
  return true;
}, {
  message: 'Los días personalizados son requeridos cuando la frecuencia es personalizada',
  path: ['custom_days'],
}).refine((data) => {
  // Validar que end_date sea posterior a start_date
  if (data.end_date && data.start_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return endDate > startDate;
  }
  return true;
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['end_date'],
});

export type RecurringServiceFormData = z.infer<typeof recurringServiceSchema>;

// Schema base sin refinements para actualizaciones
const baseRecurringServiceSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  fk_client: z.number({
    required_error: 'Debe seleccionar un cliente',
  }).min(1, 'Debe seleccionar un cliente válido'),
  
  fk_location: z.number({
    required_error: 'Debe seleccionar una ubicación',
  }).min(1, 'Debe seleccionar una ubicación válida'),
  
  fk_type_service: z.number({
    required_error: 'Debe seleccionar un tipo de servicio',
  }).min(1, 'Debe seleccionar un tipo de servicio válido'),
  
  fk_waste: z.number().optional(),
  
  fk_waste_subcategory: z.number().optional(),
  
  frequency: z.enum(['daily', 'weekly', 'monthly', 'custom'], {
    required_error: 'Debe seleccionar una frecuencia',
  }),
  
  custom_days: z.number()
    .min(1, 'Los días personalizados deben ser al menos 1')
    .max(365, 'Los días personalizados no pueden exceder 365')
    .optional(),
  
  start_date: z.string({
    required_error: 'La fecha de inicio es requerida',
  }).min(1, 'La fecha de inicio es requerida'),
  
  end_date: z.string().optional(),
  
  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional(),
});

// Schema más simple para actualizaciones
export const recurringServiceUpdateSchema = baseRecurringServiceSchema.partial().extend({
  pk_recurring_service: z.number(),
});

export type RecurringServiceUpdateData = z.infer<typeof recurringServiceUpdateSchema>;
