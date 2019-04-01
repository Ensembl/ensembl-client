import React from 'react';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';
import { Consumer, Provider } from './AccordionContext';
import { UUID } from './ItemContext';
import styles from '../css/Accordion.scss';

type AccordionProps = Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, 'onChange'>
> & {
  preExpanded?: UUID[];
  allowMultipleExpanded: boolean;
  allowZeroExpanded: boolean;
  onChange?(args: UUID[]): void;
};

const Accordion = (props: AccordionProps) => {
  const renderAccordion = (): JSX.Element => {
    const {
      preExpanded,
      allowMultipleExpanded,
      allowZeroExpanded,
      onChange,
      ...rest
    } = props;

    return <div data-accordion-component="Accordion" {...rest} />;
  };

  return (
    <Provider
      preExpanded={props.preExpanded}
      allowMultipleExpanded={props.allowMultipleExpanded}
      allowZeroExpanded={props.allowZeroExpanded}
      onChange={props.onChange}
    >
      <Consumer>{renderAccordion}</Consumer>
    </Provider>
  );
};

Accordion.diplayName = DisplayName.Accordion;
Accordion.defaultProps = {
  allowMultipleExpanded: false,
  allowZeroExpanded: true,
  className: styles.accordion
};

export default Accordion;
