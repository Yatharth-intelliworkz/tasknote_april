import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class NotificationRefreshInterceptor implements HttpInterceptor {
  private refreshTimers: any[] = [];

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (!(event instanceof HttpResponse)) {
          return;
        }

        if (!this.shouldTriggerRefresh(req, event.body)) {
          return;
        }

        this.dispatchRefreshEvents();
      })
    );
  }

  private shouldTriggerRefresh(req: HttpRequest<unknown>, body: any): boolean {
    const method = (req.method || '').toUpperCase();
    const url = (req.url || '').toLowerCase();

    // Trigger for successful mutating requests only.
    const isMutatingMethod = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
    if (!isMutatingMethod) {
      return false;
    }

    // Avoid auth/session endpoints.
    if (url.includes('login') || url.includes('logout') || url.includes('checkpalnvalid')) {
      return false;
    }

    // Avoid notification read/list endpoints to prevent noisy loops.
    if (
      url.includes('notificationlist') ||
      url.includes('notificationalllist') ||
      url.includes('notificationview') ||
      url.includes('notificationdeleteall')
    ) {
      return false;
    }

    // Ignore clearly list/read-only APIs that use POST in this codebase.
    if (
      url.includes('tasklist') ||
      url.includes('mytasklist') ||
      url.includes('tasklistall') ||
      url.includes('statuslist') ||
      url.includes('companylist') ||
      url.includes('profile') ||
      url.includes('checklist')
    ) {
      return false;
    }

    // Trigger for mutation-style endpoints even when body does not include "status".
    const mutationUrlPattern = /(add|create|save|edit|update|delete|remove|active|assign|change|priority|completed|close|pin)/;
    if (!mutationUrlPattern.test(url)) {
      return false;
    }

    // Skip only when API explicitly says failure.
    if (body?.status === false) {
      return false;
    }

    return true;
  }

  private dispatchRefreshEvents(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent('data-changed'));
    window.dispatchEvent(new CustomEvent('notifications-updated'));

    // Follow-up refreshes capture async notification inserts from backend jobs.
    this.refreshTimers.forEach((timerId) => clearTimeout(timerId));
    this.refreshTimers = [];

    [1200, 3000].forEach((delayMs) => {
      const timerId = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('data-changed'));
        window.dispatchEvent(new CustomEvent('notifications-updated'));
      }, delayMs);
      this.refreshTimers.push(timerId);
    });
  }
}
