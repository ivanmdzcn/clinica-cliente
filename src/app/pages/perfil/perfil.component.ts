import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { Perfil } from '../../core/models/auth/perfil.model';

import { CambiarContrasenaComponent } from '../cambiar-contrasena/cambiar-contrasena.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatDividerModule,
    ],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

    perfil = signal<Perfil | null>(null);
    cargando = signal(true);

    constructor(public authService: AuthService, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.authService.obtenerPerfil().subscribe({
            next: (data) => {
                this.perfil.set(data);
                this.cargando.set(false);
            },
            error: () => this.cargando.set(false)
        });
    }

    abrirCambiarContrasena(): void {
        const dialogRef = this.dialog.open(CambiarContrasenaComponent, {
            width: '480px',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((exito: boolean) => {
            if (exito) {
                // opcional: refrescar algo en perfil si aplica
            }
        });
    }
}