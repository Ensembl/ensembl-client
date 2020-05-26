/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
