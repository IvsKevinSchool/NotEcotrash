import { z } from "zod";

export const serviceSchema = z.object({
    pk_services: z.number().optional(),
    service_number: z.string().min(1, "El número de servicio es requerido"),
    scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
    fk_clients: z.number().min(1, "Cliente es requerido"),
    fk_locations: z.number().min(1, "Ubicación es requerida"),
    fk_status: z.number().min(1, "Estado es requerido"),
    fk_type_services: z.number().min(1, "Tipo de servicio es requerido"),
    fk_waste: z.number().min(1, "Residuo es requerido"),
    fk_waste_subcategory: z.number().min(1, "Subcategoría es requerida").optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;