# Resumen de la construcción del modelo User para AUTH_USER_MODEL

En este proyecto se construyó un modelo de usuario personalizado siguiendo estos pasos:

- **Extensión de AbstractUser y PermissionsMixin:**  
  Se basó el modelo custom en `AbstractUser` para aprovechar la lógica y estructura predeterminada de Django, y en `PermissionsMixin` para gestionar permisos y grupos.

- **Definición de campos personalizados:**  
  Se incluyeron campos como `email` (definido como único), `first_name`, `last_name` y `username` (también único), además de otros campos básicos como `date_joined`, `last_login`, `is_staff`, `is_superuser`, `is_verified` e `is_active`.

- **Custom User Manager:**  
  Se implementó un `UserManager` que valida los datos esenciales (email, username, first_name, last_name) antes de crear el usuario. Esto asegura que siempre se proporcionen los campos requeridos y se verifique el formato del email.

- **Integración en AUTH_USER_MODEL:**  
  Se configuró el archivo de settings (base.py) para usar el modelo custom a través de la variable:  
  `AUTH_USER_MODEL = "accounts.User"`

- **Utilidad y extensibilidad:**  
  Se agregó un método `tokens` como placeholder para la generación de tokens, lo que permitirá integrar autenticación con JWT u otros esquemas en el futuro.  
  Además, se definió la propiedad `get_full_name` para facil acceso al nombre completo del usuario.

Este proceso garantiza una mayor flexibilidad y control sobre la autenticación y administración de usuarios en la aplicación.