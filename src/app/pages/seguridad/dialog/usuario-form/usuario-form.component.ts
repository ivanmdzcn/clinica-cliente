import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsuarioService } from '../../../../core/services/seguridad/usuario.service';
import { RolService } from '../../../../core/services/seguridad/rol.service';
import { Usuario } from '../../../../core/models/seguridad/usuario.model';
import { Rol } from '../../../../core/models/seguridad/rol.model';

@Component({
    selector: 'app-usuario-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './usuario-form.component.html',
    styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit {

    form!: FormGroup;
    roles = signal<Rol[]>([]);
    mostrarContrasena = signal(false);
    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private usuarioService: UsuarioService,
        private rolService: RolService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<UsuarioFormComponent>,
        @Inject(MAT_DIALOG_DATA) public usuario: Usuario | null
    ) {
        // Importante: se calcula aquí dentro, no como inicializador de campo,
        // porque los parámetros del constructor (usuario) se asignan antes
        // de que el cuerpo del constructor se ejecute, pero después de los
        // inicializadores de campo declarados arriba.
        this.modoEdicion = !!this.usuario;
    }

    ngOnInit(): void {
        this.cargarRoles();
        this.inicializarForm();
    }

    cargarRoles(): void {
        this.rolService.obtenerTodos().subscribe({
            next: (data) => this.roles.set(data.filter(r => r.activo))
        });
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            nombre:        [this.usuario?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
            nombreUsuario: [this.usuario?.nombreUsuario ?? '', [Validators.required, Validators.maxLength(80)]],
            email:         [this.usuario?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(150)]],
            contrasena:    ['', this.modoEdicion ? [] : [Validators.required, Validators.minLength(8)]],
            idRol:         [this.usuario?.idRol ?? null]
        });
    }

    toggleContrasena(): void {
        this.mostrarContrasena.update(v => !v);
    }

    cerrar(): void {
        this.dialogRef.close(false);
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.cargando.set(true);

        if (this.modoEdicion) {
            const dto = {
                nombre:        this.form.value.nombre,
                nombreUsuario: this.form.value.nombreUsuario,
                email:         this.form.value.email,
                idRol:         this.form.value.idRol,
                activo:        true
            };

            this.usuarioService.actualizar(this.usuario!.idUsuario, dto).subscribe({
                next: () => {
                    this.mostrarExito('Usuario actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al actualizar usuario.');
                    this.cargando.set(false);
                }
            });
        } else {
            const dto = {
                nombre:        this.form.value.nombre,
                nombreUsuario: this.form.value.nombreUsuario,
                email:         this.form.value.email,
                contrasena:    this.form.value.contrasena,
                idRol:         this.form.value.idRol
            };

            this.usuarioService.crear(dto).subscribe({
                next: () => {
                    this.mostrarExito('Usuario creado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al crear usuario.');
                    this.cargando.set(false);
                }
            });
        }
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }

    get nombre()        { return this.form.get('nombre')!; }
    get nombreUsuario() { return this.form.get('nombreUsuario')!; }
    get email()         { return this.form.get('email')!; }
    get contrasena()    { return this.form.get('contrasena')!; }
}