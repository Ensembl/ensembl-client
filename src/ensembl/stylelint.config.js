module.exports = {
  defaultSeverity: 'warning',
  extends: 'stylelint-config-recommended',
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'include',
        'mixin'
      ]
    }],
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['global']
    }],
    'string-no-newline': null
  }
};
