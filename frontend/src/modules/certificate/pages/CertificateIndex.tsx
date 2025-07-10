import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { CertificateFormData, certificateSchema } from "../schemas/certificateSchemas";
import {
    getCertificates,
    getCertificate,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    downloadCertificate,
} from "../services/certificateService";

const CertificateIndex = () => {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [managements, setManagements] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CertificateFormData>({
        resolver: zodResolver(certificateSchema),
    });

    const selectedFile = watch("pdf");

    // Fetch initial data
    useEffect(() => {
        fetchData();
        // In a real app, you would fetch managements from API
        setManagements([
            { pk_management: 1, name: "Management 1" },
            { pk_management: 2, name: "Management 2" },
        ]);
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getCertificates();
            setCertificates(data);
        } catch (error) {
            toast.error("Error fetching certificates");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: CertificateFormData) => {
        try {
            if (isEditing && currentId) {
                await updateCertificate(currentId, data);
                toast.success("Certificate updated successfully");
            } else {
                await createCertificate(data);
                toast.success("Certificate created successfully");
            }
            fetchData();
            resetForm();
        } catch (error) {
            console.error("Error saving certificate:", error);
            toast.error("Error saving certificate");
        }
    };

    const handleEdit = async (id: number) => {
        try {
            const certificate = await getCertificate(id);
            reset({
                ...certificate,
                pdf: undefined, // No establecer el archivo PDF existente
            });
            setIsEditing(true);
            setCurrentId(id);
        } catch (error) {
            toast.error("Error fetching certificate for edit");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this certificate?")) {
            try {
                await deleteCertificate(id);
                toast.success("Certificate deleted successfully");
                fetchData();
            } catch (error) {
                toast.error("Error deleting certificate");
            }
        }
    };

    const handleDownload = async (id: number, fileName: string) => {
        try {
            const blob = await downloadCertificate(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error("Error downloading certificate");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setValue("pdf", e.target.files[0]);
        }
    };

    const resetForm = () => {
        reset();
        setIsEditing(false);
        setCurrentId(null);
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 mb-8">Certificates Management</h1>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-200">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">
                        {isEditing ? "Edit Certificate" : "Add New Certificate"}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Management Select */}
                            <div>
                                <label className="block text-green-700 mb-1">Management</label>
                                <select
                                    {...register("fk_management", { valueAsNumber: true })}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Select Management</option>
                                    {managements.map((mgmt) => (
                                        <option key={mgmt.pk_management} value={mgmt.pk_management}>
                                            {mgmt.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.fk_management && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_management.message}</p>
                                )}
                            </div>

                            {/* Certificate Name */}
                            <div>
                                <label className="block text-green-700 mb-1">Certificate Name</label>
                                <input
                                    type="text"
                                    {...register("certificate_name")}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.certificate_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.certificate_name.message}</p>
                                )}
                            </div>

                            {/* PDF File Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-green-700 mb-1">PDF File</label>
                                <div className="flex items-center">
                                    <label className="flex flex-col items-center px-4 py-2 bg-white rounded-lg border border-green-300 cursor-pointer hover:bg-green-50">
                                        <span className="text-sm text-green-700">
                                            {selectedFile?.name || "Choose a PDF file"}
                                        </span>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {selectedFile && (
                                        <span className="ml-2 text-sm text-green-600">
                                            {selectedFile.name}
                                        </span>
                                    )}
                                </div>
                                {errors.pdf && (
                                    <p className="text-red-500 text-sm mt-1">{errors.pdf.message}</p>
                                )}
                                {!isEditing && !selectedFile && (
                                    <p className="text-red-500 text-sm mt-1">PDF file is required</p>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                {isEditing ? "Update" : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Certificates List</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-green-200">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Management</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">File</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-200">
                                    {certificates.map((cert) => (
                                        <tr key={cert.pk_certificate} className="hover:bg-green-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{cert.pk_certificate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{cert.certificate_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                {managements.find(m => m.pk_management === cert.fk_management)?.name || cert.fk_management}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                <button
                                                    onClick={() => handleDownload(cert.pk_certificate, cert.certificate_name + '.pdf')}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Download PDF
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(cert.pk_certificate)}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cert.pk_certificate)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificateIndex;