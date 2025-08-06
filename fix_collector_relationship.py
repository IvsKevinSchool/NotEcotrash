#!/usr/bin/env python
"""
Script para verificar y crear la relación entre User y CollectorUsers
"""
import os
import sys
import django

# Configurar Django
sys.path.append('e:/NotEcotrash/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

from apps.accounts.models import User
from apps.management.models import CollectorUsers, Management

def check_and_fix_collector_user():
    print("🔍 VERIFICANDO RELACIONES USER-COLLECTOR")
    print("=" * 50)
    
    # 1. Verificar el usuario collector
    try:
        collector_user = User.objects.get(id=4, role='collector')
        print(f"✅ Usuario collector encontrado:")
        print(f"   ID: {collector_user.id}")
        print(f"   Username: {collector_user.username}")
        print(f"   Email: {collector_user.email}")
        print(f"   Role: {collector_user.role}")
    except User.DoesNotExist:
        print("❌ Usuario collector con ID 4 no encontrado")
        return False
    
    # 2. Verificar si existe CollectorUsers para este usuario
    print(f"\n🔍 Verificando CollectorUsers para user ID {collector_user.id}:")
    
    try:
        collector_users_entry = CollectorUsers.objects.get(fk_user=collector_user)
        print("✅ Entrada CollectorUsers encontrada:")
        print(f"   pk_collector_user: {collector_users_entry.pk_collector_user}")
        print(f"   name: {collector_users_entry.name}")
        print(f"   last_name: {collector_users_entry.last_name}")
        print(f"   phone_number: {collector_users_entry.phone_number}")
        print(f"   fk_management: {collector_users_entry.fk_management.pk_management}")
        
        return True
        
    except CollectorUsers.DoesNotExist:
        print("❌ No existe entrada en CollectorUsers para este usuario")
        print("\n🔧 INTENTANDO CREAR LA ENTRADA...")
        
        # Verificar si hay managements disponibles
        managements = Management.objects.all()
        if not managements.exists():
            print("❌ No hay managements en el sistema. Necesitamos crear uno primero.")
            return False
        
        # Usar el primer management disponible
        first_management = managements.first()
        print(f"📋 Usando management: {first_management.name} (ID: {first_management.pk_management})")
        
        # Crear la entrada CollectorUsers
        try:
            collector_users_entry = CollectorUsers.objects.create(
                fk_management=first_management,
                fk_user=collector_user,
                name=collector_user.first_name or collector_user.username,
                last_name=collector_user.last_name or ".",
                phone_number="555-0000"  # Número por defecto
            )
            
            print("✅ Entrada CollectorUsers creada exitosamente:")
            print(f"   pk_collector_user: {collector_users_entry.pk_collector_user}")
            print(f"   name: {collector_users_entry.name}")
            print(f"   last_name: {collector_users_entry.last_name}")
            print(f"   phone_number: {collector_users_entry.phone_number}")
            print(f"   fk_management: {collector_users_entry.fk_management.pk_management}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error creando CollectorUsers: {e}")
            return False

def list_all_collector_users():
    print(f"\n📋 TODAS LAS ENTRADAS DE COLLECTORUSERS:")
    print("-" * 40)
    
    collector_users = CollectorUsers.objects.all()
    if not collector_users.exists():
        print("❌ No hay entradas en CollectorUsers")
    else:
        for cu in collector_users:
            print(f"   🚛 pk_collector_user: {cu.pk_collector_user}")
            print(f"      fk_user: {cu.fk_user.id} ({cu.fk_user.username})")
            print(f"      name: {cu.name} {cu.last_name}")
            print(f"      fk_management: {cu.fk_management.pk_management}")
            print()

def test_login_serializer():
    print(f"\n🧪 SIMULANDO LOGIN SERIALIZER:")
    print("-" * 35)
    
    try:
        collector_user = User.objects.get(id=4, role='collector')
        
        # Simular el código del LoginSerializer
        collector_info = {}
        try:
            collector_users_entry = CollectorUsers.objects.get(fk_user=collector_user)
            collector_info = {
                "pk_collector_user": collector_users_entry.pk_collector_user,
                "name": collector_users_entry.name,
                "last_name": collector_users_entry.last_name,
                "phone_number": collector_users_entry.phone_number,
                "fk_management": collector_users_entry.fk_management.pk_management
            }
            print("✅ collector_info se llenaría correctamente:")
            print(f"   {collector_info}")
            
        except CollectorUsers.DoesNotExist:
            print("❌ collector_info estaría vacío: {}")
            
    except User.DoesNotExist:
        print("❌ Usuario no encontrado")

if __name__ == "__main__":
    success = check_and_fix_collector_user()
    list_all_collector_users()
    test_login_serializer()
    
    if success:
        print(f"\n🎉 PROBLEMA RESUELTO!")
        print("Ahora el login debería llenar correctamente el campo collector.")
        print("Puedes probar hacer login nuevamente en el frontend.")
    else:
        print(f"\n❌ PROBLEMA NO RESUELTO")
        print("Revisar los pasos anteriores para más detalles.")
