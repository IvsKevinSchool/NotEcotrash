#!/usr/bin/env python
"""
Script para crear tipos de servicios por defecto
"""
import os
import sys
import django

# Configurar Django
sys.path.append('e:/NotEcotrash/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

from apps.services.models import TypeServices
from apps.management.models import Management

def create_default_type_services():
    print("🔧 CREANDO TIPOS DE SERVICIOS POR DEFECTO")
    print("=" * 50)
    
    # Verificar que existe al menos un management
    managements = Management.objects.all()
    if not managements.exists():
        print("❌ No hay managements en el sistema. Necesitas crear uno primero.")
        return False
    
    first_management = managements.first()
    print(f"📋 Usando management: {first_management.name} (ID: {first_management.pk_management})")
    
    # Tipos de servicios por defecto
    default_services = [
        {
            "name": "Recolección de residuos generales",
            "description": "Servicio de recolección de residuos sólidos urbanos y comerciales"
        },
        {
            "name": "Recolección de residuos orgánicos",
            "description": "Servicio especializado en recolección de residuos orgánicos y compostables"
        },
        {
            "name": "Recolección de residuos reciclables",
            "description": "Servicio de recolección selectiva de materiales reciclables"
        },
        {
            "name": "Recolección de residuos peligrosos",
            "description": "Servicio especializado en manejo de residuos peligrosos y químicos"
        },
        {
            "name": "Limpieza y mantenimiento",
            "description": "Servicio de limpieza general y mantenimiento de áreas comunes"
        },
        {
            "name": "Consultoría ambiental",
            "description": "Servicios de asesoría y consultoría en gestión ambiental"
        }
    ]
    
    created_services = []
    
    for service_data in default_services:
        # Verificar si ya existe
        existing = TypeServices.objects.filter(
            name=service_data["name"],
            fk_management=first_management
        ).first()
        
        if existing:
            print(f"⚠️  Ya existe: {service_data['name']}")
            created_services.append(existing)
        else:
            # Crear nuevo tipo de servicio
            try:
                new_service = TypeServices.objects.create(
                    name=service_data["name"],
                    description=service_data["description"],
                    fk_management=first_management
                )
                print(f"✅ Creado: {service_data['name']} (ID: {new_service.pk_type_services})")
                created_services.append(new_service)
            except Exception as e:
                print(f"❌ Error creando {service_data['name']}: {e}")
    
    print(f"\n📊 RESUMEN:")
    print(f"Total servicios creados/existentes: {len(created_services)}")
    
    # Mostrar cuáles activarían campos de residuo
    print(f"\n🚛 SERVICIOS QUE ACTIVARÍAN CAMPOS DE RESIDUO:")
    for service in created_services:
        name_lower = service.name.lower()
        keywords = ['recolección', 'recoleccion', 'residuo', 'waste', 'collection', 'general']
        matching_keywords = [kw for kw in keywords if kw in name_lower]
        
        if matching_keywords:
            print(f"   ✅ {service.name} (keywords: {matching_keywords})")
        else:
            print(f"   ❌ {service.name} (no keywords)")
    
    return True

def list_all_type_services():
    print(f"\n📋 TODOS LOS TIPOS DE SERVICIOS EN EL SISTEMA:")
    print("-" * 45)
    
    services = TypeServices.objects.all()
    if not services.exists():
        print("❌ No hay tipos de servicios")
    else:
        for service in services:
            print(f"   🔧 ID: {service.pk_type_services}")
            print(f"      Nombre: {service.name}")
            print(f"      Descripción: {service.description}")
            print(f"      Management: {service.fk_management.name}")
            print()

if __name__ == "__main__":
    success = create_default_type_services()
    list_all_type_services()
    
    if success:
        print(f"\n🎉 TIPOS DE SERVICIOS CREADOS!")
        print("Ahora puedes usar el formulario de creación de servicios.")
        print("Los servicios con 'recolección' en el nombre mostrarán los campos de residuo.")
    else:
        print(f"\n❌ PROBLEMA NO RESUELTO")
        print("Revisar los pasos anteriores para más detalles.")
