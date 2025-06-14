# Documentación del Módulo de Cuentas (Accounts)

Este documento describe de forma detallada la implementación del modelo de usuario personalizado, la gestión y verificación de OTP, y los endpoints expuestos para la autenticación y recuperación de contraseñas. Se incluyen además detalles sobre serializers, vistas, rutas y utilidades asociadas.

---

## 1. Modelo Custom de Usuario

El modelo custom está basado en `AbstractUser` y `PermissionsMixin` para aprovechar la lógica de autenticación y permisos de Django, extendiéndolo para agregar funcionalidades propias.

### Características:
- **Campos personalizados:**  
  - `email` (único)
  - `username` (único)
  - `first_name`
  - `last_name`
  - `date_joined`, `last_login`
  - Flags: `is_staff`, `is_superuser`, `is_verified`, `is_active`

- **Manager personalizado (UserManager):**  
  Valida datos esenciales (email, username, first_name, last_name) al crear el usuario.

- **Métodos adicionales:**
  - `tokens`: Genera y retorna un diccionario con tokens de autenticación (JWT) utilizando `rest_framework_simplejwt`.
  - Propiedad `get_full_name`: Devuelve el nombre completo del usuario.

_Ejemplo de uso del método tokens:_
```python
user = User.objects.get(email="usuario@example.com")
tokens = user.tokens()
print(tokens["access"])
print(tokens["refresh"])
```

---

## 2. Gestión y Verificación de OTP

Se implementó la funcionalidad de One-Time Password (OTP) para procesos de verificación, registrando y validando códigos temporales enviados por email.

### Modelo OneTimePassword
- **Campos:**
  - `user`: Relación con el modelo User.
  - `otp`: Código de 6 dígitos.
  - `created_at`: Fecha de creación.
  - `expires_at`: Fecha y hora límite para que el OTP sea válido.

- **Método `is_valid`:**  
  Verifica si el OTP sigue vigente comparando la hora actual con `expires_at`.

_Ejemplo de verificación:_
```python
otp_instance = OneTimePassword.objects.get(otp="123456")
if otp_instance.is_valid():
    # Proceder con la verificación
```

---

## 3. Endpoints y Flujos API

Se han implementado varios endpoints para gestionar el registro, verificación, autenticación y recuperación de contraseña de los usuarios. Todos los endpoints se encuentran definidos en `apps/accounts/api/urls.py`.

### 3.1 Registro de Usuario
- **Endpoint:** `POST /api/v1/accounts/auth/register/`
- **Serializer:** `UserRegisterSerializer`
- **Flujo:**
  1. Se envía la información (email, username, first_name, last_name, password, password2).
  2. El serializer valida que ambas contraseñas coincidan y que el email no esté en uso.
  3. Se crea el usuario y se invoca `send_otp_email` para enviar un OTP al email registrado.
  4. Se retorna una respuesta con un mensaje de éxito y los datos del usuario.

### 3.2 Verificación de Email (OTP)
- **Endpoint:** `POST /api/v1/accounts/auth/verify-email/`
- **Serializer:** `VerifyEmailSerializer`
- **Flujo:**
  1. Se envía el código OTP en el body.
  2. La vista busca el OTP asociado y verifica si éste es válido (no expirado).
  3. Si el OTP es correcto, se marca el usuario como verificado (`is_verified = True`) y se envía una respuesta de éxito.

### 3.3 Login de Usuario
- **Endpoint:** `POST /api/v1/accounts/auth/login/`
- **Serializer:** `LoginSerializer`
- **Flujo:**
  1. Se envían las credenciales (email y password).
  2. El serializer utiliza `authenticate` para validar el usuario.  
  3. Si la autenticación es correcta, se generan tokens (access y refresh) mediante el método `tokens` del modelo.
  4. Se retorna un JSON conteniendo los tokens y algunos datos del usuario.

### 3.4 Endpoint de Prueba para Usuarios Autenticados
- **Endpoint:** `GET /api/v1/accounts/auth/test-authenticated/`
- **Requiere:** Autenticación (token JWT en el header `Authorization`)
- **Flujo:**
  1. Este endpoint comprueba que el usuario esté autenticado.
  2. En caso de éxito, retorna un mensaje: `"You are authenticated!"`.

_Para probar este endpoint en Swagger, asegúrate de autorizarte utilizando un token válido en el formato:_
```
Bearer <tu_access_token>
```

### 3.5 Reinicio de Contraseña
El flujo de reinicio de contraseña se compone de tres endpoints:

#### 3.5.1 Solicitud de Reinicio de Contraseña
- **Endpoint:** `POST /api/v1/accounts/auth/password-reset/`
- **Serializer:** `ResetPasswordSerializer`
- **Flujo:**
  1. Se envía el email del usuario.
  2. El serializer verifica que el email exista y genera un token con `PasswordResetTokenGenerator`.
  3. Se conforma un enlace absoluto utilizando el dominio actual y se envía por email (se invoca `send_normal_email`).

#### 3.5.2 Confirmación del Token para Reinicio de Contraseña
- **Endpoint:** `GET /api/v1/accounts/auth/password-reset-confirm/<uidb64>/<token>/`
- **Flujo:**
  1. Se decodifica el UID y se obtiene el usuario.
  2. Se utiliza `PasswordResetTokenGenerator().check_token` para validar el token.
  3. Si el token es válido, se retorna un mensaje indicando que se puede proceder al reajuste de la contraseña.

#### 3.5.3 Establecer Nueva Contraseña
- **Endpoint:** `PATCH /api/v1/accounts/auth/set-new-password/`
- **Serializer:** `SetNewPasswordSerializer`
- **Flujo:**
  1. Se envían las contraseñas nuevas (password y password2), junto con `uidb64` y `token`.
  2. El serializer valida que las contraseñas coincidan y que el token sea válido.
  3. Se actualiza la contraseña del usuario y se retorna un mensaje de éxito.

---

## 4. Serializers

### 4.1 UserRegisterSerializer
- Valida que las contraseñas coincidan y que el email sea único.
- Crea el usuario y se utiliza en el proceso de registro.

### 4.2 LoginSerializer
- Valida las credenciales del usuario.
- Utiliza `authenticate` y recupera los tokens JWT a través del método `tokens` del modelo.
- Retorna los tokens y algunos datos del usuario (email, username, full name).

### 4.3 VerifyEmailSerializer
- Se utiliza para la verificación del OTP, recibiendo el código de 6 dígitos.

### 4.4 ResetPasswordSerializer
- Valida el email y, de existir el usuario, genera un enlace para la restauración de contraseña.
- Se encarga de enviar el email correspondiente con el token de reinicio.

### 4.5 SetNewPasswordSerializer
- Valida que las contraseñas ingresadas coincidan.
- Utiliza el token y uidb64 para decodificar el usuario y actualizar la contraseña.

---

## 5. Utilidades (utils.py)

### Funciones principales:
- **generate_otp:**  
  Genera un código OTP de 6 dígitos de forma aleatoria.

- **send_otp_email:**  
  Busca el usuario por email, genera un OTP y lo guarda en la base de datos junto con la fecha de expiración. Envía el código vía email utilizando la configuración de correo definida en las settings.

- **send_normal_email:**  
  Envía un correo electrónico genérico usando los datos proporcionados (subject, message, recipient_list, etc.). Esta función se utiliza para enviar enlaces de reinicio de contraseña.

---

## 6. Configuración del Proyecto y Seguridad

- **AUTH_USER_MODEL:**  
  Se configuró en el archivo de settings (por ejemplo, `base.py`) mediante:
  ```python
  AUTH_USER_MODEL = "accounts.User"
  ```

- **JWT Authentication:**  
  Se utiliza `rest_framework_simplejwt` para generar y validar tokens. El método `tokens` del modelo User genera los tokens necesarios.

- **Swagger & Documentación de la API:**  
  La documentación se genera usando `drf_yasg` y se ha configurado para mostrar la opción de **Authorize**. Para autorizar, se debe proporcionar el token en el header `Authorization` en el formato:
  ```
  Bearer <tu_access_token>
  ```

---

## 7. Pruebas Unitarias

Se han desplegado casos de prueba que incluyen, pero no se limitan a:
- Registro de usuario: Validación de datos correctos, manejo de contraseñas que no coinciden, y verificación de la unicidad del email.
- Verificación de OTP: Asegurar que el OTP se valide correctamente dentro del tiempo estipulado y se invalide al expirar.
- Flujo de restauración de contraseña: Desde la solicitud hasta el establecimiento de una nueva contraseña.

_Ejecutar tests:_
```bash
python manage.py test
```

---

## Conclusión

Esta documentación detalla la arquitectura del módulo de cuentas, que incluye:
- Un modelo custom de usuario robusto.
- Gestión de OTP para verificación de usuarios.
- Endpoints para registro, autenticación, verificación y recuperación de contraseñas.
- Implementación de tokens JWT para la autenticación segura.
- Integración con Swagger para facilitar el testing y la visualización de la API.

Con este sistema, se obtiene una solución escalable y segura para la gestión de usuarios y la autenticación en la aplicación, asegurando la facilidad de mantenimiento y extensión en futuras actualizaciones.

---

*Para cualquier duda o soporte adicional, consulte la documentación oficial de Django y Django Rest Framework.*