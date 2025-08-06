import requests

def test_collector_login():
    """
    Test de login para verificar la estructura de respuesta del collector
    """
    base_url = "http://127.0.0.1:8000/api/v1"
    login_url = f"{base_url}/accounts/auth/login/"
    
    print("🔍 TESTING COLLECTOR LOGIN")
    print("=" * 50)
    
    # Intentamos hacer login con el usuario collector
    # Necesitamos las credenciales del usuario "Brian" (ID 4)
    
    # Intentar algunas combinaciones comunes de credenciales
    credentials_to_try = [
        {"email": "brian@gmail.com", "password": "password"},
        {"email": "brian@gmail.com", "password": "admin123"},
        {"email": "brian@gmail.com", "password": "Brian123"},
        {"email": "brian@gmail.com", "password": "12345678"},
        {"email": "collector@gmail.com", "password": "password"},
        {"email": "collector@gmail.com", "password": "admin123"},
    ]
    
    print("🔑 Intentando hacer login con el usuario collector...")
    
    for i, creds in enumerate(credentials_to_try, 1):
        print(f"\n{i}. Probando: {creds['email']} / {creds['password']}")
        
        try:
            response = requests.post(login_url, json=creds)
            
            if response.status_code == 200:
                print("   ✅ LOGIN EXITOSO!")
                data = response.json()
                
                print("\n📋 ESTRUCTURA DE RESPUESTA:")
                print("-" * 30)
                
                # Estructura general
                print(f"Message: {data.get('message')}")
                
                if 'data' in data:
                    login_data = data['data']
                    
                    # Información del usuario
                    if 'user' in login_data:
                        user = login_data['user']
                        print(f"\n👤 USER:")
                        print(f"   ID: {user.get('pk')}")
                        print(f"   Username: {user.get('username')}")
                        print(f"   Email: {user.get('email')}")
                        print(f"   Role: {user.get('role')}")
                        print(f"   Full Name: {user.get('full_name')}")
                    
                    # Información del collector
                    if 'collector' in login_data:
                        collector = login_data['collector']
                        print(f"\n🚛 COLLECTOR:")
                        if collector:
                            print(f"   pk_collector_user: {collector.get('pk_collector_user')}")
                            print(f"   name: {collector.get('name')}")
                            print(f"   last_name: {collector.get('last_name')}")
                            print(f"   phone_number: {collector.get('phone_number')}")
                            print(f"   fk_management: {collector.get('fk_management')}")
                        else:
                            print("   ❌ COLLECTOR ES NULL - ESTE ES EL PROBLEMA!")
                    else:
                        print("\n❌ NO HAY CAMPO 'collector' EN LA RESPUESTA")
                    
                    # Información de management y client
                    print(f"\n📊 Management: {login_data.get('management', 'NULL')}")
                    print(f"📊 Client: {login_data.get('client', 'NULL')}")
                
                print("\n🎯 PROBLEMA IDENTIFICADO:" if not login_data.get('collector') else "\n✅ TODO PARECE CORRECTO:")
                
                # Test del endpoint de servicios con el ID correcto
                user_id = login_data['user']['pk']
                collector_pk = login_data.get('collector', {}).get('pk_collector_user') if login_data.get('collector') else None
                
                print(f"\nID del usuario: {user_id}")
                print(f"pk_collector_user: {collector_pk}")
                
                # Test endpoint con ID de usuario
                print(f"\n🧪 Testando endpoint con user ID ({user_id}):")
                test_endpoint(f"{base_url}/services/collector/{user_id}/services/")
                
                # Test endpoint con collector ID si existe
                if collector_pk:
                    print(f"\n🧪 Testando endpoint con collector ID ({collector_pk}):")
                    test_endpoint(f"{base_url}/services/collector/{collector_pk}/services/")
                
                return True
                
            else:
                print(f"   ❌ Error: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   💬 {error_data}")
                except:
                    print(f"   💬 {response.text[:100]}")
                    
        except Exception as e:
            print(f"   ❌ Error de conexión: {e}")
    
    print("\n❌ No se pudo hacer login con ninguna credencial.")
    print("\n💡 RECOMENDACIONES:")
    print("1. Verificar las credenciales del usuario collector en la base de datos")
    print("2. Asegurarse de que existe una entrada en CollectorUsers para el usuario ID 4")
    print("3. Verificar que el LoginSerializer llene correctamente el campo collector")
    
    return False

def test_endpoint(url):
    """Helper para testear un endpoint"""
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Status 200 - {len(data)} servicios")
        else:
            error = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:100]
            print(f"   ❌ Status {response.status_code} - {error}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_collector_login()
