from django.db import models

# Create your models here.
class Rol(models.Model):
    nombre=models.CharField(max_length=50)
    descripcion=models.CharField(max_length=150, null=True, blank=True)
    class Meta:
        db_table= 'roles' #esto le dice a django que use tu tabla de postgrest
    def __str__(self):
        return self.nombre
class Permiso(models.Model):
    codigo=models.CharField(max_length=50)
    modulo=models.CharField(max_length=50)

    class Meta: 
        db_table='permisos'
    def __str__(self):
        return f"{self.modulo} - {self.codigo}"
class Usuario(models.Model): 
    nombre=models.CharField( max_length=100)
    email=models.EmailField(unique=True)
    password_hash=models.CharField(max_length=255)
    activo=models.BooleanField(default=True)

    class Meta: 
        db_table='usuarios'
    def __str__(self):
        return f"{self.nombre} ({self.email})"
# Definimos los niveles de alerta para el sistema
    NIVELES_RIESGO = [
        ('INFO', 'Información Normal'),
        ('ALERTA', 'Acceso No Autorizado / Intento Fallido'),
        ('CRITICO', 'Peligro / Acción Destructiva'),
    ]

    # null=True es VITAL aquí. Si alguien falla el login, no hay usuario, pero registramos el intento.
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True, blank=True)
    
    # Datos exactos de tu Frontend
    accion = models.CharField(max_length=50) # Ej: CREATE, UPDATE, LOGIN_FALLIDO
    modulo_afectado = models.CharField(max_length=100) # Ej: Autenticación, Gestión de Personal
    descripcion = models.TextField() # Ej: "Intento de acceso con contraseña incorrecta"
    direccion_ip = models.CharField(max_length=45, null=True, blank=True)
    dispositivo = models.CharField(max_length=100, null=True, blank=True) # Ej: Panel Web, App Móvil
    
    # Nuevo campo para las alertas
    nivel_riesgo = models.CharField(max_length=20, choices=NIVELES_RIESGO, default='INFO')
    
    # Fecha y hora automática
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta: 
        db_table = 'bitacora'
        
    def __str__(self):
        return f"[{self.nivel_riesgo}] {self.accion} - IP: {self.direccion_ip}"

class Sesion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    expira_en = models.DateTimeField()
    activa = models.BooleanField(default=True)

    class Meta:
        db_table = 'sesiones' 
class UsuarioRol(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

    class Meta:
        db_table = 'usuario_roles'
        