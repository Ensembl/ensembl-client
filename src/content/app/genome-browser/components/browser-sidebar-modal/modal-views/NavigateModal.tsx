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

import { memo } from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel
} from 'src/shared/components/accordion';
import NavigateRegionModal from './navigate-modal/RegionNavigation';
import NavigateLocationModal from './navigate-modal/LocationNavigation';

import styles from './navigate-modal/NavigateModal.module.css';

const NavigateModal = () => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion className={styles.navigateAccordion}>
        <AccordionItem className={styles.navigateAccordionItem}>
          <AccordionItemHeading>
            <AccordionItemButton className={styles.navigateAccordionItemButton}>
              Navigate this region
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.navigateAccordionPanel}>
            <NavigateRegionModal />
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem className={styles.navigateAccordionItem}>
          <AccordionItemHeading>
            <AccordionItemButton className={styles.navigateAccordionItemButton}>
              Go to new location
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.navigateAccordionPanel}>
            <NavigateLocationModal />
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default memo(NavigateModal);
