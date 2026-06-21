import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConsultaService } from '../../../core/services/clinica/consulta.service';
import { Consulta, ActualizarConsulta, TIPOS_CONSULTA, ESTADOS_CONSULTA }
    from '../../../core/models/clinica/consulta.model';

@Component({
    selector: 'app-editar-consulta-dialog',
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
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule
    ],
    templateUrl: './editar-consulta-dialog.component.html', // 👈
    styleUrl:    './editar-consulta-dialog.component.scss'  // 👈
})

export class EditarConsultaDialogComponent implements OnInit {

    form!:        FormGroup;
    guardando   = false;
    minFecha    = new Date(new Date().setDate(new Date().getDate() + 1));
    tiposConsulta   = TIPOS_CONSULTA;
    estadosConsulta = ESTADOS_CONSULTA;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { consulta: Consulta },
        private dialogRef:       MatDialogRef<EditarConsultaDialogComponent>,
        private fb:              FormBuilder,
        private consultaService: ConsultaService,
        private snackBar:        MatSnackBar
    ) {}

    ngOnInit(): void {
        const c = this.data.consulta;
        this.form = this.fb.group({
            tipoConsulta:         [c.tipoConsulta],
            motivoConsulta:       [c.motivoConsulta, [Validators.required, Validators.maxLength(2000)]],
            evolucionTratamiento: [c.evolucionTratamiento],
            observaciones:        [c.observaciones],
            proximaCita:          [c.proximaCita ? new Date(c.proximaCita) : null],
            estado:               [c.estado, Validators.required]
        });
    }

    formatearFecha(fecha: Date | null): string | null {
        if (!fecha) return null;
        const d = new Date(fecha);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.guardando = true;
        const v = this.form.value;

        const dto: ActualizarConsulta = {
            tipoConsulta:         v.tipoConsulta         || null,
            motivoConsulta:       v.motivoConsulta,
            evolucionTratamiento: v.evolucionTratamiento || null,
            observaciones:        v.observaciones        || null,
            proximaCita:          this.formatearFecha(v.proximaCita),
            estado:               v.estado
        };

        this.consultaService.actualizar(this.data.consulta.idConsulta, dto).subscribe({
            next: () => {
                this.guardando = false;
                this.snackBar.open('Consulta actualizada exitosamente.', 'Cerrar',
                    { duration: 3000, panelClass: ['snack-success'] });
                this.dialogRef.close(true); // 👈 true = recarga tabla
            },
            error: (err) => {
                this.guardando = false;
                this.snackBar.open(
                    err.error?.errores?.[0] ?? 'Error al actualizar.',
                    'Cerrar', { duration: 4000, panelClass: ['snack-error'] }
                );
            }
        });
    }
}