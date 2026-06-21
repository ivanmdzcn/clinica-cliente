import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrdenLaboratorioService }
    from '../../../core/services/clinica/orden-laboratorio.service';
import { OrdenLaboratorio }
    from '../../../core/models/clinica/orden-laboratorio.model';

@Component({
    selector: 'app-orden-lab-vista',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './orden-lab-vista.component.html',
    styleUrl:    './orden-lab-vista.component.scss'
})
export class OrdenLabVistaComponent implements OnInit {

    orden    = signal<OrdenLaboratorio | null>(null);
    cargando = signal(true);

    constructor(
        private route:       ActivatedRoute,
        private ordenService: OrdenLaboratorioService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.ordenService.obtenerPorId(id).subscribe({
            next: (data) => {
                this.orden.set(data);
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