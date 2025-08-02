import { z } from "zod";

export const userSchema = z.object({
    pk_user: z.number().optional(),

    username: z.string({
        required_error: "El nombre de usuario es requerido",
        invalid_type_error: "El nombre de usuario debe ser un texto",
    }).min(1, "El nombre de usuario no puede estar vacío"),

    email: z.string({
        required_error: "El correo electrónico es requerido",
        invalid_type_error: "El correo electrónico debe ser un texto",
    }).email("Debe ser un correo electrónico válido"),

    password: z.string({
        required_error: "La contraseña es requerida",
        invalid_type_error: "La contraseña debe ser un texto",
    }).min(6, "La contraseña debe tener al menos 6 caracteres"),

    password2: z.string({
        required_error: "La contraseña es requerida",
        invalid_type_error: "La contraseña debe ser un texto",
    }).min(6, "La contraseña debe tener al menos 6 caracteres"),

    role: z.enum(["admin", "employee"], {
        required_error: "El rol es requerido",
        invalid_type_error: "El rol debe ser uno de los siguientes: admin, employee",
    }),

    first_name: z.string().optional(),
    last_name: z.string().optional(),

    is_active: z.boolean().optional(),
})

export type UserFormType = z.infer<typeof userSchema>;

// SCHEMA FOR MANAGEMENT REGISTRATION
export const managementFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(8, "Phone number must be at least 8 digits"),
    phone_number_2: z.string().optional(),
    rfc: z.string()
        .min(12, "RFC must be 12-13 characters")
        .max(13, "RFC must be 12-13 characters")
    //.regex(/^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][0-9A-Z]$/i, "Invalid RFC format"),
});

export type ManagementFormValues = z.infer<typeof managementFormSchema>;
