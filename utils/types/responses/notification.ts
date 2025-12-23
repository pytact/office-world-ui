import type { NotificationType, NotificationChannel, NotificationStatus } from "@/utils/types/requests/notification";

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  is_read: boolean;
  read_at: string | null;
  status: NotificationStatus;
  related_record_id: string | null;
  related_table: string | null;
  data: Record<string, unknown> | null;
  user_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationListData {
  items: NotificationResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

export interface NotificationListResponse {
  data: NotificationListData;
  message: string;
}

export interface NotificationDetailResponse {
  data: NotificationResponse;
  message: string;
}

export interface NotificationMutationResponse {
  data: NotificationResponse;
  message: string;
}

export interface NotificationBulkUpdateData {
  updated_count: number;
  action: "read" | "unread";
  notification_ids: string[];
}

export interface NotificationBulkUpdateResponse {
  data: NotificationBulkUpdateData;
  message: string;
}

export interface NotificationCountData {
  unread_count: number;
}

export interface NotificationCountResponse {
  data: NotificationCountData;
  message: string;
}

