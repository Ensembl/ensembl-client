import React from 'react';

import styles from './Accordion.scss';

type AccordionProps = React.HTMLAttributes<HTMLDivElement>;

const Accordion = ({ ...rest }: AccordionProps): JSX.Element => {
  return (
    <section className={styles.accordionContainer}>
      <div {...rest} />
    </section>
  );
};

export default Accordion;
