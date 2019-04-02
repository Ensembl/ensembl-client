import React from 'react';
import { InjectedButtonAttributes } from '../helpers/AccordionStore';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';
import classNames from 'classnames';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

import defaultStyles from '../css/Accordion.scss';

type Props = DivAttributes & {
  extendStyles: boolean;
  toggleExpanded(): void;
};

export const AccordionItemButton = (props: Props) => {
  const { className, extendStyles, toggleExpanded, ...rest } = props;

  let styles = className;

  if (extendStyles) {
    styles = classNames(defaultStyles.accordionButtonDefault, className);
  }

  return (
    <div
      {...rest}
      className={styles}
      onClick={toggleExpanded}
      data-accordion-component="AccordionItemButton"
    />
  );
};

AccordionItemButton.defaultProps = {
  extendStyles: true
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
