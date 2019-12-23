import React from 'react';
import { InjectedButtonAttributes } from '../helpers/AccordionStore';
import { DivAttributes } from '../helpers/types';
import classNames from 'classnames';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

import defaultStyles from '../css/Accordion.scss';
import noop from 'lodash/noop';

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
      { [defaultStyles.accordionButtonDefaultDisabled]: props.disabled },
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

export default AccordionItemButtonWrapper;
