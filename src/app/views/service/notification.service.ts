import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private ApiUrl = environment.ApiUrl;
  constructor(private http: HttpClient) { }

  // Request browser permission for notifications.
  requestPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  // Function to display desktop notifications.
  pushNotify(data:any) {
    if (!('Notification' in window)) {
      console.warn('Web browser does not support desktop notification');
      return;
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.pushNotify(data);
        }
      });
      return;
    }

    const notifications = Array.isArray(data) ? data : [data];

    notifications.forEach((item: any) => {
      const title = item?.title || (typeof item === 'string' ? 'Notification' : 'New Notification');
      const body = item?.body || item?.message || item?.massage || (typeof item === 'string' ? item : 'You have a new notification.');
      const icon = item?.icon || `${window.location.origin}/assets/img/dashboard/notification.svg`;
      const url = item?.url || window.location.origin;

      if (!title && !body) {
        return;
      }

      const notification = this.createNotification(title, icon, body, url);
      setTimeout(() => {
        notification.close();
      }, 5000);
    });
  }

  // Create and display a notification.
  createNotification(title: string, icon: string, body: string, url: string): Notification {
    const notification = new Notification(title, { icon, body });
    notification.onclick = () => {
      if (url) {
        window.open(url, '_blank');
      }
    };
    return notification;
  }
}
