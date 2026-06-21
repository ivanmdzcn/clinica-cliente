import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { PacienteService } from '../../../core/services/clinica/paciente.service';
import { AlergiaService } from '../../../core/services/clinica/alergia.service';
import { AntecedenteService } from '../../../core/services/clinica/antecedente.service';
import { ConsultaService } from '../../../core/services/clinica/consulta.service';
import { Paciente } from '../../../core/models/clinica/paciente.model';
import { Alergia, SEVERIDADES } from '../../../core/models/clinica/alergia.model';
import { Antecedente } from '../../../core/models/clinica/antecedente.model';
import { Consulta, TIPOS_CONSULTA, ESTADOS_CONSULTA } from '../../../core/models/clinica/consulta.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { AlergiaFormComponent, AlergiaFormData } from '../dialog/alergia-form/alergia-form.component';
import { AntecedenteFormComponent, AntecedenteFormData } from '../dialog/antecedente-form/antecedente-form.component';
import { ConsultaFormComponent, ConsultaFormData } from '../dialog/consulta-form/consulta-form.component';

@Component({
    selector: 'app-historia-clinica',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatChipsModule,
        MatDividerModule,
        MatTableModule,
        PermisoDirective
    ],
    templateUrl: './historia-clinica.component.html',
    styleUrl: './historia-clinica.component.scss'
})
export class HistoriaClinicaComponent implements OnInit {

    idPaciente   = signal<number>(0);
    paciente     = signal<Paciente | null>(null);
    alergias     = signal<Alergia[]>([]);
    antecedentes = signal<Antecedente[]>([]);
    consultas    = signal<Consulta[]>([]);

    severidades      = SEVERIDADES;
    tiposConsulta    = TIPOS_CONSULTA;
    estadosConsulta  = ESTADOS_CONSULTA;
    columnasConsulta = ['fecha', 'medico', 'tipo', 'motivo', 'estado', 'acciones'];

    constructor(
        private route:              ActivatedRoute,
        private router:             Router,
        private pacienteService:    PacienteService,
        private alergiaService:     AlergiaService,
        private antecedenteService: AntecedenteService,
        private consultaService:    ConsultaService,
        private dialog:             MatDialog,
        private snackBar:           MatSnackBar
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.idPaciente.set(id);
        this.cargarPaciente();
        this.cargarAlergias();
        this.cargarAntecedentes();
        this.cargarConsultas();
    }

    // ── Paciente ──────────────────────────────────────────────────────────────
    cargarPaciente(): void {
        this.pacienteService.obtenerPorId(this.idPaciente()).subscribe({
            next: (data) => this.paciente.set(data),
            error: () => this.mostrarError('Error al cargar datos del paciente.')
        });
    }

    volver(): void {
        this.router.navigate(['/clinica/pacientes']);
    }

    // ── Alergias ──────────────────────────────────────────────────────────────
    cargarAlergias(): void {
        this.alergiaService.obtenerPorPaciente(this.idPaciente()).subscribe({
            next: (data) => this.alergias.set(data),
            error: () => this.mostrarError('Error al cargar alergias.')
        });
    }

    abrirFormAlergia(): void {
        const dialogRef = this.dialog.open(AlergiaFormComponent, {
            width: '560px',
            maxWidth: '95vw',
            data: { idPaciente: this.idPaciente(), alergia: null } as AlergiaFormData
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarAlergias();
        });
    }

    editarAlergia(alergia: Alergia): void {
        const dialogRef = this.dialog.open(AlergiaFormComponent, {
            width: '560px',
            maxWidth: '95vw',
            data: { idPaciente: this.idPaciente(), alergia } as AlergiaFormData
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarAlergias();
        });
    }

    confirmarEliminarAlergia(alergia: Alergia): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo:       'Eliminar Alergia',
                mensaje:      `¿Eliminar la alergia a "${alergia.medicamentoOElemento}"?`,
                btnConfirmar: 'Eliminar',
                color:        'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminarAlergia(alergia.idAlergia);
        });
    }

    eliminarAlergia(idAlergia: number): void {
        this.alergiaService.eliminar(this.idPaciente(), idAlergia).subscribe({
            next: () => {
                this.mostrarExito('Alergia eliminada exitosamente.');
                this.cargarAlergias();
            },
            error: () => this.mostrarError('Error al eliminar alergia.')
        });
    }

    obtenerColorSeveridad(severidad: string): string {
        return this.severidades.find(s => s.value === severidad)?.color ?? '#777';
    }

    obtenerLabelSeveridad(severidad: string): string {
        return this.severidades.find(s => s.value === severidad)?.label ?? severidad;
    }

    // ── Antecedentes ──────────────────────────────────────────────────────────
    cargarAntecedentes(): void {
        this.antecedenteService.obtenerPorPaciente(this.idPaciente()).subscribe({
            next: (data) => this.antecedentes.set(data),
            error: () => this.mostrarError('Error al cargar antecedentes.')
        });
    }

    obtenerAntecedentesPorTipo(tipo: string): Antecedente[] {
        return this.antecedentes().filter(a => a.tipo === tipo);
    }

    abrirFormAntecedente(): void {
        const dialogRef = this.dialog.open(AntecedenteFormComponent, {
            width: '560px',
            maxWidth: '95vw',
            data: { idPaciente: this.idPaciente(), antecedente: null } as AntecedenteFormData
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarAntecedentes();
        });
    }

    editarAntecedente(antecedente: Antecedente): void {
        const dialogRef = this.dialog.open(AntecedenteFormComponent, {
            width: '560px',
            maxWidth: '95vw',
            data: { idPaciente: this.idPaciente(), antecedente } as AntecedenteFormData
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarAntecedentes();
        });
    }

    confirmarEliminarAntecedente(antecedente: Antecedente): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo:       'Eliminar Antecedente',
                mensaje:      `¿Eliminar el antecedente "${antecedente.condicion}"?`,
                btnConfirmar: 'Eliminar',
                color:        'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminarAntecedente(antecedente.idAntecedente);
        });
    }

    eliminarAntecedente(idAntecedente: number): void {
        this.antecedenteService.eliminar(this.idPaciente(), idAntecedente).subscribe({
            next: () => {
                this.mostrarExito('Antecedente eliminado exitosamente.');
                this.cargarAntecedentes();
            },
            error: () => this.mostrarError('Error al eliminar antecedente.')
        });
    }

    // ── Consultas ─────────────────────────────────────────────────────────────
    cargarConsultas(): void {
        this.consultaService.obtenerPorPaciente(this.idPaciente()).subscribe({
            next: (data) => this.consultas.set(data),
            error: () => this.mostrarError('Error al cargar consultas.')
        });
    }

    abrirFormConsulta(): void {
        const dialogRef = this.dialog.open(ConsultaFormComponent, {
            width: '720px',
            maxWidth: '95vw',
            data: { idPaciente: this.idPaciente(), consulta: null } as ConsultaFormData
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarConsultas();
        });
    }

    editarConsulta(consulta: Consulta): void {
        const dialogRef = this.dialog.open(ConsultaFormComponent, {
            width: '720px',
            maxWidth: '95vw',
            data: { idPaciente: this.idPaciente(), consulta } as ConsultaFormData
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarConsultas();
        });
    }

    confirmarEliminarConsulta(consulta: Consulta): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo:       'Eliminar Consulta',
                mensaje:      `¿Eliminar la consulta del ${new Date(consulta.fechaConsulta!).toLocaleDateString('es')}?`,
                btnConfirmar: 'Eliminar',
                color:        'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminarConsulta(consulta.idConsulta);
        });
    }

    eliminarConsulta(id: number): void {
        this.consultaService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Consulta eliminada exitosamente.');
                this.cargarConsultas();
            },
            error: (err) => this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar.')
        });
    }

    verDetalleConsulta(consulta: Consulta): void {
        this.router.navigate(['/clinica/consultas', consulta.idConsulta]);
    }

    obtenerEstadoConsulta(valor: string) {
        return this.estadosConsulta.find(e => e.value === valor);
    }

    obtenerLabelTipoConsulta(valor: string | null): string {
        return this.tiposConsulta.find(t => t.value === valor)?.label ?? valor ?? '—';
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}