import React from 'react';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';
import { nextUuid } from '../helpers/uuid';
import { Provider as ItemProvider, UUID } from './ItemContext';
import styles from '../css/Accordion.scss';

type Props = DivAttributes & {
  uuid?: UUID;
};

const AccordionItem = (props: Props) => {
  const instanceUuid: UUID = nextUuid();

  const { uuid = instanceUuid, ...rest } = props;

  return (
    <ItemProvider uuid={uuid}>
      <div data-accordion-component="AccordionItem" {...rest} />
    </ItemProvider>
  );
};

AccordionItem.displayName = DisplayName.AccordionItem;
AccordionItem.defaultProps = {
  className: styles.accordionItem
};

export default AccordionItem;
