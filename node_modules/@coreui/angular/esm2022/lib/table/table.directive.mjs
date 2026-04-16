import { booleanAttribute, Directive, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class TableDirective {
    constructor(renderer, hostElement) {
        this.renderer = renderer;
        this.hostElement = hostElement;
        /**
         * Add borders on all sides of the table and cells.
         * @type boolean
         */
        this.bordered = false;
        /**
         * Remove borders on all sides of the table and cells.
         * @type boolean
         */
        this.borderless = false;
        /**
         * Enable a hover state on table rows within table body.
         * @type boolean
         */
        this.hover = false;
        /**
         * Make table more compact by cutting all cell `padding` in half.
         * @type boolean
         */
        this.small = false;
        /**
         * Add zebra-striping to any table row within the table body.
         * @type boolean
         */
        this.striped = false;
        /**
         * Add zebra-striping to any table column.
         * @type boolean
         * @since 4.2.4
         */
        this.stripedColumns = false;
    }
    get hostClasses() {
        return {
            table: true,
            [`align-${this.align}`]: !!this.align,
            [`caption-${this.caption}`]: !!this.caption,
            [`border-${this.borderColor}`]: !!this.borderColor,
            'table-bordered': this.bordered,
            'table-borderless': this.borderless,
            [`table-${this.color}`]: !!this.color,
            'table-hover': this.hover,
            'table-sm': this.small,
            'table-striped': this.striped,
            'table-striped-columns': this.stripedColumns
        };
    }
    ngOnInit() {
        this.setResponsiveWrapper();
    }
    // todo
    setResponsiveWrapper() {
        if (!!this.responsive) {
            const nativeElement = this.hostElement.nativeElement;
            const wrapper = this.renderer.createElement('div');
            const className = this.responsive === true ? 'table-responsive' : `table-responsive-${this.responsive}`;
            this.renderer.addClass(wrapper, className);
            const parentNode = this.renderer.parentNode(nativeElement);
            this.renderer.appendChild(parentNode, wrapper);
            this.renderer.insertBefore(parentNode, wrapper, nativeElement);
            this.renderer.appendChild(wrapper, nativeElement);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: TableDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "16.2.10", type: TableDirective, isStandalone: true, selector: "table[cTable]", inputs: { align: "align", borderColor: "borderColor", bordered: ["bordered", "bordered", booleanAttribute], borderless: ["borderless", "borderless", booleanAttribute], caption: "caption", color: "color", hover: ["hover", "hover", booleanAttribute], responsive: "responsive", small: ["small", "small", booleanAttribute], striped: ["striped", "striped", booleanAttribute], stripedColumns: ["stripedColumns", "stripedColumns", booleanAttribute] }, host: { properties: { "class": "this.hostClasses" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: TableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'table[cTable]',
                    standalone: true
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; }, propDecorators: { align: [{
                type: Input
            }], borderColor: [{
                type: Input
            }], bordered: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], borderless: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], caption: [{
                type: Input
            }], color: [{
                type: Input
            }], hover: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], responsive: [{
                type: Input
            }], small: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], striped: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], stripedColumns: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZXVpLWFuZ3VsYXIvc3JjL2xpYi90YWJsZS90YWJsZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBYyxXQUFXLEVBQUUsS0FBSyxFQUFxQixNQUFNLGVBQWUsQ0FBQzs7QUFRL0csTUFBTSxPQUFPLGNBQWM7SUFFekIsWUFDVSxRQUFtQixFQUNuQixXQUF1QjtRQUR2QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBZ0JqQzs7O1dBR0c7UUFDcUMsYUFBUSxHQUFxQixLQUFLLENBQUM7UUFFM0U7OztXQUdHO1FBQ3FDLGVBQVUsR0FBcUIsS0FBSyxDQUFDO1FBYzdFOzs7V0FHRztRQUNxQyxVQUFLLEdBQXFCLEtBQUssQ0FBQztRQVF4RTs7O1dBR0c7UUFDcUMsVUFBSyxHQUFxQixLQUFLLENBQUM7UUFFeEU7OztXQUdHO1FBQ3FDLFlBQU8sR0FBcUIsS0FBSyxDQUFDO1FBRTFFOzs7O1dBSUc7UUFDcUMsbUJBQWMsR0FBcUIsS0FBSyxDQUFDO0lBcEU3RSxDQUFDO0lBc0VMLElBQ0ksV0FBVztRQUNiLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSTtZQUNYLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDckMsQ0FBQyxXQUFXLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTztZQUMzQyxDQUFDLFVBQVUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2xELGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRO1lBQy9CLGtCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVO1lBQ25DLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDckMsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ3pCLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSztZQUN0QixlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDN0IsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLGNBQWM7U0FDN0MsQ0FBQztJQUNKLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELE9BQU87SUFDUCxvQkFBb0I7UUFDbEIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNyQixNQUFNLGFBQWEsR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7WUFDbEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3hHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMzQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDbkQ7SUFDSCxDQUFDOytHQTVHVSxjQUFjO21HQUFkLGNBQWMsMElBd0JMLGdCQUFnQiw0Q0FNaEIsZ0JBQWdCLGlFQWtCaEIsZ0JBQWdCLHVEQVloQixnQkFBZ0IsbUNBTWhCLGdCQUFnQix3REFPaEIsZ0JBQWdCOzs0RkF6RXpCLGNBQWM7a0JBSjFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjt5SEFhVSxLQUFLO3NCQUFiLEtBQUs7Z0JBTUcsV0FBVztzQkFBbkIsS0FBSztnQkFNa0MsUUFBUTtzQkFBL0MsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFNRSxVQUFVO3NCQUFqRCxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQU03QixPQUFPO3NCQUFmLEtBQUs7Z0JBTUcsS0FBSztzQkFBYixLQUFLO2dCQU1rQyxLQUFLO3NCQUE1QyxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQU03QixVQUFVO3NCQUFsQixLQUFLO2dCQU1rQyxLQUFLO3NCQUE1QyxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQU1FLE9BQU87c0JBQTlDLEtBQUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBT0UsY0FBYztzQkFBckQsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFHbEMsV0FBVztzQkFEZCxXQUFXO3VCQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBib29sZWFuQXR0cmlidXRlLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nLCBJbnB1dCwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyZWFrcG9pbnRzLCBDb2xvcnMgfSBmcm9tICcuLi9jb3JldWkudHlwZXMnO1xuaW1wb3J0IHsgSVRhYmxlIH0gZnJvbSAnLi90YWJsZS50eXBlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAndGFibGVbY1RhYmxlXScsXG4gIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgVGFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBJVGFibGUsIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgaG9zdEVsZW1lbnQ6IEVsZW1lbnRSZWZcbiAgKSB7IH1cblxuICAvKipcbiAgICogU2V0IHRoZSB2ZXJ0aWNhbCBhbGlnbm1lbnQuXG4gICAqIEB0eXBlIHN0cmluZ1xuICAgKiBAdmFsdWVzICdib3R0b20nIHwgJ21pZGRsZScgfCAndG9wJ1xuICAgKi9cbiAgQElucHV0KCkgYWxpZ24/OiAnYm90dG9tJyB8ICdtaWRkbGUnIHwgJ3RvcCc7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGJvcmRlciBjb2xvciBvZiB0aGUgY29tcG9uZW50IHRvIG9uZSBvZiBDb3JlVUnigJlzIHRoZW1lZCBjb2xvcnMuXG4gICAqIEB0eXBlIENvbG9yc1xuICAgKi9cbiAgQElucHV0KCkgYm9yZGVyQ29sb3I/OiBDb2xvcnM7XG5cbiAgLyoqXG4gICAqIEFkZCBib3JkZXJzIG9uIGFsbCBzaWRlcyBvZiB0aGUgdGFibGUgYW5kIGNlbGxzLlxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgYm9yZGVyZWQ6IHN0cmluZyB8IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogUmVtb3ZlIGJvcmRlcnMgb24gYWxsIHNpZGVzIG9mIHRoZSB0YWJsZSBhbmQgY2VsbHMuXG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBib3JkZXJsZXNzOiBzdHJpbmcgfCBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFB1dCB0aGUgYDxjYXB0aW9uPmAgb24gdGhlIHRvcCBvZiB0aGUgdGFibGUuXG4gICAqIEB2YWx1ZXMgJ3RvcCdcbiAgICovXG4gIEBJbnB1dCgpIGNhcHRpb24/OiAndG9wJztcblxuICAvKipcbiAgICogU2V0cyB0aGUgY29sb3IgY29udGV4dCBvZiB0aGUgY29tcG9uZW50IHRvIG9uZSBvZiBDb3JlVUnigJlzIHRoZW1lZCBjb2xvcnMuXG4gICAqIEB0eXBlIENvbG9yc1xuICAgKi9cbiAgQElucHV0KCkgY29sb3I/OiBDb2xvcnM7XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBhIGhvdmVyIHN0YXRlIG9uIHRhYmxlIHJvd3Mgd2l0aGluIHRhYmxlIGJvZHkuXG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBob3Zlcjogc3RyaW5nIHwgYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBNYWtlIHRhYmxlIHJlc3BvbnNpdmUgYWNyb3NzIGFsbCB2aWV3cG9ydHMgb3IgcGljayBhIG1heGltdW0gYnJlYWtwb2ludCB3aXRoIHdoaWNoIHRvIGhhdmUgYSByZXNwb25zaXZlIHRhYmxlIHVwIHRvLlxuICAgKiBAdHlwZToge2Jvb2xlYW4gfCAnc20nIHwgJ21kJyB8ICdsZycgfCAneGwnIHwgJ3h4bCd9XG4gICAqL1xuICBASW5wdXQoKSByZXNwb25zaXZlPzogYm9vbGVhbiB8IE9taXQ8QnJlYWtwb2ludHMsICd4cyc+O1xuXG4gIC8qKlxuICAgKiBNYWtlIHRhYmxlIG1vcmUgY29tcGFjdCBieSBjdXR0aW5nIGFsbCBjZWxsIGBwYWRkaW5nYCBpbiBoYWxmLlxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc21hbGw6IHN0cmluZyB8IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQWRkIHplYnJhLXN0cmlwaW5nIHRvIGFueSB0YWJsZSByb3cgd2l0aGluIHRoZSB0YWJsZSBib2R5LlxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc3RyaXBlZDogc3RyaW5nIHwgYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBZGQgemVicmEtc3RyaXBpbmcgdG8gYW55IHRhYmxlIGNvbHVtbi5cbiAgICogQHR5cGUgYm9vbGVhblxuICAgKiBAc2luY2UgNC4yLjRcbiAgICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBzdHJpcGVkQ29sdW1uczogc3RyaW5nIHwgYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgaG9zdENsYXNzZXMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgdGFibGU6IHRydWUsXG4gICAgICBbYGFsaWduLSR7dGhpcy5hbGlnbn1gXTogISF0aGlzLmFsaWduLFxuICAgICAgW2BjYXB0aW9uLSR7dGhpcy5jYXB0aW9ufWBdOiAhIXRoaXMuY2FwdGlvbixcbiAgICAgIFtgYm9yZGVyLSR7dGhpcy5ib3JkZXJDb2xvcn1gXTogISF0aGlzLmJvcmRlckNvbG9yLFxuICAgICAgJ3RhYmxlLWJvcmRlcmVkJzogdGhpcy5ib3JkZXJlZCxcbiAgICAgICd0YWJsZS1ib3JkZXJsZXNzJzogdGhpcy5ib3JkZXJsZXNzLFxuICAgICAgW2B0YWJsZS0ke3RoaXMuY29sb3J9YF06ICEhdGhpcy5jb2xvcixcbiAgICAgICd0YWJsZS1ob3Zlcic6IHRoaXMuaG92ZXIsXG4gICAgICAndGFibGUtc20nOiB0aGlzLnNtYWxsLFxuICAgICAgJ3RhYmxlLXN0cmlwZWQnOiB0aGlzLnN0cmlwZWQsXG4gICAgICAndGFibGUtc3RyaXBlZC1jb2x1bW5zJzogdGhpcy5zdHJpcGVkQ29sdW1uc1xuICAgIH07XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldFJlc3BvbnNpdmVXcmFwcGVyKCk7XG4gIH1cblxuICAvLyB0b2RvXG4gIHNldFJlc3BvbnNpdmVXcmFwcGVyKCk6IHZvaWQge1xuICAgIGlmICghIXRoaXMucmVzcG9uc2l2ZSkge1xuICAgICAgY29uc3QgbmF0aXZlRWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCB3cmFwcGVyID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHRoaXMucmVzcG9uc2l2ZSA9PT0gdHJ1ZSA/ICd0YWJsZS1yZXNwb25zaXZlJyA6IGB0YWJsZS1yZXNwb25zaXZlLSR7dGhpcy5yZXNwb25zaXZlfWA7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHdyYXBwZXIsIGNsYXNzTmFtZSk7XG4gICAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5yZW5kZXJlci5wYXJlbnROb2RlKG5hdGl2ZUVsZW1lbnQpO1xuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZChwYXJlbnROb2RlLCB3cmFwcGVyKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuaW5zZXJ0QmVmb3JlKHBhcmVudE5vZGUsIHdyYXBwZXIsIG5hdGl2ZUVsZW1lbnQpO1xuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh3cmFwcGVyLCBuYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==