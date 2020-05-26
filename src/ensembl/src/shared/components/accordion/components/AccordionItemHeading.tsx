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

import React, { useEffect, useRef } from 'react';
import { InjectedHeadingAttributes } from '../helpers/AccordionStore';
import { DivAttributes } from '../helpers/types';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

type Props = DivAttributes;

export const SPEC_ERROR = `AccordionItemButton may contain only one child element, which must be an instance of AccordionItemButton.
From the WAI-ARIA spec (https://www.w3.org/TR/wai-aria-practices-1.1/#accordion):
“The button element is the only element inside the heading element. 
That is, if there are other visually persistent elements, they are not included inside the heading element.”
`;

export const AccordionItemHeading = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const VALIDATE = (reference: HTMLDivElement | null): void | never => {
    if (reference === null) {
      throw new Error('reference is undefined');
    }
    if (
      !(
        reference.childElementCount === 1 &&
        reference.firstElementChild &&
        reference.firstElementChild.getAttribute('data-accordion-component') ===
          'AccordionItemButton'
      )
    ) {
      throw new Error(SPEC_ERROR);
    }
  };

  useEffect(() => {
    VALIDATE(ref.current);
  });

  return (
    <div data-accordion-component="AccordionItemHeading" {...props} ref={ref} />
  );
};

AccordionItemHeading.defaultProps = {
  'aria-level': 3
};

type WrapperProps = Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, keyof InjectedHeadingAttributes>
>;

const AccordionItemHeadingWrapper = (props: WrapperProps) => (
  <ItemConsumer>
    {(itemContext: ItemContext) => {
      const { headingAttributes } = itemContext;

      return <AccordionItemHeading {...props} {...headingAttributes} />;
    }}
  </ItemConsumer>
);

export default AccordionItemHeadingWrapper;
