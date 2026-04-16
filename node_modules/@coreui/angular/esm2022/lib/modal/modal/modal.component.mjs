import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Input, Output, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { A11yModule } from '@angular/cdk/a11y';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "../modal.service";
import * as i2 from "../../backdrop/backdrop.service";
import * as i3 from "@angular/cdk/a11y";
export class ModalComponent {
    constructor(document, renderer, hostElement, modalService, backdropService) {
        this.document = document;
        this.renderer = renderer;
        this.hostElement = hostElement;
        this.modalService = modalService;
        this.backdropService = backdropService;
        /**
         * Align the modal in the center or top of the screen.
         * @type {'top' | 'center'}
         * @default 'top'
         */
        this.alignment = 'top';
        /**
         * Apply a backdrop on body while modal is open.
         * @type boolean | 'static'
         * @default true
         */
        this.backdrop = true;
        /**
         * Closes the modal when escape key is pressed.
         * @type boolean
         * @default true
         */
        this.keyboard = true;
        /**
         * Remove animation to create modal that simply appear rather than fade in to view.
         */
        this.transition = true;
        /**
         * Default role for modal. [docs]
         * @type string
         * @default 'dialog'
         */
        this.role = 'dialog';
        /**
         * Set aria-modal html attr for modal. [docs]
         * @type boolean
         * @default true
         */
        this.ariaModal = true;
        this._scrollable = false;
        /**
         * Event triggered on modal dismiss.
         */
        this.visibleChange = new EventEmitter();
        this._show = true;
        this.mouseDownTarget = null;
    }
    /**
     * Create a scrollable modal that allows scrolling the modal body.
     * @type boolean
     */
    set scrollable(value) {
        this._scrollable = coerceBooleanProperty(value);
    }
    get scrollable() {
        return this._scrollable;
    }
    /**
     * Toggle the visibility of modal component.
     * @type boolean
     */
    set visible(value) {
        const newValue = coerceBooleanProperty(value);
        if (this._visible !== newValue) {
            this._visible = newValue;
            this.setBackdrop(this.backdrop !== false && newValue);
            this.setBodyStyles(newValue);
            this.visibleChange.emit(newValue);
        }
    }
    get visible() {
        return this._visible;
    }
    // private inBoundingClientRect!: boolean;
    get hostClasses() {
        return {
            modal: true,
            fade: this.transition,
            show: this.show
        };
    }
    get ariaHidden() {
        return this.visible ? null : true;
    }
    ;
    get tabIndex() {
        return '-1';
    }
    get animateTrigger() {
        return this.visible ? 'visible' : 'hidden';
    }
    get show() {
        return this.visible && this._show;
    }
    set show(value) {
        this._show = value;
    }
    animateStart(event) {
        const scrollbarWidth = this.backdropService.scrollbarWidth;
        if (event.toState === 'visible') {
            this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
            this.renderer.setStyle(this.document.body, 'padding-right', scrollbarWidth);
            this.renderer.setStyle(this.hostElement.nativeElement, 'display', 'block');
        }
        else {
            if (!this.transition) {
                this.renderer.setStyle(this.hostElement.nativeElement, 'display', 'none');
            }
        }
    }
    animateDone(event) {
        setTimeout(() => {
            if (event.toState === 'hidden') {
                this.renderer.setStyle(this.hostElement.nativeElement, 'display', 'none');
                this.renderer.removeStyle(this.document.body, 'overflow');
                this.renderer.removeStyle(this.document.body, 'padding-right');
            }
        });
        this.show = this.visible;
    }
    onKeyDownHandler(event) {
        if (event.key === 'Escape' && this.keyboard && this.visible) {
            if (this.backdrop === 'static') {
                this.setStaticBackdrop();
            }
            else {
                this.modalService.toggle({ show: false, modal: this });
            }
        }
    }
    onMouseDownHandler($event) {
        this.mouseDownTarget = $event.target;
    }
    onClickHandler($event) {
        if (this.mouseDownTarget !== $event.target) {
            this.mouseDownTarget = null;
            return;
        }
        const targetElement = $event.target;
        if (targetElement === this.hostElement.nativeElement) {
            if (this.backdrop === 'static') {
                this.setStaticBackdrop();
                return;
            }
            this.modalService.toggle({ show: false, modal: this });
        }
    }
    ngOnInit() {
        this.stateToggleSubscribe();
    }
    ngOnDestroy() {
        this.modalService.toggle({ show: false, modal: this });
        this.stateToggleSubscribe(false);
    }
    stateToggleSubscribe(subscribe = true) {
        if (subscribe) {
            this.stateToggleSubscription = this.modalService.modalState$.subscribe((action) => {
                if (this === action.modal || this.id === action.id) {
                    if ('show' in action) {
                        this.visible = action?.show === 'toggle' ? !this.visible : action.show;
                    }
                }
                else {
                    if (this.visible) {
                        this.visible = false;
                    }
                }
            });
        }
        else {
            this.stateToggleSubscription?.unsubscribe();
        }
    }
    setBackdrop(setBackdrop) {
        if (setBackdrop) {
            this.activeBackdrop = this.backdropService.setBackdrop('modal');
        }
        else {
            this.activeBackdrop = this.backdropService.clearBackdrop(this.activeBackdrop);
        }
    }
    setBodyStyles(open) {
        if (open) {
            if (this.backdrop === true) {
                this.renderer.addClass(this.document.body, 'modal-open');
            }
        }
        else {
            this.renderer.removeClass(this.document.body, 'modal-open');
        }
    }
    setStaticBackdrop() {
        if (this.transition) {
            this.renderer.addClass(this.hostElement.nativeElement, 'modal-static');
            this.renderer.setStyle(this.hostElement.nativeElement, 'overflow-y', 'hidden');
            setTimeout(() => {
                this.renderer.removeClass(this.hostElement.nativeElement, 'modal-static');
                this.renderer.removeStyle(this.hostElement.nativeElement, 'overflow-y');
            }, 300);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: ModalComponent, deps: [{ token: DOCUMENT }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1.ModalService }, { token: i2.BackdropService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.10", type: ModalComponent, isStandalone: true, selector: "c-modal", inputs: { alignment: "alignment", backdrop: "backdrop", fullscreen: "fullscreen", keyboard: "keyboard", id: "id", size: "size", transition: "transition", role: "role", ariaModal: "ariaModal", scrollable: "scrollable", visible: "visible" }, outputs: { visibleChange: "visibleChange" }, host: { listeners: { "@showHide.start": "animateStart($event)", "@showHide.done": "animateDone($event)", "document:keyup": "onKeyDownHandler($event)", "mousedown": "onMouseDownHandler($event)", "click": "onClickHandler($event)" }, properties: { "attr.role": "this.role", "attr.aria-modal": "this.ariaModal", "class": "this.hostClasses", "attr.aria-hidden": "this.ariaHidden", "attr.tabindex": "this.tabIndex", "@showHide": "this.animateTrigger" } }, viewQueries: [{ propertyName: "modalContent", first: true, predicate: ModalContentComponent, descendants: true, read: ElementRef }], exportAs: ["cModal"], ngImport: i0, template: "<c-modal-dialog\n  [alignment]=\"alignment\"\n  [fullscreen]=\"fullscreen\"\n  [scrollable]=\"scrollable\"\n  [size]=\"size\">\n  <c-modal-content>\n    <div [cdkTrapFocus]=\"visible\" [cdkTrapFocusAutoCapture]=\"visible\" style=\"display: contents;\">\n      <ng-content></ng-content>\n    </div>\n  </c-modal-content>\n</c-modal-dialog>\n", dependencies: [{ kind: "component", type: ModalDialogComponent, selector: "c-modal-dialog", inputs: ["alignment", "fullscreen", "scrollable", "size"] }, { kind: "component", type: ModalContentComponent, selector: "c-modal-content" }, { kind: "ngmodule", type: A11yModule }, { kind: "directive", type: i3.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }], animations: [
            trigger('showHide', [
                state('visible', style({
                // display: 'block'
                })),
                state('hidden', style({
                // display: 'none'
                })),
                transition('visible <=> *', [animate('300ms')])
            ])
        ] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: ModalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'c-modal', animations: [
                        trigger('showHide', [
                            state('visible', style({
                            // display: 'block'
                            })),
                            state('hidden', style({
                            // display: 'none'
                            })),
                            transition('visible <=> *', [animate('300ms')])
                        ])
                    ], exportAs: 'cModal', standalone: true, imports: [ModalDialogComponent, ModalContentComponent, A11yModule], template: "<c-modal-dialog\n  [alignment]=\"alignment\"\n  [fullscreen]=\"fullscreen\"\n  [scrollable]=\"scrollable\"\n  [size]=\"size\">\n  <c-modal-content>\n    <div [cdkTrapFocus]=\"visible\" [cdkTrapFocusAutoCapture]=\"visible\" style=\"display: contents;\">\n      <ng-content></ng-content>\n    </div>\n  </c-modal-content>\n</c-modal-dialog>\n" }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1.ModalService }, { type: i2.BackdropService }]; }, propDecorators: { alignment: [{
                type: Input
            }], backdrop: [{
                type: Input
            }], fullscreen: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], id: [{
                type: Input
            }], size: [{
                type: Input
            }], transition: [{
                type: Input
            }], role: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.role']
            }], ariaModal: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.aria-modal']
            }], scrollable: [{
                type: Input
            }], visible: [{
                type: Input
            }], visibleChange: [{
                type: Output
            }], modalContent: [{
                type: ViewChild,
                args: [ModalContentComponent, { read: ElementRef }]
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }], ariaHidden: [{
                type: HostBinding,
                args: ['attr.aria-hidden']
            }], tabIndex: [{
                type: HostBinding,
                args: ['attr.tabindex']
            }], animateTrigger: [{
                type: HostBinding,
                args: ['@showHide']
            }], animateStart: [{
                type: HostListener,
                args: ['@showHide.start', ['$event']]
            }], animateDone: [{
                type: HostListener,
                args: ['@showHide.done', ['$event']]
            }], onKeyDownHandler: [{
                type: HostListener,
                args: ['document:keyup', ['$event']]
            }], onMouseDownHandler: [{
                type: HostListener,
                args: ['mousedown', ['$event']]
            }], onClickHandler: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZXVpLWFuZ3VsYXIvc3JjL2xpYi9tb2RhbC9tb2RhbC9tb2RhbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JldWktYW5ndWxhci9zcmMvbGliL21vZGFsL21vZGFsL21vZGFsLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUVOLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBa0IsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakcsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUsvQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNqRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQzs7Ozs7QUEwQjlFLE1BQU0sT0FBTyxjQUFjO0lBS3pCLFlBQzRCLFFBQWtCLEVBQ3BDLFFBQW1CLEVBQ25CLFdBQXVCLEVBQ3ZCLFlBQTBCLEVBQzFCLGVBQWdDO1FBSmQsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNwQyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3ZCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLG9CQUFlLEdBQWYs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Z0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFhMUMsZ0JBQWdCO3NCQURmLFlBQVk7dUJBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBY25DLGtCQUFrQjtzQkFEeEIsWUFBWTt1QkFBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBTTlCLGNBQWM7c0JBRHBCLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgYW5pbWF0ZSwgQW5pbWF0aW9uRXZlbnQsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgQTExeU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBNb2RhbFNlcnZpY2UgfSBmcm9tICcuLi9tb2RhbC5zZXJ2aWNlJztcbmltcG9ydCB7IEJhY2tkcm9wU2VydmljZSB9IGZyb20gJy4uLy4uL2JhY2tkcm9wL2JhY2tkcm9wLnNlcnZpY2UnO1xuaW1wb3J0IHsgTW9kYWxDb250ZW50Q29tcG9uZW50IH0gZnJvbSAnLi4vbW9kYWwtY29udGVudC9tb2RhbC1jb250ZW50LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNb2RhbERpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uL21vZGFsLWRpYWxvZy9tb2RhbC1kaWFsb2cuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYy1tb2RhbCcsXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdzaG93SGlkZScsIFtcbiAgICAgIHN0YXRlKFxuICAgICAgICAndmlzaWJsZScsXG4gICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAvLyBkaXNwbGF5OiAnYmxvY2snXG4gICAgICAgIH0pXG4gICAgICApLFxuICAgICAgc3RhdGUoXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICBzdHlsZSh7XG4gICAgICAgICAgLy8gZGlzcGxheTogJ25vbmUnXG4gICAgICAgIH0pXG4gICAgICApLFxuICAgICAgdHJhbnNpdGlvbigndmlzaWJsZSA8PT4gKicsIFthbmltYXRlKCczMDBtcycpXSlcbiAgICBdKVxuICBdLFxuICB0ZW1wbGF0ZVVybDogJy4vbW9kYWwuY29tcG9uZW50Lmh0bWwnLFxuICBleHBvcnRBczogJ2NNb2RhbCcsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtNb2RhbERpYWxvZ0NvbXBvbmVudCwgTW9kYWxDb250ZW50Q29tcG9uZW50LCBBMTF5TW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBNb2RhbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2Nyb2xsYWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmlzaWJsZTogQm9vbGVhbklucHV0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGhvc3RFbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgbW9kYWxTZXJ2aWNlOiBNb2RhbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBiYWNrZHJvcFNlcnZpY2U6IEJhY2tkcm9wU2VydmljZVxuICApIHsgfVxuXG4gIC8qKlxuICAgKiBBbGlnbiB0aGUgbW9kYWwgaW4gdGhlIGNlbnRlciBvciB0b3Agb2YgdGhlIHNjcmVlbi5cbiAgICogQHR5cGUgeyd0b3AnIHwgJ2NlbnRlcid9XG4gICAqIEBkZWZhdWx0ICd0b3AnXG4gICAqL1xuICBASW5wdXQoKSBhbGlnbm1lbnQ/OiAndG9wJyB8ICdjZW50ZXInID0gJ3RvcCc7XG4gIC8qKlxuICAgKiBBcHBseSBhIGJhY2tkcm9wIG9uIGJvZHkgd2hpbGUgbW9kYWwgaXMgb3Blbi5cbiAgICogQHR5cGUgYm9vbGVhbiB8ICdzdGF0aWMnXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIEBJbnB1dCgpIGJhY2tkcm9wOiBib29sZWFuIHwgJ3N0YXRpYycgPSB0cnVlO1xuICAvKipcbiAgICogU2V0IG1vZGFsIHRvIGNvdmVyIHRoZSBlbnRpcmUgdXNlciB2aWV3cG9ydC5cbiAgICogQHR5cGUge2Jvb2xlYW4gfCAnc20nIHwgJ21kJyB8ICdsZycgfCAneGwnIHwgJ3h4bCd9XG4gICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgKi9cbiAgQElucHV0KCkgZnVsbHNjcmVlbj86IGJvb2xlYW4gfCAnc20nIHwgJ21kJyB8ICdsZycgfCAneGwnIHwgJ3h4bCc7XG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIG1vZGFsIHdoZW4gZXNjYXBlIGtleSBpcyBwcmVzc2VkLlxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIEBJbnB1dCgpIGtleWJvYXJkID0gdHJ1ZTtcbiAgQElucHV0KCkgaWQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBTaXplIHRoZSBjb21wb25lbnQgc21hbGwsIGxhcmdlLCBvciBleHRyYSBsYXJnZS5cbiAgICovXG4gIEBJbnB1dCgpIHNpemU/OiAnc20nIHwgJ2xnJyB8ICd4bCc7XG4gIC8qKlxuICAgKiBSZW1vdmUgYW5pbWF0aW9uIHRvIGNyZWF0ZSBtb2RhbCB0aGF0IHNpbXBseSBhcHBlYXIgcmF0aGVyIHRoYW4gZmFkZSBpbiB0byB2aWV3LlxuICAgKi9cbiAgQElucHV0KCkgdHJhbnNpdGlvbiA9IHRydWU7XG4gIC8qKlxuICAgKiBEZWZhdWx0IHJvbGUgZm9yIG1vZGFsLiBbZG9jc11cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqIEBkZWZhdWx0ICdkaWFsb2cnXG4gICAqL1xuICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpIHJvbGUgPSAnZGlhbG9nJztcbiAgLyoqXG4gICAqIFNldCBhcmlhLW1vZGFsIGh0bWwgYXR0ciBmb3IgbW9kYWwuIFtkb2NzXVxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIEBJbnB1dCgpIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLW1vZGFsJykgYXJpYU1vZGFsID0gdHJ1ZTtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgc2Nyb2xsYWJsZSBtb2RhbCB0aGF0IGFsbG93cyBzY3JvbGxpbmcgdGhlIG1vZGFsIGJvZHkuXG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBzY3JvbGxhYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2Nyb2xsYWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICBnZXQgc2Nyb2xsYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2Nyb2xsYWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgX3Njcm9sbGFibGUgPSBmYWxzZTtcblxuICAvKipcbiAgICogVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIG1vZGFsIGNvbXBvbmVudC5cbiAgICogQHR5cGUgYm9vbGVhblxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IHZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgaWYgKHRoaXMuX3Zpc2libGUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLl92aXNpYmxlID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnNldEJhY2tkcm9wKHRoaXMuYmFja2Ryb3AgIT09IGZhbHNlICYmIG5ld1ZhbHVlKTtcbiAgICAgIHRoaXMuc2V0Qm9keVN0eWxlcyhuZXdWYWx1ZSk7XG4gICAgICB0aGlzLnZpc2libGVDaGFuZ2UuZW1pdChuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2libGU7XG4gIH1cblxuICBwcml2YXRlIF92aXNpYmxlITogYm9vbGVhbjtcblxuICAvKipcbiAgICogRXZlbnQgdHJpZ2dlcmVkIG9uIG1vZGFsIGRpc21pc3MuXG4gICAqL1xuICBAT3V0cHV0KCkgdmlzaWJsZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBAVmlld0NoaWxkKE1vZGFsQ29udGVudENvbXBvbmVudCwgeyByZWFkOiBFbGVtZW50UmVmIH0pIG1vZGFsQ29udGVudCE6IEVsZW1lbnRSZWY7XG4gIHByaXZhdGUgYWN0aXZlQmFja2Ryb3AhOiBhbnk7XG4gIHByaXZhdGUgc3RhdGVUb2dnbGVTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XG5cbiAgLy8gcHJpdmF0ZSBpbkJvdW5kaW5nQ2xpZW50UmVjdCE6IGJvb2xlYW47XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBob3N0Q2xhc3NlcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGZhZGU6IHRoaXMudHJhbnNpdGlvbixcbiAgICAgIHNob3c6IHRoaXMuc2hvd1xuICAgIH07XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1oaWRkZW4nKVxuICBnZXQgYXJpYUhpZGRlbigpOiBib29sZWFuIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMudmlzaWJsZSA/IG51bGwgOiB0cnVlO1xuICB9O1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci50YWJpbmRleCcpXG4gIGdldCB0YWJJbmRleCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gJy0xJztcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnQHNob3dIaWRlJylcbiAgZ2V0IGFuaW1hdGVUcmlnZ2VyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmlzaWJsZSA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nO1xuICB9XG5cbiAgZ2V0IHNob3coKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmlzaWJsZSAmJiB0aGlzLl9zaG93O1xuICB9XG5cbiAgc2V0IHNob3codmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zaG93ID0gdmFsdWU7XG4gIH1cblxuICBwcml2YXRlIF9zaG93ID0gdHJ1ZTtcblxuICBASG9zdExpc3RlbmVyKCdAc2hvd0hpZGUuc3RhcnQnLCBbJyRldmVudCddKVxuICBhbmltYXRlU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgY29uc3Qgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLmJhY2tkcm9wU2VydmljZS5zY3JvbGxiYXJXaWR0aDtcbiAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZG9jdW1lbnQuYm9keSwgJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmRvY3VtZW50LmJvZHksICdwYWRkaW5nLXJpZ2h0Jywgc2Nyb2xsYmFyV2lkdGgpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdGhpcy50cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdub25lJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignQHNob3dIaWRlLmRvbmUnLCBbJyRldmVudCddKVxuICBhbmltYXRlRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChldmVudC50b1N0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuaG9zdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZVN0eWxlKHRoaXMuZG9jdW1lbnQuYm9keSwgJ292ZXJmbG93Jyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5kb2N1bWVudC5ib2R5LCAncGFkZGluZy1yaWdodCcpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuc2hvdyA9IHRoaXMudmlzaWJsZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleXVwJywgWyckZXZlbnQnXSlcbiAgb25LZXlEb3duSGFuZGxlcihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnICYmIHRoaXMua2V5Ym9hcmQgJiYgdGhpcy52aXNpYmxlKSB7XG4gICAgICBpZiAodGhpcy5iYWNrZHJvcCA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0aWNCYWNrZHJvcCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb2RhbFNlcnZpY2UudG9nZ2xlKHsgc2hvdzogZmFsc2UsIG1vZGFsOiB0aGlzIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbW91c2VEb3duVGFyZ2V0OiBFdmVudFRhcmdldCB8IG51bGwgPSBudWxsO1xuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBvbk1vdXNlRG93bkhhbmRsZXIoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5tb3VzZURvd25UYXJnZXQgPSAkZXZlbnQudGFyZ2V0O1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICBwdWJsaWMgb25DbGlja0hhbmRsZXIoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5tb3VzZURvd25UYXJnZXQgIT09ICRldmVudC50YXJnZXQpIHtcbiAgICAgIHRoaXMubW91c2VEb3duVGFyZ2V0ID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gJGV2ZW50LnRhcmdldDtcbiAgICBpZiAodGFyZ2V0RWxlbWVudCA9PT0gdGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50KSB7XG5cbiAgICAgIGlmICh0aGlzLmJhY2tkcm9wID09PSAnc3RhdGljJykge1xuICAgICAgICB0aGlzLnNldFN0YXRpY0JhY2tkcm9wKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tb2RhbFNlcnZpY2UudG9nZ2xlKHsgc2hvdzogZmFsc2UsIG1vZGFsOiB0aGlzIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGVUb2dnbGVTdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMubW9kYWxTZXJ2aWNlLnRvZ2dsZSh7IHNob3c6IGZhbHNlLCBtb2RhbDogdGhpcyB9KTtcbiAgICB0aGlzLnN0YXRlVG9nZ2xlU3Vic2NyaWJlKGZhbHNlKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGVUb2dnbGVTdWJzY3JpYmUoc3Vic2NyaWJlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChzdWJzY3JpYmUpIHtcbiAgICAgIHRoaXMuc3RhdGVUb2dnbGVTdWJzY3JpcHRpb24gPSB0aGlzLm1vZGFsU2VydmljZS5tb2RhbFN0YXRlJC5zdWJzY3JpYmUoXG4gICAgICAgIChhY3Rpb24pID0+IHtcbiAgICAgICAgICBpZiAodGhpcyA9PT0gYWN0aW9uLm1vZGFsIHx8IHRoaXMuaWQgPT09IGFjdGlvbi5pZCkge1xuICAgICAgICAgICAgaWYgKCdzaG93JyBpbiBhY3Rpb24pIHtcbiAgICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gYWN0aW9uPy5zaG93ID09PSAndG9nZ2xlJyA/ICF0aGlzLnZpc2libGUgOiBhY3Rpb24uc2hvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGVUb2dnbGVTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRCYWNrZHJvcChzZXRCYWNrZHJvcDogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChzZXRCYWNrZHJvcCkge1xuICAgICAgdGhpcy5hY3RpdmVCYWNrZHJvcCA9IHRoaXMuYmFja2Ryb3BTZXJ2aWNlLnNldEJhY2tkcm9wKCdtb2RhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZUJhY2tkcm9wID0gdGhpcy5iYWNrZHJvcFNlcnZpY2UuY2xlYXJCYWNrZHJvcCh0aGlzLmFjdGl2ZUJhY2tkcm9wKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldEJvZHlTdHlsZXMob3BlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChvcGVuKSB7XG4gICAgICBpZiAodGhpcy5iYWNrZHJvcCA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZG9jdW1lbnQuYm9keSwgJ21vZGFsLW9wZW4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmRvY3VtZW50LmJvZHksICdtb2RhbC1vcGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRTdGF0aWNCYWNrZHJvcCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuaG9zdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ21vZGFsLXN0YXRpYycpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdvdmVyZmxvdy15JywgJ2hpZGRlbicpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnbW9kYWwtc3RhdGljJyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnb3ZlcmZsb3cteScpO1xuICAgICAgfSwgMzAwKTtcbiAgICB9XG4gIH1cbn1cbiIsIjxjLW1vZGFsLWRpYWxvZ1xuICBbYWxpZ25tZW50XT1cImFsaWdubWVudFwiXG4gIFtmdWxsc2NyZWVuXT1cImZ1bGxzY3JlZW5cIlxuICBbc2Nyb2xsYWJsZV09XCJzY3JvbGxhYmxlXCJcbiAgW3NpemVdPVwic2l6ZVwiPlxuICA8Yy1tb2RhbC1jb250ZW50PlxuICAgIDxkaXYgW2Nka1RyYXBGb2N1c109XCJ2aXNpYmxlXCIgW2Nka1RyYXBGb2N1c0F1dG9DYXB0dXJlXT1cInZpc2libGVcIiBzdHlsZT1cImRpc3BsYXk6IGNvbnRlbnRzO1wiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICA8L2MtbW9kYWwtY29udGVudD5cbjwvYy1tb2RhbC1kaWFsb2c+XG4iXX0=