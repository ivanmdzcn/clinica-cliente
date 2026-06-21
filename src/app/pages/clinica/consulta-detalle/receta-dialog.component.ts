import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { RecetaService } from '../../../core/services/clinica/receta.service';
import { MedicamentoService } from '../../../core/services/clinica/medicamento.service';
import { MedicamentoBusqueda } from '../../../core/models/clinica/medicamento.model';
import { CrearReceta, CrearRecetaDetalle } from '../../../core/models/clinica/receta.model';

export interface RecetaDialogData {
    idConsulta: number;
    idMedico:   number;
    idPaciente: number;
}

@Component({
    selector: 'app-receta-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatSnackBarModule
    ],
    templateUrl: './receta-dialog.component.html',
    styleUrl:    './receta-dialog.component.scss'
})
export class RecetaDialogComponent implements OnInit {

    form!:       FormGroup;
    guardando  = false;

    // Buscador medicamentos por ítem
    resultadosBusqueda: MedicamentoBusqueda[][] = [];
    terminosBusqueda:   string[] = [];
    private sujetos:    Subject<{ idx: number; termino: string }>[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: RecetaDialogData,
        private dialogRef:       MatDialogRef<RecetaDialogComponent>,
        private fb:              FormBuilder,
        private recetaService:   RecetaService,
        private medicamentoService: MedicamentoService,
        private snackBar:        MatSnackBar
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            observaciones: [''],
            detalle: this.fb.array([])
        });
        this.agregarItem();
    }

    get detalle(): FormArray {
        return this.form.get('detalle') as FormArray;
    }

    crearItemGroup(): FormGroup {
        return this.fb.group({
            idMedicamento:     [null, Validators.required],
            nombreMedicamento: [''],
            buscar:            [''],
            dosis:             ['', [Validators.required, Validators.maxLength(100)]],
            frecuencia:        ['', [Validators.required, Validators.maxLength(100)]],
            duracion:          ['', [Validators.required, Validators.maxLength(100)]],
            indicaciones:      ['']
        });
    }

    agregarItem(): void {
        const idx = this.detalle.length;
        this.detalle.push(this.crearItemGroup());
        this.resultadosBusqueda.push([]);
        this.terminosBusqueda.push('');

        const sujeto = new Subject<{ idx: number; termino: string }>();
        this.sujetos.push(sujeto);

        sujeto.pipe(debounceTime(300), distinctUntilChanged((a, b) => a.termino === b.termino))
            .subscribe(({ idx, termino }) => {
                if (termino.length >= 2) {
                    this.medicamentoService.buscar(termino).subscribe({
                        next: (data) => this.resultadosBusqueda[idx] = data,
                        error: () => this.resultadosBusqueda[idx] = []
                    });
                } else {
                    this.resultadosBusqueda[idx] = [];
                }
            });
    }

    onBuscar(idx: number, termino: string): void {
        this.terminosBusqueda[idx] = termino;
        this.sujetos[idx].next({ idx, termino });
    }

    seleccionarMedicamento(idx: number, med: MedicamentoBusqueda): void {
        this.detalle.at(idx).patchValue({
            idMedicamento:     med.idMedicamento,
            nombreMedicamento: med.nombreComercial
                ? `${med.nombre} (${med.nombreComercial})`
                : med.nombre,
            buscar: ''
        });
        this.resultadosBusqueda[idx] = [];
        this.terminosBusqueda[idx]   = '';
    }

    quitarMedicamento(idx: number): void {
        this.detalle.at(idx).patchValue({
            idMedicamento:     null,
            nombreMedicamento: '',
            buscar:            ''
        });
    }

    eliminarItem(idx: number): void {
        this.detalle.removeAt(idx);
        this.resultadosBusqueda.splice(idx, 1);
        this.terminosBusqueda.splice(idx, 1);
        this.sujetos.splice(idx, 1);
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.guardando = true;
        const v = this.form.value;

        const detalle: CrearRecetaDetalle[] = v.detalle.map((item: any, i: number) => ({
            idMedicamento: item.idMedicamento,
            dosis:         item.dosis,
            frecuencia:    item.frecuencia,
            duracion:      item.duracion,
            indicaciones:  item.indicaciones || null,
            orden:         i + 1
        }));

        const dto: CrearReceta = {
            idConsulta:    this.data.idConsulta,
            idMedico:      this.data.idMedico,
            idPaciente:    this.data.idPaciente,
            observaciones: v.observaciones || null,
            detalle
        };

        this.recetaService.crear(dto).subscribe({
            next: () => {
                this.guardando = false;
                this.snackBar.open('Receta creada exitosamente.', 'Cerrar',
                    { duration: 3000, panelClass: ['snack-success'] });
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.guardando = false;
                this.snackBar.open(
                    err.error?.errores?.[0] ?? 'Error al crear receta.',
                    'Cerrar', { duration: 4000, panelClass: ['snack-error'] }
                );
            }
        });
    }
}