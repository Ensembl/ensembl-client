import React from 'react';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';
import defaultStyles from '../css/Accordion.scss';
import classNames from 'classnames';

type Props = DivAttributes & {
  extendStyles: boolean;
};

const AccordionItemPanel = (props: Props) => {
  const renderChildren = ({ panelAttributes }: ItemContext): JSX.Element => {
    const { className, extendStyles, ...rest } = props;

    let styles = className;

    if (extendStyles) {
      styles = classNames(defaultStyles.accordionPanelDefault, className);
    }
    return (
      <div
        data-accordion-component="AccordionItemPanel"
        {...rest}
        className={styles}
        {...panelAttributes}
      />
    );
  };

  return <ItemConsumer>{renderChildren}</ItemConsumer>;
};

AccordionItemPanel.defaultProps = {
  extendStyles: true
};

AccordionItemPanel.displayName = DisplayName.AccordionItemPanel;

export default AccordionItemPanel;
