#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

from apps.services.models import Status

def populate_status():
    """Poblar la tabla Status con los estados requeridos"""
    
    required_statuses = [
        {
            'name': 'Pendiente',
            'description': 'Servicio solicitado por el cliente, pendiente de aprobación'
        },
        {
            'name': 'Aprobado', 
            'description': 'Servicio aprobado por management, listo para programar'
        },
        {
            'name': 'En curso',
            'description': 'Servicio asignado a collector y en proceso de ejecución'
        },
        {
            'name': 'Completado',
            'description': 'Servicio completado exitosamente por el collector'
        },
        {
            'name': 'Cancelado',
            'description': 'Servicio cancelado por management o cliente'
        }
    ]
    
    print("Poblando tabla Status...")
    
    for status_data in required_statuses:
        status, created = Status.objects.get_or_create(
            name=status_data['name'],
            defaults={
                'description': status_data['description']
            }
        )
        
        if created:
            print(f"✓ Creado: {status.name}")
        else:
            print(f"- Ya existe: {status.name}")
    
    print("\nStatus actuales en la base de datos:")
    for status in Status.objects.all().order_by('pk_status'):
        print(f"  {status.pk_status}: {status.name} - {status.description}")

if __name__ == '__main__':
    populate_status()
