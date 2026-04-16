import { Component, EventEmitter, HostBinding, HostListener, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { filter } from 'rxjs/operators';
import { A11yModule } from '@angular/cdk/a11y';
import * as i0 from "@angular/core";
import * as i1 from "../offcanvas.service";
import * as i2 from "../../backdrop/backdrop.service";
import * as i3 from "@angular/cdk/layout";
import * as i4 from "@angular/cdk/a11y";
let nextId = 0;
export class OffcanvasComponent {
    constructor(document, platformId, renderer, hostElement, offcanvasService, backdropService, breakpointObserver) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.hostElement = hostElement;
        this.offcanvasService = offcanvasService;
        this.backdropService = backdropService;
        this.breakpointObserver = breakpointObserver;
        /**
         * Apply a backdrop on body while offcanvas is open.
         * @type boolean | 'static'
         * @default true
         */
        this.backdrop = true;
        /**
         * Closes the offcanvas when escape key is pressed [docs]
         * @type boolean
         * @default true
         */
        this.keyboard = true;
        /**
         * Components placement, there’s no default placement.
         * @type {'start' | 'end' | 'top' | 'bottom'}
         * @default 'start'
         */
        this.placement = 'start';
        /**
         * Responsive offcanvas property hides content outside the viewport from a specified breakpoint and down.
         * @type boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
         * @default true
         * @since 4.3.10
         */
        this.responsive = true;
        this.id = `offcanvas-${this.placement}-${nextId++}`;
        /**
         * Default role for offcanvas. [docs]
         * @type string
         * @default 'dialog'
         */
        this.role = 'dialog';
        /**
         * Set aria-modal html attr for offcanvas. [docs]
         * @type boolean
         * @default true
         */
        this.ariaModal = true;
        /**
         * Event triggered on visible change.
         */
        this.visibleChange = new EventEmitter();
        this.#scroll = false;
        this.#visible = false;
        this.#show = false;
    }
    #scroll;
    #visible;
    #activeBackdrop;
    #scrollbarWidth;
    #stateToggleSubscription;
    #backdropClickSubscription;
    #layoutChangeSubscription;
    #show;
    get scroll() {
        return this.#scroll;
    }
    /**
     * Allow body scrolling while offcanvas is visible.
     * @type boolean
     * @default false
     */
    set scroll(value) {
        this.#scroll = coerceBooleanProperty(value);
    }
    get visible() {
        return this.#visible;
    }
    /**
     * Toggle the visibility of offcanvas component.
     * @type boolean
     * @default false
     */
    set visible(value) {
        this.#visible = coerceBooleanProperty(value);
        if (this.#visible) {
            this.setBackdrop(this.backdrop);
            this.setFocus();
        }
        else {
            this.setBackdrop(false);
        }
        this.layoutChangeSubscribe(this.#visible);
        this.visibleChange.emit(value);
    }
    get hostClasses() {
        return {
            offcanvas: typeof this.responsive === 'boolean',
            [`offcanvas-${this.responsive}`]: typeof this.responsive !== 'boolean',
            [`offcanvas-${this.placement}`]: !!this.placement,
            show: this.show
        };
    }
    get ariaHidden() {
        return this.visible ? null : true;
    }
    get tabIndex() {
        return '-1';
    }
    get animateTrigger() {
        return this.visible ? 'visible' : 'hidden';
    }
    get show() {
        return this.visible && this.#show;
    }
    set show(value) {
        this.#show = value;
    }
    get responsiveBreakpoint() {
        if (typeof this.responsive !== 'string') {
            return false;
        }
        const element = this.document.documentElement;
        const responsiveBreakpoint = this.responsive;
        const breakpointValue = getComputedStyle(element).getPropertyValue(`--cui-breakpoint-${responsiveBreakpoint.trim()}`) || false;
        return breakpointValue ? `${parseFloat(breakpointValue.trim()) - 0.02}px` : false;
    }
    animateStart(event) {
        const scrollbarWidth = this.#scrollbarWidth;
        if (event.toState === 'visible') {
            if (!this.scroll) {
                this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
                this.renderer.setStyle(this.document.body, 'padding-right', scrollbarWidth);
            }
            this.renderer.addClass(this.hostElement.nativeElement, 'showing');
        }
        else {
            this.renderer.addClass(this.hostElement.nativeElement, 'hiding');
        }
    }
    animateDone(event) {
        setTimeout(() => {
            if (event.toState === 'visible') {
                this.renderer.removeClass(this.hostElement.nativeElement, 'showing');
            }
            if (event.toState === 'hidden') {
                this.renderer.removeClass(this.hostElement.nativeElement, 'hiding');
                this.renderer.removeStyle(this.document.body, 'overflow');
                this.renderer.removeStyle(this.document.body, 'paddingRight');
            }
        });
        this.show = this.visible;
    }
    onKeyDownHandler(event) {
        if (event.key === 'Escape' &&
            this.keyboard &&
            this.visible &&
            this.backdrop !== 'static') {
            this.offcanvasService.toggle({ show: false, id: this.id });
        }
    }
    ngOnInit() {
        this.#scrollbarWidth = this.backdropService.scrollbarWidth;
        this.stateToggleSubscribe();
        setTimeout(() => {
            // hotfix to avoid offcanvas flicker on the first render
            this.renderer.setStyle(this.hostElement.nativeElement, 'display', 'flex');
        });
    }
    ngOnDestroy() {
        this.offcanvasService.toggle({ show: false, id: this.id });
        this.stateToggleSubscribe(false);
    }
    setFocus() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => this.hostElement.nativeElement.focus());
        }
    }
    stateToggleSubscribe(subscribe = true) {
        if (subscribe) {
            this.#stateToggleSubscription =
                this.offcanvasService.offcanvasState$.subscribe((action) => {
                    if (this === action.offcanvas || this.id === action.id) {
                        if ('show' in action) {
                            this.visible =
                                action?.show === 'toggle' ? !this.visible : action.show;
                        }
                    }
                });
        }
        else {
            this.#stateToggleSubscription?.unsubscribe();
        }
    }
    backdropClickSubscribe(subscribe = true) {
        if (subscribe) {
            this.#backdropClickSubscription =
                this.backdropService.backdropClick$.subscribe((clicked) => {
                    this.offcanvasService.toggle({ show: !clicked, id: this.id });
                });
        }
        else {
            this.#backdropClickSubscription?.unsubscribe();
        }
    }
    setBackdrop(setBackdrop) {
        this.#scrollbarWidth = this.backdropService.scrollbarWidth;
        this.#activeBackdrop = !!setBackdrop ? this.backdropService.setBackdrop('offcanvas')
            : this.backdropService.clearBackdrop(this.#activeBackdrop);
        setBackdrop === true ? this.backdropClickSubscribe()
            : this.backdropClickSubscribe(false);
    }
    layoutChangeSubscribe(subscribe = true) {
        if (subscribe) {
            if (!this.responsiveBreakpoint) {
                return;
            }
            const responsiveBreakpoint = `(max-width: ${this.responsiveBreakpoint})`;
            const layoutChanges = this.breakpointObserver.observe([responsiveBreakpoint]);
            this.#layoutChangeSubscription = layoutChanges
                .pipe(filter(breakpointState => !breakpointState.matches))
                .subscribe((breakpointState) => {
                this.visible = breakpointState.matches;
            });
        }
        else {
            this.#layoutChangeSubscription?.unsubscribe();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: OffcanvasComponent, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1.OffcanvasService }, { token: i2.BackdropService }, { token: i3.BreakpointObserver }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.10", type: OffcanvasComponent, isStandalone: true, selector: "c-offcanvas", inputs: { backdrop: "backdrop", keyboard: "keyboard", placement: "placement", responsive: "responsive", id: "id", role: "role", ariaModal: "ariaModal", scroll: "scroll", visible: "visible" }, outputs: { visibleChange: "visibleChange" }, host: { listeners: { "@showHide.start": "animateStart($event)", "@showHide.done": "animateDone($event)", "document:keydown": "onKeyDownHandler($event)" }, properties: { "attr.role": "this.role", "attr.aria-modal": "this.ariaModal", "class": "this.hostClasses", "attr.aria-hidden": "this.ariaHidden", "attr.tabindex": "this.tabIndex", "@showHide": "this.animateTrigger" } }, exportAs: ["cOffcanvas"], ngImport: i0, template: "<div cdkTrapFocus cdkTrapFocusAutoCapture>\n  <ng-content></ng-content>\n</div>\n\n", styles: [":host{display:none}\n"], dependencies: [{ kind: "ngmodule", type: A11yModule }, { kind: "directive", type: i4.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }], animations: [
            trigger('showHide', [
                state('visible', style({
                // visibility: 'visible'
                })),
                state('hidden', style({
                // visibility: 'hidden'
                })),
                transition('visible <=> *', [animate('300ms')])
            ])
        ] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: OffcanvasComponent, decorators: [{
            type: Component,
            args: [{ selector: 'c-offcanvas', animations: [
                        trigger('showHide', [
                            state('visible', style({
                            // visibility: 'visible'
                            })),
                            state('hidden', style({
                            // visibility: 'hidden'
                            })),
                            transition('visible <=> *', [animate('300ms')])
                        ])
                    ], exportAs: 'cOffcanvas', standalone: true, imports: [A11yModule], template: "<div cdkTrapFocus cdkTrapFocusAutoCapture>\n  <ng-content></ng-content>\n</div>\n\n", styles: [":host{display:none}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1.OffcanvasService }, { type: i2.BackdropService }, { type: i3.BreakpointObserver }]; }, propDecorators: { backdrop: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], placement: [{
                type: Input
            }], responsive: [{
                type: Input
            }], id: [{
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
            }], visibleChange: [{
                type: Output
            }], scroll: [{
                type: Input
            }], visible: [{
                type: Input
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
                args: ['document:keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmV1aS1hbmd1bGFyL3NyYy9saWIvb2ZmY2FudmFzL29mZmNhbnZhcy9vZmZjYW52YXMuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZXVpLWFuZ3VsYXIvc3JjL2xpYi9vZmZjYW52YXMvb2ZmY2FudmFzL29mZmNhbnZhcy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULFlBQVksRUFDWixXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUNOLFdBQVcsRUFFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDOUQsT0FBTyxFQUFFLE9BQU8sRUFBa0IsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakcsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRzVFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUl4QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7OztBQUUvQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUEyQmYsTUFBTSxPQUFPLGtCQUFrQjtJQUU3QixZQUM0QixRQUFrQixFQUNmLFVBQWUsRUFDcEMsUUFBbUIsRUFDbkIsV0FBdUIsRUFDdkIsZ0JBQWtDLEVBQ2xDLGVBQWdDLEVBQ2hDLGtCQUFzQztRQU5wQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2YsZUFBVSxHQUFWLFVBQVUsQ0FBSztRQUNwQyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25C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QixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgYW5pbWF0ZSwgQW5pbWF0aW9uRXZlbnQsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgQnJlYWtwb2ludE9ic2VydmVyLCBCcmVha3BvaW50U3RhdGUgfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBCYWNrZHJvcFNlcnZpY2UgfSBmcm9tICcuLi8uLi9iYWNrZHJvcC9iYWNrZHJvcC5zZXJ2aWNlJztcbmltcG9ydCB7IE9mZmNhbnZhc1NlcnZpY2UgfSBmcm9tICcuLi9vZmZjYW52YXMuc2VydmljZSc7XG5pbXBvcnQgeyBBMTF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuXG5sZXQgbmV4dElkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYy1vZmZjYW52YXMnLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcignc2hvd0hpZGUnLCBbXG4gICAgICBzdGF0ZShcbiAgICAgICAgJ3Zpc2libGUnLFxuICAgICAgICBzdHlsZSh7XG4gICAgICAgICAgLy8gdmlzaWJpbGl0eTogJ3Zpc2libGUnXG4gICAgICAgIH0pXG4gICAgICApLFxuICAgICAgc3RhdGUoXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICBzdHlsZSh7XG4gICAgICAgICAgLy8gdmlzaWJpbGl0eTogJ2hpZGRlbidcbiAgICAgICAgfSlcbiAgICAgICksXG4gICAgICB0cmFuc2l0aW9uKCd2aXNpYmxlIDw9PiAqJywgW2FuaW1hdGUoJzMwMG1zJyldKVxuICAgIF0pXG4gIF0sXG4gIHRlbXBsYXRlVXJsOiAnLi9vZmZjYW52YXMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vZmZjYW52YXMuY29tcG9uZW50LnNjc3MnXSxcbiAgZXhwb3J0QXM6ICdjT2ZmY2FudmFzJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0ExMXlNb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIE9mZmNhbnZhc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCxcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBob3N0RWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIG9mZmNhbnZhc1NlcnZpY2U6IE9mZmNhbnZhc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBiYWNrZHJvcFNlcnZpY2U6IEJhY2tkcm9wU2VydmljZSxcbiAgICBwcml2YXRlIGJyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyXG4gICkge31cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2Nyb2xsOiBCb29sZWFuSW5wdXQ7XG4gIC8qKlxuICAgKiBBcHBseSBhIGJhY2tkcm9wIG9uIGJvZHkgd2hpbGUgb2ZmY2FudmFzIGlzIG9wZW4uXG4gICAqIEB0eXBlIGJvb2xlYW4gfCAnc3RhdGljJ1xuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBASW5wdXQoKSBiYWNrZHJvcDogYm9vbGVhbiB8ICdzdGF0aWMnID0gdHJ1ZTtcblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBvZmZjYW52YXMgd2hlbiBlc2NhcGUga2V5IGlzIHByZXNzZWQgW2RvY3NdXG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgQElucHV0KCkga2V5Ym9hcmQgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBDb21wb25lbnRzIHBsYWNlbWVudCwgdGhlcmXigJlzIG5vIGRlZmF1bHQgcGxhY2VtZW50LlxuICAgKiBAdHlwZSB7J3N0YXJ0JyB8ICdlbmQnIHwgJ3RvcCcgfCAnYm90dG9tJ31cbiAgICogQGRlZmF1bHQgJ3N0YXJ0J1xuICAgKi9cbiAgQElucHV0KCkgcGxhY2VtZW50OiBzdHJpbmcgfCAnc3RhcnQnIHwgJ2VuZCcgfCAndG9wJyB8ICdib3R0b20nID0gJ3N0YXJ0JztcblxuICAvKipcbiAgICogUmVzcG9uc2l2ZSBvZmZjYW52YXMgcHJvcGVydHkgaGlkZXMgY29udGVudCBvdXRzaWRlIHRoZSB2aWV3cG9ydCBmcm9tIGEgc3BlY2lmaWVkIGJyZWFrcG9pbnQgYW5kIGRvd24uXG4gICAqIEB0eXBlIGJvb2xlYW4gfCAnc20nIHwgJ21kJyB8ICdsZycgfCAneGwnIHwgJ3h4bCc7XG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICogQHNpbmNlIDQuMy4xMFxuICAgKi9cbiAgQElucHV0KCkgcmVzcG9uc2l2ZT86IGJvb2xlYW4gfCAnc20nIHwgJ21kJyB8ICdsZycgfCAneGwnIHwgJ3h4bCcgPSB0cnVlO1xuICBASW5wdXQoKSBpZCA9IGBvZmZjYW52YXMtJHt0aGlzLnBsYWNlbWVudH0tJHtuZXh0SWQrK31gO1xuICAvKipcbiAgICogRGVmYXVsdCByb2xlIGZvciBvZmZjYW52YXMuIFtkb2NzXVxuICAgKiBAdHlwZSBzdHJpbmdcbiAgICogQGRlZmF1bHQgJ2RpYWxvZydcbiAgICovXG4gIEBJbnB1dCgpIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJykgcm9sZSA9ICdkaWFsb2cnO1xuICAvKipcbiAgICogU2V0IGFyaWEtbW9kYWwgaHRtbCBhdHRyIGZvciBvZmZjYW52YXMuIFtkb2NzXVxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIEBJbnB1dCgpIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLW1vZGFsJykgYXJpYU1vZGFsID0gdHJ1ZTtcbiAgLyoqXG4gICAqIEV2ZW50IHRyaWdnZXJlZCBvbiB2aXNpYmxlIGNoYW5nZS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2aXNpYmxlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICAjc2Nyb2xsID0gZmFsc2U7XG4gICN2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG4gICNhY3RpdmVCYWNrZHJvcCE6IEhUTUxEaXZFbGVtZW50O1xuICAjc2Nyb2xsYmFyV2lkdGghOiBzdHJpbmc7XG4gICNzdGF0ZVRvZ2dsZVN1YnNjcmlwdGlvbiE6IFN1YnNjcmlwdGlvbjtcbiAgI2JhY2tkcm9wQ2xpY2tTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XG4gICNsYXlvdXRDaGFuZ2VTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XG4gICNzaG93ID0gZmFsc2U7XG5cbiAgZ2V0IHNjcm9sbCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc2Nyb2xsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IGJvZHkgc2Nyb2xsaW5nIHdoaWxlIG9mZmNhbnZhcyBpcyB2aXNpYmxlLlxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgc2Nyb2xsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy4jc2Nyb2xsID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLiN2aXNpYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiBvZmZjYW52YXMgY29tcG9uZW50LlxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgdmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuI3Zpc2libGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIGlmICh0aGlzLiN2aXNpYmxlKSB7XG4gICAgICB0aGlzLnNldEJhY2tkcm9wKHRoaXMuYmFja2Ryb3ApO1xuICAgICAgdGhpcy5zZXRGb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEJhY2tkcm9wKGZhbHNlKTtcbiAgICB9XG4gICAgdGhpcy5sYXlvdXRDaGFuZ2VTdWJzY3JpYmUodGhpcy4jdmlzaWJsZSk7XG4gICAgdGhpcy52aXNpYmxlQ2hhbmdlLmVtaXQodmFsdWUpO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBob3N0Q2xhc3NlcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBvZmZjYW52YXM6IHR5cGVvZiB0aGlzLnJlc3BvbnNpdmUgPT09ICdib29sZWFuJyxcbiAgICAgIFtgb2ZmY2FudmFzLSR7dGhpcy5yZXNwb25zaXZlfWBdOiB0eXBlb2YgdGhpcy5yZXNwb25zaXZlICE9PSAnYm9vbGVhbicsXG4gICAgICBbYG9mZmNhbnZhcy0ke3RoaXMucGxhY2VtZW50fWBdOiAhIXRoaXMucGxhY2VtZW50LFxuICAgICAgc2hvdzogdGhpcy5zaG93XG4gICAgfTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWhpZGRlbicpXG4gIGdldCBhcmlhSGlkZGVuKCk6IGJvb2xlYW4gfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy52aXNpYmxlID8gbnVsbCA6IHRydWU7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2F0dHIudGFiaW5kZXgnKVxuICBnZXQgdGFiSW5kZXgoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuICctMSc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ0BzaG93SGlkZScpXG4gIGdldCBhbmltYXRlVHJpZ2dlcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZpc2libGUgPyAndmlzaWJsZScgOiAnaGlkZGVuJztcbiAgfVxuXG4gIGdldCBzaG93KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnZpc2libGUgJiYgdGhpcy4jc2hvdztcbiAgfVxuXG4gIHNldCBzaG93KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy4jc2hvdyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHJlc3BvbnNpdmVCcmVha3BvaW50KCk6IHN0cmluZyB8IGZhbHNlIHtcbiAgICBpZiAodHlwZW9mIHRoaXMucmVzcG9uc2l2ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgZWxlbWVudDogRWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIGNvbnN0IHJlc3BvbnNpdmVCcmVha3BvaW50ID0gdGhpcy5yZXNwb25zaXZlO1xuICAgIGNvbnN0IGJyZWFrcG9pbnRWYWx1ZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShgLS1jdWktYnJlYWtwb2ludC0ke3Jlc3BvbnNpdmVCcmVha3BvaW50LnRyaW0oKX1gKSB8fCBmYWxzZTtcbiAgICByZXR1cm4gYnJlYWtwb2ludFZhbHVlID8gYCR7cGFyc2VGbG9hdChicmVha3BvaW50VmFsdWUudHJpbSgpKSAtIDAuMDJ9cHhgIDogZmFsc2U7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdAc2hvd0hpZGUuc3RhcnQnLCBbJyRldmVudCddKVxuICBhbmltYXRlU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgY29uc3Qgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLiNzY3JvbGxiYXJXaWR0aDtcbiAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5kb2N1bWVudC5ib2R5LCAnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5kb2N1bWVudC5ib2R5LCAncGFkZGluZy1yaWdodCcsIHNjcm9sbGJhcldpZHRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnc2hvd2luZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuaG9zdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2hpZGluZycpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ0BzaG93SGlkZS5kb25lJywgWyckZXZlbnQnXSlcbiAgYW5pbWF0ZURvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnc2hvd2luZycpO1xuICAgICAgfVxuICAgICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnaGlkaW5nJyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5kb2N1bWVudC5ib2R5LCAnb3ZlcmZsb3cnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVTdHlsZSh0aGlzLmRvY3VtZW50LmJvZHksICdwYWRkaW5nUmlnaHQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnNob3cgPSB0aGlzLnZpc2libGU7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlkb3duJywgWyckZXZlbnQnXSlcbiAgb25LZXlEb3duSGFuZGxlcihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIGV2ZW50LmtleSA9PT0gJ0VzY2FwZScgJiZcbiAgICAgIHRoaXMua2V5Ym9hcmQgJiZcbiAgICAgIHRoaXMudmlzaWJsZSAmJlxuICAgICAgdGhpcy5iYWNrZHJvcCAhPT0gJ3N0YXRpYydcbiAgICApIHtcbiAgICAgIHRoaXMub2ZmY2FudmFzU2VydmljZS50b2dnbGUoeyBzaG93OiBmYWxzZSwgaWQ6IHRoaXMuaWQgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy4jc2Nyb2xsYmFyV2lkdGggPSB0aGlzLmJhY2tkcm9wU2VydmljZS5zY3JvbGxiYXJXaWR0aDtcbiAgICB0aGlzLnN0YXRlVG9nZ2xlU3Vic2NyaWJlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBob3RmaXggdG8gYXZvaWQgb2ZmY2FudmFzIGZsaWNrZXIgb24gdGhlIGZpcnN0IHJlbmRlclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgJ2ZsZXgnKTtcbiAgICB9KVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5vZmZjYW52YXNTZXJ2aWNlLnRvZ2dsZSh7IHNob3c6IGZhbHNlLCBpZDogdGhpcy5pZCB9KTtcbiAgICB0aGlzLnN0YXRlVG9nZ2xlU3Vic2NyaWJlKGZhbHNlKTtcbiAgfVxuXG4gIHNldEZvY3VzKCk6IHZvaWQge1xuICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaG9zdEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRlVG9nZ2xlU3Vic2NyaWJlKHN1YnNjcmliZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBpZiAoc3Vic2NyaWJlKSB7XG4gICAgICB0aGlzLiNzdGF0ZVRvZ2dsZVN1YnNjcmlwdGlvbiA9XG4gICAgICAgIHRoaXMub2ZmY2FudmFzU2VydmljZS5vZmZjYW52YXNTdGF0ZSQuc3Vic2NyaWJlKChhY3Rpb24pID0+IHtcbiAgICAgICAgICBpZiAodGhpcyA9PT0gYWN0aW9uLm9mZmNhbnZhcyB8fCB0aGlzLmlkID09PSBhY3Rpb24uaWQpIHtcbiAgICAgICAgICAgIGlmICgnc2hvdycgaW4gYWN0aW9uKSB7XG4gICAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9XG4gICAgICAgICAgICAgICAgYWN0aW9uPy5zaG93ID09PSAndG9nZ2xlJyA/ICF0aGlzLnZpc2libGUgOiBhY3Rpb24uc2hvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNzdGF0ZVRvZ2dsZVN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGJhY2tkcm9wQ2xpY2tTdWJzY3JpYmUoc3Vic2NyaWJlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChzdWJzY3JpYmUpIHtcbiAgICAgIHRoaXMuI2JhY2tkcm9wQ2xpY2tTdWJzY3JpcHRpb24gPVxuICAgICAgICB0aGlzLmJhY2tkcm9wU2VydmljZS5iYWNrZHJvcENsaWNrJC5zdWJzY3JpYmUoKGNsaWNrZWQpID0+IHtcbiAgICAgICAgICB0aGlzLm9mZmNhbnZhc1NlcnZpY2UudG9nZ2xlKHsgc2hvdzogIWNsaWNrZWQsIGlkOiB0aGlzLmlkIH0pO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jYmFja2Ryb3BDbGlja1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldEJhY2tkcm9wKHNldEJhY2tkcm9wOiBib29sZWFuIHwgJ3N0YXRpYycpOiB2b2lkIHtcbiAgICB0aGlzLiNzY3JvbGxiYXJXaWR0aCA9IHRoaXMuYmFja2Ryb3BTZXJ2aWNlLnNjcm9sbGJhcldpZHRoO1xuICAgIHRoaXMuI2FjdGl2ZUJhY2tkcm9wID0gISFzZXRCYWNrZHJvcCA/IHRoaXMuYmFja2Ryb3BTZXJ2aWNlLnNldEJhY2tkcm9wKCdvZmZjYW52YXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMuYmFja2Ryb3BTZXJ2aWNlLmNsZWFyQmFja2Ryb3AodGhpcy4jYWN0aXZlQmFja2Ryb3ApO1xuICAgIHNldEJhY2tkcm9wID09PSB0cnVlID8gdGhpcy5iYWNrZHJvcENsaWNrU3Vic2NyaWJlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMuYmFja2Ryb3BDbGlja1N1YnNjcmliZShmYWxzZSk7XG4gIH1cblxuICBwcml2YXRlIGxheW91dENoYW5nZVN1YnNjcmliZShzdWJzY3JpYmU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG5cbiAgICBpZiAoc3Vic2NyaWJlKSB7XG5cbiAgICAgIGlmICghdGhpcy5yZXNwb25zaXZlQnJlYWtwb2ludCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNpdmVCcmVha3BvaW50ID0gYChtYXgtd2lkdGg6ICR7dGhpcy5yZXNwb25zaXZlQnJlYWtwb2ludH0pYDtcblxuICAgICAgY29uc3QgbGF5b3V0Q2hhbmdlcyA9IHRoaXMuYnJlYWtwb2ludE9ic2VydmVyLm9ic2VydmUoW3Jlc3BvbnNpdmVCcmVha3BvaW50XSk7XG5cbiAgICAgIHRoaXMuI2xheW91dENoYW5nZVN1YnNjcmlwdGlvbiA9IGxheW91dENoYW5nZXNcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgZmlsdGVyKGJyZWFrcG9pbnRTdGF0ZSA9PiAhYnJlYWtwb2ludFN0YXRlLm1hdGNoZXMpXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICAoYnJlYWtwb2ludFN0YXRlOiBCcmVha3BvaW50U3RhdGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IGJyZWFrcG9pbnRTdGF0ZS5tYXRjaGVzO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jbGF5b3V0Q2hhbmdlU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiPGRpdiBjZGtUcmFwRm9jdXMgY2RrVHJhcEZvY3VzQXV0b0NhcHR1cmU+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvZGl2PlxuXG4iXX0=