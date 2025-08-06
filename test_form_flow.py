import requests

def test_complete_service_form_flow():
    """
    Test completo del flujo del formulario de servicios
    """
    base_url = "http://127.0.0.1:8000/api/v1"
    
    print("🔍 TESTING FLUJO COMPLETO DEL FORMULARIO")
    print("=" * 60)
    
    # 1. Simular la llamada que hace getServiceFormData
    management_id = 1
    
    print(f"\n1️⃣ SIMULANDO getServiceFormData(managementId={management_id}):")
    print("-" * 50)
    
    try:
        # Obtener tipos de servicios (como lo hace el frontend)
        type_services_url = f"{base_url}/services/typeServices/?management_id={management_id}"
        print(f"📍 Calling: {type_services_url}")
        
        response = requests.get(type_services_url)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            type_services = response.json()
            print(f"   ✅ Type Services found: {len(type_services)}")
            
            # 2. Simular la lógica de isDynamicWasteCollectionService
            print(f"\n2️⃣ SIMULANDO isDynamicWasteCollectionService PARA CADA SERVICIO:")
            print("-" * 55)
            
            keywords = ['recolección', 'recoleccion', 'residuo', 'waste', 'collection', 'general']
            
            for service in type_services:
                service_name = service.get('name', '').lower()
                service_id = service.get('pk_type_services')
                
                # Simular la misma lógica que está en el frontend
                has_keyword = (service_name.find('recolección') >= 0 or 
                              service_name.find('recoleccion') >= 0 or 
                              service_name.find('residuo') >= 0 or
                              service_name.find('waste') >= 0 or
                              service_name.find('collection') >= 0 or
                              service_name.find('general') >= 0)
                
                # Encontrar qué keywords matchean
                matching_keywords = [kw for kw in keywords if kw in service_name]
                
                icon = "🚛" if has_keyword else "❌"
                print(f"   {icon} ID: {service_id}")
                print(f"      Nombre: '{service.get('name')}'")
                print(f"      Nombre lowercase: '{service_name}'")
                print(f"      Keywords encontradas: {matching_keywords}")
                print(f"      ¿Debería mostrar campos residuo? {has_keyword}")
                print()
            
            # 3. Verificar datos de residuos
            print(f"3️⃣ VERIFICANDO DATOS DE RESIDUOS:")
            print("-" * 35)
            
            # Wastes
            waste_url = f"{base_url}/waste/waste/"
            print(f"📍 Calling: {waste_url}")
            waste_response = requests.get(waste_url)
            print(f"   Wastes Status: {waste_response.status_code}")
            if waste_response.status_code == 200:
                wastes = waste_response.json()
                print(f"   ✅ Wastes found: {len(wastes)}")
                for waste in wastes[:3]:  # Mostrar solo los primeros 3
                    print(f"      - ID: {waste.get('pk_waste')}, Name: '{waste.get('name')}'")
            
            # Waste Subcategories  
            subcat_url = f"{base_url}/management/management/{management_id}/waste-subcategories/"
            print(f"\n📍 Calling: {subcat_url}")
            subcat_response = requests.get(subcat_url)
            print(f"   Subcategories Status: {subcat_response.status_code}")
            if subcat_response.status_code == 200:
                subcats = subcat_response.json()
                print(f"   ✅ Subcategories found: {len(subcats)}")
                for subcat in subcats[:3]:  # Mostrar solo las primeras 3
                    print(f"      - ID: {subcat.get('pk_waste_subcategory')}, Name: '{subcat.get('name')}'")
        
        else:
            print(f"   ❌ Error getting type services: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data}")
            except:
                print(f"   Error: {response.text[:200]}")
    
    except Exception as e:
        print(f"❌ Error in test: {e}")
    
    # 4. Posibles problemas
    print(f"\n4️⃣ POSIBLES PROBLEMAS:")
    print("-" * 25)
    print("✓ Si todos los datos están disponibles pero el frontend no funciona:")
    print("  1. El managementId no se está pasando correctamente")
    print("  2. Los typeServices están llegando vacíos al componente")
    print("  3. El selectedTypeService no se está actualizando")
    print("  4. Hay un error en el useMemo que impide la recalculación")
    print()
    print("📱 PARA DEBUGGING EN EL FRONTEND:")
    print("  - Abre las DevTools del navegador")
    print("  - Ve a la página de creación de servicios")
    print("  - Busca en la consola los logs que comienzan con '🔍'")
    print("  - Verifica que typeServices tenga datos")
    print("  - Selecciona un tipo de servicio y ve si cambia isDynamicWasteCollectionService")

if __name__ == "__main__":
    test_complete_service_form_flow()
