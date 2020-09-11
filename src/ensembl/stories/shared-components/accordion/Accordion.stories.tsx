/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
  AccordionItemPermanentBlock
} from 'src/shared/components/accordion';
import styles from './Accordion.stories.scss';

export default {
  title: 'Components/Shared Components/Accordion'
};

export const DefaultAccordion = () => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item One</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item Two</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item Two content</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

DefaultAccordion.storyName = 'default';

export const MultipleItemsAccordion = () => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion allowMultipleExpanded={true}>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item One</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item Two</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item Two content</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

MultipleItemsAccordion.storyName = 'allow opening of multiple items';

export const AccordionWithPreExpandedItem = () => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion allowMultipleExpanded={true} preExpanded={[1]}>
        <AccordionItem uuid={1}>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item One</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem uuid={2}>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item Two</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item Two content</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

AccordionWithPreExpandedItem.storyName = 'pre-expanded item';

export const AccordionWithPermanentBlock = () => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion allowMultipleExpanded={true}>
        <AccordionItem uuid={1}>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item One</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            <div className={styles.accordionPermanentBlock}>
              This content belongs to Item One and will always be visible.
            </div>
          </AccordionItemPermanentBlock>
        </AccordionItem>
        <AccordionItem uuid={2}>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item Two</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item Two content</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

AccordionWithPermanentBlock.storyName = 'with permanent block';

export const AccordionBottomRight = () => {
  return (
    <div className={styles.accordionBottomRight}>
      <Accordion allowMultipleExpanded={true}>
        <AccordionItem uuid={1}>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item One</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem uuid={2}>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item Two</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item Two content</div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem uuid={3}>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item Three</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item Three content</div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem uuid={4}>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item Four</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item Four content</div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem uuid={5}>
          <AccordionItemHeading>
            <AccordionItemButton>Accordion Item Five</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item Five content</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

AccordionBottomRight.storyName = 'positioned to bottom right';

export const AccordionWithDisabledItems = () => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion className={styles.entityViewerAccordion}>
        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading>
            <AccordionItemButton disabled={true}>Function</AccordionItemButton>
          </AccordionItemHeading>
        </AccordionItem>
        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading>
            <AccordionItemButton disabled={true}>Function</AccordionItemButton>
          </AccordionItemHeading>
        </AccordionItem>
        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
              Sequence
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>Sequence content</div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading>
            <AccordionItemButton disabled={true}>
              Secondary structure
            </AccordionItemButton>
          </AccordionItemHeading>
        </AccordionItem>
        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading>
            <AccordionItemButton disabled={true}>History</AccordionItemButton>
          </AccordionItemHeading>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

AccordionWithDisabledItems.storyName = 'with disabled items';
