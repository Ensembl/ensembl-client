import React from 'react';
import { InjectedHeadingAttributes } from '../helpers/AccordionStore';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';

import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

type Props = DivAttributes;

const defaultProps = {
  'aria-level': 3,
  className: 'accordion__heading'
};

export const SPEC_ERROR = `AccordionItemButton may contain only one child element, which must be an instance of AccordionItemButton.

From the WAI-ARIA spec (https://www.w3.org/TR/wai-aria-practices-1.1/#accordion):

“The button element is the only element inside the heading element. 
That is, if there are other visually persistent elements, they are not included inside the heading element.”
`;

export class AccordionItemHeading extends React.PureComponent<Props> {
  public static defaultProps: typeof defaultProps = defaultProps;

  public static VALIDATE(ref: HTMLDivElement | undefined): void | never {
    if (ref === undefined) {
      throw new Error('ref is undefined');
    }
    if (
      !(
        ref.childElementCount === 1 &&
        ref.firstElementChild &&
        ref.firstElementChild.getAttribute('data-accordion-component') ===
          'AccordionItemButton'
      )
    ) {
      throw new Error(SPEC_ERROR);
    }
  }
  public ref: HTMLDivElement | undefined;

  public setRef = (ref: HTMLDivElement): void => {
    this.ref = ref;
  };

  public componentDidUpdate(): void {
    AccordionItemHeading.VALIDATE(this.ref);
  }

  public componentDidMount(): void {
    AccordionItemHeading.VALIDATE(this.ref);
  }

  public render(): JSX.Element {
    return (
      <div
        data-accordion-component="AccordionItemHeading"
        {...this.props}
        ref={this.setRef}
      />
    );
  }
}

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
