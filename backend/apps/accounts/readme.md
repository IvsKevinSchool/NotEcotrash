# Resumen de la construcción del modelo User para AUTH_USER_MODEL y funcionalidades adicionales

En este proyecto se construyó un modelo de usuario personalizado y se integraron funcionalidades complementarias siguiendo estos pasos:

## Modelo Custom de Usuario
- **Extensión de AbstractUser y PermissionsMixin:**  
  Se basó el modelo custom en `AbstractUser` para aprovechar la lógica predeterminada de Django y en `PermissionsMixin` para gestionar permisos y grupos.
  
- **Definición de campos personalizados:**  
  Se definieron campos importantes como `email` (definido como único), `first_name`, `last_name` y `username` (también único), junto con otros campos esenciales (`date_joined`, `last_login`, `is_staff`, `is_superuser`, `is_verified` e `is_active`).

- **Custom User Manager:**  
  Se implementó un `UserManager` que valida los datos esenciales (email, username, first_name, last_name) antes de crear el usuario, garantizando la integridad y el formato correcto de la información.

- **Integración en AUTH_USER_MODEL:**  
  Se configuró el archivo de settings (base.py) para utilizar el modelo custom mediante:
  `AUTH_USER_MODEL = "accounts.User"`

- **Utilidad y Extensibilidad:**  
  Se añadió un método `tokens` (como placeholder para futuras implementaciones de autenticación, por ejemplo, con JWT) y se creó una propiedad `get_full_name` que facilita el acceso al nombre completo del usuario.

## Gestión y Verificación de OTP
- **Modelo One-Time Password (OTP):**  
  Se creó el modelo `OneTimePassword` para almacenar códigos OTP, que incluye campos como `otp`, `created_at` y `expires_at`, permitiendo implementar mecanismos de verificación o autenticación basados en OTP.

- **Método de Validez del OTP:**  
  El método `is_valid` verifica si el OTP aún se encuentra vigente comparando la hora actual con el tiempo de expiración.

## Endpoints API y Funcionalidades
- **Registro de Usuario:**  
  Se desarrolló la vista `RegisterUserView` (basada en `GenericAPIView`) que utiliza el serializer `UserRegisterSerializer` para gestionar el registro. Tras crear el usuario, se invoca la función `send_otp_email` para enviar un código OTP al email proporcionado.

- **Rutas (URLs):**  
  Se definieron las rutas en `apps/accounts/api/urls.py`, combinando rutas específicas para vistas (como la de registro) y las generadas automáticamente mediante un `DefaultRouter`.

## Utilidades y Configuración del Entorno
- **Envío de OTP por Email:**  
  En `utils.py` se implementó `send_otp_email`, que se encarga de generar un OTP y enviarlo por medio del correo configurado en las settings. La configuración utiliza variables de entorno definidas en el archivo `.env`.

- **Configuración del Proyecto:**  
  Se utilizaron variables de entorno para datos sensibles como `SECRET_KEY`, y se configuró la base de datos PostgreSQL y los parámetros del correo en `local.py` y `base.py`.

## Pruebas Unitarias
- **Casos de Prueba en tests.py:**  
  Se agregaron pruebas unitarias para:
  - **Registro de Usuario:**  
    Validar un registro exitoso y manejar el caso en que las contraseñas no coinciden.
  - **Verificación de OTP:**  
    Confirmar que el OTP se considera válido dentro del tiempo estipulado y se invalida al expirar.

  Estos tests se pueden ejecutar con el siguiente comando desde la raíz del proyecto (donde se encuentra `manage.py`):

  ```bash
  python manage.py test
  ```

## Conclusión
La integración de un modelo de usuario personalizado junto con la funcionalidad de OTP y una API robusta permite una gestión confiable y escalable de la autenticación. La incorporación de pruebas unitarias es esencial para garantizar la calidad y estabilidad del sistema, facilitando la detección temprana de problemas y permitiendo un mantenimiento ágil y seguro frente a futuras modificaciones.