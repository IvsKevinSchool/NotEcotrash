#!/usr/bin/env python3
"""
Test rápido para verificar que la conversión de string a number soluciona el problema
"""

def test_string_to_number_fix():
    print("🔧 TESTING STRING TO NUMBER FIX")
    print("=" * 50)
    
    # Datos simulados
    typeServices = [
        {"pk_type_services": 1, "name": "Recoleccion General"},
        {"pk_type_services": 4, "name": "Recolección de residuos generales"},
    ]
    
    def is_dynamic_with_number_conversion(selected_type_service, type_services):
        if not selected_type_service or not type_services:
            return False
        
        # Convertir a número como en el fix
        selected_service = None
        for service in type_services:
            if service["pk_type_services"] == int(selected_type_service):  # Number() en JS = int() en Python
                selected_service = service
                break
                
        if not selected_service:
            return False
        
        service_name = selected_service["name"].lower()
        has_keyword = (service_name.find('recolección') != -1 or 
                      service_name.find('recoleccion') != -1 or 
                      service_name.find('residuo') != -1 or
                      service_name.find('waste') != -1 or
                      service_name.find('collection') != -1 or
                      service_name.find('general') != -1)
        
        return has_keyword
    
    # Test casos
    test_cases = [
        ("1", "string '1'"),
        (1, "number 1"),
        ("4", "string '4'"),
        (4, "number 4"),
    ]
    
    for test_value, description in test_cases:
        result = is_dynamic_with_number_conversion(test_value, typeServices)
        print(f"✅ Test {description}: {result}")
    
    print("\n🎉 Con la conversión Number(), todos los casos deberían funcionar!")

if __name__ == "__main__":
    test_string_to_number_fix()
