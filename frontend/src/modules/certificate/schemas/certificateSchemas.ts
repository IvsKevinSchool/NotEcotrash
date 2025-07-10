import { z } from "zod";

export const certificateSchema = z.object({
    pk_certificate: z.number().optional(),
    fk_management: z.number().min(1, "Management is required"),
    certificate_name: z.string().min(2, "Certificate name must be at least 2 characters"),
    pdf: z.instanceof(File).optional(),
});

export type CertificateFormData = z.infer<typeof certificateSchema>;