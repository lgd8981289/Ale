import { VNodeDirective } from 'vue'

export interface AlInfiniteScroll extends VNodeDirective {
  name: 'infinite-scroll',
  value: Function
}