import { z } from 'zod';

export const certificateSchema = z.object({
    fk_client: z.number({
        required_error: "Debe seleccionar un cliente",
        invalid_type_error: "Seleccione un cliente válido"
    }).min(1, "Debe seleccionar un cliente"),

    certificate_name: z.string({
        required_error: "El nombre del certificado es requerido"
    })
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),

    pdf: z.custom<File>((val) => val instanceof File, {
        message: "Debe seleccionar un archivo PDF"
    })
        .refine((file) => file.size <= 5_000_000, "El archivo no puede exceder 5MB")
        .refine((file) => file.type === "application/pdf", {
            message: "Solo se permiten archivos PDF"
        })
        .optional()
});

export type CertificateFormData = z.infer<typeof certificateSchema>;