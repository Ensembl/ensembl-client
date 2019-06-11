import React, { useCallback } from 'react';
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
import { setFiltersAccordionExpandedPanel } from './state/filterAccordionActions';

import { Genes } from './sections';

type Props = StateProps & DispatchProps;

const Filters = (props: Props) => {
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

  const accordionOnChange = useCallback(
    (newExpandedPanels: string[]) => {
      props.setFiltersAccordionExpandedPanel(newExpandedPanels[0]);
    },
    [props.expandedPanel]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterHint}>
        Filter the results to download only the information you need - the
        filtered content will appear as rows in a table
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
            <div className={styles.tempPadding}>Protein filters</div>
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
};

const mapDispatchToProps: DispatchProps = {
  setFiltersAccordionExpandedPanel
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
)(Filters);
