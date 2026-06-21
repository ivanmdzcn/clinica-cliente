// import { Component, OnInit, signal } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { MatListModule } from '@angular/material/list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatDividerModule } from '@angular/material/divider';
// import { AuthService } from '../../core/services/auth/auth.service';
// import { EmpresaService } from '../../core/services/seguridad/empresa.service';
// import { ModuloMenu, MenuArbol } from '../../core/models/auth/sidebar.model';

// @Component({
//     selector: 'app-sidebar',
//     standalone: true,
//     imports: [
//         CommonModule,
//         RouterModule,
//         MatListModule,
//         MatIconModule,
//         MatExpansionModule,
//         MatDividerModule
//     ],
//     templateUrl: './sidebar.component.html',
//     styleUrl: './sidebar.component.scss',
//     styles: [`
//         ::ng-deep {
//             .sidebar .mat-mdc-list-item,
//             .sidebar button.mat-mdc-list-item {
//                 color: white !important;
//             }

//             .sidebar .mdc-list-item__primary-text {
//                 color: white !important;
//             }

//             .sidebar [matListItemTitle] {
//                 color: white !important;
//             }

//             .sidebar span[matListItemTitle] {
//                 color: white !important;
//             }

//             .sidebar .mat-list-item-content span {
//                 color: white !important;
//             }
//         }
//     `]
// })
// export class SidebarComponent implements OnInit {

//     modulos = signal<ModuloMenu[]>([]);
//     cargando = signal(true);
//     nombreEmpresa = signal<string>('');

//     constructor(
//         private authService: AuthService,
//         private empresaService: EmpresaService,
//         private router: Router
//     ) {}

//     ngOnInit(): void {
//         this.cargarNombreEmpresa();
//         this.cargarSidebar();
//     }

//     cargarNombreEmpresa(): void {
//         this.empresaService.obtenerPublica().subscribe({
//             next: (data) => {
//                 if (data?.nombreComercial) {
//                     this.nombreEmpresa.set(data.nombreComercial);
//                 } else if (data?.razonSocial) {
//                     this.nombreEmpresa.set(data.razonSocial);
//                 }
//             },
//             error: () => {}
//         });
//     }

//     cargarSidebar(): void {
//         this.authService.obtenerSidebar().subscribe({
//             next: (data) => {
//                 this.modulos.set(data);
//                 this.cargando.set(false);
//             },
//             error: () => this.cargando.set(false)
//         });
//     }

//     tieneHijos(menu: MenuArbol): boolean {
//         return menu.hijos && menu.hijos.length > 0;
//     }

//     navegarA(ruta: string | null): void {
//         if (ruta) this.router.navigate([ruta]);
//     }

//     irAlDashboard(): void {
//         this.router.navigate(['/dashboard']);
//     }

//     estaActivo(ruta: string | null): boolean {
//         if (!ruta) return false;
//         return this.router.url === ruta;
//     }
// }
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth/auth.service';
import { EmpresaService } from '../../core/services/seguridad/empresa.service';
import { ModuloMenu, MenuArbol } from '../../core/models/auth/sidebar.model';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatListModule,
        MatIconModule,
        MatExpansionModule,
        MatDividerModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

    modulos      = signal<ModuloMenu[]>([]);
    cargando     = signal(true);
    nombreEmpresa = signal<string>('');

    constructor(
        private authService:    AuthService,
        private empresaService: EmpresaService,
        private router:         Router
    ) {}

    ngOnInit(): void {
        this.cargarNombreEmpresa();
        this.cargarSidebar();
    }

    cargarNombreEmpresa(): void {
        this.empresaService.obtenerPublica().subscribe({
            next: (data) => {
                const nombre = data?.nombreComercial ?? data?.razonSocial;
                if (nombre) this.nombreEmpresa.set(nombre);
            },
            error: () => {}
        });
    }

    cargarSidebar(): void {
        this.authService.obtenerSidebar().subscribe({
            next: (data) => {
                this.modulos.set(data);
                this.cargando.set(false);
            },
            error: () => this.cargando.set(false)
        });
    }

    tieneHijos(menu: MenuArbol): boolean {
        return menu.hijos?.length > 0;
    }

    navegarA(ruta: string | null): void {
        if (ruta) this.router.navigate([ruta]);
    }

    irAlDashboard(): void {
        this.router.navigate(['/dashboard']);
    }

    estaActivo(ruta: string | null): boolean {
        if (!ruta) return false;
        return this.router.url === ruta ||
               this.router.url.startsWith(ruta + '/');
    }

    // Verifica si algún descendiente está activo para auto-expandir
    estaActivoArbol(menu: MenuArbol): boolean {
        if (this.estaActivo(menu.ruta)) return true;
        return menu.hijos?.some(h => this.estaActivoArbolRecursivo(h)) ?? false;
    }

    private estaActivoArbolRecursivo(menu: MenuArbol): boolean {
        if (this.estaActivo(menu.ruta)) return true;
        return menu.hijos?.some(h => this.estaActivoArbolRecursivo(h)) ?? false;
    }
}