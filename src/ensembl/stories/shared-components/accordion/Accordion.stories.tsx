import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'src/shared/accordion/';
import styles from './Accordion.stories.scss';

storiesOf('Components|Shared Components/Accordion', module).add(
  'default',
  () => {
    return (
      <div className={styles.accordionContainer}>
        <Accordion>
          <AccordionItem>
            <AccordionItemTitle>
              <span>Simple title</span>
            </AccordionItemTitle>
            <AccordionItemBody>
              <p>Body content</p>
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemTitle>
              <h3>Complex title</h3>
              <div>With a bit of description</div>
            </AccordionItemTitle>
            <AccordionItemBody>
              <p>Body content</p>
            </AccordionItemBody>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
