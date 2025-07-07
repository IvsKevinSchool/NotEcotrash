Buscar la palabara RDS en AWS en el buscador de la parte superior derecha y selecciona la opción "RDS" en el menú desplegable.

Una vez dentro de RDS, haz clic en "Create database" (Crear base de datos).
Aparecerá una pantalla donde podrás configurar tu base de datos. Selecciona "PostgreSQL" como motor de base de datos.
Configura los detalles de la base de datos:
- **DB instance class**: Elige una clase de instancia según tus necesidades. Para pruebas, puedes seleccionar una clase pequeña.
- **Storage**: Configura el almacenamiento según tus necesidades. Puedes comenzar con 20 GB y ajustarlo más tarde si es necesario.
- **DB instance identifier**: Asigna un nombre a tu instancia de base de datos.
- **Master username**: Elige un nombre de usuario para la base de datos.
- **Master password**: Establece una contraseña segura para el usuario de la base debase de datos.
- **VPC**: Selecciona la VPC en la que deseas crear la base de datos. Si no tienes una VPC, puedes usar la predeterminada.
- **Public accessibility**: Si deseas acceder a la base de datos desde fuera de la VPC, selecciona "Yes". Si solo necesitas acceso desde instancias dentro de la VPC, selecciona "No".
- **Availability zone**: Puedes dejarlo en "No preference" para que AWS elija automáticamente una zona de disponibilidad.
- **Database options**: Configura el nombre de la base de datos, el conjunto de caracteres y la colación según tus necesidades. Puedes dejar los valores predeterminados si no tienes requisitos específicos.
- **Backup**: Configura la retención de copias de seguridad según tus necesidades.