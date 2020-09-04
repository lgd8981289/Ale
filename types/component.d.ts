import Vue from 'vue'

/** AleUI component common definition */
export declare class AleUIComponent extends Vue {
  /** Install component into Vue */
  static install (vue: typeof Vue): void
}

/** Component size definition for button, input, etc */
export type AleUIComponentSize = 'large' | 'medium' | 'small' | 'mini'

/** Horizontal alignment */
export type AleUIHorizontalAlignment = 'left' | 'center' | 'right'
