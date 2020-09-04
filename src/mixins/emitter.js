// /**
//  *
//  * @param {*} componentName 发送通知的组件名
//  * @param {*} eventName 通知名
//  * @param {*} params 通知参数
//  * @param {*} emitter 事件中心实例对象
//  */
// function broadcast(componentName, eventName, params, emitter) {
//   this.$children.forEach((child) => {
//     var name = child.$options.componentName;

//     if (name === componentName) {
//       // TODO: 通知机制修改
//       // child.$emit.apply(child, [eventName].concat(params));
//       emitter.emit(eventName, params);
//     } else {
//       broadcast.apply(child, [componentName, eventName].concat([params]));
//     }
//   });
// }
// export default {
//   methods: {
//     dispatch(componentName, eventName, params) {
//       var parent = this.$parent || this.$root;
//       var name = parent.$options.componentName;

//       while (parent && (!name || name !== componentName)) {
//         parent = parent.$parent;

//         if (parent) {
//           name = parent.$options.componentName;
//         }
//       }
//       if (parent) {
//         parent.$emit.apply(parent, [eventName].concat(params));
//       }
//     },
//     broadcast(componentName, eventName, params, emitter) {
//       broadcast.call(this, componentName, eventName, params, emitter);
//     }
//   }
// };

import mitt from 'mitt';

initEmitter();

/**
 * 生成全局的 emitter 对象
 */
function initEmitter() {
  if (window.$alEmitter) {
    return window.$alEmitter;
  }
  window.$alEmitter = mitt();
}

/**
 *
 * @param eventName 事件名称
 * @param params 事件参数
 */
export function $alEmit(eventName, params = '') {
  window.$alEmitter.emit(eventName, params);
}

export function $alOn(eventName, callback) {
  window.$alEmitter.on(eventName, callback);
}

/**
 * 删除所有的监听函数
 */
export function $alOffAll() {
  window.$alEmitter.all.clear();
}

export default {
  $alEmitter: initEmitter(),
  $alEmit,
  $alOn
};
