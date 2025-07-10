import { z } from "zod";

export const typeServiceSchema = z.object({
    pk_type_services: z.number().optional(),
    fk_management: z.number().min(1, "Management is required"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
});

export type TypeServiceFormData = z.infer<typeof typeServiceSchema>;