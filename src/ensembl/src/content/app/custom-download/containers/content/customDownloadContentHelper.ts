import JSONValue from 'src/shared/types/JSON';

export const flattenObject = (
  objectOrArray: JSONValue,
  prefix = '',
  formatter = (k: string) => k
) => {
  if (!objectOrArray) {
    return {};
  }
  const nestedFormatter = (k: string) => '.' + k;

  const nestElement = (prev: any, value: any, key: any): JSONValue =>
    value && typeof value === 'object'
      ? {
          ...prev,
          ...flattenObject(value, `${prefix}${formatter(key)}`, nestedFormatter)
        }
      : { ...prev, ...{ [`${prefix}${formatter(key)}`]: value } };

  return Array.isArray(objectOrArray)
    ? objectOrArray.reduce(nestElement, {})
    : Object.keys(objectOrArray).reduce(
        (prev, element) => nestElement(prev, objectOrArray[element], element),
        {}
      );
};

export const getProcessedAttributes = (flatSelectedAttributes: JSONValue) => {
  const filteredAttributes = Object.keys(flatSelectedAttributes).filter(
    (key) => flatSelectedAttributes[key]
  );
  return filteredAttributes.map((value: string) => {
    return value.replace(/\.default\./g, '.').replace(/genes\./g, '');
  });
};
