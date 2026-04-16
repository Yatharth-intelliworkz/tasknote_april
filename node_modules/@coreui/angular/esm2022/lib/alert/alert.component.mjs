import { Component, ContentChildren, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TemplateIdDirective } from '../shared';
import { ButtonCloseDirective } from '../button';
import * as i0 from "@angular/core";
export class AlertComponent {
    constructor() {
        /**
         * Sets the color context of the component to one of CoreUI’s themed colors.
         *
         * @type Colors
         * @default 'primary'
         */
        this.color = 'primary';
        /**
         * Default role for alert. [docs]
         * @type string
         * @default 'alert'
         */
        this.role = 'alert';
        /**
         * Event triggered on the alert dismiss.
         */
        this.visibleChange = new EventEmitter();
        this.templates = {};
        this._dismissible = false;
        this._fade = false;
        this._visible = true;
    }
    /**
     * Optionally adds a close button to alert and allow it to self dismiss.
     * @type boolean
     */
    get dismissible() {
        return this._dismissible;
    }
    set dismissible(value) {
        this._dismissible = coerceBooleanProperty(value);
    }
    /**
     * Adds animation for dismissible alert.
     * @type boolean
     */
    get fade() {
        return this._fade;
    }
    set fade(value) {
        this._fade = coerceBooleanProperty(value);
    }
    get visible() {
        return this._visible;
    }
    /**
     * Toggle the visibility of alert component.
     * @type boolean
     */
    set visible(value) {
        if (this._visible !== value) {
            this._visible = coerceBooleanProperty(value);
            this.visibleChange.emit(value);
        }
    }
    ;
    get animationDisabled() {
        return !this.fade;
    }
    get animateType() {
        return this.visible ? 'show' : 'hide';
    }
    get hostClasses() {
        return {
            alert: true,
            'alert-dismissible': this.dismissible,
            fade: this.fade,
            show: !this.hide,
            [`alert-${this.color}`]: !!this.color && this.variant !== 'solid',
            [`bg-${this.color}`]: !!this.color && this.variant === 'solid',
            'text-white': !!this.color && this.variant === 'solid'
        };
    }
    onAnimationStart($event) {
        this.onAnimationEvent($event);
    }
    onAnimationDone($event) {
        this.onAnimationEvent($event);
    }
    ngAfterContentInit() {
        this.contentTemplates.forEach((child) => {
            this.templates[child.id] = child.templateRef;
        });
    }
    onAnimationEvent(event) {
        this.hide = event.phaseName === 'start' && event.toState === 'show';
        if (event.phaseName === 'done') {
            this.hide = (event.toState === 'hide' || event.toState === 'void');
            if (event.toState === 'show') {
                this.hide = false;
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: AlertComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.10", type: AlertComponent, isStandalone: true, selector: "c-alert", inputs: { color: "color", role: "role", variant: "variant", dismissible: "dismissible", fade: "fade", visible: "visible" }, outputs: { visibleChange: "visibleChange" }, host: { listeners: { "@fadeInOut.start": "onAnimationStart($event)", "@fadeInOut.done": "onAnimationDone($event)" }, properties: { "attr.role": "this.role", "@.disabled": "this.animationDisabled", "@fadeInOut": "this.animateType", "class": "this.hostClasses" } }, queries: [{ propertyName: "contentTemplates", predicate: TemplateIdDirective, descendants: true }], exportAs: ["cAlert"], ngImport: i0, template: "<ng-container *ngIf=\"visible || !hide\">\n  <ng-template [ngIf]=\"dismissible\">\n    <ng-container *ngTemplateOutlet=\"templates?.alertButtonCloseTemplate || defaultAlertButtonCloseTemplate\">\n    </ng-container>\n  </ng-template>\n  <ng-content></ng-content>\n</ng-container>\n\n<ng-template #defaultAlertButtonCloseTemplate>\n  <button (click)=\"visible=false\" aria-label=\"Close\" cButtonClose></button>\n</ng-template>\n", styles: [":host{display:block;overflow:hidden}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: ButtonCloseDirective, selector: "[cButtonClose]", inputs: ["white"] }], animations: [
            trigger('fadeInOut', [
                state('show', style({ opacity: 1, height: '*', padding: '*', border: '*', margin: '*' })),
                state('hide', style({ opacity: 0, height: 0, padding: 0, border: 0, margin: 0 })),
                state('void', style({ opacity: 0, height: 0, padding: 0, border: 0, margin: 0 })),
                transition('show => hide', [
                    animate('.3s ease-out')
                ]),
                transition('hide => show', [
                    animate('.3s ease-in')
                ]),
                transition('show => void', [
                    animate('.3s ease-out')
                ]),
                transition('void => show', [
                    animate('.3s ease-in')
                ])
            ])
        ] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: AlertComponent, decorators: [{
            type: Component,
            args: [{ selector: 'c-alert', exportAs: 'cAlert', standalone: true, imports: [NgIf, NgTemplateOutlet, ButtonCloseDirective], animations: [
                        trigger('fadeInOut', [
                            state('show', style({ opacity: 1, height: '*', padding: '*', border: '*', margin: '*' })),
                            state('hide', style({ opacity: 0, height: 0, padding: 0, border: 0, margin: 0 })),
                            state('void', style({ opacity: 0, height: 0, padding: 0, border: 0, margin: 0 })),
                            transition('show => hide', [
                                animate('.3s ease-out')
                            ]),
                            transition('hide => show', [
                                animate('.3s ease-in')
                            ]),
                            transition('show => void', [
                                animate('.3s ease-out')
                            ]),
                            transition('void => show', [
                                animate('.3s ease-in')
                            ])
                        ])
                    ], template: "<ng-container *ngIf=\"visible || !hide\">\n  <ng-template [ngIf]=\"dismissible\">\n    <ng-container *ngTemplateOutlet=\"templates?.alertButtonCloseTemplate || defaultAlertButtonCloseTemplate\">\n    </ng-container>\n  </ng-template>\n  <ng-content></ng-content>\n</ng-container>\n\n<ng-template #defaultAlertButtonCloseTemplate>\n  <button (click)=\"visible=false\" aria-label=\"Close\" cButtonClose></button>\n</ng-template>\n", styles: [":host{display:block;overflow:hidden}\n"] }]
        }], propDecorators: { color: [{
                type: Input
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }, {
                type: Input
            }], variant: [{
                type: Input
            }], visibleChange: [{
                type: Output
            }], contentTemplates: [{
                type: ContentChildren,
                args: [TemplateIdDirective, { descendants: true }]
            }], dismissible: [{
                type: Input
            }], fade: [{
                type: Input
            }], visible: [{
                type: Input
            }], animationDisabled: [{
                type: HostBinding,
                args: ['@.disabled']
            }], animateType: [{
                type: HostBinding,
                args: ['@fadeInOut']
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }], onAnimationStart: [{
                type: HostListener,
                args: ['@fadeInOut.start', ['$event']]
            }], onAnimationDone: [{
                type: HostListener,
                args: ['@fadeInOut.done', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZXVpLWFuZ3VsYXIvc3JjL2xpYi9hbGVydC9hbGVydC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JldWktYW5ndWxhci9zcmMvbGliL2FsZXJ0L2FsZXJ0LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsZUFBZSxFQUNmLFlBQVksRUFDWixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxPQUFPLEVBQWtCLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pHLE9BQU8sRUFBZ0IscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUc1RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDaEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sV0FBVyxDQUFDOztBQStCakQsTUFBTSxPQUFPLGNBQWM7SUEzQjNCO1FBa0NFOzs7OztXQUtHO1FBQ00sVUFBSyxHQUFXLFNBQVMsQ0FBQztRQUNuQzs7OztXQUlHO1FBRU0sU0FBSSxHQUFHLE9BQU8sQ0FBQztRQU14Qjs7V0FFRztRQUNPLGtCQUFhLEdBQTBCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDcEUsY0FBUyxHQUFRLEVBQUUsQ0FBQztRQUdaLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBZXJCLFVBQUssR0FBRyxLQUFLLENBQUM7UUFlZCxhQUFRLEdBQUcsSUFBSSxDQUFDO0tBa0V6QjtJQTlGQzs7O09BR0c7SUFDSCxJ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Vzs7c0JBQ3ZCLEtBQUs7Z0JBS0csT0FBTztzQkFBZixLQUFLO2dCQUlJLGFBQWE7c0JBQXRCLE1BQU07Z0JBRXNELGdCQUFnQjtzQkFBNUUsZUFBZTt1QkFBQyxtQkFBbUIsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUU7Z0JBU3ZELFdBQVc7c0JBRGQsS0FBSztnQkFnQkYsSUFBSTtzQkFEUCxLQUFLO2dCQW9CRixPQUFPO3NCQURWLEtBQUs7Z0JBU0YsaUJBQWlCO3NCQURwQixXQUFXO3VCQUFDLFlBQVk7Z0JBTXJCLFdBQVc7c0JBRGQsV0FBVzt1QkFBQyxZQUFZO2dCQU1yQixXQUFXO3NCQURkLFdBQVc7dUJBQUMsT0FBTztnQkFjcEIsZ0JBQWdCO3NCQURmLFlBQVk7dUJBQUMsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBTTVDLGVBQWU7c0JBRGQsWUFBWTt1QkFBQyxpQkFBaUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nSWYsIE5nVGVtcGxhdGVPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgYW5pbWF0ZSwgQW5pbWF0aW9uRXZlbnQsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5pbXBvcnQgeyBDb2xvcnMgfSBmcm9tICcuLi9jb3JldWkudHlwZXMnO1xuaW1wb3J0IHsgVGVtcGxhdGVJZERpcmVjdGl2ZSB9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQgeyBCdXR0b25DbG9zZURpcmVjdGl2ZSB9IGZyb20gJy4uL2J1dHRvbic7XG5cbnR5cGUgQW5pbWF0ZVR5cGUgPSAoJ2hpZGUnIHwgJ3Nob3cnKTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYy1hbGVydCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9hbGVydC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2FsZXJ0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGV4cG9ydEFzOiAnY0FsZXJ0JyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW05nSWYsIE5nVGVtcGxhdGVPdXRsZXQsIEJ1dHRvbkNsb3NlRGlyZWN0aXZlXSxcbiAgYW5pbWF0aW9uczogW1xuICAgIHRyaWdnZXIoJ2ZhZGVJbk91dCcsIFtcbiAgICAgIHN0YXRlKCdzaG93Jywgc3R5bGUoeyBvcGFjaXR5OiAxLCBoZWlnaHQ6ICcqJywgcGFkZGluZzogJyonLCBib3JkZXI6ICcqJywgbWFyZ2luOiAnKicgfSkpLFxuICAgICAgc3RhdGUoJ2hpZGUnLCBzdHlsZSh7IG9wYWNpdHk6IDAsIGhlaWdodDogMCwgcGFkZGluZzogMCwgYm9yZGVyOiAwLCBtYXJnaW46IDAgfSkpLFxuICAgICAgc3RhdGUoJ3ZvaWQnLCBzdHlsZSh7IG9wYWNpdHk6IDAsIGhlaWdodDogMCwgcGFkZGluZzogMCwgYm9yZGVyOiAwLCBtYXJnaW46IDAgfSkpLFxuICAgICAgdHJhbnNpdGlvbignc2hvdyA9PiBoaWRlJywgW1xuICAgICAgICBhbmltYXRlKCcuM3MgZWFzZS1vdXQnKVxuICAgICAgXSksXG4gICAgICB0cmFuc2l0aW9uKCdoaWRlID0+IHNob3cnLCBbXG4gICAgICAgIGFuaW1hdGUoJy4zcyBlYXNlLWluJylcbiAgICAgIF0pLFxuICAgICAgdHJhbnNpdGlvbignc2hvdyA9PiB2b2lkJywgW1xuICAgICAgICBhbmltYXRlKCcuM3MgZWFzZS1vdXQnKVxuICAgICAgXSksXG4gICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IHNob3cnLCBbXG4gICAgICAgIGFuaW1hdGUoJy4zcyBlYXNlLWluJylcbiAgICAgIF0pXG4gICAgXSlcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBBbGVydENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNtaXNzaWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZmFkZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmlzaWJsZTogQm9vbGVhbklucHV0O1xuXG4gIGhpZGUhOiBib29sZWFuO1xuICAvKipcbiAgICogU2V0cyB0aGUgY29sb3IgY29udGV4dCBvZiB0aGUgY29tcG9uZW50IHRvIG9uZSBvZiBDb3JlVUnigJlzIHRoZW1lZCBjb2xvcnMuXG4gICAqXG4gICAqIEB0eXBlIENvbG9yc1xuICAgKiBAZGVmYXVsdCAncHJpbWFyeSdcbiAgICovXG4gIEBJbnB1dCgpIGNvbG9yOiBDb2xvcnMgPSAncHJpbWFyeSc7XG4gIC8qKlxuICAgKiBEZWZhdWx0IHJvbGUgZm9yIGFsZXJ0LiBbZG9jc11cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqIEBkZWZhdWx0ICdhbGVydCdcbiAgICovXG4gIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcbiAgQElucHV0KCkgcm9sZSA9ICdhbGVydCc7XG4gIC8qKlxuICAgKiBTZXQgdGhlIGFsZXJ0IHZhcmlhbnQgdG8gYSBzb2xpZC5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBASW5wdXQoKSB2YXJpYW50PzogJ3NvbGlkJyB8IHN0cmluZztcbiAgLyoqXG4gICAqIEV2ZW50IHRyaWdnZXJlZCBvbiB0aGUgYWxlcnQgZGlzbWlzcy5cbiAgICovXG4gIEBPdXRwdXQoKSB2aXNpYmxlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHRlbXBsYXRlczogYW55ID0ge307XG4gIEBDb250ZW50Q2hpbGRyZW4oVGVtcGxhdGVJZERpcmVjdGl2ZSwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KSBjb250ZW50VGVtcGxhdGVzITogUXVlcnlMaXN0PFRlbXBsYXRlSWREaXJlY3RpdmU+O1xuXG4gIHByaXZhdGUgX2Rpc21pc3NpYmxlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsbHkgYWRkcyBhIGNsb3NlIGJ1dHRvbiB0byBhbGVydCBhbmQgYWxsb3cgaXQgdG8gc2VsZiBkaXNtaXNzLlxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzbWlzc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc21pc3NpYmxlO1xuICB9XG5cbiAgc2V0IGRpc21pc3NpYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzbWlzc2libGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmFkZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuaW1hdGlvbiBmb3IgZGlzbWlzc2libGUgYWxlcnQuXG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBmYWRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mYWRlO1xuICB9XG5cbiAgc2V0IGZhZGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9mYWRlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2libGUgPSB0cnVlO1xuXG4gIGdldCB2aXNpYmxlKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiBhbGVydCBjb21wb25lbnQuXG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCB2aXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX3Zpc2libGUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl92aXNpYmxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICAgIHRoaXMudmlzaWJsZUNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgQEhvc3RCaW5kaW5nKCdALmRpc2FibGVkJylcbiAgZ2V0IGFuaW1hdGlvbkRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5mYWRlO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdAZmFkZUluT3V0JylcbiAgZ2V0IGFuaW1hdGVUeXBlKCk6IEFuaW1hdGVUeXBlIHtcbiAgICByZXR1cm4gdGhpcy52aXNpYmxlID8gJ3Nob3cnIDogJ2hpZGUnO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBob3N0Q2xhc3NlcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBhbGVydDogdHJ1ZSxcbiAgICAgICdhbGVydC1kaXNtaXNzaWJsZSc6IHRoaXMuZGlzbWlzc2libGUsXG4gICAgICBmYWRlOiB0aGlzLmZhZGUsXG4gICAgICBzaG93OiAhdGhpcy5oaWRlLFxuICAgICAgW2BhbGVydC0ke3RoaXMuY29sb3J9YF06ICEhdGhpcy5jb2xvciAmJiB0aGlzLnZhcmlhbnQgIT09ICdzb2xpZCcsXG4gICAgICBbYGJnLSR7dGhpcy5jb2xvcn1gXTogISF0aGlzLmNvbG9yICYmIHRoaXMudmFyaWFudCA9PT0gJ3NvbGlkJyxcbiAgICAgICd0ZXh0LXdoaXRlJzogISF0aGlzLmNvbG9yICYmIHRoaXMudmFyaWFudCA9PT0gJ3NvbGlkJ1xuICAgIH07XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdAZmFkZUluT3V0LnN0YXJ0JywgWyckZXZlbnQnXSlcbiAgb25BbmltYXRpb25TdGFydCgkZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5vbkFuaW1hdGlvbkV2ZW50KCRldmVudCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdAZmFkZUluT3V0LmRvbmUnLCBbJyRldmVudCddKVxuICBvbkFuaW1hdGlvbkRvbmUoJGV2ZW50OiBBbmltYXRpb25FdmVudCk6IHZvaWQge1xuICAgIHRoaXMub25BbmltYXRpb25FdmVudCgkZXZlbnQpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGVudFRlbXBsYXRlcy5mb3JFYWNoKChjaGlsZDogVGVtcGxhdGVJZERpcmVjdGl2ZSkgPT4ge1xuICAgICAgdGhpcy50ZW1wbGF0ZXNbY2hpbGQuaWRdID0gY2hpbGQudGVtcGxhdGVSZWY7XG4gICAgfSk7XG4gIH1cblxuICBvbkFuaW1hdGlvbkV2ZW50KGV2ZW50OiBBbmltYXRpb25FdmVudCk6IHZvaWQge1xuICAgIHRoaXMuaGlkZSA9IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ3N0YXJ0JyAmJiBldmVudC50b1N0YXRlID09PSAnc2hvdyc7XG4gICAgaWYgKGV2ZW50LnBoYXNlTmFtZSA9PT0gJ2RvbmUnKSB7XG4gICAgICB0aGlzLmhpZGUgPSAoZXZlbnQudG9TdGF0ZSA9PT0gJ2hpZGUnIHx8IGV2ZW50LnRvU3RhdGUgPT09ICd2b2lkJyk7XG4gICAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ3Nob3cnKSB7XG4gICAgICAgIHRoaXMuaGlkZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiPG5nLWNvbnRhaW5lciAqbmdJZj1cInZpc2libGUgfHwgIWhpZGVcIj5cbiAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cImRpc21pc3NpYmxlXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlcz8uYWxlcnRCdXR0b25DbG9zZVRlbXBsYXRlIHx8IGRlZmF1bHRBbGVydEJ1dHRvbkNsb3NlVGVtcGxhdGVcIj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgPC9uZy10ZW1wbGF0ZT5cbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9uZy1jb250YWluZXI+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEFsZXJ0QnV0dG9uQ2xvc2VUZW1wbGF0ZT5cbiAgPGJ1dHRvbiAoY2xpY2spPVwidmlzaWJsZT1mYWxzZVwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiIGNCdXR0b25DbG9zZT48L2J1dHRvbj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=