# Generated migration for updating Bitacora model with new fields

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0002_usuariorol'),
    ]

    operations = [
        # Eliminar la tabla bitacora anterior
        migrations.RemoveField(
            model_name='bitacora',
            name='usuario',
        ),
        migrations.DeleteModel(
            name='Bitacora',
        ),
        # Crear la nueva tabla bitacora con los campos actualizados
        migrations.CreateModel(
            name='Bitacora',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accion', models.CharField(max_length=50)),
                ('modulo_afectado', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('direccion_ip', models.CharField(blank=True, max_length=45, null=True)),
                ('dispositivo', models.CharField(blank=True, max_length=100, null=True)),
                ('nivel_riesgo', models.CharField(choices=[('INFO', 'Información Normal'), ('ALERTA', 'Acceso No Autorizado / Intento Fallido'), ('CRITICO', 'Peligro / Acción Destructiva')], default='INFO', max_length=20)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
            ],
            options={
                'db_table': 'bitacora',
            },
        ),
    ]
