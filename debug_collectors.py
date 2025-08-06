import requests

def debug_collectors():
    """
    Script para debuggear el problema de los collectors
    """
    base_url = "http://127.0.0.1:8000/api/v1"
    
    print("🔍 DEBUGGING COLLECTORS")
    print("=" * 60)
    
    # 1. Obtener lista de todos los usuarios
    print("\n1️⃣ USUARIOS EN EL SISTEMA:")
    print("-" * 30)
    
    try:
        response = requests.get(f"{base_url}/accounts/auth/users/")
        if response.status_code == 200:
            users = response.json()
            print(f"Total usuarios: {len(users)}")
            
            collectors = [u for u in users if u.get('role') == 'collector']
            print(f"Usuarios con rol 'collector': {len(collectors)}")
            
            print("\n👥 Todos los usuarios:")
            for user in users:
                role_icon = "👨‍💼" if user.get('role') == 'collector' else "👤"
                print(f"   {role_icon} ID: {user.get('id')}, Username: {user.get('username')}, "
                      f"Role: {user.get('role')}, Name: {user.get('get_full_name')}")
                
            if collectors:
                print(f"\n🚛 Collectors encontrados:")
                for collector in collectors:
                    print(f"   🚛 ID: {collector.get('id')}, Username: {collector.get('username')}, "
                          f"Name: {collector.get('get_full_name')}")
        else:
            print(f"Error obteniendo usuarios: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")
    
    # 2. Probar endpoints de servicios con los IDs de usuarios collector
    print(f"\n2️⃣ TESTANDO ENDPOINTS DE SERVICIOS:")
    print("-" * 40)
    
    # Probar con todos los IDs de usuario para ver cuáles funcionan
    for user_id in range(1, 10):
        url = f"{base_url}/services/collector/{user_id}/services/"
        
        try:
            response = requests.get(url)
            status_icon = "✅" if response.status_code == 200 else "❌"
            print(f"   {status_icon} ID {user_id}: Status {response.status_code}", end="")
            
            if response.status_code == 200:
                data = response.json()
                print(f" - {len(data)} servicios")
                if len(data) > 0:
                    print(f"        Ejemplo: {data[0].get('service_number', 'N/A')}")
            else:
                try:
                    error = response.json()
                    print(f" - {error.get('error', 'Error desconocido')}")
                except:
                    print(f" - Error HTTP")
        except Exception as e:
            print(f"   ❌ ID {user_id}: Error de conexión")
    
    # 3. Intentar hacer login para ver la estructura completa de respuesta
    print(f"\n3️⃣ ESTRUCTURA DE LOGIN:")
    print("-" * 25)
    print("Para resolver completamente el problema, necesitaríamos:")
    print("  1. Credenciales de un usuario collector")
    print("  2. Hacer login y ver la estructura completa de la respuesta")
    print("  3. Verificar si el campo 'collector' se llena correctamente")

if __name__ == "__main__":
    debug_collectors()
