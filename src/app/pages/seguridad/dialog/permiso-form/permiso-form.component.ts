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

import { PermisoService } from '../../../../core/services/seguridad/permiso.service';
import { MenuService } from '../../../../core/services/seguridad/menu.service';
import { Permiso } from '../../../../core/models/seguridad/permiso.model';
import { Menu } from '../../../../core/models/seguridad/menu.model';

@Component({
    selector: 'app-permiso-form',
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
    templateUrl: './permiso-form.component.html',
    styleUrl: './permiso-form.component.scss'
})
export class PermisoFormComponent implements OnInit {

    form!: FormGroup;
    menus = signal<Menu[]>([]);
    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private permisoService: PermisoService,
        private menuService: MenuService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<PermisoFormComponent>,
        @Inject(MAT_DIALOG_DATA) public permiso: Permiso | null
    ) {
        this.modoEdicion = !!this.permiso;
    }

    ngOnInit(): void {
        this.cargarMenus();
        this.inicializarForm();
    }

    cargarMenus(): void {
        this.menuService.obtenerTodos().subscribe({
            next: (data) => this.menus.set(data)
        });
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            nombre: [this.permiso?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
            idMenu: [this.permiso?.idMenu ?? null, Validators.required]
        });
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
            this.permisoService.actualizar(this.permiso!.idPermiso, this.form.value).subscribe({
                next: () => {
                    this.mostrarExito('Permiso actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al actualizar permiso.');
                    this.cargando.set(false);
                }
            });
        } else {
            this.permisoService.crear(this.form.value).subscribe({
                next: () => {
                    this.mostrarExito('Permiso creado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al crear permiso.');
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

    get nombre() { return this.form.get('nombre')!; }
    get idMenu() { return this.form.get('idMenu')!; }
}