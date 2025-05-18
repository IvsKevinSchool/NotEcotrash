# Proyecto NotEcotrash

Este documento describe cómo configurar e iniciar el entorno de desarrollo tanto para el backend como para el frontend.

---

## Backend

El backend se encuentra en la carpeta `backend` y utiliza un entorno virtual para gestionar las dependencias de Python.

### Requisitos

- Python 3.x instalado en el sistema.
- Las dependencias instaladas (se recomienda usar `pip`).

### Instrucciones

1. **Abrir una terminal** y navegar a la carpeta del backend:
   ```
   cd c:\Users\kevin\Documents\TrabajosUTT\Archivos_Cuatrimestre_8\NotEcotrash\backend
   ```

2. **Activar el entorno virtual**:

   - En **Command Prompt** (CMD):
     ```
     env\Scripts\activate.bat
     ```
     
   - En **PowerShell**:
     ```
     .\env\Scripts\Activate.ps1
     ```
     
   - En **Git Bash** o similar:
     ```
     source env/Scripts/activate
     ```

3. **Instalar las dependencias** (si aún no se han instalado):
   ```
   pip install -r requirements.txt
   ```
   *(Asegúrate de que exista un archivo `requirements.txt` o instala las dependencias según las instrucciones del proyecto.)*

4. **Iniciar el servidor**:
   ```
   python manage.py runserver
   ```
   Esto iniciará el backend, normalmente en `http://127.0.0.1:8000`.

---

## Frontend

El frontend se encuentra en la carpeta `frontend` y utiliza Vite junto con React.

### Requisitos

- Node.js instalado (se recomienda la versión LTS).

### Instrucciones

1. **Abrir una terminal** y navegar a la carpeta del frontend:
   ```
   cd c:\Users\kevin\Documents\TrabajosUTT\Archivos_Cuatrimestre_8\NotEcotrash\frontend
   ```

2. **Instalar las dependencias**:
   ```
   npm install
   ```
   o
   ```
   yarn
   ```

3. **Iniciar el entorno de desarrollo**:
   ```
   npm run dev
   ```
   o, si usas Yarn:
   ```
   yarn dev
   ```
   Esto iniciará el servidor de desarrollo de Vite (por defecto se abrirá en `http://localhost:3000` o `http://localhost:5173` según tu configuración).

---

¡Listo! Ahora tendrás el backend y el frontend en funcionamiento para continuar con el desarrollo del proyecto.