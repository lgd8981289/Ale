export interface VNodeDirective {
  name: string;
  value?: any;
  oldValue?: any;
  expression?: any;
  arg?: string;
  modifiers?: { [key: string]: boolean };
}
