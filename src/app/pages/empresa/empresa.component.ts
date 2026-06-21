import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmpresaService } from '../../core/services/seguridad/empresa.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { PermisoDirective } from '../../shared/directives/permiso.directive';

@Component({
    selector: 'app-empresa',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        PermisoDirective
    ],
    templateUrl: './empresa.component.html',
    styleUrl: './empresa.component.scss'
})
export class EmpresaComponent implements OnInit {

    form!: FormGroup;
    cargando = signal(true);
    guardando = signal(false);

    constructor(
        private fb: FormBuilder,
        private empresaService: EmpresaService,
        public authService: AuthService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.inicializarForm();
        this.cargarConfiguracion();
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            // Información general
            razonSocial: ['', [Validators.required, Validators.maxLength(200)]],
            nombreComercial: ['', Validators.maxLength(200)],
            numeroIdentificacionFiscal: ['', Validators.maxLength(50)],

            // Ubicación
            direccion: ['', Validators.required],
            ciudad: ['', Validators.maxLength(100)],
            estadoProvincia: ['', Validators.maxLength(100)],
            codigoPostal: ['', Validators.maxLength(20)],
            pais: ['', [Validators.required, Validators.maxLength(100)]],

            // Contacto
            telefonoPrincipal: ['', Validators.maxLength(20)],
            telefonoSecundario: ['', Validators.maxLength(20)],
            emailPrincipal: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
            emailSecundario: ['', [Validators.email, Validators.maxLength(100)]],
            sitioWeb: ['', Validators.maxLength(200)],

            // Moneda
            codigoMoneda: ['GTQ', [Validators.required, Validators.maxLength(3)]],
            simboloMoneda: ['Q', Validators.required],
            nombreMoneda: ['Quetzal', Validators.maxLength(50)],
            posicionSimbolo: ['antes'],
            separadorMiles: [','],
            separadorDecimales: ['.'],
            decimales: [2, [Validators.required, Validators.min(0), Validators.max(4)]],

            // Apariencia
            logoUrl: ['', Validators.maxLength(500)],
            colorPrimario: ['#3B82F6', Validators.pattern('^#[0-9A-Fa-f]{6}$')],

            // Documentos
            piePaginaDocumentos: [''],
            mensajeAgradecimiento: ['']
        });
    }

    cargarConfiguracion(): void {
        this.empresaService.obtener().subscribe({
            next: (data) => {
                setTimeout(() => {
                    if (data?.idEmpresa) {
                        this.form.patchValue({
                            razonSocial: data.razonSocial,
                            nombreComercial: data.nombreComercial,
                            numeroIdentificacionFiscal: data.numeroIdentificacionFiscal,
                            direccion: data.direccion,
                            ciudad: data.ciudad,
                            estadoProvincia: data.estadoProvincia,
                            codigoPostal: data.codigoPostal,
                            pais: data.pais,
                            telefonoPrincipal: data.telefonoPrincipal,
                            telefonoSecundario: data.telefonoSecundario,
                            emailPrincipal: data.emailPrincipal,
                            emailSecundario: data.emailSecundario,
                            sitioWeb: data.sitioWeb,
                            codigoMoneda: data.codigoMoneda,
                            simboloMoneda: data.simboloMoneda,
                            nombreMoneda: data.nombreMoneda,
                            posicionSimbolo: data.posicionSimbolo,
                            separadorMiles: data.separadorMiles,
                            separadorDecimales: data.separadorDecimales,
                            decimales: data.decimales,
                            logoUrl: data.logoUrl,
                            colorPrimario: data.colorPrimario,
                            piePaginaDocumentos: data.piePaginaDocumentos,
                            mensajeAgradecimiento: data.mensajeAgradecimiento
                        });
                    }
                    this.cargando.set(false);
                }, 300);
            },
            error: () =>
                setTimeout(() => {
                    this.cargando.set(false)
                }, 300)
        });
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.snackBar.open('Por favor corrige los errores del formulario.', 'Cerrar', {
                duration: 3000,
                panelClass: ['snack-error']
            });
            return;
        }

        this.guardando.set(true);
        this.empresaService.guardar(this.form.value).subscribe({
            next: () => {
                this.snackBar.open('Configuración guardada exitosamente.', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['snack-success']
                });
                this.guardando.set(false);
            },
            error: (err) => {
                const mensaje = err.error?.mensaje ?? 'Error al guardar configuración.';
                this.snackBar.open(mensaje, 'Cerrar', {
                    duration: 4000,
                    panelClass: ['snack-error']
                });
                this.guardando.set(false);
            }
        });
    }

    // Preview del color
    get colorPreview(): string {
        return this.form.get('colorPrimario')?.value ?? '#3B82F6';
    }

    // Preview de moneda
    get previewMoneda(): string {
        const simbolo = this.form.get('simboloMoneda')?.value ?? 'Q';
        const posicion = this.form.get('posicionSimbolo')?.value ?? 'antes';
        const decimales = this.form.get('decimales')?.value ?? 2;
        const numero = (1234.5).toFixed(decimales);
        return posicion === 'antes' ? `${simbolo}${numero}` : `${numero}${simbolo}`;
    }
}