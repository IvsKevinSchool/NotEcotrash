import requests
import sys

def test_fixed_collector_endpoint():
    """
    Test del endpoint corregido de servicios del collector
    """
    base_url = "http://127.0.0.1:8000/api/v1"
    
    print("🔧 TESTING ENDPOINT ARREGLADO")
    print("=" * 50)
    
    # Ahora probar con el pk_collector_user correcto (1)
    collector_pk = 1  # Este es el pk_collector_user que encontramos
    user_id = 4      # Este es el user.id que funcionaba antes
    
    test_cases = [
        {
            "name": "Con pk_collector_user (CORRECTO)",
            "id": collector_pk,
            "expected": "✅ Debería funcionar"
        },
        {
            "name": "Con user.id (FALLBACK)",
            "id": user_id,
            "expected": "✅ Debería funcionar (fallback)"
        },
        {
            "name": "ID inexistente",
            "id": 999,
            "expected": "❌ Debería fallar"
        }
    ]
    
    for test_case in test_cases:
        print(f"\n📍 {test_case['name']} (ID: {test_case['id']})")
        print(f"   Esperado: {test_case['expected']}")
        
        url = f"{base_url}/services/collector/{test_case['id']}/services/"
        
        try:
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ SUCCESS: Status 200 - {len(data)} servicios encontrados")
                if len(data) > 0:
                    service = data[0]
                    print(f"   � Primer servicio: {service.get('service_number', 'N/A')}")
                    print(f"   📅 Fecha: {service.get('scheduled_date', 'N/A')}")
                    print(f"   📊 Estado: {service.get('fk_status', {}).get('name', 'N/A')}")
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:100]
                print(f"   ❌ FAILED: Status {response.status_code}")
                print(f"   💬 Error: {error_data}")
                
        except requests.ConnectionError:
            print("   ❌ ERROR: No se pudo conectar al servidor")
        except Exception as e:
            print(f"   ❌ ERROR: {e}")

def test_multiple_collector_ids():
    """
    Test para probar varios IDs y ver cuáles funcionan ahora
    """
    base_url = "http://127.0.0.1:8000/api/v1"
    
    print(f"\n🧪 TESTING MÚLTIPLES IDs DESPUÉS DEL ARREGLO")
    print("=" * 55)
    
    for test_id in range(1, 8):
        url = f"{base_url}/services/collector/{test_id}/services/"
        
        try:
            response = requests.get(url)
            status_icon = "✅" if response.status_code == 200 else "❌"
            
            print(f"   {status_icon} ID {test_id}: Status {response.status_code}", end="")
            
            if response.status_code == 200:
                data = response.json()
                print(f" - {len(data)} servicios")
            else:
                try:
                    error = response.json()
                    print(f" - {error.get('error', 'Error desconocido')}")
                except:
                    print(f" - Error HTTP")
        except Exception as e:
            print(f"   ❌ ID {test_id}: Error de conexión")

if __name__ == "__main__":
    test_fixed_collector_endpoint()
    test_multiple_collector_ids()