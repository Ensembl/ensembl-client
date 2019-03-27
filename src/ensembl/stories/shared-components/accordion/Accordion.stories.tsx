import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
  AccordionItemState
} from 'src/shared/accordion/';
import styles from './Accordion.stories.scss';

storiesOf('Components|Shared Components/Accordion', module)
  .add('default', () => {
    return (
      <div className={styles.accordionContainer}>
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Accordion Item One</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className={styles.accordion_body}>Item One content</div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Accordion Item Two</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className={styles.accordion_body}>Item Two content</div>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    );
  })
  .add('Allow multiple', () => {
    return (
      <div className={styles.accordionContainer}>
        <Accordion allowMultipleExpanded={true}>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Accordion Item One</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className={styles.accordion_body}>Item One content</div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Accordion Item Two</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className={styles.accordion_body}>Item Two content</div>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    );
  })
  .add('Pre-expanded Item', () => {
    return (
      <div className={styles.accordionContainer}>
        <Accordion allowMultipleExpanded={true} preExpanded={[1]}>
          <AccordionItem uuid={1}>
            <AccordionItemHeading>
              <AccordionItemButton>Accordion Item One</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className={styles.accordion_body}>Item One content</div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem uuid={2}>
            <AccordionItemHeading>
              <AccordionItemButton>Accordion Item Two</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className={styles.accordion_body}>Item Two content</div>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    );
  });
