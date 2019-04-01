import React from 'react';
import { InjectedButtonAttributes } from '../helpers/AccordionStore';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';

import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

import styles from '../css/Accordion.scss';

type Props = DivAttributes & {
  toggleExpanded(): void;
};

export const AccordionItemButton = (props: Props) => {
  const { toggleExpanded, ...rest } = props;

  return (
    <div
      {...rest}
      onClick={toggleExpanded}
      data-accordion-component="AccordionItemButton"
    />
  );
};

AccordionItemButton.defaultProps = {
  className: styles.accordionButton
};

type WrapperProps = Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, keyof InjectedButtonAttributes>
>;

const AccordionItemButtonWrapper: React.SFC<WrapperProps> = (
  props: WrapperProps
): JSX.Element => (
  <ItemConsumer>
    {(itemContext: ItemContext): JSX.Element => {
      const { toggleExpanded, buttonAttributes } = itemContext;

      return (
        <AccordionItemButton
          toggleExpanded={toggleExpanded}
          {...props}
          {...buttonAttributes}
        />
      );
    }}
  </ItemConsumer>
);

AccordionItemButtonWrapper.displayName = DisplayName.AccordionItemButton;

export default AccordionItemButtonWrapper;
