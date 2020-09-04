import { AleUIComponent } from './component';

/** Radio Button Component */
export declare class AlRadioButton extends AleUIComponent {
  /** The form input value */
  value: string;

  /** The value of radio */
  label: string | number;

  /** Whether radio is disabled */
  disabled: boolean;

  /** Native 'name' attribute */
  name: string;
}
