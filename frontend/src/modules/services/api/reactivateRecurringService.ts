import api from '../../../api';

export const reactivateRecurringService = async (id: number): Promise<{ message: string }> => {
  const response = await api.post(`/services/recurring-services/${id}/reactivate/`);
  return response.data;
};
