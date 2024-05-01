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

export const createSmallNumberFormatter = (
  options?: Intl.NumberFormatOptions & {
    scientificNotation?:
      | {
          maximumSignificantDigits?: number;
          cutoff?: number; // number below which we should format the input using scientific notation
        }
      | boolean;
  }
) => {
  let {
    // eslint-disable-next-line prefer-const
    scientificNotation = true, // use scientific notation unless explicitly told not to
    ...intlOptions
  } = options ?? {};
  intlOptions = {
    ...defaultSmallNumberFormatterOptions,
    ...intlOptions
  };

  const regularFormatter = new Intl.NumberFormat('en-GB', intlOptions);
  let scientificNotationFormatter: Intl.NumberFormat | undefined;

  if (scientificNotation) {
    const scientificNotationConfig =
      scientificNotation === true ? {} : scientificNotation;
    intlOptions.notation = 'scientific';
    intlOptions.maximumSignificantDigits =
      scientificNotationConfig.maximumSignificantDigits ??
      defaultSmallNumberFormatterOptions.maximumSignificantDigits;
    scientificNotationFormatter = new Intl.NumberFormat('en-GB', intlOptions);
  }

  return {
    format: (num: number) => {
      if (scientificNotation) {
        const defaultCutoff = DEFAULT_CUTOFF_FOR_SMALL_NUMBERS;
        const cutoff =
          typeof scientificNotation === 'object'
            ? scientificNotation.cutoff ?? defaultCutoff
            : defaultCutoff;

        const absNum = Math.abs(num);
        if (absNum > 0 && absNum < cutoff) {
          // Intl.NumberFormatter uses capital "E" in the output
          return scientificNotationFormatter!.format(num).toLowerCase();
        }
      }

      return regularFormatter.format(num);
    }
  };
};

// FIXME: Intl.NumberFormatOptions type doesn't seem to include "roundingMode"?
const defaultSmallNumberFormatterOptions = {
  maximumSignificantDigits: 21,
  roundingMode: 'trunc'
};

// the value below which a default small number formatter would switch to scientific notation
const DEFAULT_CUTOFF_FOR_SMALL_NUMBERS = 0.0001;
