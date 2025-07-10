import { z } from "zod";

export const clientSchema = z.object({
    pk_client: z.number().optional(),
    fk_management: z.number().min(1, "Management is required"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    legal_name: z.string().min(2, "Legal name must be at least 2 characters"),
    rfc: z.string().min(12, "RFC must be 12-13 characters").max(13, "RFC must be 12-13 characters"),
    email: z.string().email("Invalid email format"),
    phone_number: z.string().regex(/^[0-9]*$/, "Phone number must contain only digits").optional().or(z.literal("")),
    phone_number_2: z.string().regex(/^[0-9]*$/, "Phone number must contain only digits").optional().or(z.literal("")),
});

export type ClientFormData = z.infer<typeof clientSchema>;