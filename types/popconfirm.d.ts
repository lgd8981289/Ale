import { AleUIComponent } from './component';
import { AlPopover } from './popover';

/** Popconfirm Component */
export declare class AlPopconfirm extends AlPopover {
  /** Popconfirm title */
  title: string;

  /** Popconfirm ok text */
  confirmButtonText: string;

  /** Popconfirm cancel text */
  cancelButtonText: string;

  /** Popconfirm ok type */
  confirmButtonType: string;

  /** Popconfirm cancal type */
  cancelButtonType: string;

  /** Popconfirm icon */
  icon: string;

  /** Popconfirm icon color */
  iconColor: string;

  /** Popconfirm hide icon */
  hideIcon: boolean;
}
