import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrdenLaboratorioService } from '../../../core/services/clinica/orden-laboratorio.service';
import { CatalogoExamenService } from '../../../core/services/clinica/catalogo-examen.service';
import {
    OrdenLaboratorio, OrdenLabDetalle, GuardarResultado, ESTADOS_DETALLE
} from '../../../core/models/clinica/orden-laboratorio.model';
import { CatalogoParametro } from '../../../core/models/clinica/catalogo-examen.model';

export interface ResultadosDialogData {
    orden: OrdenLaboratorio;
}

interface ExamenConParametros {
    detalle:    OrdenLabDetalle;
    parametros: CatalogoParametro[];
    form:       FormGroup;
}

@Component({
    selector: 'app-resultados-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDividerModule,
        MatChipsModule,
        MatTabsModule,
        MatSnackBarModule
    ],
    templateUrl: './resultados-dialog.component.html',
    styleUrl:    './resultados-dialog.component.scss'
})
export class ResultadosDialogComponent implements OnInit {

    examenes    = signal<ExamenConParametros[]>([]);
    cargando    = signal(true);
    guardando   = signal(false);
    soloLectura = false;
    estadosDetalle = ESTADOS_DETALLE;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ResultadosDialogData,
        private dialogRef:      MatDialogRef<ResultadosDialogComponent>,
        private fb:             FormBuilder,
        private ordenService:   OrdenLaboratorioService,
        private catalogoService: CatalogoExamenService,
        private snackBar:       MatSnackBar
    ) {}

    ngOnInit(): void {
        this.soloLectura = this.data.orden.estado === 'completada';
        this.cargarParametros();
    }

    cargarParametros(): void {
        this.cargando.set(true);
        const detalle = this.data.orden.detalle;
        const examenes: ExamenConParametros[] = [];
        let pendientes = detalle.length;

        if (pendientes === 0) {
            this.cargando.set(false);
            return;
        }

        detalle.forEach(d => {
            this.catalogoService.obtenerPorId(d.idExamen).subscribe({
                next: (examen) => {
                    const parametros = examen.parametros;
                    const form = this.fb.group({
                        resultados: this.fb.array(
                            parametros.map(p => {
                                // Buscar resultado existente
                                const existente = d.resultados?.find(
                                    r => r.idParametro === p.idParametro
                                );
                                return this.fb.group({
                                    idParametro:  [p.idParametro],
                                    resultado:    [existente?.resultado ?? ''],
                                    anormal:      [existente?.anormal ?? false],
                                    observaciones:[existente?.observaciones ?? '']
                                });
                            })
                        )
                    });

                    examenes.push({ detalle: d, parametros, form });
                    pendientes--;
                    if (pendientes === 0) {
                        // Ordenar según el detalle original
                        examenes.sort((a, b) =>
                            detalle.indexOf(a.detalle) - detalle.indexOf(b.detalle)
                        );
                        this.examenes.set(examenes);
                        this.cargando.set(false);
                    }
                },
                error: () => {
                    pendientes--;
                    if (pendientes === 0) this.cargando.set(false);
                }
            });
        });
    }

    getResultadosArray(examen: ExamenConParametros): FormArray {
        return examen.form.get('resultados') as FormArray;
    }

    guardarExamen(examen: ExamenConParametros): void {
        this.guardando.set(true);
        const v = examen.form.value;

        const resultados: GuardarResultado[] = v.resultados.map((r: any) => ({
            idParametro:  r.idParametro,
            resultado:    r.resultado || null,
            anormal:      r.anormal,
            observaciones: r.observaciones || null
        }));

        this.ordenService.guardarResultados(examen.detalle.idDetalle, resultados).subscribe({
            next: () => {
                this.guardando.set(false);
                this.snackBar.open(
                    `Resultados de "${examen.detalle.nombreExamen}" guardados.`,
                    'Cerrar', { duration: 3000, panelClass: ['snack-success'] }
                );
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.guardando.set(false);
                this.snackBar.open(
                    err.error?.errores?.[0] ?? 'Error al guardar.',
                    'Cerrar', { duration: 4000, panelClass: ['snack-error'] }
                );
            }
        });
    }

    obtenerEstadoDetalle(valor: string) {
        return this.estadosDetalle.find(e => e.value === valor);
    }

    // función para imprimir resultados de laboratorio
    imprimir(): void {
        window.print();
    }
}