import React from "react";
import { useForm } from "react-hook-form";

export type UserFormValues = {
    email: string;
    username: string;
    password: string;
}

const useUserForm = () => {
    // Custom hook for user form handling
    // This hook can be used to manage form state, validation, and submission
    // using react-hook-form or any other form management library.
    const form = useForm<UserFormValues>()

    // You can define your form fields, validation rules, and submission logic here
    // For example, you can register fields like this:
    const { register, handleSubmit, formState } = form;
    // formState contains information about the form state, such as errors and touched fields
    const { errors } = formState;

    // Registering fields with validation rules
    const onSubmit = (data: UserFormValues) => {
        // Handle form submission logic here
        console.log(data);
    }

    return {
        form,
        register,
        handleSubmit,
        onSubmit, 
        errors,
    }
}

export default useUserForm;