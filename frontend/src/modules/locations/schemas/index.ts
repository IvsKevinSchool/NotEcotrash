import { z } from "zod";

// Esquema que siempre devuelve strings (compatible con react-hook-form)
export const locationSchema = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),

    postcode: z.string()
        .min(4, "El código postal debe tener al menos 4 caracteres")
        .max(10, "El código postal no puede exceder 10 caracteres"),

    exterior_number: z.string()
        .min(1, "El número exterior es requerido")
        .max(20, "El número exterior no puede exceder 20 caracteres"),

    interior_number: z.string()
        .max(20, "El número interior no puede exceder 20 caracteres")
        .optional(),

    street_name: z.string()
        .min(3, "El nombre de la calle debe tener al menos 3 caracteres")
        .max(100, "El nombre de la calle no puede exceder 100 caracteres"),

    neighborhood: z.string()
        .min(3, "El barrio/colonia debe tener al menos 3 caracteres")
        .max(100, "El barrio/colonia no puede exceder 100 caracteres"),

    city: z.string()
        .min(3, "La ciudad debe tener al menos 3 caracteres")
        .max(50, "La ciudad no puede exceder 50 caracteres"),

    state: z.string()
        .min(3, "El estado debe tener al menos 3 caracteres")
        .max(50, "El estado no puede exceder 50 caracteres"),

    country: z.string()
        .min(3, "El país debe tener al menos 3 caracteres")
        .max(50, "El país no puede exceder 50 caracteres"),

    phone_number: z.string()
        .min(7, "El teléfono debe tener al menos 7 caracteres")
        .max(20, "El teléfono no puede exceder 20 caracteres")
        .regex(/^[0-9+]+$/, "Solo se permiten números y el signo +")
});

// Tipo para los datos del formulario (siempre strings)
export type LocationFormData = z.infer<typeof locationSchema>;

// Tipo para los datos recibidos del API (pueden ser números)
type LocationApiData = Omit<LocationFormData, 'exterior_number' | 'interior_number'> & {
    exterior_number: string | number;
    interior_number?: string | number;
};

// Función para transformar datos del API al formato del formulario
export const transformLocationData = (data: LocationApiData): LocationFormData => ({
    ...data,
    exterior_number: String(data.exterior_number),
    interior_number: data.interior_number ? String(data.interior_number) : undefined
});