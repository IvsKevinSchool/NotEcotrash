# ======= NUEVAS VISTAS PARA GESTIÓN DE SERVICIOS =======

class PendingServicesView(APIView):
    """Vista para obtener servicios pendientes de aprobación"""
    def get(self, request, management_id):
        try:
            management = Management.objects.get(pk=management_id)
            pending_status = Status.objects.get(name='Pendiente')
            pending_services = Services.objects.filter(
                fk_management=management,
                fk_status=pending_status
            ).order_by('-scheduled_date')
            serializer = ServicesSerializer(pending_services, many=True)
            return Response(serializer.data)
        except Management.DoesNotExist:
            return Response({"error": "Management no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Status.DoesNotExist:
            return Response({"error": "Status 'Pendiente' no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class ApproveServiceView(APIView):
    """Vista para aprobar un servicio"""
    def patch(self, request, service_id):
        try:
            service = Services.objects.get(pk=service_id)
            if service.fk_status.name != 'Pendiente':
                return Response({"error": "Solo se pueden aprobar servicios pendientes"}, status=status.HTTP_400_BAD_REQUEST)
            approved_status = Status.objects.get(name='Aprobado')
            service.fk_status = approved_status
            service.save()
            serializer = ServicesSerializer(service)
            return Response(serializer.data)
        except Services.DoesNotExist:
            return Response({"error": "Servicio no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Status.DoesNotExist:
            return Response({"error": "Status 'Aprobado' no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class RejectServiceView(APIView):
    """Vista para rechazar un servicio"""
    def patch(self, request, service_id):
        try:
            service = Services.objects.get(pk=service_id)
            if service.fk_status.name != 'Pendiente':
                return Response({"error": "Solo se pueden rechazar servicios pendientes"}, status=status.HTTP_400_BAD_REQUEST)
            cancelled_status = Status.objects.get(name='Cancelado')
            service.fk_status = cancelled_status
            service.save()
            serializer = ServicesSerializer(service)
            return Response(serializer.data)
        except Services.DoesNotExist:
            return Response({"error": "Servicio no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Status.DoesNotExist:
            return Response({"error": "Status 'Cancelado' no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class TodayScheduledServicesView(APIView):
    """Vista para obtener servicios programados para hoy"""
    def get(self, request, management_id):
        from datetime import date
        try:
            management = Management.objects.get(pk=management_id)
            approved_status = Status.objects.get(name='Aprobado')
            today_services = Services.objects.filter(
                fk_management=management,
                fk_status=approved_status,
                scheduled_date=date.today()
            ).order_by('scheduled_date')
            serializer = ServicesSerializer(today_services, many=True)
            return Response(serializer.data)
        except Management.DoesNotExist:
            return Response({"error": "Management no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Status.DoesNotExist:
            return Response({"error": "Status 'Aprobado' no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class AssignCollectorView(APIView):
    """Vista para asignar collector a un servicio"""
    def patch(self, request, service_id):
        try:
            service = Services.objects.get(pk=service_id)
            collector_id = request.data.get('collector_id')
            if not collector_id:
                return Response({"error": "collector_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)
            
            from apps.accounts.models import User
            collector = User.objects.get(pk=collector_id, role='collector')
            
            if service.fk_status.name != 'Aprobado':
                return Response({"error": "Solo se pueden asignar collectors a servicios aprobados"}, status=status.HTTP_400_BAD_REQUEST)
            
            in_progress_status = Status.objects.get(name='En curso')
            service.fk_collector = collector
            service.fk_status = in_progress_status
            service.save()
            
            serializer = ServicesSerializer(service)
            return Response(serializer.data)
        except Services.DoesNotExist:
            return Response({"error": "Servicio no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({"error": "Collector no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Status.DoesNotExist:
            return Response({"error": "Status 'En curso' no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class CollectorServicesView(APIView):
    """Vista para obtener servicios de un collector"""
    def get(self, request, collector_id):
        try:
            from apps.accounts.models import User
            collector = User.objects.get(pk=collector_id, role='collector')
            
            # Obtener todos los servicios asignados al collector, no solo los de hoy
            collector_services = Services.objects.filter(
                fk_collector=collector
            ).order_by('-scheduled_date')  # Ordenar por fecha descendente para ver los más recientes primero
            
            serializer = ServicesSerializer(collector_services, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "Collector no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class CompleteServiceView(APIView):
    """Vista para completar un servicio"""
    def patch(self, request, service_id):
        try:
            service = Services.objects.get(pk=service_id)
            if service.fk_status.name != 'En curso':
                return Response({"error": "Solo se pueden completar servicios en curso"}, status=status.HTTP_400_BAD_REQUEST)
            completed_status = Status.objects.get(name='Completado')
            service.fk_status = completed_status
            service.save()
            serializer = ServicesSerializer(service)
            return Response(serializer.data)
        except Services.DoesNotExist:
            return Response({"error": "Servicio no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Status.DoesNotExist:
            return Response({"error": "Status 'Completado' no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class FilteredServicesView(APIView):
    """Vista para obtener servicios filtrados"""
    def get(self, request, management_id):
        try:
            management = Management.objects.get(pk=management_id)
            status_names = request.query_params.getlist('status')
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')
            
            services = Services.objects.filter(fk_management=management)
            
            if status_names:
                services = services.filter(fk_status__name__in=status_names)
            if start_date:
                services = services.filter(scheduled_date__gte=start_date)
            if end_date:
                services = services.filter(scheduled_date__lte=end_date)
            
            services = services.order_by('-scheduled_date')
            serializer = ServicesSerializer(services, many=True)
            return Response(serializer.data)
        except Management.DoesNotExist:
            return Response({"error": "Management no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class AvailableCollectorsView(APIView):
    """Vista para obtener collectors disponibles"""
    def get(self, request, management_id):
        try:
            management = Management.objects.get(pk=management_id)
            from apps.management.models import CollectorUsers
            from apps.accounts.api.serializers import UserListSerializer
            
            collector_users = CollectorUsers.objects.filter(
                fk_management=management
            ).select_related('fk_user')
            
            collectors = [cu.fk_user for cu in collector_users if cu.fk_user.role == 'collector']
            serializer = UserListSerializer(collectors, many=True)
            return Response(serializer.data)
        except Management.DoesNotExist:
            return Response({"error": "Management no encontrado"}, status=status.HTTP_404_NOT_FOUND)
