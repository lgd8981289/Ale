import { inject } from 'vue';

export function getInject() {
  let alForm = inject('alForm', '');
  let alFormItem = inject('alFormItem', '');
  return {
    alForm,
    alFormItem
  };
}
