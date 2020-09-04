import { once, on } from '@utils/dom';

export default {
  beforeMount(el, binding, vnode) {
    let interval = null;
    let startTime;
    // TODO: 自定义指令的修改，不确定问题
    // const handler = () => vnode.context[binding.expression].apply();
    const handler = binding.value;
    const clear = () => {
      if (Date.now() - startTime < 100) {
        handler();
      }
      clearInterval(interval);
      interval = null;
    };

    on(el, 'mousedown', (e) => {
      if (e.button !== 0) return;
      startTime = Date.now();
      once(document, 'mouseup', clear);
      clearInterval(interval);
      interval = setInterval(handler, 100);
    });
  }
};
