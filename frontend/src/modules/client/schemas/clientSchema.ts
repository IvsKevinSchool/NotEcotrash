import { z } from 'zod';

export const clientFormSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    legal_name: z.string().min(3, 'La razón social debe tener al menos 3 caracteres'),
    email: z.string().email('Ingresa un email válido'),
    phone_number: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
    phone_number_2: z.string().optional(),
    rfc: z.string()
        .min(12, 'El RFC debe tener al menos 12 caracteres')
        .max(13, 'El RFC no debe exceder 13 caracteres'),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;