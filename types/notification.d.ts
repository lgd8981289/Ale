import Vue, { VNode } from 'vue';
import { MessageType } from './message';

export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/** Notification Component */
// TODO:  extends Vue
export declare class AlNotificationComponent {
  /** Close the Notification instance */
  close(): void;
}

export interface AlNotificationOptions {
  /** Title */
  title: string;

  /** Description text */
  message: string | VNode;

  /** Notification type */
  type?: MessageType;

  /** Custom icon's class. It will be overridden by type */
  iconClass?: string;

  /** Custom class name for Notification */
  customClass?: string;

  /** Duration before close. It will not automatically close if set 0 */
  duration?: number;

  /** Whether to show a close button */
  showClose?: boolean;

  /** Whether message is treated as HTML string */
  dangerouslyUseHTMLString?: boolean;

  /** Callback function when closed */
  onClose?: () => void;

  /** Callback function when notification clicked */
  onClick?: () => void;

  /** Offset from the top edge of the screen. Every Notification instance of the same moment should have the same offset */
  offset?: number;

  /** custom position */
  position?: NotificationPosition;
}

export interface AlNotification {
  /** Show a notification */
  (options: AlNotificationOptions): AlNotificationComponent;

  /** Show a success notification */
  success(message: string | VNode): AlNotificationComponent;

  /** Show a success notification */
  success(options: AlNotificationOptions): AlNotificationComponent;

  /** Show a warning notification */
  warning(message: string | VNode): AlNotificationComponent;

  /** Show a warning notification */
  warning(options: AlNotificationOptions): AlNotificationComponent;

  /** Show an info notification */
  info(message: string | VNode): AlNotificationComponent;

  /** Show an info notification */
  info(options: AlNotificationOptions): AlNotificationComponent;

  /** Show an error notification */
  error(message: string | VNode): AlNotificationComponent;

  /** Show an error notification */
  error(options: AlNotificationOptions): AlNotificationComponent;
}

declare module 'vue/types/vue' {
  interface Vue {
    /** Displays a global notification message at the upper right corner of the page */
    $notify: AlNotification;
  }
}
