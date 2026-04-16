import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
export class BreadcrumbRouterService {
    constructor(router, route) {
        this.router = router;
        this.route = route;
        this.outlet = 'primary';
        this.breadcrumbsBehaviorSubject = new BehaviorSubject(new Array());
        this.breadcrumbs$ = this.breadcrumbsBehaviorSubject.asObservable();
        this.router.events
            .pipe(takeUntilDestroyed(), filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
            const breadcrumbs = [];
            let currentRoute = this.route.root;
            let url = '';
            do {
                const childrenRoutes = currentRoute.children;
                currentRoute = null;
                childrenRoutes.forEach((childRoute) => {
                    // console.log('breadcrumb event', event, 'route', route);
                    if (childRoute.outlet === this.outlet) {
                        const routeSnapshot = childRoute.snapshot;
                        url += '/' + routeSnapshot.url.map((segment) => segment.path).join('/');
                        breadcrumbs.push({
                            label: childRoute.snapshot.data['title'] || '',
                            url,
                            queryParams: routeSnapshot.queryParams
                        });
                        currentRoute = childRoute;
                    }
                });
            } while (currentRoute);
            this.breadcrumbsBehaviorSubject.next(Object.assign([], breadcrumbs));
            // console.log('breadcrumbs', breadcrumbs);
            return breadcrumbs;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: BreadcrumbRouterService, deps: [{ token: i1.Router }, { token: i1.ActivatedRoute }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: BreadcrumbRouterService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: BreadcrumbRouterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.Router }, { type: i1.ActivatedRoute }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWRjcnVtYi1yb3V0ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmV1aS1hbmd1bGFyL3NyYy9saWIvYnJlYWRjcnVtYi9icmVhZGNydW1iLXJvdXRlci9icmVhZGNydW1iLXJvdXRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDaEUsT0FBTyxFQUFrQixhQUFhLEVBQVUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBTXhDLE1BQU0sT0FBTyx1QkFBdUI7SUFNbEMsWUFBb0IsTUFBYyxFQUFVLEtBQXFCO1FBQTdDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUwxRCxXQUFNLEdBQUcsU0FBUyxDQUFDO1FBTXhCLElBQUksQ0FBQywwQkFBMEIsR0FBRyxJQUFJLGVBQWUsQ0FDbkQsSUFBSSxLQUFLLEVBQW1CLENBQzdCLENBQUM7UUFFRixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVuRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07YUFDZixJQUFJLENBQ0gsa0JBQWtCLEVBQUUsRUFDcEIsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLFlBQVksYUFBYSxDQUFDLENBQ2xEO2FBQ0EsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbkIsTUFBTSxXQUFXLEdBQVUsRUFBRSxDQUFDO1lBQzlCLElBQUksWUFBWSxHQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUMxRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixHQUFHO2dCQUNELE1BQU0sY0FBYyxHQUFxQixZQUFZLENBQUMsUUFBUSxDQUFDO2dCQUMvRCxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQ3BDLDBEQUEwRDtvQkFDMUQsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ3JDLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7d0JBQzFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3hFLFdBQVcsQ0FBQyxJQUFJLENBQUM7NEJBQ2YsS0FBSyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7NEJBQzlDLEdBQUc7NEJBQ0gsV0FBVyxFQUFFLGFBQWEsQ0FBQyxXQUFXO3lCQUN2QyxDQUFDLENBQUM7d0JBQ0gsWUFBWSxHQUFHLFVBQVUsQ0FBQztxQkFDM0I7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSixRQUFRLFlBQVksRUFBRTtZQUV2QixJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFFckUsMkNBQTJDO1lBQzNDLE9BQU8sV0FBVyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzsrR0E3Q1UsdUJBQXVCO21IQUF2Qix1QkFBdUIsY0FGdEIsTUFBTTs7NEZBRVAsdUJBQXVCO2tCQUhuQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHRha2VVbnRpbERlc3Ryb3llZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvcnhqcy1pbnRlcm9wJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRW5kLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJQnJlYWRjcnVtYkl0ZW0gfSBmcm9tICcuLi9icmVhZGNydW1iLWl0ZW0vYnJlYWRjcnVtYi1pdGVtJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQnJlYWRjcnVtYlJvdXRlclNlcnZpY2Uge1xuICBwdWJsaWMgb3V0bGV0ID0gJ3ByaW1hcnknO1xuXG4gIGJyZWFkY3J1bWJzJDogT2JzZXJ2YWJsZTxJQnJlYWRjcnVtYkl0ZW1bXT47XG4gIHByaXZhdGUgYnJlYWRjcnVtYnNCZWhhdmlvclN1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxJQnJlYWRjcnVtYkl0ZW1bXT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICB0aGlzLmJyZWFkY3J1bWJzQmVoYXZpb3JTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnlbXT4oXG4gICAgICBuZXcgQXJyYXk8SUJyZWFkY3J1bWJJdGVtPigpXG4gICAgKTtcblxuICAgIHRoaXMuYnJlYWRjcnVtYnMkID0gdGhpcy5icmVhZGNydW1ic0JlaGF2aW9yU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUoXG4gICAgICAgIHRha2VVbnRpbERlc3Ryb3llZCgpLFxuICAgICAgICBmaWx0ZXIoKGV2ZW50KSA9PiBldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBicmVhZGNydW1iczogYW55W10gPSBbXTtcbiAgICAgICAgbGV0IGN1cnJlbnRSb3V0ZTogQWN0aXZhdGVkUm91dGUgfCBudWxsID0gdGhpcy5yb3V0ZS5yb290O1xuICAgICAgICBsZXQgdXJsID0gJyc7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBjb25zdCBjaGlsZHJlblJvdXRlczogQWN0aXZhdGVkUm91dGVbXSA9IGN1cnJlbnRSb3V0ZS5jaGlsZHJlbjtcbiAgICAgICAgICBjdXJyZW50Um91dGUgPSBudWxsO1xuICAgICAgICAgIGNoaWxkcmVuUm91dGVzLmZvckVhY2goKGNoaWxkUm91dGUpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdicmVhZGNydW1iIGV2ZW50JywgZXZlbnQsICdyb3V0ZScsIHJvdXRlKTtcbiAgICAgICAgICAgIGlmIChjaGlsZFJvdXRlLm91dGxldCA9PT0gdGhpcy5vdXRsZXQpIHtcbiAgICAgICAgICAgICAgY29uc3Qgcm91dGVTbmFwc2hvdCA9IGNoaWxkUm91dGUuc25hcHNob3Q7XG4gICAgICAgICAgICAgIHVybCArPSAnLycgKyByb3V0ZVNuYXBzaG90LnVybC5tYXAoKHNlZ21lbnQpID0+IHNlZ21lbnQucGF0aCkuam9pbignLycpO1xuICAgICAgICAgICAgICBicmVhZGNydW1icy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogY2hpbGRSb3V0ZS5zbmFwc2hvdC5kYXRhWyd0aXRsZSddIHx8ICcnLFxuICAgICAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgICAgICBxdWVyeVBhcmFtczogcm91dGVTbmFwc2hvdC5xdWVyeVBhcmFtc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY3VycmVudFJvdXRlID0gY2hpbGRSb3V0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSB3aGlsZSAoY3VycmVudFJvdXRlKTtcblxuICAgICAgICB0aGlzLmJyZWFkY3J1bWJzQmVoYXZpb3JTdWJqZWN0Lm5leHQoT2JqZWN0LmFzc2lnbihbXSwgYnJlYWRjcnVtYnMpKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnYnJlYWRjcnVtYnMnLCBicmVhZGNydW1icyk7XG4gICAgICAgIHJldHVybiBicmVhZGNydW1icztcbiAgICAgIH0pO1xuICB9XG59XG4iXX0=