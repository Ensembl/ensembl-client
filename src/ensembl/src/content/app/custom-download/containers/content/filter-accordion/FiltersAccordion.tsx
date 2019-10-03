import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';

import { getPreviewResult } from '../../../state/customDownloadSelectors';
import {
  getFiltersAccordionExpandedPanel,
  getSelectedFilters
} from '../../../state/filters/filtersSelector';
import {
  setFiltersAccordionExpandedPanel,
  resetSelectedFilters,
  updateSelectedFilters
} from '../../../state/filters/filtersActions';

import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';
import JSONValue from 'src/shared/types/JSON';

import { Genes } from './sections';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';
import BadgedButton from 'src/shared/components/badged-button/BadgedButton';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';
import { ReactComponent as ResetIcon } from 'static/img/shared/trash.svg';
import styles from './FiltersAccordion.scss';

type Filter = {
  [key: string]: boolean;
};
type SelectedFilters = {
  [key: string]: boolean | string | string[] | Filter;
};

type StateProps = {
  expandedPanel: string;
  selectedFilters: {};
  preview: JSONValue;
};

type DispatchProps = {
  setFiltersAccordionExpandedPanel: (
    setFiltersAccordionExpandedPanel: string
  ) => void;
  resetSelectedFilters: () => void;
  updateSelectedFilters: (filters: JSONValue) => void;
};

const getTotalSelectedFilters = (
  filters: SelectedFilters,
  totalSelectedFilters = 0
) => {
  if (!filters) {
    return 0;
  }
  Object.keys(filters).forEach((key: string) => {
    if (key === 'preExpanded') {
      // Skip preExpanded keys
    } else if (typeof filters[key] === 'boolean' && filters[key] === true) {
      totalSelectedFilters++;
    } else if (typeof filters[key] === 'string' && filters[key] !== '') {
      totalSelectedFilters++;
    } else if (
      Array.isArray(filters[key]) &&
      (filters[key] as string[]).length > 0
    ) {
      totalSelectedFilters++;
    } else if (typeof filters[key] === 'object') {
      totalSelectedFilters = getTotalSelectedFilters(
        filters[key] as SelectedFilters,
        totalSelectedFilters
      );
    }
  });

  return totalSelectedFilters;
};

type Props = StateProps & DispatchProps;

const FiltersAccordion = (props: Props) => {
  const formatAccordionTitle = (expandedPanel: string, title: string) => {
    if (expandedPanel !== props.expandedPanel) {
      return <span>{title}</span>;
    }

    return (
      <span className={styles.accordionExpandedTitle}>
        Filter by <span> {title} </span>
      </span>
    );
  };

  const accordionOnChange = (newExpandedPanels: string[]) => {
    props.setFiltersAccordionExpandedPanel(newExpandedPanels[0]);
  };

  const onReset = () => {
    props.resetSelectedFilters();
    customDownloadStorageService.saveSelectedFilters({});
  };

  const resultCount: number = props.preview.resultCount
    ? (props.preview.resultCount as number)
    : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <BadgedButton
          badgeContent={String(getTotalSelectedFilters(props.selectedFilters))}
          className={styles.titleBadge}
        >
          <div className={styles.title}>Filters</div>
        </BadgedButton>

        <div className={styles.resultCounter}>
          <span>{getCommaSeparatedNumber(resultCount)}</span> results
        </div>

        <span className={styles.resetIcon} onClick={onReset}>
          <ImageButton
            buttonStatus={ImageButtonStatus.ACTIVE}
            description={'Reset filters'}
            image={ResetIcon}
          />
        </span>
      </div>

      <Accordion
        preExpanded={Array(1).fill(props.expandedPanel)}
        onChange={accordionOnChange}
      >
        <AccordionItem uuid={'genes'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('genes', 'Genes & transcripts')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <Genes />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'regions'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('regions', 'Regions')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <div className={styles.tempPadding}>Regions filters</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'variants'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('variants', 'Variants')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <div className={styles.tempPadding}>Variants filters</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'phenotypes'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('phenotypes', 'Phenotypes')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <div className={styles.tempPadding}>Phenotypes filters</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'protein'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('protein', 'Protein domains & families')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItemPanel}>
            <div className={styles.tempPadding}>
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
            <div className={styles.tempPadding}>Homologues filters</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const mapDispatchToProps: DispatchProps = {
  setFiltersAccordionExpandedPanel,
  resetSelectedFilters,
  updateSelectedFilters
};

const mapStateToProps = (state: RootState): StateProps => ({
  expandedPanel: getFiltersAccordionExpandedPanel(state),
  selectedFilters: getSelectedFilters(state),
  preview: getPreviewResult(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersAccordion);
