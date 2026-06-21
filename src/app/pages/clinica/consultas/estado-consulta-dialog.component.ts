import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConsultaService } from '../../../core/services/clinica/consulta.service';
import { Consulta, ActualizarConsulta, ESTADOS_CONSULTA }
    from '../../../core/models/clinica/consulta.model';

@Component({
    selector: 'app-estado-consulta-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSnackBarModule
    ],
  templateUrl: './estado-consulta-dialog.component.html', // 👈
  styleUrl: './estado-consulta-dialog.component.scss'  // 👈
})
export class EstadoConsultaDialogComponent implements OnInit {

    form!:      FormGroup;
    guardando = false;
    estadosConsulta = ESTADOS_CONSULTA;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { consulta: Consulta },
        private dialogRef:       MatDialogRef<EstadoConsultaDialogComponent>,
        private fb:              FormBuilder,
        private consultaService: ConsultaService,
        private snackBar:        MatSnackBar
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            estado: [this.data.consulta.estado, Validators.required]
        });
    }

    obtenerEstado(valor: string) {
        return this.estadosConsulta.find(e => e.value === valor);
    }

    guardar(): void {
        if (this.form.invalid) return;

        this.guardando = true;
        const c = this.data.consulta;

        const dto: ActualizarConsulta = {
            tipoConsulta:         c.tipoConsulta,
            motivoConsulta:       c.motivoConsulta,
            evolucionTratamiento: c.evolucionTratamiento,
            observaciones:        c.observaciones,
            proximaCita:          c.proximaCita ?? null,
            estado:               this.form.value.estado
        };

        this.consultaService.actualizar(c.idConsulta, dto).subscribe({
            next: () => {
                this.guardando = false;
                this.snackBar.open('Estado actualizado exitosamente.', 'Cerrar',
                    { duration: 3000, panelClass: ['snack-success'] });
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.guardando = false;
                this.snackBar.open(
                    err.error?.errores?.[0] ?? 'Error al cambiar estado.',
                    'Cerrar', { duration: 4000, panelClass: ['snack-error'] }
                );
            }
        });
    }
}