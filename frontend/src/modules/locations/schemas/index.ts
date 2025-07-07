import { z } from "zod";

export const locationSchema = z.object({
    pk_location: z.string().optional(),
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    postcode: z.string()
        .min(4, "El código postal debe tener al menos 4 caracteres")
        .max(10, "El código postal no puede exceder 10 caracteres"),
    interior_number: z.string()
        .max(20, "El número interior no puede exceder 20 caracteres")
        .optional(),
    exterior_number: z.string()
        .min(1, "El número exterior es requerido")
        .max(20, "El número exterior no puede exceder 20 caracteres"),
    street_name: z.string()
        .min(3, "El nombre de la calle debe tener al menos 3 caracteres")
        .max(100, "El nombre de la calle no puede exceder 100 caracteres"),
    neighborhood: z.string()
        .min(3, "El barrio/colonia debe tener al menos 3 caracteres")
        .max(100, "El barrio/colonia no puede exceder 100 caracteres"),
    country: z.string()
        .min(3, "El país debe tener al menos 3 caracteres")
        .max(50, "El país no puede exceder 50 caracteres"),
    city: z.string()
        .min(3, "La ciudad debe tener al menos 3 caracteres")
        .max(50, "La ciudad no puede exceder 50 caracteres"),
    state: z.string()
        .min(3, "El estado debe tener al menos 3 caracteres")
        .max(50, "El estado no puede exceder 50 caracteres"),
    phone_number: z.string()
        .min(7, "El teléfono debe tener al menos 7 caracteres")
        .max(20, "El teléfono no puede exceder 20 caracteres")
        .regex(/^[0-9+]+$/, "Solo se permiten números y el signo +")
});

export type LocationFormData = z.infer<typeof locationSchema>;