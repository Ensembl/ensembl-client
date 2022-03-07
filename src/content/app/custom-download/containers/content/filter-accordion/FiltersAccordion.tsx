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
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
  AccordionItemPermanentBlock
} from 'src/shared/components/accordion';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import BadgedButton from 'src/shared/components/badged-button/BadgedButton';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import FiltersAccordionSection from 'src/content/app/custom-download/containers/content/filter-accordion/sections/FiltersAccordionSection';
import {
  setFiltersAccordionExpandedPanel,
  resetSelectedFilters,
  updateSelectedFilters
} from 'src/content/app/custom-download/state/filters/filtersActions';
import {
  getFiltersAccordionExpandedPanels,
  getSelectedFilters
} from 'src/content/app/custom-download/state/filters/filtersSelector';
import { getPreviewResult } from 'src/content/app/custom-download/state/customDownloadSelectors';

import ResetIcon from 'static/icons/icon_delete.svg';

import type JSONValue from 'src/shared/types/JSON';
import { Status } from 'src/shared/types/status';

import styles from './FiltersAccordion.scss';

type FiltersAccordionProps = {
  expandedPanels: string[];
  selectedFilters: JSONValue;
  preview: JSONValue;
  setFiltersAccordionExpandedPanel: (expandedPanels: string[]) => void;
  resetSelectedFilters: () => void;
  updateSelectedFilters: (filters: JSONValue) => void;
};

const getSelectedFiltersCount = (
  filters: JSONValue,
  selectedFiltersCount = 0
) => {
  if (!filters) {
    return 0;
  }
  Object.keys(filters).forEach((key: string) => {
    if (typeof filters[key] === 'boolean' && filters[key] === true) {
      selectedFiltersCount++;
    } else if (typeof filters[key] === 'string' && filters[key] !== '') {
      selectedFiltersCount++;
    } else if (
      Array.isArray(filters[key]) &&
      (filters[key] as string[]).length > 0
    ) {
      selectedFiltersCount++;
    } else if (typeof filters[key] === 'object') {
      selectedFiltersCount = getSelectedFiltersCount(
        filters[key] as JSONValue,
        selectedFiltersCount
      );
    }
  });

  return selectedFiltersCount;
};

const FiltersAccordion = (props: FiltersAccordionProps) => {
  const formatAccordionTitle = (expandedPanel: string, title: string) => {
    if (expandedPanel !== props.expandedPanels[0]) {
      return <span>{title}</span>;
    }

    return (
      <span className={styles.accordionExpandedTitle}>
        Filter by <span> {title} </span>
      </span>
    );
  };

  const accordionOnChange = (newExpandedPanels: string[]) => {
    props.setFiltersAccordionExpandedPanel(newExpandedPanels);
  };

  const resultCount: number = props.preview.resultCount
    ? (props.preview.resultCount as number)
    : 0;

  const buildSection = (options: {
    section: string;
    showOverview?: boolean;
  }) => {
    return (
      <FiltersAccordionSection
        section={options.section}
        showOverview={options.showOverview}
      />
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <BadgedButton
          badgeContent={String(getSelectedFiltersCount(props.selectedFilters))}
          className={styles.titleBadge}
        >
          <div className={styles.title}>Filters</div>
        </BadgedButton>

        <div className={styles.resultCounter}>
          <span>{getCommaSeparatedNumber(resultCount)}</span> results
        </div>

        <span className={styles.resetIcon} onClick={props.resetSelectedFilters}>
          <ImageButton
            status={Status.UNSELECTED}
            description={'Reset filters'}
            image={ResetIcon}
          />
        </span>
      </div>

      <Accordion
        preExpanded={props.expandedPanels}
        onChange={accordionOnChange}
      >
        <AccordionItem uuid={'genes'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('genes', 'Genes & transcripts')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            {buildSection({ section: 'genes' })}
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            {props.expandedPanels[0] !== 'genes' && (
              <div className={styles.permanentBlock}>
                {buildSection({
                  section: 'genes',
                  showOverview: true
                })}
              </div>
            )}
          </AccordionItemPermanentBlock>
        </AccordionItem>

        <AccordionItem uuid={'regions'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('regions', 'Regions')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <div className={styles.temporaryContentPadding}>
              Regions filters
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'variants'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('variants', 'Variants')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <div className={styles.temporaryContentPadding}>
              Variants filters
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'phenotypes'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('phenotypes', 'Phenotypes')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <div className={styles.temporaryContentPadding}>
              Phenotypes filters
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'protein'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('protein', 'Protein domains & families')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <div className={styles.temporaryContentPadding}>
              Protein domains & families filters
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'homologues'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('homologues', 'Homologues')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <div className={styles.temporaryContentPadding}>
              Homologues filters
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const mapDispatchToProps = {
  setFiltersAccordionExpandedPanel,
  resetSelectedFilters,
  updateSelectedFilters
};

const mapStateToProps = (state: RootState) => ({
  expandedPanels: getFiltersAccordionExpandedPanels(state),
  selectedFilters: getSelectedFilters(state),
  preview: getPreviewResult(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(FiltersAccordion);
