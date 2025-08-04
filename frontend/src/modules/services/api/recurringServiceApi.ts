import api from '../../../api';
import { 
  RecurringService, 
  RecurringServiceCreateData, 
  ServiceNotification,
  GenerateServicesResponse 
} from '../types/recurringService';

const BASE_URL = '/services/recurring-services';
const NOTIFICATION_URL = '/services/notifications';

// Servicios Recurrentes
export const getRecurringServices = async (params?: {
  client_id?: number;
  management_id?: number;
  status?: string;
}): Promise<RecurringService[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.client_id) queryParams.append('client_id', params.client_id.toString());
    if (params?.management_id) queryParams.append('management_id', params.management_id.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = queryParams.toString() ? `${BASE_URL}/?${queryParams}` : `${BASE_URL}/`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching recurring services:', error);
    throw error;
  }
};

export const getRecurringService = async (id: number): Promise<RecurringService> => {
  try {
    const response = await api.get(`${BASE_URL}/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recurring service:', error);
    throw error;
  }
};

export const createRecurringService = async (data: RecurringServiceCreateData): Promise<RecurringService> => {
  try {
    const response = await api.post(`${BASE_URL}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating recurring service:', error);
    throw error;
  }
};

export const updateRecurringService = async (
  id: number, 
  data: Partial<RecurringServiceCreateData>
): Promise<RecurringService> => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating recurring service:', error);
    throw error;
  }
};

export const deleteRecurringService = async (id: number): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${id}/`);
  } catch (error) {
    console.error('Error deleting recurring service:', error);
    throw error;
  }
};

// Acciones específicas
export const pauseRecurringService = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.post(`${BASE_URL}/${id}/pause/`);
    return response.data;
  } catch (error) {
    console.error('Error pausing recurring service:', error);
    throw error;
  }
};

export const resumeRecurringService = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.post(`${BASE_URL}/${id}/resume/`);
    return response.data;
  } catch (error) {
    console.error('Error resuming recurring service:', error);
    throw error;
  }
};

export const cancelRecurringService = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.post(`${BASE_URL}/${id}/cancel/`);
    return response.data;
  } catch (error) {
    console.error('Error canceling recurring service:', error);
    throw error;
  }
};

export const generateNextService = async (id: number): Promise<{
  message: string;
  service: any;
}> => {
  try {
    const response = await api.post(`${BASE_URL}/${id}/generate_next_service/`);
    return response.data;
  } catch (error) {
    console.error('Error generating next service:', error);
    throw error;
  }
};

// Generar servicios automáticamente
export const generateRecurringServices = async (): Promise<GenerateServicesResponse> => {
  try {
    const response = await api.post('/services/generate-recurring-services/');
    return response.data;
  } catch (error) {
    console.error('Error generating recurring services:', error);
    throw error;
  }
};

// Notificaciones
export const getNotifications = async (): Promise<ServiceNotification[]> => {
  try {
    const response = await api.get(`${NOTIFICATION_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.post(`${NOTIFICATION_URL}/${id}/mark_as_read/`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<{ message: string }> => {
  try {
    const response = await api.post(`${NOTIFICATION_URL}/mark_all_as_read/`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const getUnreadNotificationCount = async (): Promise<{ unread_count: number }> => {
  try {
    const response = await api.get(`${NOTIFICATION_URL}/unread_count/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw error;
  }
};

export const deleteNotification = async (id: number): Promise<void> => {
  try {
    await api.delete(`${NOTIFICATION_URL}/${id}/`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};
