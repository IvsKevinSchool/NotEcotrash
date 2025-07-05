import { z } from "zod";

// Esquema para Waste
export const wasteSchema = z.object({
    name: z.string({ required_error: "El nombre es requerido" })
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    description: z.string()
        .max(500, "La descripción no puede exceder 500 caracteres")
        .optional()
        .default(""),
    is_active: z.boolean().default(true)
});

// Esquema para Subcategorías
export const wasteSubcategorySchema = z.object({
    name: z.string()
        .min(3, "Nombre debe tener al menos 3 caracteres")
        .max(100, "Nombre no puede exceder 100 caracteres"),
    description: z.string()
        .max(500, "Descripción no puede exceder 500 caracteres")
        .optional(),
    is_active: z.boolean().default(true),
    fk_waste: z.string().min(1, "Debe seleccionar un residuo")
});

export type WasteFormValues = z.infer<typeof wasteSchema>;
export type WasteSubcategoryFormValues = z.infer<typeof wasteSubcategorySchema>;