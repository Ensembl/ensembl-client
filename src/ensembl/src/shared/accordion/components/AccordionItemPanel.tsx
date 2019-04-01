import React from 'react';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';
import styles from '../css/Accordion.scss';

type Props = DivAttributes;

const AccordionItemPanel = (props: Props) => {
  const renderChildren = ({ panelAttributes }: ItemContext): JSX.Element => {
    return (
      <div
        data-accordion-component="AccordionItemPanel"
        {...props}
        {...panelAttributes}
      />
    );
  };

  return <ItemConsumer>{renderChildren}</ItemConsumer>;
};

AccordionItemPanel.defaultProps = {
  className: styles.accordionPanel
};

AccordionItemPanel.displayName = DisplayName.AccordionItemPanel;

export default AccordionItemPanel;
