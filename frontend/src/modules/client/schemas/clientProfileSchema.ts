import { z } from "zod";

export const clientProfileSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    legal_name: z.string().min(2, "El nombre legal debe tener al menos 2 caracteres"),
    rfc: z.string().min(12, "El RFC debe tener al menos 12 caracteres").max(13, "El RFC no puede tener más de 13 caracteres"),
    email: z.string().email("Ingresa un email válido"),
    phone_number: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
    phone_number_2: z.string().optional(),
    is_active: z.boolean().optional(),
});