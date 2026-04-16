import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { HtmlAttributesDirective } from '../../shared';
import { SidebarNavBadgePipe } from './sidebar-nav-badge.pipe';
import * as i0 from "@angular/core";
import * as i1 from "./sidebar-nav.service";
export class SidebarNavLabelComponent {
    constructor(helper) {
        this.helper = helper;
        this.classes = {
            'c-nav-label': true,
            'c-active': true
        };
        this.iconClasses = {};
    }
    ngOnInit() {
        this.iconClasses = this.helper.getIconClass(this.item);
    }
    getItemClass() {
        const itemClass = this.item.class;
        // @ts-ignore
        this.classes[itemClass] = !!itemClass;
        return this.classes;
    }
    getLabelIconClass() {
        const variant = `text-${this.item.label.variant}`;
        // @ts-ignore
        this.iconClasses[variant] = !!this.item.label.variant;
        const labelClass = this.item.label.class;
        // @ts-ignore
        this.iconClasses[labelClass] = !!labelClass;
        return this.iconClasses;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: SidebarNavLabelComponent, deps: [{ token: i1.SidebarNavHelper }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.10", type: SidebarNavLabelComponent, isStandalone: true, selector: "c-sidebar-nav-label", inputs: { item: "item" }, ngImport: i0, template: "<a [ngClass]=\"getItemClass()\"\n   href=\"{{item.url}}\"\n   [cHtmlAttr]=\"item.attributes\">\n  <i *ngIf=\"helper.hasIcon(item)\" [ngClass]=\"getLabelIconClass()\"></i>\n  <ng-container>{{ item.name }}</ng-container>\n  <span *ngIf=\"helper.hasBadge(item)\" [ngClass]=\"item | cSidebarNavBadge\">{{ item.badge.text }}</span>\n</a>\n", dependencies: [{ kind: "directive", type: HtmlAttributesDirective, selector: "[cHtmlAttr]", inputs: ["cHtmlAttr"], exportAs: ["cHtmlAttr"] }, { kind: "pipe", type: SidebarNavBadgePipe, name: "cSidebarNavBadge" }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: SidebarNavLabelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'c-sidebar-nav-label', standalone: true, imports: [HtmlAttributesDirective, SidebarNavBadgePipe, NgClass, NgIf], template: "<a [ngClass]=\"getItemClass()\"\n   href=\"{{item.url}}\"\n   [cHtmlAttr]=\"item.attributes\">\n  <i *ngIf=\"helper.hasIcon(item)\" [ngClass]=\"getLabelIconClass()\"></i>\n  <ng-container>{{ item.name }}</ng-container>\n  <span *ngIf=\"helper.hasBadge(item)\" [ngClass]=\"item | cSidebarNavBadge\">{{ item.badge.text }}</span>\n</a>\n" }]
        }], ctorParameters: function () { return [{ type: i1.SidebarNavHelper }]; }, propDecorators: { item: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZWJhci1uYXYtbGFiZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZXVpLWFuZ3VsYXIvc3JjL2xpYi9zaWRlYmFyL3NpZGViYXItbmF2L3NpZGViYXItbmF2LWxhYmVsLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmV1aS1hbmd1bGFyL3NyYy9saWIvc2lkZWJhci9zaWRlYmFyLW5hdi9zaWRlYmFyLW5hdi1sYWJlbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRWhELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV2RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7O0FBUS9ELE1BQU0sT0FBTyx3QkFBd0I7SUFFbkMsWUFDUyxNQUF3QjtRQUF4QixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUt6QixZQUFPLEdBQUc7WUFDaEIsYUFBYSxFQUFFLElBQUk7WUFDbkIsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQztRQUNNLGdCQUFXLEdBQUcsRUFBRSxDQUFDO0lBUnJCLENBQUM7SUFVTCxRQUFRO1FBQ04sSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELFlBQVk7UUFDVixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNsQyxhQUFhO1FBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsTUFBTSxPQUFPLEdBQUcsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsRCxhQUFhO1FBQ2IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3RELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QyxhQUFhO1FBQ2IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQzVDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDOytHQWpDVSx3QkFBd0I7bUdBQXhCLHdCQUF3Qix5R0NickMsZ1ZBT0EsNENESVksdUJBQXVCLG1HQUFFLG1CQUFtQix5REFBRSxPQUFPLG9GQUFFLElBQUk7OzRGQUUxRCx3QkFBd0I7a0JBTnBDLFNBQVM7K0JBQ0UscUJBQXFCLGNBRW5CLElBQUksV0FDUCxDQUFDLHVCQUF1QixFQUFFLG1CQUFtQixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUM7dUdBUTdELElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdDbGFzcywgTmdJZiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IEh0bWxBdHRyaWJ1dGVzRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vc2hhcmVkJztcbmltcG9ydCB7IFNpZGViYXJOYXZIZWxwZXIgfSBmcm9tICcuL3NpZGViYXItbmF2LnNlcnZpY2UnO1xuaW1wb3J0IHsgU2lkZWJhck5hdkJhZGdlUGlwZSB9IGZyb20gJy4vc2lkZWJhci1uYXYtYmFkZ2UucGlwZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Mtc2lkZWJhci1uYXYtbGFiZWwnLFxuICB0ZW1wbGF0ZVVybDogJy4vc2lkZWJhci1uYXYtbGFiZWwuY29tcG9uZW50Lmh0bWwnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbSHRtbEF0dHJpYnV0ZXNEaXJlY3RpdmUsIFNpZGViYXJOYXZCYWRnZVBpcGUsIE5nQ2xhc3MsIE5nSWZdXG59KVxuZXhwb3J0IGNsYXNzIFNpZGViYXJOYXZMYWJlbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGhlbHBlcjogU2lkZWJhck5hdkhlbHBlclxuICApIHsgfVxuXG4gIEBJbnB1dCgpIGl0ZW06IGFueTtcblxuICBwcml2YXRlIGNsYXNzZXMgPSB7XG4gICAgJ2MtbmF2LWxhYmVsJzogdHJ1ZSxcbiAgICAnYy1hY3RpdmUnOiB0cnVlXG4gIH07XG4gIHByaXZhdGUgaWNvbkNsYXNzZXMgPSB7fTtcblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmljb25DbGFzc2VzID0gdGhpcy5oZWxwZXIuZ2V0SWNvbkNsYXNzKHRoaXMuaXRlbSk7XG4gIH1cblxuICBnZXRJdGVtQ2xhc3MoKSB7XG4gICAgY29uc3QgaXRlbUNsYXNzID0gdGhpcy5pdGVtLmNsYXNzO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLmNsYXNzZXNbaXRlbUNsYXNzXSA9ICEhaXRlbUNsYXNzO1xuICAgIHJldHVybiB0aGlzLmNsYXNzZXM7XG4gIH1cblxuICBnZXRMYWJlbEljb25DbGFzcygpIHtcbiAgICBjb25zdCB2YXJpYW50ID0gYHRleHQtJHt0aGlzLml0ZW0ubGFiZWwudmFyaWFudH1gO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLmljb25DbGFzc2VzW3ZhcmlhbnRdID0gISF0aGlzLml0ZW0ubGFiZWwudmFyaWFudDtcbiAgICBjb25zdCBsYWJlbENsYXNzID0gdGhpcy5pdGVtLmxhYmVsLmNsYXNzO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLmljb25DbGFzc2VzW2xhYmVsQ2xhc3NdID0gISFsYWJlbENsYXNzO1xuICAgIHJldHVybiB0aGlzLmljb25DbGFzc2VzO1xuICB9XG59XG4iLCI8YSBbbmdDbGFzc109XCJnZXRJdGVtQ2xhc3MoKVwiXG4gICBocmVmPVwie3tpdGVtLnVybH19XCJcbiAgIFtjSHRtbEF0dHJdPVwiaXRlbS5hdHRyaWJ1dGVzXCI+XG4gIDxpICpuZ0lmPVwiaGVscGVyLmhhc0ljb24oaXRlbSlcIiBbbmdDbGFzc109XCJnZXRMYWJlbEljb25DbGFzcygpXCI+PC9pPlxuICA8bmctY29udGFpbmVyPnt7IGl0ZW0ubmFtZSB9fTwvbmctY29udGFpbmVyPlxuICA8c3BhbiAqbmdJZj1cImhlbHBlci5oYXNCYWRnZShpdGVtKVwiIFtuZ0NsYXNzXT1cIml0ZW0gfCBjU2lkZWJhck5hdkJhZGdlXCI+e3sgaXRlbS5iYWRnZS50ZXh0IH19PC9zcGFuPlxuPC9hPlxuIl19