import { z } from 'zod';

export const serviceLogSchema = z.object({
  // Removemos completed_date ya que se establece automáticamente en el backend
  waste_amount: z.string().min(1, 'Waste amount is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Waste amount must be a positive number'
  ),
  notes: z.string().optional(),
  fk_services: z.number().min(1, 'Service is required'),
  fk_user: z.number().min(1, 'Collector is required'), // Ahora es requerido
});

export type ServiceLogFormData = z.infer<typeof serviceLogSchema>;
