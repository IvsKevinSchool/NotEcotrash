import requests

def debug_type_services():
    """
    Debug para ver qué tipos de servicios existen en el sistema
    """
    base_url = "http://127.0.0.1:8000/api/v1"
    
    print("🔍 DEBUGGING TIPOS DE SERVICIOS")
    print("=" * 50)
    
    # Intentar obtener tipos de servicios con diferentes filtros
    endpoints_to_try = [
        "/services/typeServices/",
        "/services/typeServices/?management_id=1",
        "/services/typeServices/?management_id=2",
        "/services/type-services/",
        "/core/type-services/",
        "/management/management/1/type-services/",
    ]
    
    for endpoint in endpoints_to_try:
        url = f"{base_url}{endpoint}"
        try:
            print(f"\n📍 Probando: {url}")
            response = requests.get(url)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Datos encontrados: {len(data) if isinstance(data, list) else 'Objeto'}")
                
                if isinstance(data, list) and len(data) > 0:
                    print(f"\n📋 TIPOS DE SERVICIOS ENCONTRADOS:")
                    for i, service in enumerate(data, 1):
                        name = service.get('name', 'Sin nombre')
                        pk = service.get('pk_type_services', service.get('id', 'Sin ID'))
                        management = service.get('fk_management', 'N/A')
                        print(f"   {i}. ID: {pk}, Nombre: '{name}', Management: {management}")
                        
                        # Verificar si contiene palabras clave de recolección
                        name_lower = name.lower()
                        keywords = ['recolección', 'recoleccion', 'residuo', 'waste', 'collection', 'general']
                        matching_keywords = [kw for kw in keywords if kw in name_lower]
                        
                        if matching_keywords:
                            print(f"      🚛 DEBERÍA activar campos de residuo (keywords: {matching_keywords})")
                        else:
                            print(f"      ❌ NO activaría campos de residuo")
                
                    return True  # Si encontramos datos, terminar
            else:
                try:
                    error_data = response.json()
                    print(f"   💬 Error: {error_data}")
                except:
                    print(f"   💬 Error HTTP")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"\n🔧 RECOMENDACIONES:")
    print("1. Verifica que existan tipos de servicios con nombres como:")
    print("   - 'Recolección de residuos'")
    print("   - 'Recolección general'")
    print("   - 'Servicio de recolección'")
    print("2. Si no existen, créalos desde el panel de management")
    print("3. Verifica que el endpoint correcto sea usado en el frontend")
    
    return False

if __name__ == "__main__":
    debug_type_services()
