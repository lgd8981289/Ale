import AlAutocomplete from './src/autocomplete';

/* istanbul ignore next */
AlAutocomplete.install = function (Vue) {
  Vue.component(AlAutocomplete.name, AlAutocomplete);
};

export default AlAutocomplete;
