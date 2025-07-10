import { z } from "zod";

export const collectorUserSchema = z.object({
    pk_collector_user: z.number().optional(),
    fk_management: z.number().min(1, "Management is required"),
    fk_user: z.number().min(1, "User is required"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    phone_number: z.string().regex(/^[0-9]*$/, "Phone number must contain only digits").optional().or(z.literal("")),
});

export type CollectorUserFormData = z.infer<typeof collectorUserSchema>;