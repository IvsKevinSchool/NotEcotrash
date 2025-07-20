import { z } from "zod";

export const collectorUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone_number: z.string().optional(),
    fk_user: z.object({
        username: z.string().min(1, "Username is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        password2: z.string().min(6, "Password confirmation is required"),
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
    }).refine(data => data.password === data.password2, {
        message: "Passwords don't match",
        path: ["password2"],
    }),
});

export type CollectorUserFormData = z.infer<typeof collectorUserSchema>;

export interface IUser {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role: string;
}

export interface ICollector {
    pk_collector_user: number;
    name: string;
    last_name: string;
    phone_number: string | null;
    fk_management: number;
    fk_user: IUser;
}