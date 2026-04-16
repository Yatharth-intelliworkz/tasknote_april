import { Component, ContentChild, HostBinding, Input } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { CollapseDirective } from '../collapse';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/layout";
// todo: fix container prop issue not rendering children
// todo: workaround -  use <c-container> component directly in template
export class NavbarComponent {
    constructor(hostElement, breakpointObserver) {
        this.hostElement = hostElement;
        this.breakpointObserver = breakpointObserver;
        /**
         * Sets if the color of text should be colored for a light or dark dark background.
         */
        this.colorScheme = 'light';
        this.role = 'navigation';
    }
    get hostClasses() {
        const expandClassSuffix = this.expand === true ? '' : `-${this.expand}`;
        return {
            navbar: true,
            'navbar-light': this.colorScheme === 'light',
            'navbar-dark': this.colorScheme === 'dark',
            [`navbar-expand${expandClassSuffix}`]: !!this.expand,
            [`bg-${this.color}`]: !!this.color,
            [`${this.placement}`]: !!this.placement
        };
    }
    get containerClass() {
        return `container${this.container !== true ? '-' + this.container : ''}`;
    }
    get breakpoint() {
        if (typeof this.expand === 'string') {
            return getComputedStyle(this.hostElement.nativeElement).getPropertyValue(`--cui-breakpoint-${this.expand}`);
        }
        return false;
    }
    ngAfterContentInit() {
        if (this.breakpoint) {
            const onBreakpoint = `(min-width: ${this.breakpoint})`;
            this.breakpointObserver.observe([onBreakpoint]).subscribe(result => {
                if (this.collapse) {
                    const animate = this.collapse.animate;
                    this.collapse.toggle(false);
                    this.collapse.animate = false;
                    setTimeout(() => {
                        this.collapse.toggle(result.matches);
                        setTimeout(() => {
                            this.collapse.animate = animate;
                        });
                    });
                }
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NavbarComponent, deps: [{ token: i0.ElementRef }, { token: i1.BreakpointObserver }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.10", type: NavbarComponent, isStandalone: true, selector: "c-navbar", inputs: { color: "color", colorScheme: "colorScheme", container: "container", expand: "expand", placement: "placement", role: "role" }, host: { properties: { "attr.role": "this.role", "class": "this.hostClasses" } }, queries: [{ propertyName: "collapse", first: true, predicate: CollapseDirective, descendants: true }], ngImport: i0, template: "<ng-container *ngTemplateOutlet=\"container ? withContainerTemplate : noContainerTemplate\"></ng-container>\n\n<ng-template #withContainerTemplate>\n  <div [ngClass]=\"containerClass\">\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n\n<ng-template #noContainerTemplate>\n  <ng-content></ng-content>\n</ng-template>\n", dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NavbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'c-navbar', standalone: true, imports: [NgClass, NgTemplateOutlet], template: "<ng-container *ngTemplateOutlet=\"container ? withContainerTemplate : noContainerTemplate\"></ng-container>\n\n<ng-template #withContainerTemplate>\n  <div [ngClass]=\"containerClass\">\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n\n<ng-template #noContainerTemplate>\n  <ng-content></ng-content>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.BreakpointObserver }]; }, propDecorators: { color: [{
                type: Input
            }], colorScheme: [{
                type: Input
            }], container: [{
                type: Input
            }], expand: [{
                type: Input
            }], placement: [{
                type: Input
            }], collapse: [{
                type: ContentChild,
                args: [CollapseDirective]
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }, {
                type: Input
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2YmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmV1aS1hbmd1bGFyL3NyYy9saWIvbmF2YmFyL25hdmJhci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JldWktYW5ndWxhci9zcmMvbGliL25hdmJhci9uYXZiYXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFvQixTQUFTLEVBQUUsWUFBWSxFQUFjLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUcsT0FBTyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRzVELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7O0FBR2hELHdEQUF3RDtBQUN4RCx1RUFBdUU7QUFRdkUsTUFBTSxPQUFPLGVBQWU7SUE0QjFCLFlBQ1UsV0FBdUIsRUFDdkIsa0JBQXNDO1FBRHRDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3ZCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUF4QmhEOztXQUVHO1FBQ00sZ0JBQVcsR0FBc0IsT0FBTyxDQUFDO1FBaUJ6QyxTQUFJLEdBQUcsWUFBWSxDQUFDO0lBSzFCLENBQUM7SUFFSixJQUNJLFdBQVc7UUFDYixNQUFNLGlCQUFpQixHQUFXLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hGLE9BQU87WUFDTCxNQUFNLEVBQUUsSUFBSTtZQUNaLGNBQWMsRUFBRSxJQUFJLENBQUMsV0FBVyxLQUFLLE9BQU87WUFDNUMsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLEtBQUssTUFBTTtZQUMxQyxDQUFDLGdCQUFnQixpQkFBaUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQ3BELENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDbEMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUztTQUN4QyxDQUFDO0lBQ0osQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLFlBQVksSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUMzRSxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ25DLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDN0c7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLE1BQU0sWUFBWSxHQUFHLGVBQWUsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDakUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztvQkFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDOUIsVUFBVSxDQUFDLEdBQUcsRUFBRTt3QkFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3JDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7NEJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO3dCQUNsQyxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUMsQ0FBQztpQkFDSjtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOytHQTFFVSxlQUFlO21HQUFmLGVBQWUsbVVBdUJaLGlCQUFpQixnREN2Q2pDLHlVQVdBLDRDREdZLE9BQU8sb0ZBQUUsZ0JBQWdCOzs0RkFFeEIsZUFBZTtrQkFOM0IsU0FBUzsrQkFDRSxVQUFVLGNBRVIsSUFBSSxXQUNQLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDO2tJQU8zQixLQUFLO3NCQUFiLEtBQUs7Z0JBSUcsV0FBVztzQkFBbkIsS0FBSztnQkFJRyxTQUFTO3NCQUFqQixLQUFLO2dCQUlHLE1BQU07c0JBQWQsS0FBSztnQkFJRyxTQUFTO3NCQUFqQixLQUFLO2dCQUUyQixRQUFRO3NCQUF4QyxZQUFZO3VCQUFDLGlCQUFpQjtnQkFHdEIsSUFBSTtzQkFEWixXQUFXO3VCQUFDLFdBQVc7O3NCQUN2QixLQUFLO2dCQVFGLFdBQVc7c0JBRGQsV0FBVzt1QkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdDbGFzcywgTmdUZW1wbGF0ZU91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBCcmVha3BvaW50T2JzZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcblxuaW1wb3J0IHsgQ29sbGFwc2VEaXJlY3RpdmUgfSBmcm9tICcuLi9jb2xsYXBzZSc7XG5pbXBvcnQgeyBDb2xvcnMgfSBmcm9tICcuLi9jb3JldWkudHlwZXMnO1xuXG4vLyB0b2RvOiBmaXggY29udGFpbmVyIHByb3AgaXNzdWUgbm90IHJlbmRlcmluZyBjaGlsZHJlblxuLy8gdG9kbzogd29ya2Fyb3VuZCAtICB1c2UgPGMtY29udGFpbmVyPiBjb21wb25lbnQgZGlyZWN0bHkgaW4gdGVtcGxhdGVcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYy1uYXZiYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmF2YmFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW05nQ2xhc3MsIE5nVGVtcGxhdGVPdXRsZXRdXG59KVxuZXhwb3J0IGNsYXNzIE5hdmJhckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAvKipcbiAgICogU2V0cyB0aGUgY29sb3IgY29udGV4dCBvZiB0aGUgY29tcG9uZW50IHRvIG9uZSBvZiBDb3JlVUnigJlzIHRoZW1lZCBjb2xvcnMuXG4gICAqIEB0eXBlIENvbG9yc1xuICAgKi9cbiAgQElucHV0KCkgY29sb3I/OiBDb2xvcnM7XG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjb2xvciBvZiB0ZXh0IHNob3VsZCBiZSBjb2xvcmVkIGZvciBhIGxpZ2h0IG9yIGRhcmsgZGFyayBiYWNrZ3JvdW5kLlxuICAgKi9cbiAgQElucHV0KCkgY29sb3JTY2hlbWU/OiAnZGFyaycgfCAnbGlnaHQnID0gJ2xpZ2h0JztcbiAgLyoqXG4gICAqIERlZmluZXMgb3B0aW9uYWwgY29udGFpbmVyIHdyYXBwaW5nIGNoaWxkcmVuIGVsZW1lbnRzLlxuICAgKi9cbiAgQElucHV0KCkgY29udGFpbmVyPzogYm9vbGVhbiB8ICdzbScgfCAnbWQnIHwgJ2xnJyB8ICd4bCcgfCAneHhsJyB8ICdmbHVpZCc7XG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSByZXNwb25zaXZlIGJyZWFrcG9pbnQgdG8gZGV0ZXJtaW5lIHdoZW4gY29udGVudCBjb2xsYXBzZXMuXG4gICAqL1xuICBASW5wdXQoKSBleHBhbmQ/OiBib29sZWFuIHwgJ3NtJyB8ICdtZCcgfCAnbGcnIHwgJ3hsJyB8ICd4eGwnO1xuICAvKipcbiAgICogUGxhY2UgY29tcG9uZW50IGluIG5vbi1zdGF0aWMgcG9zaXRpb25zLlxuICAgKi9cbiAgQElucHV0KCkgcGxhY2VtZW50PzogJ2ZpeGVkLXRvcCcgfCAnZml4ZWQtYm90dG9tJyB8ICdzdGlja3ktdG9wJztcblxuICBAQ29udGVudENoaWxkKENvbGxhcHNlRGlyZWN0aXZlKSBjb2xsYXBzZSE6IENvbGxhcHNlRGlyZWN0aXZlO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcbiAgQElucHV0KCkgcm9sZSA9ICduYXZpZ2F0aW9uJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGhvc3RFbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgYnJlYWtwb2ludE9ic2VydmVyOiBCcmVha3BvaW50T2JzZXJ2ZXJcbiAgKSB7fVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgaG9zdENsYXNzZXMoKTogYW55IHtcbiAgICBjb25zdCBleHBhbmRDbGFzc1N1ZmZpeDogc3RyaW5nID0gdGhpcy5leHBhbmQgPT09IHRydWUgPyAnJyA6IGAtJHt0aGlzLmV4cGFuZH1gO1xuICAgIHJldHVybiB7XG4gICAgICBuYXZiYXI6IHRydWUsXG4gICAgICAnbmF2YmFyLWxpZ2h0JzogdGhpcy5jb2xvclNjaGVtZSA9PT0gJ2xpZ2h0JyxcbiAgICAgICduYXZiYXItZGFyayc6IHRoaXMuY29sb3JTY2hlbWUgPT09ICdkYXJrJyxcbiAgICAgIFtgbmF2YmFyLWV4cGFuZCR7ZXhwYW5kQ2xhc3NTdWZmaXh9YF06ICEhdGhpcy5leHBhbmQsXG4gICAgICBbYGJnLSR7dGhpcy5jb2xvcn1gXTogISF0aGlzLmNvbG9yLFxuICAgICAgW2Ake3RoaXMucGxhY2VtZW50fWBdOiAhIXRoaXMucGxhY2VtZW50XG4gICAgfTtcbiAgfVxuXG4gIGdldCBjb250YWluZXJDbGFzcygpOiBzdHJpbmcge1xuICAgIHJldHVybiBgY29udGFpbmVyJHt0aGlzLmNvbnRhaW5lciAhPT0gdHJ1ZSA/ICctJyArIHRoaXMuY29udGFpbmVyIDogJyd9YDtcbiAgfVxuXG4gIGdldCBicmVha3BvaW50KCk6IHN0cmluZyB8IGJvb2xlYW4ge1xuICAgIGlmICh0eXBlb2YgdGhpcy5leHBhbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoYC0tY3VpLWJyZWFrcG9pbnQtJHt0aGlzLmV4cGFuZH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmJyZWFrcG9pbnQpIHtcbiAgICAgIGNvbnN0IG9uQnJlYWtwb2ludCA9IGAobWluLXdpZHRoOiAke3RoaXMuYnJlYWtwb2ludH0pYDtcbiAgICAgIHRoaXMuYnJlYWtwb2ludE9ic2VydmVyLm9ic2VydmUoW29uQnJlYWtwb2ludF0pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZSkge1xuICAgICAgICAgIGNvbnN0IGFuaW1hdGUgPSB0aGlzLmNvbGxhcHNlLmFuaW1hdGU7XG4gICAgICAgICAgdGhpcy5jb2xsYXBzZS50b2dnbGUoZmFsc2UpO1xuICAgICAgICAgIHRoaXMuY29sbGFwc2UuYW5pbWF0ZSA9IGZhbHNlO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZS50b2dnbGUocmVzdWx0Lm1hdGNoZXMpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuY29sbGFwc2UuYW5pbWF0ZSA9IGFuaW1hdGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCI8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGFpbmVyID8gd2l0aENvbnRhaW5lclRlbXBsYXRlIDogbm9Db250YWluZXJUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuXG48bmctdGVtcGxhdGUgI3dpdGhDb250YWluZXJUZW1wbGF0ZT5cbiAgPGRpdiBbbmdDbGFzc109XCJjb250YWluZXJDbGFzc1wiPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI25vQ29udGFpbmVyVGVtcGxhdGU+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvbmctdGVtcGxhdGU+XG4iXX0=