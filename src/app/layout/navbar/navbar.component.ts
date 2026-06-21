import { Component, EventEmitter, Output, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth/auth.service';
import { EmpresaService } from '../../core/services/seguridad/empresa.service';
import { CambiarContrasenaComponent } from '../../pages/cambiar-contrasena/cambiar-contrasena.component';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatSnackBarModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
    @Output() toggleSidebar = new EventEmitter<void>();
    nombreEmpresa = signal<string>('');

    constructor(
        public authService: AuthService,
        private empresaService: EmpresaService,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.cargarNombreEmpresa();
    }

    cargarNombreEmpresa(): void {
        this.empresaService.obtenerPublica().subscribe({
            next: (data) => {
                if (data?.nombreComercial) {
                    this.nombreEmpresa.set(data.nombreComercial);
                } else if (data?.razonSocial) {
                    this.nombreEmpresa.set(data.razonSocial);
                }
            },
            error: () => {}
        });
    }

    onToggleSidebar(): void {
        this.toggleSidebar.emit();
    }

    irAPerfil(): void {
        this.router.navigate(['/perfil']);
    }

    irAlDashboard(): void {
        this.router.navigate(['/dashboard']);
    }

    irACambiarContrasena(): void {
        this.dialog.open(CambiarContrasenaComponent, {
            width: '480px',
            disableClose: true
        });
    }

    logout(): void {
        this.authService.logout().subscribe({
            next: () => {
                this.snackBar.open('Sesión cerrada exitosamente.', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['snack-success']
                });
            },
            error: () => {
                this.router.navigate(['/login']);
            }
        });
    }
}