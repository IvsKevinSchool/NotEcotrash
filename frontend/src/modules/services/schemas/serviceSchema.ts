import { z } from "zod";

export const serviceSchema = z.object({
    pk_services: z.number().optional(),
    // service_number se genera automáticamente en el backend
    scheduled_date: z.string()
        .min(1, "La fecha programada es requerida")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe estar en formato YYYY-MM-DD")
        .refine((date) => {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        }, "La fecha no puede ser anterior a hoy"),
    fk_clients: z.number({
        required_error: "Debe seleccionar un cliente",
        invalid_type_error: "Cliente inválido"
    }).min(1, "Debe seleccionar un cliente válido"),
    fk_locations: z.number({
        required_error: "Debe seleccionar una ubicación",
        invalid_type_error: "Ubicación inválida"
    }).min(1, "Debe seleccionar una ubicación válida"),
    fk_status: z.number({
        required_error: "Estado es requerido",
        invalid_type_error: "Estado inválido"
    }).min(1, "Estado inválido"),
    fk_type_services: z.number({
        required_error: "Debe seleccionar un tipo de servicio",
        invalid_type_error: "Tipo de servicio inválido"
    }).min(1, "Debe seleccionar un tipo de servicio válido"),
    fk_waste: z.number({
        invalid_type_error: "Residuo inválido"
    }).optional(),
    fk_waste_subcategory: z.number({
        invalid_type_error: "Subcategoría de residuo inválida"
    }).optional(),
})
.refine((data) => {
    // Validación condicional: si es servicio de recolección de residuos (ID 1), fk_waste es requerido
    if (data.fk_type_services === 1 && !data.fk_waste) {
        return false;
    }
    return true;
}, {
    message: "Para servicios de recolección de residuos, debe seleccionar un tipo de residuo",
    path: ["fk_waste"] // Especifica en qué campo mostrar el error
});

export type ServiceFormData = z.infer<typeof serviceSchema>;