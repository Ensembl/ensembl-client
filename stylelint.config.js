module.exports = {
  plugins: [
  "stylelint-scss"
  ],
  defaultSeverity: 'warning',
  extends: ['stylelint-config-recommended-scss'],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['global']
    }],
    'string-no-newline': null
  }
};
