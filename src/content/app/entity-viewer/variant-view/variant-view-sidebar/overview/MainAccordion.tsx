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

import { getReferenceAndAltAlleles } from 'src/shared/helpers/variantHelpers';
import { EntityViewerVariantDefaultQueryResult } from 'src/content/app/entity-viewer/state/api/queries/variantDefaultQuery';

import styles from './VariantOverview.module.css';

export type AccordionSectionID = 'function' | 'other_data_sets';

const MainAccordion = (props: EntityViewerVariantDefaultQueryResult) => {
  const { variant } = props;
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
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
              Alleles
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <Alleles alleles={variant.alleles} />
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
              In this region
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>No data available</div>
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
              Synonyms
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

type AlleleProps = {
  alleles: {
    allele_sequence: string;
    reference_sequence: string;
    allele_type: {
      value: string;
    };
  }[];
};
const Alleles = (props: AlleleProps) => {
  const { referenceAllele, alternativeAlleles } = getReferenceAndAltAlleles(
    props.alleles
  );

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.label}>Ref</div>
        <div className={styles.value}>
          {referenceAllele?.reference_sequence}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label}>Alt</div>
        <div className={styles.value}>
          {alternativeAlleles.map((allele, index) => (
            <div key={index}>{allele.allele_sequence}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MainAccordion;
