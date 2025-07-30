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

export const editCollectorSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name too long (max 100 characters)"),
    last_name: z.string()
        .min(1, "Last name is required")
        .max(100, "Last name too long (max 100 characters)"),
    phone_number: z.string()
        .max(20, "Phone number too long (max 20 characters)")
        .regex(
            /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
            "Invalid phone number format (only numbers, +, -, (, ) and spaces allowed)"
        )
        .optional()
        .or(z.literal("")), // Permite string vacío
});

export type EditCollectorFormData = z.infer<typeof editCollectorSchema>;