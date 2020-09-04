import { AleUIComponent } from './component';

/** Use Collapse to store contents. */
export declare class AlCollapse extends AleUIComponent {
  /** Whether to activate accordion mode */
  accordion: boolean;

  /** Currently active panel */
  value: string | number | string[] | number[];
}
