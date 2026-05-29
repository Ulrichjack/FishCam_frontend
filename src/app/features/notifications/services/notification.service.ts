import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/api-response.model';
import { NotificationResponse } from '../../../core/models/notification.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/notifications`;


  getNotifications(userId: number) {
    return this.http.get<ApiResponse<NotificationResponse[]>>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  getUnreadCount(userId: number) {
    return this.http.get<ApiResponse<{ count: number }>>(
      `${this.apiUrl}/user/${userId}/unread-count`
    );
  }

  markAsRead(notificationId: number) {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/${notificationId}/mark-as-read`,
      {}
    );
  }
}
