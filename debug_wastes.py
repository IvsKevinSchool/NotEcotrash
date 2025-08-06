import requests

def debug_wastes_and_subcategories():
    """
    Debug para verificar que existan residuos y subcategorías en el sistema
    """
    base_url = "http://127.0.0.1:8000/api/v1"
    
    print("🔍 DEBUGGING RESIDUOS Y SUBCATEGORÍAS")
    print("=" * 50)
    
    # Verificar residuos
    print("\n1️⃣ RESIDUOS:")
    print("-" * 20)
    
    waste_endpoints = [
        "/waste/waste/",
        "/management/management/1/wastes/",
    ]
    
    wastes_found = False
    for endpoint in waste_endpoints:
        url = f"{base_url}{endpoint}"
        try:
            print(f"\n📍 Probando: {url}")
            response = requests.get(url)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Residuos encontrados: {len(data) if isinstance(data, list) else 'N/A'}")
                
                if isinstance(data, list):
                    for i, waste in enumerate(data[:5], 1):  # Mostrar solo los primeros 5
                        name = waste.get('name', 'Sin nombre')
                        pk = waste.get('pk_waste', waste.get('id', 'Sin ID'))
                        print(f"   {i}. ID: {pk}, Nombre: '{name}'")
                    
                    if len(data) > 5:
                        print(f"   ... y {len(data) - 5} más")
                        
                    if len(data) > 0:
                        wastes_found = True
                        break
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Verificar subcategorías
    print(f"\n2️⃣ SUBCATEGORÍAS DE RESIDUOS:")
    print("-" * 35)
    
    subcategory_endpoints = [
        "/waste/wasteSubcategory/",
        "/management/management/1/waste-subcategories/",
    ]
    
    subcategories_found = False
    for endpoint in subcategory_endpoints:
        url = f"{base_url}{endpoint}"
        try:
            print(f"\n📍 Probando: {url}")
            response = requests.get(url)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Subcategorías encontradas: {len(data) if isinstance(data, list) else 'N/A'}")
                
                if isinstance(data, list):
                    for i, subcat in enumerate(data[:5], 1):  # Mostrar solo las primeras 5
                        name = subcat.get('name', subcat.get('description', 'Sin nombre'))
                        pk = subcat.get('pk_waste_subcategory', subcat.get('id', 'Sin ID'))
                        waste_fk = subcat.get('fk_waste', 'N/A')
                        print(f"   {i}. ID: {pk}, Nombre: '{name}', Residuo FK: {waste_fk}")
                    
                    if len(data) > 5:
                        print(f"   ... y {len(data) - 5} más")
                        
                    if len(data) > 0:
                        subcategories_found = True
                        break
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Resumen
    print(f"\n📊 RESUMEN:")
    print(f"✅ Tipos de servicios: SÍ (verificado anteriormente)")
    print(f"{'✅' if wastes_found else '❌'} Residuos: {'SÍ' if wastes_found else 'NO'}")
    print(f"{'✅' if subcategories_found else '❌'} Subcategorías: {'SÍ' if subcategories_found else 'NO'}")
    
    if wastes_found and subcategories_found:
        print(f"\n🎉 TODOS LOS DATOS NECESARIOS ESTÁN DISPONIBLES!")
        print("El formulario debería funcionar correctamente ahora.")
    else:
        print(f"\n⚠️  FALTAN DATOS:")
        if not wastes_found:
            print("   - Necesitas crear residuos en el sistema")
        if not subcategories_found:
            print("   - Necesitas crear subcategorías de residuos")

if __name__ == "__main__":
    debug_wastes_and_subcategories()
