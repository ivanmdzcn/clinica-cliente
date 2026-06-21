import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DiagnosticoService } from '../../../core/services/clinica/diagnostico.service';
import { Cie10Service } from '../../../core/services/clinica/cie10.service';
import { Cie10Busqueda } from '../../../core/models/clinica/cie10.model';
import {
    Diagnostico, CrearDiagnostico, ActualizarDiagnostico, TIPOS_DIAGNOSTICO
} from '../../../core/models/clinica/diagnostico.model';

export interface DiagnosticoDialogData {
    idConsulta:  number;
    diagnostico?: Diagnostico;
}

@Component({
    selector: 'app-diagnostico-dialog',
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
        MatChipsModule,
        MatSnackBarModule
    ],
    templateUrl: './diagnostico-dialog.component.html',
    styleUrl:    './diagnostico-dialog.component.scss'
})
export class DiagnosticoDialogComponent implements OnInit {

    form!:          FormGroup;
    guardando     = false;
    modoEdicion   = false;
    tiposDiag     = TIPOS_DIAGNOSTICO;

    // Buscador CIE-10
    resultadosCie10: Cie10Busqueda[] = [];
    buscandoCie10  = false;
    cie10Seleccionado: Cie10Busqueda | null = null;
    private busquedaCie10 = new Subject<string>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DiagnosticoDialogData,
        private dialogRef:          MatDialogRef<DiagnosticoDialogComponent>,
        private fb:                 FormBuilder,
        private diagnosticoService: DiagnosticoService,
        private cie10Service:       Cie10Service,
        private snackBar:           MatSnackBar
    ) {}

    ngOnInit(): void {
        this.modoEdicion = !!this.data.diagnostico;
        const d = this.data.diagnostico;

        this.form = this.fb.group({
            buscarCie10:  [''],
            descripcion:  [d?.descripcion ?? '', [Validators.required, Validators.maxLength(255)]],
            tipo:         [d?.tipo ?? 'definitivo', Validators.required]
        });

        // Si es edición y tenía CIE-10, mostrarlo
        if (d?.idCie10) {
            this.cie10Seleccionado = {
                idCie10:     d.idCie10,
                codigo:      d.codigoCie10 ?? '',
                descripcion: d.descripcion,
                categoria:   null
            };
        }

        // Debounce búsqueda CIE-10
        this.busquedaCie10.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(termino => {
            if (termino.length >= 2) {
                this.buscarCie10(termino);
            } else {
                this.resultadosCie10 = [];
            }
        });

        this.form.get('buscarCie10')!.valueChanges.subscribe(val => {
            this.busquedaCie10.next(val ?? '');
        });
    }

    buscarCie10(termino: string): void {
        this.buscandoCie10 = true;
        this.cie10Service.buscar(termino).subscribe({
            next: (data) => {
                this.resultadosCie10 = data;
                this.buscandoCie10 = false;
            },
            error: () => {
                this.resultadosCie10 = [];
                this.buscandoCie10 = false;
            }
        });
    }

    seleccionarCie10(cie10: Cie10Busqueda): void {
        this.cie10Seleccionado = cie10;
        this.resultadosCie10   = [];
        this.form.patchValue({
            buscarCie10: '',
            descripcion: cie10.descripcion
        });
    }

    quitarCie10(): void {
        this.cie10Seleccionado = null;
        this.form.patchValue({ buscarCie10: '' });
        this.resultadosCie10 = [];
    }

    obtenerTipo(valor: string) {
        return this.tiposDiag.find(t => t.value === valor);
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.guardando = true;
        const v = this.form.value;

        if (this.modoEdicion) {
            const dto: ActualizarDiagnostico = {
                idCie10:     this.cie10Seleccionado?.idCie10 ?? null,
                codigoCie10: this.cie10Seleccionado?.codigo  ?? null,
                descripcion: v.descripcion,
                tipo:        v.tipo
            };

            this.diagnosticoService
                .actualizar(this.data.idConsulta, this.data.diagnostico!.idDiagnostico, dto)
                .subscribe({
                    next: () => {
                        this.guardando = false;
                        this.snackBar.open('Diagnóstico actualizado.', 'Cerrar',
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
            const dto: CrearDiagnostico = {
                idConsulta:  this.data.idConsulta,
                idCie10:     this.cie10Seleccionado?.idCie10 ?? null,
                codigoCie10: this.cie10Seleccionado?.codigo  ?? null,
                descripcion: v.descripcion,
                tipo:        v.tipo
            };

            this.diagnosticoService.crear(this.data.idConsulta, dto).subscribe({
                next: () => {
                    this.guardando = false;
                    this.snackBar.open('Diagnóstico registrado.', 'Cerrar',
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