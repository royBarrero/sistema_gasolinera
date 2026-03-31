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
class Bitacora ( models.Model):
    usuario=models.ForeignKey(Usuario,on_delete=models.CASCADE)
    accion=models.CharField(max_length=100)
    tabla=models.CharField(max_length=50,null=True)
    ip=models.CharField(max_length=45 , null = True )
    fecha=models.DateTimeField(auto_now_add=True)

    class Meta : 
        db_table = 'bitacora'

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
        