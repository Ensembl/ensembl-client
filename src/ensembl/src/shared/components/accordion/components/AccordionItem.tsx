import React from 'react';
import { DivAttributes } from '../helpers/types';

import { Provider as ItemProvider, UUID } from './ItemContext';
import classNames from 'classnames';
import { generateId } from 'src/shared/helpers/generateId';

import defaultStyles from '../css/Accordion.scss';

type Props = DivAttributes & {
  extendDefaultStyles: boolean;
  uuid?: UUID;
};

const AccordionItem = (props: Props) => {
  const instanceUuid: UUID = generateId();

  const {
    uuid = instanceUuid,
    extendDefaultStyles,
    className,
    ...rest
  } = props;

  let styles = className;

  if (extendDefaultStyles) {
    styles = classNames(defaultStyles.accordionItemDefault, className);
  }

  return (
    <ItemProvider uuid={uuid}>
      <div
        data-accordion-component="AccordionItem"
        {...rest}
        className={styles}
      />
    </ItemProvider>
  );
};

AccordionItem.defaultProps = {
  extendDefaultStyles: true
};

export default AccordionItem;
