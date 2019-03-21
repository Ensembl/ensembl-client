import React from 'react';
import styles from './AccordionItemHeader.scss';
import classNames from 'classnames';

import { ReactComponent as AccordianToggle } from './chevron.svg';

const AccordionItemHeader = (props: any) => {
  return (
    <div className={styles.accordionItemHeader}>
      <div
        className={classNames(styles.accordionItemToggle, {
          [styles.expanded]: props.expanded
        })}
        onClick={props.onClick}
      >
        <AccordianToggle />
      </div>

      <div className={styles.accordionItemTitle}>{props.title}</div>
    </div>
  );
};

export default AccordionItemHeader;
