import api from "../../../api";
import { ClientFormData } from "../schemas/clientSchema";

export const createManagment = async (data: ClientFormData) => {
    const response = await api.post('/management/management/', data);
    return response.data;
}