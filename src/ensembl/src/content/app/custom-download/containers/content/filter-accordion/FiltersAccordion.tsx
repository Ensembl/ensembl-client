import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/accordion';

import styles from './FiltersAccordion.scss';

import { getFiltersAccordionExpandedPanel } from './state/filterAccordionSelector';
import {
  setFiltersAccordionExpandedPanel,
  resetSelectedFilters,
  updateSelectedFilters
} from './state/filterAccordionActions';

import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

import { Filters } from 'src/content/app/custom-download/types/Filters';

import { Genes, Proteins } from './sections';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';
import { ReactComponent as ResetIcon } from 'static/img/shared/reset.svg';

type Props = StateProps & DispatchProps;

const FiltersAccordion = (props: Props) => {
  useEffect(() => {
    props.updateSelectedFilters(
      customDownloadStorageService.getSelectedFilters()
    );
  }, []);

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterHint}>
        Filter the results to download only the information you need - the
        filtered content will appear as rows in a table
      </div>
      <span className={styles.resetIcon} onClick={onReset}>
        <ImageButton
          buttonStatus={ImageButtonStatus.ACTIVE}
          description={'Reset filters'}
          image={ResetIcon}
        />
      </span>
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
            <Proteins />
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

type DispatchProps = {
  setFiltersAccordionExpandedPanel: (
    setFiltersAccordionExpandedPanel: string
  ) => void;
  resetSelectedFilters: () => void;
  updateSelectedFilters: (filters: Filters) => void;
};

const mapDispatchToProps: DispatchProps = {
  setFiltersAccordionExpandedPanel,
  resetSelectedFilters,
  updateSelectedFilters
};

type StateProps = {
  expandedPanel: string;
};

const mapStateToProps = (state: RootState): StateProps => ({
  expandedPanel: getFiltersAccordionExpandedPanel(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersAccordion);
