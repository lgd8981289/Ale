import { ref } from 'vue';

export function initData() {
  let focus = ref(false);
  return {
    focus
  };
}
