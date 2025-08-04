import { z } from "zod";

export const serviceSchema = z.object({
    pk_services: z.number().optional(),
    // service_number se genera automáticamente en el backend
    scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
    fk_clients: z.number().min(1, "Cliente es requerido"),
    fk_locations: z.number().min(1, "Ubicación es requerida"),
    fk_status: z.number().min(1).optional(), // Será establecido automáticamente como "En progreso"
    fk_type_services: z.number().min(1, "Tipo de servicio es requerido"),
    fk_waste: z.number().min(1).optional().nullable(),
    fk_waste_subcategory: z.number().min(1).optional().nullable(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;