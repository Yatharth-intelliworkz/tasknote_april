import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { TabPaneComponent } from '../tab-pane/tab-pane.component';
import * as i0 from "@angular/core";
import * as i1 from "../tab.service";
export class TabContentComponent {
    /**
     * Set active tabPane index
     * @type number
     */
    set activeTabPaneIdx(value) {
        const newValue = coerceNumberProperty(value);
        if (this._activeTabPaneIdx != newValue) {
            this._activeTabPaneIdx = newValue;
            this.activeTabPaneIdxChange.emit(newValue);
            this.changeDetectorRef.markForCheck();
            this.changeDetectorRef.detectChanges();
        }
    }
    ;
    get activeTabPaneIdx() {
        return this._activeTabPaneIdx;
    }
    constructor(changeDetectorRef, tabService) {
        this.changeDetectorRef = changeDetectorRef;
        this.tabService = tabService;
        this._activeTabPaneIdx = -1;
        /**
         * Event emitted on the active tab pane index change.
         */
        this.activeTabPaneIdxChange = new EventEmitter();
    }
    get hostClasses() {
        return {
            'tab-content': true
        };
    }
    ngAfterContentInit() {
        this.subscribeTabService();
    }
    ngAfterContentChecked() {
        this.panes?.forEach((tabPane, index) => {
            tabPane.tabContent = this;
            tabPane.tabPaneIdx = index;
        });
        this.refreshTabPaneActive(this.activeTabPaneIdx);
        this.tabService.setActiveTabIdx({ tabContent: this, activeIdx: this.activeTabPaneIdx });
    }
    ngOnChanges(changes) {
        if (changes['activeTabPaneIdx']?.currentValue) {
            this.tabService.setActiveTabIdx({ tabContent: this, activeIdx: changes['activeTabPaneIdx'].currentValue });
        }
    }
    ngOnDestroy() {
        this.subscribeTabService(false);
    }
    subscribeTabService(subscribe = true) {
        if (subscribe) {
            this.tabServiceSubscription = this.tabService.activeTabPaneIdx$.subscribe((tabContentState) => {
                if (this === tabContentState.tabContent) {
                    this.activeTabPaneIdx = tabContentState.activeIdx;
                }
            });
        }
        else {
            this.tabServiceSubscription?.unsubscribe();
        }
    }
    refreshTabPaneActive(idx) {
        // hack for active state pane refresh todo?
        this.panes?.forEach((tabPane, index) => {
            tabPane.active = idx === index;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: TabContentComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.TabService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.10", type: TabContentComponent, isStandalone: true, selector: "c-tab-content", inputs: { activeTabPaneIdx: "activeTabPaneIdx" }, outputs: { activeTabPaneIdxChange: "activeTabPaneIdxChange" }, host: { properties: { "class": "this.hostClasses" } }, queries: [{ propertyName: "panes", predicate: TabPaneComponent }], exportAs: ["cTabContent"], usesOnChanges: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, styles: [":host{display:block}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: TabContentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'c-tab-content', template: `<ng-content></ng-content>`, changeDetection: ChangeDetectionStrategy.OnPush, exportAs: 'cTabContent', standalone: true, styles: [":host{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.TabService }]; }, propDecorators: { activeTabPaneIdx: [{
                type: Input
            }], activeTabPaneIdxChange: [{
                type: Output
            }], panes: [{
                type: ContentChildren,
                args: [TabPaneComponent]
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWNvbnRlbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZXVpLWFuZ3VsYXIvc3JjL2xpYi90YWJzL3RhYi1jb250ZW50L3RhYi1jb250ZW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsWUFBWSxFQUNaLFdBQVcsRUFDWCxLQUFLLEVBR0wsTUFBTSxFQUdQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRzdELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOzs7QUFXbEUsTUFBTSxPQUFPLG1CQUFtQjtJQUU5Qjs7O09BR0c7SUFDSCxJQUNJLGdCQUFnQixDQUFDLEtBQWE7UUFDaEMsTUFBTSxRQUFRLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksUUFBUSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUM7WUFDbEMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFDRixJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDO0lBV0QsWUFDVSxpQkFBb0MsRUFDcEMsVUFBc0I7UUFEdEIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBWnhCLHNCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRS9COztXQUVHO1FBQ08sMkJBQXNCLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7SUFRaEYsQ0FBQztJQUVMLElBQ0ksV0FBVztRQUNiLE9BQU87WUFDTCxhQUFhLEVBQUUsSUFBSTtTQUNwQixDQUFDO0lBQ0osQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQscUJBQXFCO1FBQ25CLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3JDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsWUFBWSxFQUFFO1lBQzdDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztTQUM1RztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxZQUFxQixJQUFJO1FBQzNDLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQzVGLElBQUksSUFBSSxLQUFLLGVBQWUsQ0FBQyxVQUFVLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDO2lCQUNuRDtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxXQUFXLEVBQUUsQ0FBQztTQUM1QztJQUNILENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxHQUFXO1FBQzlCLDJDQUEyQztRQUMzQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNyQyxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsS0FBSyxLQUFLLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOytHQWpGVSxtQkFBbUI7bUdBQW5CLG1CQUFtQix1UUEwQmIsZ0JBQWdCLDZFQWhDdkIsMkJBQTJCOzs0RkFNMUIsbUJBQW1CO2tCQVIvQixTQUFTOytCQUNFLGVBQWUsWUFDZiwyQkFBMkIsbUJBRXBCLHVCQUF1QixDQUFDLE1BQU0sWUFDckMsYUFBYSxjQUNYLElBQUk7aUlBU1osZ0JBQWdCO3NCQURuQixLQUFLO2dCQWtCSSxzQkFBc0I7c0JBQS9CLE1BQU07Z0JBRW1DLEtBQUs7c0JBQTlDLGVBQWU7dUJBQUMsZ0JBQWdCO2dCQVM3QixXQUFXO3NCQURkLFdBQVc7dUJBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjb2VyY2VOdW1iZXJQcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgVGFiUGFuZUNvbXBvbmVudCB9IGZyb20gJy4uL3RhYi1wYW5lL3RhYi1wYW5lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJTZXJ2aWNlIH0gZnJvbSAnLi4vdGFiLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjLXRhYi1jb250ZW50JyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgc3R5bGVVcmxzOiBbJy4vdGFiLWNvbnRlbnQuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGV4cG9ydEFzOiAnY1RhYkNvbnRlbnQnLFxuICBzdGFuZGFsb25lOiB0cnVlXG59KVxuZXhwb3J0IGNsYXNzIFRhYkNvbnRlbnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cbiAgLyoqXG4gICAqIFNldCBhY3RpdmUgdGFiUGFuZSBpbmRleFxuICAgKiBAdHlwZSBudW1iZXJcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBhY3RpdmVUYWJQYW5lSWR4KHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICBpZiAodGhpcy5fYWN0aXZlVGFiUGFuZUlkeCAhPSBuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5fYWN0aXZlVGFiUGFuZUlkeCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5hY3RpdmVUYWJQYW5lSWR4Q2hhbmdlLmVtaXQobmV3VmFsdWUpO1xuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfTtcbiAgZ2V0IGFjdGl2ZVRhYlBhbmVJZHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVRhYlBhbmVJZHg7XG4gIH1cbiAgcHJpdmF0ZSBfYWN0aXZlVGFiUGFuZUlkeCA9IC0xO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIG9uIHRoZSBhY3RpdmUgdGFiIHBhbmUgaW5kZXggY2hhbmdlLlxuICAgKi9cbiAgQE91dHB1dCgpIGFjdGl2ZVRhYlBhbmVJZHhDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihUYWJQYW5lQ29tcG9uZW50KSBwdWJsaWMgcGFuZXMhOiBRdWVyeUxpc3Q8VGFiUGFuZUNvbXBvbmVudD47XG4gIHByaXZhdGUgdGFiU2VydmljZVN1YnNjcmlwdGlvbiE6IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHRhYlNlcnZpY2U6IFRhYlNlcnZpY2VcbiAgKSB7IH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGhvc3RDbGFzc2VzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAndGFiLWNvbnRlbnQnOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmliZVRhYlNlcnZpY2UoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLnBhbmVzPy5mb3JFYWNoKCh0YWJQYW5lLCBpbmRleCkgPT4ge1xuICAgICAgdGFiUGFuZS50YWJDb250ZW50ID0gdGhpcztcbiAgICAgICAgdGFiUGFuZS50YWJQYW5lSWR4ID0gaW5kZXg7XG4gICAgfSk7XG4gICAgdGhpcy5yZWZyZXNoVGFiUGFuZUFjdGl2ZSh0aGlzLmFjdGl2ZVRhYlBhbmVJZHgpO1xuICAgIHRoaXMudGFiU2VydmljZS5zZXRBY3RpdmVUYWJJZHgoeyB0YWJDb250ZW50OiB0aGlzLCBhY3RpdmVJZHg6IHRoaXMuYWN0aXZlVGFiUGFuZUlkeCB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snYWN0aXZlVGFiUGFuZUlkeCddPy5jdXJyZW50VmFsdWUpIHtcbiAgICAgIHRoaXMudGFiU2VydmljZS5zZXRBY3RpdmVUYWJJZHgoeyB0YWJDb250ZW50OiB0aGlzLCBhY3RpdmVJZHg6IGNoYW5nZXNbJ2FjdGl2ZVRhYlBhbmVJZHgnXS5jdXJyZW50VmFsdWUgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpYmVUYWJTZXJ2aWNlKGZhbHNlKTtcbiAgfVxuXG4gIHN1YnNjcmliZVRhYlNlcnZpY2Uoc3Vic2NyaWJlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgIGlmIChzdWJzY3JpYmUpIHtcbiAgICAgIHRoaXMudGFiU2VydmljZVN1YnNjcmlwdGlvbiA9IHRoaXMudGFiU2VydmljZS5hY3RpdmVUYWJQYW5lSWR4JC5zdWJzY3JpYmUoKHRhYkNvbnRlbnRTdGF0ZSkgPT4ge1xuICAgICAgICBpZiAodGhpcyA9PT0gdGFiQ29udGVudFN0YXRlLnRhYkNvbnRlbnQpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZVRhYlBhbmVJZHggPSB0YWJDb250ZW50U3RhdGUuYWN0aXZlSWR4O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50YWJTZXJ2aWNlU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlZnJlc2hUYWJQYW5lQWN0aXZlKGlkeDogbnVtYmVyKSB7XG4gICAgLy8gaGFjayBmb3IgYWN0aXZlIHN0YXRlIHBhbmUgcmVmcmVzaCB0b2RvP1xuICAgIHRoaXMucGFuZXM/LmZvckVhY2goKHRhYlBhbmUsIGluZGV4KSA9PiB7XG4gICAgICB0YWJQYW5lLmFjdGl2ZSA9IGlkeCA9PT0gaW5kZXg7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==