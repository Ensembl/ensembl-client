import React, { useState } from 'react';
import styles from './AccordionItem.scss';

type AccordionProps = React.HTMLAttributes<HTMLDivElement>;

const AccordionItem = ({ ...rest }: AccordionProps): JSX.Element => {
  const [itemOpen, toggleItem] = useState(false);

  const toggleAccordianItem = () => {
    toggleItem(!itemOpen);
  };

  return (
    <div
      className={styles.AccordionItem}
      {...rest}
      onClick={toggleAccordianItem}
    />
  );
};

export default AccordionItem;
