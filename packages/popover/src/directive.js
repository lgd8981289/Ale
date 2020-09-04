const getReference = (el, binding, vnode) => {
  console.log(`TODO: binding.expression: ${binding.expression}`);
  const _ref = binding.expression ? binding.value : binding.arg;
  const popper = binding.instance.$refs[_ref];
  if (popper) {
    if (Array.isArray(popper)) {
      popper[0].$refs.reference = el;
    } else {
      popper.$refs.reference = el;
    }
  }
};

export default {
  beforeMount(el, binding, vnode) {
    getReference(el, binding, vnode);
  },
  mounted(el, binding, vnode) {
    getReference(el, binding, vnode);
  }
};
