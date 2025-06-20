import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema } from "../schemas/userSchema"; // Import your Zod schema
import type { UserFormType } from "../schemas/userSchema"; // Import your user form values type
import { registerUser } from "../services/userService";

const useUserForm = () => {
    const navigate = useNavigate(); // Hook for navigation, if needed


    // Custom hook for user form handling
    // This hook can be used to manage form state, validation, and submission
    // using react-hook-form or any other form management library.
    const form = useForm<UserFormType>({
        resolver: zodResolver(userSchema), // Use Zod schema for validation
        defaultValues: {}, // Default values for the form fields

        mode: "onBlur", // Validation mode can be 'onChange', 'onBlur', or 'onSubmit'
        reValidateMode: "onChange", // Re-validation mode
        criteriaMode: "all", // Validate all fields at once
        shouldFocusError: true, // Focus the first error field on submit
    })

    // You can define your form fields, validation rules, and submission logic here
    // For example, you can register fields like this:
    const { register, control, handleSubmit, formState } = form;
    // formState contains information about the form state, such as errors and touched fields
    const { errors } = formState;

    // Registering fields with validation rules
    const onSubmit = async (data: UserFormType) => {
        try {
            console.log("Submitting user data:", data);
            
            const response = await registerUser(data);
            console.log("User registered successfully:", response);
            navigate("/admin"); // Redirect to the raw materials list page after successful creation
        } catch (error) {
            console.error("Error registering user:", error);
            // Handle the error, e.g., show a notification
        }
    }

    return {
        register,
        control,
        handleSubmit,
        onSubmit,
        errors,
    }
}

export default useUserForm;