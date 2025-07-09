import { ManagementFormValues } from "../schemas/managementSchema";

export interface Management extends ManagementFormValues {
    pk_management: string;
}

export interface ManagementListProps {
    title?: string;
    className?: string;
}