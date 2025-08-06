#!/usr/bin/env python3
"""
Test para simular la lógica del frontend y verificar por qué no funcionan los campos dinámicos
"""

def test_frontend_logic():
    print("🧪 TESTING FRONTEND LOGIC")
    print("=" * 50)
    
    # Datos simulados que deberían llegar del backend (basados en nuestro test anterior)
    typeServices = [
        {"pk_type_services": 1, "name": "Recoleccion General"},
        {"pk_type_services": 2, "name": "Entrega Regular"},
        {"pk_type_services": 3, "name": "Servicio de Instalacion"},
        {"pk_type_services": 4, "name": "Recolección de residuos generales"},
        {"pk_type_services": 5, "name": "Recolección de residuos orgánicos"},
        {"pk_type_services": 6, "name": "Recolección de residuos reciclables"},
        {"pk_type_services": 7, "name": "Recolección de residuos peligrosos"},
        {"pk_type_services": 8, "name": "Servicio de Mantenimiento"}
    ]
    
    # Simular la función isDynamicWasteCollectionService del frontend
    def is_dynamic_waste_collection_service(selected_type_service, type_services):
        print(f"🔍 ServiceForm - calculating isDynamicWasteCollectionService")
        print(f"🔍 selectedTypeService: {selected_type_service}")
        print(f"🔍 typeServices: {len(type_services)} services available")
        
        if not selected_type_service or not type_services or len(type_services) == 0:
            print("🔍 ServiceForm - returning False: no selectedTypeService or no typeServices")
            return False
        
        # Buscar el servicio seleccionado
        selected_service = None
        for service in type_services:
            if service["pk_type_services"] == selected_type_service:
                selected_service = service
                break
                
        if not selected_service:
            print(f"🔍 ServiceForm - returning False: selectedService not found for ID: {selected_type_service}")
            available_ids = [s["pk_type_services"] for s in type_services]
            print(f"🔍 ServiceForm - available service IDs: {available_ids}")
            return False
        
        # Buscar si el nombre del servicio contiene palabras relacionadas con recolección de residuos
        service_name = selected_service["name"].lower()
        keywords = ['recolección', 'recoleccion', 'residuo', 'waste', 'collection', 'general']
        
        # Usar la misma lógica exacta que en el componente
        has_keyword = (service_name.find('recolección') != -1 or 
                      service_name.find('recoleccion') != -1 or 
                      service_name.find('residuo') != -1 or
                      service_name.find('waste') != -1 or
                      service_name.find('collection') != -1 or
                      service_name.find('general') != -1)
        
        print(f"🔍 ServiceForm - selectedService: {selected_service}")
        print(f"🔍 ServiceForm - serviceName: '{service_name}'")
        found_keywords = [kw for kw in keywords if service_name.find(kw) != -1]
        print(f"🔍 ServiceForm - keywords found: {found_keywords}")
        print(f"🔍 ServiceForm - hasKeyword (result): {has_keyword}")
        
        return has_keyword
    
    print("\n📋 TESTING CADA TIPO DE SERVICIO:")
    print("-" * 40)
    
    for service in typeServices:
        service_id = service["pk_type_services"]
        service_name = service["name"]
        
        print(f"\n🎯 Testing Service ID {service_id}: '{service_name}'")
        result = is_dynamic_waste_collection_service(service_id, typeServices)
        status = "✅ SHOULD SHOW waste fields" if result else "❌ Should NOT show waste fields"
        print(f"   Result: {result} - {status}")
    
    print("\n" + "=" * 50)
    print("🏁 SUMMARY:")
    print("=" * 50)
    
    should_show_waste = []
    should_not_show_waste = []
    
    for service in typeServices:
        service_id = service["pk_type_services"]
        service_name = service["name"]
        result = is_dynamic_waste_collection_service(service_id, typeServices)
        
        if result:
            should_show_waste.append(f"ID {service_id}: {service_name}")
        else:
            should_not_show_waste.append(f"ID {service_id}: {service_name}")
    
    print(f"\n✅ Services that SHOULD show waste fields ({len(should_show_waste)}):")
    for service in should_show_waste:
        print(f"   - {service}")
    
    print(f"\n❌ Services that should NOT show waste fields ({len(should_not_show_waste)}):")
    for service in should_not_show_waste:
        print(f"   - {service}")
    
    print(f"\n🔧 POTENTIAL ISSUES TO CHECK IN FRONTEND:")
    print("1. ¿Está llegando selectedTypeService como number o string?")
    print("2. ¿Los typeServices están llegando correctamente al componente?")
    print("3. ¿El useMemo se está recalculando cuando cambia selectedTypeService?")
    print("4. ¿Hay algún error en la consola del navegador?")
    print("5. ¿El watch('fk_type_services') está funcionando correctamente?")
    
    # Test de tipos de datos
    print(f"\n🔍 TESTING DATA TYPES:")
    print("Testing string vs number comparison...")
    
    # Test caso real: selectedTypeService como string
    string_test = is_dynamic_waste_collection_service("1", typeServices)  # Como string
    number_test = is_dynamic_waste_collection_service(1, typeServices)   # Como number
    
    print(f"   - Test with string '1': {string_test}")
    print(f"   - Test with number 1: {number_test}")
    
    if string_test != number_test:
        print("   ⚠️  WARNING: Different results for string vs number!")
        print("   This could be the issue if selectedTypeService is coming as string from form")

if __name__ == "__main__":
    test_frontend_logic()
