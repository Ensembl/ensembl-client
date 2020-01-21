import React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';

import { InjectedButtonAttributes } from '../helpers/AccordionStore';
import { DivAttributes } from '../helpers/types';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

import defaultStyles from '../css/Accordion.scss';

type Props = DivAttributes & {
  extendDefaultStyles: boolean;
  toggleExpanded(): void;
  disabled?: boolean;
};

export const AccordionItemButton = (props: Props) => {
  const {
    className,
    extendDefaultStyles,
    toggleExpanded,
    disabled,
    ...rest
  } = props;

  let styles = className;

  if (extendDefaultStyles) {
    styles = classNames(
      defaultStyles.accordionButtonDefault,
      { [defaultStyles.accordionButtonDisabled]: props.disabled },
      className
    );
  }

  return (
    <div
      {...rest}
      className={styles}
      onClick={disabled ? noop : toggleExpanded}
      data-accordion-component="AccordionItemButton"
    />
  );
};

AccordionItemButton.defaultProps = {
  extendDefaultStyles: true
};

type WrapperProps = { disabled?: boolean } & Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, keyof InjectedButtonAttributes>
>;

const AccordionItemButtonWrapper = (props: WrapperProps) => (
  <ItemConsumer>
    {(itemContext: ItemContext) => {
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

export default AccordionItemButtonWrapper;
