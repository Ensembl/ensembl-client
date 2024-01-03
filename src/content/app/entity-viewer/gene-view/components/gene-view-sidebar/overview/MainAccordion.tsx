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
import classNames from 'classnames';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';

import styles from './GeneOverview.module.css';

/*  
  FIXME: 
  We started using real data from Thoas, and are not yet getting anything that can be rendered in this accordion. 
  When more data becomes available, please refer to the PR https://github.com/Ensembl/ensembl-client/pull/433
  and check if some of the deleted code segments can be reused to display the new data.
*/

export type AccordionSectionID = 'function' | 'other_data_sets';

const MainAccordion = () => {
  const disabledAccordionButtonClass = classNames(
    styles.entityViewerAccordionButton,
    {
      [styles.entityViewerAccordionButtonDisabled]: true
    }
  );

  return (
    <div className={styles.accordionContainer}>
      <Accordion
        className={styles.entityViewerAccordion}
        allowMultipleExpanded={true}
      >
        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'function'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton
              className={disabledAccordionButtonClass}
              disabled={true}
            >
              Function
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            No data available
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'other_data_sets'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton
              className={disabledAccordionButtonClass}
              disabled={true}
            >
              Other data sets
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>No data available</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MainAccordion;
