import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';

@Directive({
    selector: '[appPermiso]',
    standalone: true
})
export class PermisoDirective implements OnInit {

    @Input() appPermiso: string = '';

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        if (this.authService.tienePermiso(this.appPermiso))
            this.viewContainer.createEmbeddedView(this.templateRef);
        else
            this.viewContainer.clear();
    }
}