module.exports = {
  defaultSeverity: 'warning',
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': null, // it wants classes to be written in kebab-case
    'color-hex-length': null, // it will insist that e.g. "#0099ff" be written as "#09f"
    'alpha-value-notation': null, // who cares if it's 0.4 or 40%
    'custom-property-pattern': null, // it complains about 'private' cursom properties, such as "--_left-padding"
    'declaration-block-no-redundant-longhand-properties': null,
    'declaration-empty-line-before': null,
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['global']
    }],
    'string-no-newline': null
  }
};
