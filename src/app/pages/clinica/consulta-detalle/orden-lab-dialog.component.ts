import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { OrdenLaboratorioService } from '../../../core/services/clinica/orden-laboratorio.service';
import { CatalogoExamenService } from '../../../core/services/clinica/catalogo-examen.service';
import { Cie10Service } from '../../../core/services/clinica/cie10.service';
import { CatalogoExamenBusqueda } from '../../../core/models/clinica/catalogo-examen.model';
import { Cie10Busqueda } from '../../../core/models/clinica/cie10.model';
import { CrearOrdenLaboratorio } from '../../../core/models/clinica/orden-laboratorio.model';

export interface OrdenLabDialogData {
    idConsulta: number;
    idMedico:   number;
    idPaciente: number;
}

@Component({
    selector: 'app-orden-lab-dialog',
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
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        MatChipsModule,
        MatSnackBarModule
    ],
    templateUrl: './orden-lab-dialog.component.html',
    styleUrl:    './orden-lab-dialog.component.scss'
})
export class OrdenLabDialogComponent implements OnInit {

    form!:     FormGroup;
    guardando = false;

    // Buscador exámenes
    resultadosExamenes:  CatalogoExamenBusqueda[] = [];
    examenesSeleccionados: CatalogoExamenBusqueda[] = [];
    private busquedaExamen = new Subject<string>();

    // Buscador CIE-10
    resultadosCie10:    Cie10Busqueda[] = [];
    cie10Seleccionado:  Cie10Busqueda | null = null;
    private busquedaCie10 = new Subject<string>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: OrdenLabDialogData,
        private dialogRef:      MatDialogRef<OrdenLabDialogComponent>,
        private fb:             FormBuilder,
        private ordenService:   OrdenLaboratorioService,
        private catalogoService: CatalogoExamenService,
        private cie10Service:   Cie10Service,
        private snackBar:       MatSnackBar
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            fechaOrden:    [new Date(), Validators.required],
            urgente:       [false],
            observaciones: [''],
            buscarExamen:  [''],
            buscarCie10:   ['']
        });

        // Debounce exámenes
        this.busquedaExamen.pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(termino => {
                if (termino.length >= 2) {
                    this.catalogoService.buscar(termino).subscribe({
                        next: (data) => {
                            this.resultadosExamenes = data.filter(
                                e => !this.examenesSeleccionados.some(s => s.idExamen === e.idExamen)
                            );
                        },
                        error: () => this.resultadosExamenes = []
                    });
                } else {
                    this.resultadosExamenes = [];
                }
            });

        this.form.get('buscarExamen')!.valueChanges
            .subscribe(val => this.busquedaExamen.next(val ?? ''));

        // Debounce CIE-10
        this.busquedaCie10.pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(termino => {
                if (termino.length >= 2) {
                    this.cie10Service.buscar(termino).subscribe({
                        next: (data) => this.resultadosCie10 = data,
                        error: () => this.resultadosCie10 = []
                    });
                } else {
                    this.resultadosCie10 = [];
                }
            });

        this.form.get('buscarCie10')!.valueChanges
            .subscribe(val => this.busquedaCie10.next(val ?? ''));
    }

    // ── Exámenes ──────────────────────────────────────────────────────────────
    seleccionarExamen(examen: CatalogoExamenBusqueda): void {
        if (!this.examenesSeleccionados.some(e => e.idExamen === examen.idExamen)) {
            this.examenesSeleccionados.push(examen);
        }
        this.resultadosExamenes = [];
        this.form.patchValue({ buscarExamen: '' });
    }

    quitarExamen(idExamen: number): void {
        this.examenesSeleccionados = this.examenesSeleccionados
            .filter(e => e.idExamen !== idExamen);
    }

    // ── CIE-10 ────────────────────────────────────────────────────────────────
    seleccionarCie10(cie10: Cie10Busqueda): void {
        this.cie10Seleccionado = cie10;
        this.resultadosCie10   = [];
        this.form.patchValue({ buscarCie10: '' });
    }

    quitarCie10(): void {
        this.cie10Seleccionado = null;
        this.form.patchValue({ buscarCie10: '' });
    }

    formatearFecha(fecha: Date): string {
        const d = new Date(fecha);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }

    guardar(): void {
        if (this.form.invalid || this.examenesSeleccionados.length === 0) {
            this.form.markAllAsTouched();
            if (this.examenesSeleccionados.length === 0) {
                this.snackBar.open('Debe seleccionar al menos un examen.', 'Cerrar',
                    { duration: 3000, panelClass: ['snack-error'] });
            }
            return;
        }

        this.guardando = true;
        const v = this.form.value;

        const dto: CrearOrdenLaboratorio = {
            idConsulta:    this.data.idConsulta,
            idPaciente:    this.data.idPaciente,
            idMedico:      this.data.idMedico,
            idCie10:       this.cie10Seleccionado?.idCie10 ?? null,
            codigoCie10:   this.cie10Seleccionado?.codigo  ?? null,
            fechaOrden:    this.formatearFecha(v.fechaOrden),
            urgente:       v.urgente,
            observaciones: v.observaciones || null,
            examenIds:     this.examenesSeleccionados.map(e => e.idExamen)
        };

        this.ordenService.crear(dto).subscribe({
            next: () => {
                this.guardando = false;
                this.snackBar.open('Orden de laboratorio creada.', 'Cerrar',
                    { duration: 3000, panelClass: ['snack-success'] });
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.guardando = false;
                this.snackBar.open(
                    err.error?.errores?.[0] ?? 'Error al crear orden.',
                    'Cerrar', { duration: 4000, panelClass: ['snack-error'] }
                );
            }
        });
    }
}