import api from "../../../api";
import { CertificateFormData } from "../schemas/certificateSchemas";

const API_URL = "client/certificate/";

export const getCertificates = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

export const getClients = async (id: number) => {
    const response = await api.get(`client/by-management/${id}/`);
    return response.data;
};

export const createCertificate = async (data: CertificateFormData) => {
    const formData = new FormData();
    formData.append('fk_client', data.fk_client.toString());
    formData.append('certificate_name', data.certificate_name);
    formData.append('is_active', "true");
    if (data.pdf) {
        formData.append('pdf', data.pdf);
    }

    const response = await api.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateCertificate = async (id: number, data: CertificateFormData) => {
    const formData = new FormData();
    formData.append('fk_management', data.fk_client.toString());
    formData.append('certificate_name', data.certificate_name);
    if (data.pdf) {
        formData.append('pdf', data.pdf);
    }

    const response = await api.put(`${API_URL}${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteCertificate = async (id: number) => {
    await api.delete(`${API_URL}${id}/`);
};

export const downloadCertificate = async (id: number) => {
    const response = await api.get(`${API_URL}${id}/download/`, {
        responseType: 'blob',
    });
    return response.data;
};