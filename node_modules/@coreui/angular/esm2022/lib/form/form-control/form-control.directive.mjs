import { booleanAttribute, Directive, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class FormControlDirective {
    constructor(hostElement) {
        this.hostElement = hostElement;
        /**
         * Size the component small or large.
         * @type {'sm' | 'lg'}
         */
        this.sizing = '';
        /**
         * Specifies the type of input element.
         */
        this.type = 'text';
        /**
         * Render the component styled as plain text. Removes the default form field styling and preserve the correct margin and padding. Recommend to use alongside `readonly` [docs]
         */
        this.plaintext = false;
    }
    get hostClasses() {
        const isRangeType = this.type === 'range';
        return {
            'form-control': !isRangeType && !this.plaintext,
            'form-control-plaintext': !isRangeType && this.plaintext,
            'form-control-color': this.type === 'color',
            'form-range': isRangeType,
            [`form-control-${this.sizing}`]: !!this.sizing && !isRangeType,
            'is-valid': this.valid === true,
            'is-invalid': this.valid === false
        };
    }
    get hostTag() {
        return this.hostElement.nativeElement.tagName;
    }
    ngOnInit() {
        const hostTag = this.hostTag.toLowerCase();
        if (hostTag !== 'input' && hostTag !== 'textarea') {
            console.warn(`CoreUI [cFormControl] works with '<input>' and '<textarea>' - not with '<${hostTag}>'`);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: FormControlDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "16.2.10", type: FormControlDirective, isStandalone: true, selector: "input[cFormControl], textarea[cFormControl]", inputs: { sizing: "sizing", valid: "valid", type: "type", plaintext: ["plaintext", "plaintext", booleanAttribute] }, host: { properties: { "attr.type": "this.type", "class": "this.hostClasses" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: FormControlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[cFormControl], textarea[cFormControl]',
                    standalone: true
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { sizing: [{
                type: Input
            }], valid: [{
                type: Input
            }], type: [{
                type: HostBinding,
                args: ['attr.type']
            }, {
                type: Input
            }], plaintext: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1jb250cm9sLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmV1aS1hbmd1bGFyL3NyYy9saWIvZm9ybS9mb3JtLWNvbnRyb2wvZm9ybS1jb250cm9sLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFjLFdBQVcsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7O0FBUXBHLE1BQU0sT0FBTyxvQkFBb0I7SUFFL0IsWUFDVSxXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUdqQzs7O1dBR0c7UUFDTSxXQUFNLEdBQStCLEVBQUUsQ0FBQztRQU9qRDs7V0FFRztRQUVNLFNBQUksR0FBMEMsTUFBTSxDQUFDO1FBRTlEOztXQUVHO1FBQ3FDLGNBQVMsR0FBcUIsS0FBSyxDQUFDO0lBdEJ6RSxDQUFDO0lBd0JKLElBQ0ksV0FBVztRQUViLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDO1FBRTFDLE9BQU87WUFDTCxjQUFjLEVBQUUsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztZQUMvQyx3QkFBd0IsRUFBRSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUztZQUN4RCxvQkFBb0IsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU87WUFDM0MsWUFBWSxFQUFFLFdBQVc7WUFDekIsQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXO1lBQzlELFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUk7WUFDL0IsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSztTQUNuQyxDQUFDO0lBQ0osQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO0lBQ2hELENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMzQyxJQUFJLE9BQU8sS0FBSyxPQUFPLElBQUksT0FBTyxLQUFLLFVBQVUsRUFBRTtZQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLDRFQUE0RSxPQUFPLElBQUksQ0FBQyxDQUFDO1NBQ3ZHO0lBQ0gsQ0FBQzsrR0FyRFUsb0JBQW9CO21HQUFwQixvQkFBb0IsK0tBMEJYLGdCQUFnQjs7NEZBMUJ6QixvQkFBb0I7a0JBSmhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZDQUE2QztvQkFDdkQsVUFBVSxFQUFFLElBQUk7aUJBQ2pCO2lHQVdVLE1BQU07c0JBQWQsS0FBSztnQkFLRyxLQUFLO3NCQUFiLEtBQUs7Z0JBTUcsSUFBSTtzQkFEWixXQUFXO3VCQUFDLFdBQVc7O3NCQUN2QixLQUFLO2dCQUtrQyxTQUFTO3NCQUFoRCxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQUdsQyxXQUFXO3NCQURkLFdBQVc7dUJBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJvb2xlYW5BdHRyaWJ1dGUsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSW5wdXRUeXBlIH0gZnJvbSAnLi4vLi4vY29yZXVpLnR5cGVzJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbY0Zvcm1Db250cm9sXSwgdGV4dGFyZWFbY0Zvcm1Db250cm9sXScsXG4gIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2xEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaG9zdEVsZW1lbnQ6IEVsZW1lbnRSZWZcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBTaXplIHRoZSBjb21wb25lbnQgc21hbGwgb3IgbGFyZ2UuXG4gICAqIEB0eXBlIHsnc20nIHwgJ2xnJ31cbiAgICovXG4gIEBJbnB1dCgpIHNpemluZz86ICcnIHwgJ3NtJyB8ICdsZycgfCBzdHJpbmcgPSAnJztcbiAgLyoqXG4gICAqIFNldCBjb21wb25lbnQgdmFsaWRhdGlvbiBzdGF0ZSB0byB2YWxpZC5cbiAgICogQHR5cGUgYm9vbGVhbiB8IHVuZGVmaW5lZFxuICAgKi9cbiAgQElucHV0KCkgdmFsaWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIHR5cGUgb2YgaW5wdXQgZWxlbWVudC5cbiAgICovXG4gIEBIb3N0QmluZGluZygnYXR0ci50eXBlJylcbiAgQElucHV0KCkgdHlwZTogT21pdDxJbnB1dFR5cGUsICdjaGVja2JveCcgfCAncmFkaW8nPiA9ICd0ZXh0JztcblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjb21wb25lbnQgc3R5bGVkIGFzIHBsYWluIHRleHQuIFJlbW92ZXMgdGhlIGRlZmF1bHQgZm9ybSBmaWVsZCBzdHlsaW5nIGFuZCBwcmVzZXJ2ZSB0aGUgY29ycmVjdCBtYXJnaW4gYW5kIHBhZGRpbmcuIFJlY29tbWVuZCB0byB1c2UgYWxvbmdzaWRlIGByZWFkb25seWAgW2RvY3NdXG4gICAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgcGxhaW50ZXh0OiBzdHJpbmcgfCBib29sZWFuID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBob3N0Q2xhc3NlcygpOiBhbnkge1xuXG4gICAgY29uc3QgaXNSYW5nZVR5cGUgPSB0aGlzLnR5cGUgPT09ICdyYW5nZSc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgJ2Zvcm0tY29udHJvbCc6ICFpc1JhbmdlVHlwZSAmJiAhdGhpcy5wbGFpbnRleHQsXG4gICAgICAnZm9ybS1jb250cm9sLXBsYWludGV4dCc6ICFpc1JhbmdlVHlwZSAmJiB0aGlzLnBsYWludGV4dCxcbiAgICAgICdmb3JtLWNvbnRyb2wtY29sb3InOiB0aGlzLnR5cGUgPT09ICdjb2xvcicsXG4gICAgICAnZm9ybS1yYW5nZSc6IGlzUmFuZ2VUeXBlLFxuICAgICAgW2Bmb3JtLWNvbnRyb2wtJHt0aGlzLnNpemluZ31gXTogISF0aGlzLnNpemluZyAmJiAhaXNSYW5nZVR5cGUsXG4gICAgICAnaXMtdmFsaWQnOiB0aGlzLnZhbGlkID09PSB0cnVlLFxuICAgICAgJ2lzLWludmFsaWQnOiB0aGlzLnZhbGlkID09PSBmYWxzZVxuICAgIH07XG4gIH1cblxuICBnZXQgaG9zdFRhZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQudGFnTmFtZTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGhvc3RUYWcgPSB0aGlzLmhvc3RUYWcudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoaG9zdFRhZyAhPT0gJ2lucHV0JyAmJiBob3N0VGFnICE9PSAndGV4dGFyZWEnKSB7XG4gICAgICBjb25zb2xlLndhcm4oYENvcmVVSSBbY0Zvcm1Db250cm9sXSB3b3JrcyB3aXRoICc8aW5wdXQ+JyBhbmQgJzx0ZXh0YXJlYT4nIC0gbm90IHdpdGggJzwke2hvc3RUYWd9PidgKTtcbiAgICB9XG4gIH1cblxufVxuIl19