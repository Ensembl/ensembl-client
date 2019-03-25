import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'src/shared/accordion/';
import styles from './Accordion.stories.scss';

storiesOf('Components|Shared Components/Accordion', module)
  .add('default', () => {
    return (
      <div className={styles.accordionContainer}>
        <Accordion>
          <AccordionItem>
            <AccordionItemTitle>
              <div className={styles.accordion_title}>
                <span>Title One</span>
              </div>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className={styles.accordion_body}>
                <span>Body content one</span>
              </div>
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemTitle>
              <div className={styles.accordion_title}>
                <h3>Title Two</h3>
                <div>With a bit of description</div>
              </div>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className={styles.accordion_body}>
                <span>Body content two</span>
              </div>
            </AccordionItemBody>
          </AccordionItem>
        </Accordion>
      </div>
    );
  })
  .add('Allow multiple', () => {
    return (
      <div className={styles.accordionContainer}>
        <Accordion accordion={false}>
          <AccordionItem>
            <AccordionItemTitle>
              <div className={styles.accordion_title}>
                <span>Title One</span>
              </div>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className={styles.accordion_body}>
                <span>Body content one</span>
              </div>
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemTitle>
              <div className={styles.accordion_title}>
                <h3>Title Two</h3>
                <div>With a bit of description</div>
              </div>
            </AccordionItemTitle>
            <AccordionItemBody>
              <div className={styles.accordion_body}>
                <span>Body content two</span>
              </div>
            </AccordionItemBody>
          </AccordionItem>
        </Accordion>
      </div>
    );
  });
