// Tipos para servicios recurrentes
export interface RecurringService {
  pk_recurring_service: number;
  name: string;
  fk_client: number;
  fk_management: number;
  fk_location: number;
  fk_type_service: number;
  fk_waste?: number;
  fk_waste_subcategory?: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  custom_days?: number;
  start_date: string;
  end_date?: string;
  next_generation_date: string;
  status: 'active' | 'paused' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  frequency_display: string;
  status_display: string;
  
  // Objetos anidados de las relaciones
  fk_client_obj?: any;
  fk_management_obj?: any;
  fk_location_obj?: any;
  fk_type_service_obj?: any;
  fk_waste_obj?: any;
  fk_waste_subcategory_obj?: any;
}

export interface RecurringServiceCreateData {
  name: string;
  fk_client: number;
  fk_location: number;
  fk_type_service: number;
  fk_waste?: number;
  fk_waste_subcategory?: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  custom_days?: number;
  start_date: string;
  end_date?: string;
  notes?: string;
}

// Opciones para los selects
export interface FrequencyOption {
  value: 'daily' | 'weekly' | 'monthly' | 'custom';
  label: string;
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'custom', label: 'Personalizado' },
];

export interface StatusOption {
  value: 'active' | 'paused' | 'cancelled';
  label: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { value: 'active', label: 'Activo' },
  { value: 'paused', label: 'Pausado' },
  { value: 'cancelled', label: 'Cancelado' },
];

// Tipos para notificaciones
export interface ServiceNotification {
  pk_notification: number;
  fk_user: number;
  fk_service?: {
    pk_services: number;
    service_number: string;
    scheduled_date: string;
  };
  fk_recurring_service?: {
    pk_recurring_service: number;
    name: string;
    frequency: string;
  };
  notification_type: string;
  notification_type_display: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

// Respuesta de la API para generar servicios
export interface GenerateServicesResponse {
  generated_services: number;
  processed_recurring_services: number;
  errors?: Array<{
    recurring_service_id: number;
    error: string;
  }>;
}
