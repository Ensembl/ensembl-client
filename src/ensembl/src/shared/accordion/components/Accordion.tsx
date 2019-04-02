import React from 'react';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';
import { Consumer, Provider } from './AccordionContext';
import { UUID } from './ItemContext';
import defaultStyles from '../css/Accordion.scss';
import classNames from 'classnames';

type AccordionProps = Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, 'onChange'>
> & {
  preExpanded?: UUID[];
  allowMultipleExpanded: boolean;
  allowZeroExpanded: boolean;
  className?: any;
  extendStyles: boolean;
  onChange?(args: UUID[]): void;
};

const Accordion = (props: AccordionProps) => {
  const {
    preExpanded,
    allowMultipleExpanded,
    allowZeroExpanded,
    className,
    extendStyles,
    onChange,
    ...rest
  } = props;

  const renderAccordion = (): JSX.Element => {
    let styles = className;

    if (extendStyles) {
      styles = classNames(defaultStyles.accordionDefault, className);
    }

    return (
      <div data-accordion-component="Accordion" className={styles} {...rest} />
    );
  };

  return (
    <Provider
      preExpanded={preExpanded}
      allowMultipleExpanded={allowMultipleExpanded}
      allowZeroExpanded={allowZeroExpanded}
      onChange={onChange}
    >
      <Consumer>{renderAccordion}</Consumer>
    </Provider>
  );
};

Accordion.diplayName = DisplayName.Accordion;
Accordion.defaultProps = {
  allowMultipleExpanded: false,
  allowZeroExpanded: true,
  extendStyles: true
};

export default Accordion;
