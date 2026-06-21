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

import { MenuService } from '../../../../core/services/seguridad/menu.service';
import { ModuloService } from '../../../../core/services/seguridad/modulo.service';
import { Menu } from '../../../../core/models/seguridad/menu.model';
import { Modulo } from '../../../../core/models/seguridad/modulo.model';

@Component({
    selector: 'app-menu-form',
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
    templateUrl: './menu-form.component.html',
    styleUrl: './menu-form.component.scss'
})
export class MenuFormComponent implements OnInit {

    form!: FormGroup;
    modulos = signal<Modulo[]>([]);
    menus = signal<Menu[]>([]);
    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private menuService: MenuService,
        private moduloService: ModuloService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<MenuFormComponent>,
        @Inject(MAT_DIALOG_DATA) public menu: Menu | null
    ) {
        this.modoEdicion = !!this.menu;
    }

    ngOnInit(): void {
        this.cargarModulos();
        this.cargarMenus();
        this.inicializarForm();
    }

    cargarModulos(): void {
        this.moduloService.obtenerTodos().subscribe({
            next: (data) => this.modulos.set(data.filter(m => m.activo))
        });
    }

    cargarMenus(): void {
        this.menuService.obtenerTodos().subscribe({
            next: (data) => this.menus.set(data)
        });
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            nombre:      [this.menu?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
            descripcion: [this.menu?.descripcion ?? '', Validators.maxLength(255)],
            icono:       [this.menu?.icono ?? '', Validators.maxLength(100)],
            ruta:        [this.menu?.ruta ?? '', Validators.maxLength(200)],
            orden:       [this.menu?.orden ?? 0, Validators.required],
            idPadre:     [this.menu?.idPadre ?? null],
            idModulo:    [this.menu?.idModulo ?? null, Validators.required],
            creadoPor:   [null]
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
            const dto = { ...this.form.value, activo: true };
            this.menuService.actualizar(this.menu!.idMenu, dto).subscribe({
                next: () => {
                    this.mostrarExito('Menú actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al actualizar menú.');
                    this.cargando.set(false);
                }
            });
        } else {
            this.menuService.crear(this.form.value).subscribe({
                next: () => {
                    this.mostrarExito('Menú creado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al crear menú.');
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

    get nombre()   { return this.form.get('nombre')!; }
    get idModulo() { return this.form.get('idModulo')!; }
}