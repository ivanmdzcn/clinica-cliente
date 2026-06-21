import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RecetaService } from '../../../core/services/clinica/receta.service';
import { Receta } from '../../../core/models/clinica/receta.model';

@Component({
    selector: 'app-receta-vista',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './receta-vista.component.html',
    styleUrl:    './receta-vista.component.scss'
})
export class RecetaVistaComponent implements OnInit {

    receta  = signal<Receta | null>(null);
    cargando = signal(true);

    constructor(
        private route:         ActivatedRoute,
        private router:        Router,
        private recetaService: RecetaService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.recetaService.obtenerPorId(id).subscribe({
            next: (data) => {
                this.receta.set(data);
                this.cargando.set(false);
            },
            error: () => this.cargando.set(false)
        });
    }

    imprimir(): void {
        window.print();
    }

    volver(): void {
        history.back();
    }
}