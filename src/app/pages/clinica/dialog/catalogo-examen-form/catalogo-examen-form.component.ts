import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CatalogoExamenService } from '../../../../core/services/clinica/catalogo-examen.service';
import { CrearCatalogoExamen, CrearCatalogoParametro }
    from '../../../../core/models/clinica/catalogo-examen.model';

@Component({
    selector: 'app-catalogo-examen-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDividerModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './catalogo-examen-form.component.html',
    styleUrl: './catalogo-examen-form.component.scss'
})
export class CatalogoExamenFormComponent {

    form: FormGroup;
    guardando = signal(false);

    constructor(
        private fb: FormBuilder,
        private catalogoService: CatalogoExamenService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<CatalogoExamenFormComponent>
    ) {
        this.form = this.fb.group({
            codigo:      ['', [Validators.required, Validators.maxLength(20),
                               Validators.pattern(/^[A-Z0-9]+$/)]],
            nombre:      ['', [Validators.required, Validators.maxLength(150)]],
            descripcion: [''],
            parametros:  this.fb.array([])
        });
        this.agregarParametro();
    }

    get parametros(): FormArray {
        return this.form.get('parametros') as FormArray;
    }

    crearParametroGroup(): FormGroup {
        return this.fb.group({
            nombre:             ['', [Validators.required, Validators.maxLength(150)]],
            unidad:             ['', Validators.maxLength(30)],
            valorReferencia:    ['', Validators.maxLength(100)],
            ordenVisualizacion: [this.parametros.length + 1, [Validators.required, Validators.min(1)]]
        });
    }

    agregarParametro(): void {
        this.parametros.push(this.crearParametroGroup());
    }

    eliminarParametro(idx: number): void {
        this.parametros.removeAt(idx);
        this.parametros.controls.forEach((ctrl, i) => {
            ctrl.get('ordenVisualizacion')?.setValue(i + 1);
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

        this.guardando.set(true);
        const v = this.form.value;

        const dto: CrearCatalogoExamen = {
            codigo:      v.codigo.toUpperCase().trim(),
            nombre:      v.nombre.trim(),
            descripcion: v.descripcion?.trim() || null,
            parametros:  v.parametros.map((p: any, i: number): CrearCatalogoParametro => ({
                nombre:             p.nombre.trim(),
                unidad:             p.unidad?.trim()          || null,
                valorReferencia:    p.valorReferencia?.trim() || null,
                ordenVisualizacion: i + 1
            }))
        };

        this.catalogoService.crear(dto).subscribe({
            next: () => {
                this.mostrarExito('Examen creado exitosamente.');
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.mostrarError(err.error?.errores?.[0] ?? 'Error al crear examen.');
                this.guardando.set(false);
            }
        });
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}