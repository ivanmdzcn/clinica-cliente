import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MedicamentoService } from '../../../../core/services/clinica/medicamento.service';
import { Medicamento, CrearMedicamento, ActualizarMedicamento, TIPOS_MEDICAMENTO }
    from '../../../../core/models/clinica/medicamento.model';

@Component({
    selector: 'app-medicamento-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './medicamento-form.component.html',
    styleUrl: './medicamento-form.component.scss'
})
export class MedicamentoFormComponent implements OnInit {

    form!: FormGroup;
    tiposMedicamento = TIPOS_MEDICAMENTO;
    guardando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private medicamentoService: MedicamentoService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<MedicamentoFormComponent>,
        @Inject(MAT_DIALOG_DATA) public medicamento: Medicamento | null
    ) {
        this.modoEdicion = !!this.medicamento;
    }

    ngOnInit(): void {
        this.inicializarForm();
    }

    inicializarForm(): void {
        const m = this.medicamento;
        this.form = this.fb.group({
            nombre:          [m?.nombre ?? '', [Validators.required, Validators.maxLength(150)]],
            nombreComercial: [m?.nombreComercial ?? '', Validators.maxLength(150)],
            concentracion:   [m?.concentracion ?? '', Validators.maxLength(50)],
            presentacion:    [m?.presentacion ?? '', Validators.maxLength(50)],
            laboratorio:     [m?.laboratorio ?? '', Validators.maxLength(100)],
            codigoBarras:    [m?.codigoBarras ?? '', Validators.maxLength(50)],
            tipoMedicamento: [m?.tipoMedicamento ?? 'receta_medica', Validators.required],
            requiereReceta:  [m?.requiereReceta ?? true],
            descripcion:     [m?.descripcion ?? ''],
            activo:          [m?.activo ?? true]
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

        if (this.modoEdicion) {
            const dto: ActualizarMedicamento = {
                nombre:          v.nombre.trim(),
                nombreComercial: v.nombreComercial?.trim() || null,
                concentracion:   v.concentracion?.trim()   || null,
                presentacion:    v.presentacion?.trim()     || null,
                laboratorio:     v.laboratorio?.trim()      || null,
                codigoBarras:    v.codigoBarras?.trim()     || null,
                tipoMedicamento: v.tipoMedicamento,
                requiereReceta:  v.requiereReceta,
                descripcion:     v.descripcion?.trim()      || null,
                activo:          v.activo
            };

            this.medicamentoService.actualizar(this.medicamento!.idMedicamento, dto).subscribe({
                next: () => {
                    this.mostrarExito('Medicamento actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al actualizar.');
                    this.guardando.set(false);
                }
            });
        } else {
            const dto: CrearMedicamento = {
                nombre:          v.nombre.trim(),
                nombreComercial: v.nombreComercial?.trim() || null,
                concentracion:   v.concentracion?.trim()   || null,
                presentacion:    v.presentacion?.trim()     || null,
                laboratorio:     v.laboratorio?.trim()      || null,
                codigoBarras:    v.codigoBarras?.trim()     || null,
                tipoMedicamento: v.tipoMedicamento,
                requiereReceta:  v.requiereReceta,
                descripcion:     v.descripcion?.trim()      || null
            };

            this.medicamentoService.crear(dto).subscribe({
                next: () => {
                    this.mostrarExito('Medicamento creado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al crear.');
                    this.guardando.set(false);
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
}