import React, { useEffect } from 'react';
import { InjectedHeadingAttributes } from '../helpers/AccordionStore';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';

import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

type Props = DivAttributes;

export const SPEC_ERROR = `AccordionItemButton may contain only one child element, which must be an instance of AccordionItemButton.
From the WAI-ARIA spec (https://www.w3.org/TR/wai-aria-practices-1.1/#accordion):
“The button element is the only element inside the heading element. 
That is, if there are other visually persistent elements, they are not included inside the heading element.”
`;

export const AccordionItemHeading = (props: Props) => {
  let ref: HTMLDivElement | undefined;

  const VALIDATE = (reference: HTMLDivElement | undefined): void | never => {
    if (reference === undefined) {
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
    VALIDATE(ref);
  });

  const setRef = (reference: HTMLDivElement): void => {
    ref = reference;
  };

  return (
    <div
      data-accordion-component="AccordionItemHeading"
      {...props}
      ref={setRef}
    />
  );
};

AccordionItemHeading.defaultProps = {
  'aria-level': 3,
  className: 'accordionHeading'
};

type WrapperProps = Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, keyof InjectedHeadingAttributes>
>;

const AccordionItemHeadingWrapper: React.SFC<DivAttributes> = (
  props: WrapperProps
): JSX.Element => (
  <ItemConsumer>
    {(itemContext: ItemContext): JSX.Element => {
      const { headingAttributes } = itemContext;

      return <AccordionItemHeading {...props} {...headingAttributes} />;
    }}
  </ItemConsumer>
);

AccordionItemHeadingWrapper.displayName = DisplayName.AccordionItemHeading;

export default AccordionItemHeadingWrapper;
