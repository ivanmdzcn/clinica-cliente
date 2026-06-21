import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SignosVitalesService } from '../../../core/services/clinica/signos-vitales.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
    SignosVitales, CrearSignosVitales, ActualizarSignosVitales, NIVELES_DOLOR
} from '../../../core/models/clinica/signos-vitales.model';

export interface SignosVitalesDialogData {
    idConsulta: number;
    signos?:    SignosVitales; // si viene → edición, si no → nuevo
}

@Component({
    selector: 'app-signos-vitales-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        MatSnackBarModule
    ],
    templateUrl: './signos-vitales-dialog.component.html',
    styleUrl:    './signos-vitales-dialog.component.scss'
})
export class SignosVitalesDialogComponent implements OnInit {

    form!:          FormGroup;
    guardando     = false;
    modoEdicion   = false;
    nivelesDolorOpts = NIVELES_DOLOR;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: SignosVitalesDialogData,
        private dialogRef:      MatDialogRef<SignosVitalesDialogComponent>,
        private fb:             FormBuilder,
        private signosService:  SignosVitalesService,
        private authService:    AuthService,
        private snackBar:       MatSnackBar
    ) {}

    ngOnInit(): void {
        this.modoEdicion = !!this.data.signos;
        const s = this.data.signos;

        this.form = this.fb.group({
            presionSistolica:       [s?.presionSistolica       ?? null],
            presionDiastolica:      [s?.presionDiastolica      ?? null],
            temperatura:            [s?.temperatura            ?? null],
            frecuenciaCardiaca:     [s?.frecuenciaCardiaca     ?? null],
            frecuenciaRespiratoria: [s?.frecuenciaRespiratoria ?? null],
            saturacionOxigeno:      [s?.saturacionOxigeno      ?? null],
            peso:                   [s?.peso                   ?? null],
            altura:                 [s?.altura                 ?? null],
            glucosaCapilar:         [s?.glucosaCapilar         ?? null],
            nivelDolor:             [s?.nivelDolor             ?? null],
            observaciones:          [s?.observaciones          ?? '']
        });
    }

    guardar(): void {
        this.guardando = true;
        const v = this.form.value;

        if (this.modoEdicion) {
            const dto: ActualizarSignosVitales = {
                presionSistolica:       v.presionSistolica       ?? null,
                presionDiastolica:      v.presionDiastolica      ?? null,
                temperatura:            v.temperatura            ?? null,
                frecuenciaCardiaca:     v.frecuenciaCardiaca     ?? null,
                frecuenciaRespiratoria: v.frecuenciaRespiratoria ?? null,
                saturacionOxigeno:      v.saturacionOxigeno      ?? null,
                peso:                   v.peso                   ?? null,
                altura:                 v.altura                 ?? null,
                glucosaCapilar:         v.glucosaCapilar         ?? null,
                nivelDolor:             v.nivelDolor             ?? null,
                observaciones:          v.observaciones          || null
            };

            this.signosService
                .actualizar(this.data.idConsulta, this.data.signos!.idSignos, dto)
                .subscribe({
                    next: () => {
                        this.guardando = false;
                        this.snackBar.open('Signos vitales actualizados.', 'Cerrar',
                            { duration: 3000, panelClass: ['snack-success'] });
                        this.dialogRef.close(true);
                    },
                    error: (err) => {
                        this.guardando = false;
                        this.snackBar.open(
                            err.error?.errores?.[0] ?? 'Error al actualizar.',
                            'Cerrar', { duration: 4000, panelClass: ['snack-error'] }
                        );
                    }
                });
        } else {
            const dto: CrearSignosVitales = {
                idConsulta:             this.data.idConsulta,
                tomadoPor:              this.authService.idUsuario(),
                presionSistolica:       v.presionSistolica       ?? null,
                presionDiastolica:      v.presionDiastolica      ?? null,
                temperatura:            v.temperatura            ?? null,
                frecuenciaCardiaca:     v.frecuenciaCardiaca     ?? null,
                frecuenciaRespiratoria: v.frecuenciaRespiratoria ?? null,
                saturacionOxigeno:      v.saturacionOxigeno      ?? null,
                peso:                   v.peso                   ?? null,
                altura:                 v.altura                 ?? null,
                glucosaCapilar:         v.glucosaCapilar         ?? null,
                nivelDolor:             v.nivelDolor             ?? null,
                observaciones:          v.observaciones          || null
            };

            this.signosService.crear(this.data.idConsulta, dto).subscribe({
                next: () => {
                    this.guardando = false;
                    this.snackBar.open('Signos vitales registrados.', 'Cerrar',
                        { duration: 3000, panelClass: ['snack-success'] });
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.guardando = false;
                    this.snackBar.open(
                        err.error?.errores?.[0] ?? 'Error al registrar.',
                        'Cerrar', { duration: 4000, panelClass: ['snack-error'] }
                    );
                }
            });
        }
    }
}