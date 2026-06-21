import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-sin-acceso',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './sin-acceso.component.html',
    styleUrl: './sin-acceso.component.scss'
})
export class SinAccesoComponent {

    constructor(private router: Router) {}

    volver(): void {
        this.router.navigate(['/dashboard']);
    }
}