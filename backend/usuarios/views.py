from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password, make_password
from .models import Usuario, Bitacora, Rol, Permiso, UsuarioRol
from rest_framework.permissions import AllowAny

def get_usuario_from_token(request):
    try:
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None
        token = auth_header.split(' ')[1]
        from rest_framework_simplejwt.tokens import AccessToken
        decoded = AccessToken(token)
        user_id = decoded.get('user_id')
        return Usuario.objects.get(id=user_id)
    except:
        return None
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = Usuario.objects.get(email=email)
            if not user.activo:
                return Response({"error": "Usuario inactivo"}, status=status.HTTP_403_FORBIDDEN)
            if check_password(password, user.password_hash):
                refresh = RefreshToken()
                refresh['user_id'] = user.id
                refresh['nombre'] = user.nombre
                refresh['email'] = user.email
                Bitacora.objects.create(usuario=user, accion='LOGIN', tabla='usuarios', ip=request.META.get('REMOTE_ADDR'))
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "usuario": {"id": user.id, "nombre": user.nombre, "email": user.email}
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Contraseña incorrecta"}, status=status.HTTP_401_UNAUTHORIZED)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class ListarUsuariosView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        usuarios = Usuario.objects.all().values('id', 'nombre', 'email', 'activo')
        return Response(list(usuarios), status=status.HTTP_200_OK)


class CrearUsuarioView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        nombre = request.data.get('nombre')
        email = request.data.get('email')
        password = request.data.get('password')
        rol_id = request.data.get('rol_id')
        if not nombre or not email or not password:
            return Response({"error": "Nombre, email y contraseña son obligatorios"}, status=status.HTTP_400_BAD_REQUEST)
        if Usuario.objects.filter(email=email).exists():
            return Response({"error": "El email ya está registrado"}, status=status.HTTP_400_BAD_REQUEST)
        usuario = Usuario.objects.create(nombre=nombre, email=email, password_hash=make_password(password), activo=True)
        if rol_id:
            UsuarioRol.objects.create(usuario_id=usuario.id, rol_id=rol_id)
        Bitacora.objects.create(usuario=usuario, accion='CREAR_USUARIO', tabla='usuarios', ip=request.META.get('REMOTE_ADDR'))
        return Response({"mensaje": "Usuario creado correctamente"}, status=status.HTTP_201_CREATED)


class EditarUsuarioView(APIView):
    permission_classes = [AllowAny]
    def put(self, request, id):
        try:
            usuario = Usuario.objects.get(id=id)
            usuario.nombre = request.data.get('nombre', usuario.nombre)
            usuario.email = request.data.get('email', usuario.email)
            usuario.activo = request.data.get('activo', usuario.activo)
            if request.data.get('password'):
                usuario.password_hash = make_password(request.data.get('password'))
            usuario.save()
            rol_id = request.data.get('rol_id')
            if rol_id:
                UsuarioRol.objects.filter(usuario=usuario).delete()
                UsuarioRol.objects.create(usuario=usuario, rol_id=rol_id)
            Bitacora.objects.create(usuario=usuario, accion='EDITAR_USUARIO', tabla='usuarios', ip=request.META.get('REMOTE_ADDR'))
            return Response({"mensaje": "Usuario actualizado correctamente"}, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class EliminarUsuarioView(APIView):
    permission_classes = [AllowAny]
    def delete(self, request, id):
        try:
            usuario = Usuario.objects.get(id=id)
            usuario.delete()
            return Response({"mensaje": "Usuario eliminado correctamente"}, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class ListarRolesView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        roles = Rol.objects.all().values('id', 'nombre', 'descripcion')
        return Response(list(roles), status=status.HTTP_200_OK)


class CrearRolView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        nombre = request.data.get('nombre')
        descripcion = request.data.get('descripcion', '')
        if not nombre:
            return Response({"error": "El nombre es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)
        if Rol.objects.filter(nombre=nombre).exists():
            return Response({"error": "El rol ya existe"}, status=status.HTTP_400_BAD_REQUEST)
        rol = Rol.objects.create(nombre=nombre, descripcion=descripcion)
        try:
            usuario = get_usuario_from_token(request)
            if usuario:
                Bitacora.objects.create(usuario=usuario, accion='CREAR_ROL', tabla='roles', ip=request.META.get('REMOTE_ADDR'))
        except:
            pass
        return Response({"mensaje": "Rol creado correctamente", "id": rol.id}, status=status.HTTP_201_CREATED)


class EditarRolView(APIView):
    permission_classes = [AllowAny]
    def put(self, request, id):
        try:
            rol = Rol.objects.get(id=id)
            rol.nombre = request.data.get('nombre', rol.nombre)
            rol.descripcion = request.data.get('descripcion', rol.descripcion)
            rol.save()
            try:
                usuario = get_usuario_from_token(request)
                if usuario:
                    Bitacora.objects.create(usuario=usuario, accion='EDITAR_ROL', tabla='roles', ip=request.META.get('REMOTE_ADDR'))
            except:
                pass
            return Response({"mensaje": "Rol actualizado correctamente"}, status=status.HTTP_200_OK)
        except Rol.DoesNotExist:
            return Response({"error": "Rol no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class EliminarRolView(APIView):
    permission_classes = [AllowAny]
    def delete(self, request, id):
        try:
            rol = Rol.objects.get(id=id)
            rol.delete()
            try:
                usuario = get_usuario_from_token(request)
                if usuario:
                    Bitacora.objects.create(usuario=usuario, accion='ELIMINAR _ROL', tabla='roles', ip=request.META.get('REMOTE_ADDR'))
            except:
                pass
            return Response({"mensaje": "Rol eliminado correctamente"}, status=status.HTTP_200_OK)
        except Rol.DoesNotExist:
            return Response({"error": "Rol no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class ListarPermisosView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        permisos = Permiso.objects.all().values('id', 'codigo', 'modulo')
        return Response(list(permisos), status=status.HTTP_200_OK)


class CrearPermisoView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        codigo = request.data.get('codigo')
        modulo = request.data.get('modulo')
        if not codigo or not modulo:
            return Response({"error": "Código y módulo son obligatorios"}, status=status.HTTP_400_BAD_REQUEST)
        if Permiso.objects.filter(codigo=codigo).exists():
            return Response({"error": "El permiso ya existe"}, status=status.HTTP_400_BAD_REQUEST)
        permiso = Permiso.objects.create(codigo=codigo, modulo=modulo)
        return Response({"mensaje": "Permiso creado correctamente", "id": permiso.id}, status=status.HTTP_201_CREATED)


class EditarPermisoView(APIView):
    permission_classes = [AllowAny]
    def put(self, request, id):
        try:
            permiso = Permiso.objects.get(id=id)
            permiso.codigo = request.data.get('codigo', permiso.codigo)
            permiso.modulo = request.data.get('modulo', permiso.modulo)
            permiso.save()
            return Response({"mensaje": "Permiso actualizado correctamente"}, status=status.HTTP_200_OK)
        except Permiso.DoesNotExist:
            return Response({"error": "Permiso no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class EliminarPermisoView(APIView):
    permission_classes = [AllowAny]
    def delete(self, request, id):
        try:
            permiso = Permiso.objects.get(id=id)
            permiso.delete()
            return Response({"mensaje": "Permiso eliminado correctamente"}, status=status.HTTP_200_OK)
        except Permiso.DoesNotExist:
            return Response({"error": "Permiso no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class ListarBitacoraView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        registros = Bitacora.objects.select_related('usuario').order_by('-fecha').values(
            'id', 'usuario__nombre', 'accion', 'tabla', 'ip', 'fecha'
        )
        return Response(list(registros), status=status.HTTP_200_OK)