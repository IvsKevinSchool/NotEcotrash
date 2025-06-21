import React from "react";
import FormField from "../../../components/form/FormField";
import useUserForm from "../hooks/useUserForm";
import { DevTool } from "@hookform/devtools";

let renderCount = 0;

const UserForm = () => {
    const { register, control, handleSubmit, onSubmit, errors } = useUserForm();

    renderCount++;

    return (
        <section
            className="p-6 bg-white rounded-lg shadow dark:border md:mt-0   dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4 md:space-y-6">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Crear un nuevo usuario
                </h1>
                <h2 className="text-white">Contador de renderizados: {renderCount / 2}</h2>
                <form className="space-y-4 md:space-y-6 flex flex-col p-6 gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormField
                        label="Nombre de Usuario"
                        id="username"
                        type="text"
                        placeholder="Ingrese el Nombre de Usuario"
                        required
                        {...register("username")}
                        error={errors.username?.message}
                    />

                    <FormField
                        label="Correo Electrónico"
                        id="email"
                        type="email"
                        placeholder="Ingrese el Correo Electrónico"
                        required
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <FormField
                        label="Contraseña"
                        id="password"
                        type="password"
                        placeholder="Ingrese la Contraseña"
                        required
                        {...register("password")}
                        error={errors.password?.message}
                    />

                    <FormField
                        label="Confirmar Contraseña"
                        id="password_2"
                        type="password"
                        placeholder="Confirme la Contraseña"
                        required
                        {...register("password2")}
                        error={errors.password2?.message}
                    />

                    <FormField
                        label="Nombre"
                        id="first_name"
                        type="text"
                        placeholder="Ingrese el Nombre (opcional)"
                        {...register("first_name")}
                        error={errors.first_name?.message}
                    />

                    <FormField
                        label="Apellido"
                        id="last_name"
                        type="text"
                        placeholder="Ingrese el Apellido (opcional)"
                        {...register("last_name")}
                        error={errors.last_name?.message}
                    />

                    <div className="flex flex-col">
                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Rol
                        </label>
                        <select
                            id="role"
                            {...register("role")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="admin">Administrador</option>
                            <option value="employee">Empleado</option>
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
                        )}
                    </div>


                    <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
                        rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Guardar usuario</button>
                    <DevTool control={control} />
                </form>
            </div>
        </section>
    );
}

export default UserForm;