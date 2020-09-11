import { hasOwn } from '@utils/util';

export function isVNode(node) {
  // return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions');
  return node !== null && typeof node === 'object' && node.__v_isVNode;
}
