import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	authorId: string;
	receiverId: string;
	propertyId?: string;
	equipmentId?: string;
	articleId?: string;
	createdAt: string;
	updatedAt: Date;
}

export interface NotificationsInquiry {
	notificationStatus?: NotificationStatus;
}
