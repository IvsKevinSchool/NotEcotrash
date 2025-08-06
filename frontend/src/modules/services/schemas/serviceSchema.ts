import { z } from "zod";

export const serviceSchema = z.object({
    pk_services: z.number().optional(),
    // service_number se genera automáticamente en el backend
    scheduled_date: z.string()
    .min(1, "La fecha programada es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe estar en formato YYYY-MM-DD")
    .refine((date) => {
        const selectedDate = new Date(date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate.getTime() >= today.getTime();
    }, "La fecha no puede ser anterior a hoy"),
    fk_clients: z.coerce.number({
        required_error: "Debe seleccionar un cliente",
        invalid_type_error: "Cliente inválido"
    }).min(1, "Debe seleccionar un cliente válido"),
    fk_locations: z.coerce.number({
        required_error: "Debe seleccionar una ubicación",
        invalid_type_error: "Ubicación inválida"
    }).min(1, "Debe seleccionar una ubicación válida"),
    fk_status: z.coerce.number({
        required_error: "Estado es requerido",
        invalid_type_error: "Estado inválido"
    }).min(1, "Estado inválido").optional(),
    fk_type_services: z.coerce.number({
        required_error: "Debe seleccionar un tipo de servicio",
        invalid_type_error: "Tipo de servicio inválido"
    }).min(1, "Debe seleccionar un tipo de servicio válido"),
    fk_waste: z.coerce.number({
        invalid_type_error: "Residuo inválido"
    }).optional(),
    fk_waste_subcategory: z.coerce.number({
        invalid_type_error: "Subcategoría de residuo inválida"
    }).optional(),
})
// Nota: La validación específica para servicios de recolección se hace en el componente
// donde tenemos acceso a la lista de typeServices para determinar dinámicamente
// si el servicio seleccionado requiere campos de residuo

export type ServiceFormData = z.infer<typeof serviceSchema>;