import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
    titulo: string;
    mensaje: string;
    btnConfirmar: string;
    color: 'primary' | 'accent' | 'warn';
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
        <h2 mat-dialog-title>{{ data.titulo }}</h2>
        <mat-dialog-content>
            <p>{{ data.mensaje }}</p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button [mat-dialog-close]="false">Cancelar</button>
            <button
                mat-raised-button
                [color]="data.color"
                [mat-dialog-close]="true">
                {{ data.btnConfirmar }}
            </button>
        </mat-dialog-actions>
    `
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) {}
}