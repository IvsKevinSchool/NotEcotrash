# ======= NUEVAS VISTAS PARA GESTIÓN DE SERVICIOS =======

class PendingServicesView(APIView):
    """
    Vista para obtener servicios pendientes de aprobación
    """
    def get(self, request, management_id):
        try:
            management = Management.objects.get(pk=management_id)
        except Management.DoesNotExist:
            return Response(
                {"error": "Management no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Buscar el status "Pendiente"
        try:
            pending_status = Status.objects.get(name='Pendiente')
        except Status.DoesNotExist:
            return Response(
                {"error": "Status 'Pendiente' no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener servicios pendientes para este management
        pending_services = Services.objects.filter(
            fk_management=management,
            fk_status=pending_status
        ).order_by('-scheduled_date')
        
        serializer = ServicesSerializer(pending_services, many=True)
        return Response(serializer.data)


class ApproveServiceView(APIView):
    """
    Vista para aprobar un servicio (cambiar status a "Aprobado")
    """
    def patch(self, request, service_id):
        try:
            service = Services.objects.get(pk=service_id)
        except Services.DoesNotExist:
            return Response(
                {"error": "Servicio no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar que el servicio esté pendiente
        if service.fk_status.name != 'Pendiente':
            return Response(
                {"error": "Solo se pueden aprobar servicios pendientes"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar status a "Aprobado"
        try:
            approved_status = Status.objects.get(name='Aprobado')
            service.fk_status = approved_status
            service.save()
            
            serializer = ServicesSerializer(service)
            return Response(serializer.data)
        except Status.DoesNotExist:
            return Response(
                {"error": "Status 'Aprobado' no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )


class RejectServiceView(APIView):
    """
    Vista para rechazar un servicio (cambiar status a "Cancelado")
    """
    def patch(self, request, service_id):
        try:
            service = Services.objects.get(pk=service_id)
        except Services.DoesNotExist:
            return Response(
                {"error": "Servicio no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar que el servicio esté pendiente
        if service.fk_status.name != 'Pendiente':
            return Response(
                {"error": "Solo se pueden rechazar servicios pendientes"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar status a "Cancelado"
        try:
            cancelled_status = Status.objects.get(name='Cancelado')
            service.fk_status = cancelled_status
            service.save()
            
            serializer = ServicesSerializer(service)
            return Response(serializer.data)
        except Status.DoesNotExist:
            return Response(
                {"error": "Status 'Cancelado' no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )


class TodayScheduledServicesView(APIView):
    """
    Vista para obtener servicios programados para hoy que están aprobados
    """
    def get(self, request, management_id):
        from datetime import date
        
        try:
            management = Management.objects.get(pk=management_id)
        except Management.DoesNotExist:
            return Response(
                {"error": "Management no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Buscar el status "Aprobado"
        try:
            approved_status = Status.objects.get(name='Aprobado')
        except Status.DoesNotExist:
            return Response(
                {"error": "Status 'Aprobado' no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener servicios programados para hoy
        today_services = Services.objects.filter(
            fk_management=management,
            fk_status=approved_status,
            scheduled_date=date.today()
        ).order_by('scheduled_date')
        
        serializer = ServicesSerializer(today_services, many=True)
        return Response(serializer.data)


class AssignCollectorView(APIView):
    """
    Vista para asignar un collector a un servicio y cambiar status a "En curso"
    """
    def patch(self, request, service_id):
        try:
            service = Services.objects.get(pk=service_id)
        except Services.DoesNotExist:
            return Response(
                {"error": "Servicio no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        collector_id = request.data.get('collector_id')
        if not collector_id:
            return Response(
                {"error": "collector_id es requerido"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el collector existe y tiene rol de collector
        try:
            from apps.accounts.models import User
            collector = User.objects.get(pk=collector_id, role='collector')
        except User.DoesNotExist:
            return Response(
                {"error": "Collector no encontrado o no tiene rol de collector"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar que el servicio esté aprobado
        if service.fk_status.name != 'Aprobado':
            return Response(
                {"error": "Solo se pueden asignar collectors a servicios aprobados"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Asignar collector y cambiar status a "En curso"
        try:
            in_progress_status = Status.objects.get(name='En curso')
            service.fk_collector = collector
            service.fk_status = in_progress_status
            service.save()
            
            # TODO: Aquí se puede agregar notificación al collector
            
            serializer = ServicesSerializer(service)
            return Response(serializer.data)
        except Status.DoesNotExist:
            return Response(
                {"error": "Status 'En curso' no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )


class CollectorServicesView(APIView):
    """
    Vista para obtener servicios asignados a un collector
    """
    def get(self, request, collector_id):
        try:
            from apps.accounts.models import User
            from apps.management.models import CollectorUsers
            
            # Primero intentar buscar por pk_collector_user (el comportamiento correcto)
            try:
                collector_user = CollectorUsers.objects.get(pk_collector_user=collector_id)
                collector = collector_user.fk_user
            except CollectorUsers.DoesNotExist:
                # Fallback: buscar directamente por User ID con role collector (para compatibilidad)
                collector = User.objects.get(pk=collector_id, role='collector')
        except (User.DoesNotExist, CollectorUsers.DoesNotExist):
            return Response(
                {"error": "Collector no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener todos los servicios asignados al collector, no solo los de hoy
        collector_services = Services.objects.filter(
            fk_collector=collector
        ).order_by('-scheduled_date')  # Ordenar por fecha descendente
        
        serializer = ServicesSerializer(collector_services, many=True)
        return Response(serializer.data)


class CompleteServiceView(APIView):
    """
    Vista para que el collector marque un servicio como completado
    """
    def patch(self, request, service_id):
        try:
            service = Services.objects.get(pk=service_id)
        except Services.DoesNotExist:
            return Response(
                {"error": "Servicio no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar que el servicio esté en curso
        if service.fk_status.name != 'En curso':
            return Response(
                {"error": "Solo se pueden completar servicios en curso"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar status a "Completado"
        try:
            completed_status = Status.objects.get(name='Completado')
            service.fk_status = completed_status
            service.save()
            
            serializer = ServicesSerializer(service)
            return Response(serializer.data)
        except Status.DoesNotExist:
            return Response(
                {"error": "Status 'Completado' no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )


class FilteredServicesView(APIView):
    """
    Vista para obtener servicios filtrados por status y fecha
    """
    def get(self, request, management_id):
        try:
            management = Management.objects.get(pk=management_id)
        except Management.DoesNotExist:
            return Response(
                {"error": "Management no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener parámetros de filtro
        status_names = request.query_params.getlist('status')  # Lista de nombres de status
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        # Construir query base
        services = Services.objects.filter(fk_management=management)
        
        # Filtrar por status si se proporcionan
        if status_names:
            services = services.filter(fk_status__name__in=status_names)
        
        # Filtrar por rango de fechas
        if start_date:
            services = services.filter(scheduled_date__gte=start_date)
        if end_date:
            services = services.filter(scheduled_date__lte=end_date)
        
        services = services.order_by('-scheduled_date')
        
        serializer = ServicesSerializer(services, many=True)
        return Response(serializer.data)


class AvailableCollectorsView(APIView):
    """
    Vista para obtener collectors disponibles de un management
    """
    def get(self, request, management_id):
        try:
            management = Management.objects.get(pk=management_id)
        except Management.DoesNotExist:
            return Response(
                {"error": "Management no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener collectors asociados a este management
        from apps.management.models import CollectorUsers
        from apps.accounts.api.serializers import UserListSerializer
        
        collector_users = CollectorUsers.objects.filter(
            fk_management=management
        ).select_related('fk_user')
        
        collectors = [cu.fk_user for cu in collector_users if cu.fk_user.role == 'collector']
        
        serializer = UserListSerializer(collectors, many=True)
        return Response(serializer.data)
