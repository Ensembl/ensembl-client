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

/*
    Formats the input number to comma separated representation
    eg: 10000 -> 10,000
*/
export const formatNumber = (
  input: number,
  options?: Intl.NumberFormatOptions
) => {
  const numberFormat = Intl.NumberFormat('en-GB', options);
  return numberFormat.format(input);
};

export const getNumberWithoutCommas = (input: string) => {
  const inputWithoutCommas = input.replace(/,/g, '');
  return +inputWithoutCommas;
};

export const formatSmallNumber = (
  num: number,
  options?: Intl.NumberFormatOptions & {
    scientificNotation?:
      | {
          cutoff?: number; // number below which we should format the input using scientific notation
          maximumSignificantDigits?: number;
        }
      | boolean;
  }
) => {
  options = options ?? {};
  options = {
    ...defaultSmallNumberFormatterOptions,
    ...options
  };
  options.scientificNotation = options.scientificNotation ?? true; // use scientific notation unless explicitly told not to

  if (options.scientificNotation) {
    const scientificNotationConfig =
      options.scientificNotation === true ? {} : options.scientificNotation;
    const { cutoff = 0.0001 } = scientificNotationConfig;
    const numAbs = Math.abs(num);
    if (numAbs > 0 && numAbs < cutoff) {
      options.notation = 'scientific';
      options.maximumSignificantDigits =
        scientificNotationConfig.maximumSignificantDigits ??
        defaultSmallNumberFormatterOptions.maximumSignificantDigits;
    }
  }

  const formatter = new Intl.NumberFormat('en-GB', options);

  return formatter.format(num).toLocaleLowerCase();
};

// FIXME: Intl.NumberFormatOptions type doesn't seem to include "roundingMode"?
const defaultSmallNumberFormatterOptions = {
  maximumSignificantDigits: 21,
  roundingMode: 'trunc'
};
