import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPinIcon,
    BuildingOfficeIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    TrashIcon,
    ClockIcon,
    CalendarIcon
} from "@heroicons/react/24/outline";
import { LocationFormData, HandleFormChange } from "../../types";
import { FormSection } from "./FormSection";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { FormTextarea } from "./FormTextarea";
import { FormActions } from "./FormActions";

const wasteTypes = [
    "Orgánico",
    "Inorgánico",
    "Electrónicos",
    "Peligroso",
    "Reciclable",
    "Otro"
];

const frequencies = [
    "Diario",
    "Semanal",
    "Quincenal",
    "Mensual",
    "Bimestral",
    "Trimestral"
];

interface AddLocationFormProps {
    formData: LocationFormData;
    onChange: HandleFormChange;
    onSubmit: (e: React.FormEvent) => void;
}

export const AddLocationForm = ({ formData, onChange, onSubmit }: AddLocationFormProps) => (
    <form onSubmit={onSubmit} className="bg-green-50 p-6 rounded-lg shadow">
        <div className="space-y-6">
            {/* Sección Información de la Empresa */}
            <FormSection title="Información de la Empresa" icon={BuildingOfficeIcon}>
                <FormInput
                    id="companyName"
                    name="companyName"
                    label="Nombre de la Empresa *"
                    value={formData.companyName}
                    onChange={onChange}
                    required
                />
                <FormInput
                    id="address"
                    name="address"
                    label="Dirección *"
                    value={formData.address}
                    onChange={onChange}
                    required
                    icon={MapPinIcon}
                />
                <FormInput
                    id="coordinates"
                    name="coordinates"
                    label="Coordenadas (opcional)"
                    value={formData.coordinates}
                    onChange={onChange}
                    placeholder="Ej: 12.3456, -98.7654"
                />
                <FormSelect
                    id="wasteType"
                    name="wasteType"
                    label="Tipo de Residuo *"
                    value={formData.wasteType}
                    onChange={onChange}
                    options={wasteTypes}
                    required
                />
            </FormSection>

            {/* Sección Contacto */}
            <FormSection title="Información de Contacto" icon={UserIcon}>
                <FormInput
                    id="contactPerson"
                    name="contactPerson"
                    label="Persona de Contacto *"
                    value={formData.contactPerson}
                    onChange={onChange}
                    required
                />
                <FormInput
                    id="phone"
                    name="phone"
                    label="Teléfono *"
                    value={formData.phone}
                    onChange={onChange}
                    type="tel"
                    required
                    icon={PhoneIcon}
                />
                <FormInput
                    id="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={onChange}
                    type="email"
                    icon={EnvelopeIcon}
                />
            </FormSection>

            {/* Sección Recolección */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                    <TrashIcon className="h-5 w-5" />
                    Detalles de Recolección
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect
                        id="collectionFrequency"
                        name="collectionFrequency"
                        label="Frecuencia de Recolección *"
                        value={formData.collectionFrequency}
                        onChange={onChange}
                        options={frequencies}
                        required
                        icon={ClockIcon}
                    />
                    <FormInput
                        id="nextCollection"
                        name="nextCollection"
                        label="Próxima Recolección *"
                        value={formData.nextCollection}
                        onChange={onChange}
                        type="date"
                        required
                        icon={CalendarIcon}
                    />
                </div>
                <div className="mt-6">
                    <FormTextarea
                        id="notes"
                        name="notes"
                        label="Notas Adicionales"
                        value={formData.notes}
                        onChange={onChange}
                        placeholder="Instrucciones especiales, horarios preferidos, etc."
                    />
                </div>
            </div>

            <FormActions />
        </div>
    </form>
);