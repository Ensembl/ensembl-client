import React from 'react';
import { storiesOf } from '@storybook/react';

import Accordion from 'src/shared/accordion/Accordion';

import AccordionItem from 'src/shared/accordion/accordion-item/AccordionItem';
import AccordionItemHeader from 'src/shared/accordion/accordion-item/accordion-item-header/AccordionItemHeader';
import styles from './Accordion.stories.scss';

storiesOf('Components|Shared Components/Accordion', module).add(
  'default',
  () => {
    return (
      <div className={styles.accordionContainer}>
        <Accordion>
          <AccordionItem>
            <AccordionItemHeader title="Item 1" />
          </AccordionItem>

          <AccordionItem>
            <AccordionItemHeader title="Item 2" />
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
