export type NotificationType =
  | "leave_request"
  | "leave_approval"
  | "leave_rejection"
  | "leave_manager_approval"
  | "task_assignment"
  | "task_permission_change"
  | "task_status_change"
  | "user_activation"
  | "user_deactivation";

export type NotificationChannel = "email" | "in_app";

export type NotificationStatus = "sent" | "failed";

export interface NotificationBase {
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  related_record_id?: string | null;
  related_table?: string | null;
  data?: Record<string, unknown> | null;
}

export interface NotificationCreate extends NotificationBase {
  user_id: string;
  company_id: string;
}

export interface NotificationUpdate {
  is_read?: boolean | null;
  read_at?: string | null;
}

export interface NotificationListParams {
  page?: number;
  page_size?: number;
  is_read?: boolean | null;
  type?: NotificationType | null;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface NotificationBulkReadUpdate {
  action: "read" | "unread";
  notification_ids: string[];
}

