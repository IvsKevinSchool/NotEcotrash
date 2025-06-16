import React from "react";
import FormField from "../../../components/form/FormField";
import useUserForm from "../hooks/useUserForm";
import { DevTool } from "@hookform/devtools";


const UserForm = () => {
    const { form, register, handleSubmit, onSubmit, errors } = useUserForm();

    return (
        <section className="flex flex-col items-center pt-6">
            <div
                className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Crear un nuevo usuario
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FormField
                            label="Email"
                            id="email"
                            type="email"
                            placeholder="juanito@gmail.com"
                            required={true}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format"
                                }
                            })}
                            error={errors.email?.message}
                        />
                        <FormField
                            label="Username"
                            id="username"
                            type="text"
                            placeholder="juanito123"
                            required={true}
                            {...register("username", {
                                required: "Username is required",
                                minLength: {
                                    value: 3,
                                    message: "Username must be at least 3 characters long"
                                },
                                maxLength: {
                                    value: 20,
                                    message: "Username must not exceed 20 characters"
                                }
                            })}
                            error={errors.username?.message}
                        />

                        <FormField
                            label="Password"
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required={true}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long"
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Password must not exceed 50 characters"
                                }
                            })}
                            error={errors.password?.message}
                        />
                        
                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
                        rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Guardar usuario</button>
                        <DevTool control={form.control} />
                    </form>
                </div>
            </div>
        </section>
    );
}

export default UserForm;