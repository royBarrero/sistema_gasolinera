from django.urls import path
from .views import (
    LoginView,
    ListarUsuariosView, CrearUsuarioView, EditarUsuarioView, EliminarUsuarioView,
    ListarRolesView, CrearRolView, EditarRolView, EliminarRolView,
    ListarPermisosView, CrearPermisoView, EditarPermisoView, EliminarPermisoView,
    ListarBitacoraView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('usuarios/', ListarUsuariosView.as_view(), name='listar-usuarios'),
    path('usuarios/crear/', CrearUsuarioView.as_view(), name='crear-usuario'),
    path('usuarios/editar/<int:id>/', EditarUsuarioView.as_view(), name='editar-usuario'),
    path('usuarios/eliminar/<int:id>/', EliminarUsuarioView.as_view(), name='eliminar-usuario'),
    path('roles/', ListarRolesView.as_view(), name='listar-roles'),
    path('roles/crear/', CrearRolView.as_view(), name='crear-rol'),
    path('roles/editar/<int:id>/', EditarRolView.as_view(), name='editar-rol'),
    path('roles/eliminar/<int:id>/', EliminarRolView.as_view(), name='eliminar-rol'),
    path('permisos/', ListarPermisosView.as_view(), name='listar-permisos'),
    path('permisos/crear/', CrearPermisoView.as_view(), name='crear-permiso'),
    path('permisos/editar/<int:id>/', EditarPermisoView.as_view(), name='editar-permiso'),
    path('permisos/eliminar/<int:id>/', EliminarPermisoView.as_view(), name='eliminar-permiso'),
    path('bitacora/', ListarBitacoraView.as_view(), name='listar-bitacora'),
]