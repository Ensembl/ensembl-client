module.exports = {
  defaultSeverity: 'warning',
  extends: 'stylelint-config-recommended',
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'include',
        'mixin'
      ]
    }]
  }
};
