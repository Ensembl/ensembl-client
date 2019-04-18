import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared';

import {
  getGeneFilters,
  getGeneTypeFilters,
  getTranscriptTypeFilters,
  getFiltersAccordionExpandedGenePanels
} from 'src/content/app/custom-download/customDownloadSelectors';
import {
  setGeneTypeFilters,
  setGeneFilters,
  setTranscriptTypeFilters,
  setFiltersAccordionExpandedGenePanels
} from 'src/content/app/custom-download/customDownloadActions';
import CheckBoxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import {
  geneFiltersGrid,
  geneTypeFiltersGrid,
  transcriptTypeFiltersGrid
} from 'src/content/app/custom-download/sampledata';

import styles from './Styles.scss';

type Props = StateProps & DispatchProps;

const Genes = (props: Props) => {
  const geneOnChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      const newGeneFilters = { ...props.geneFilters };
      if (!newGeneFilters[subSection]) {
        newGeneFilters[subSection] = {};
      }

      if (!newGeneFilters[subSection][attributeId]) {
        newGeneFilters[subSection][attributeId] = {};
      }

      newGeneFilters[subSection][attributeId].checkedStatus = status;
      geneFiltersGrid[subSection][attributeId].checkedStatus = status;
      props.setGeneFilters(newGeneFilters);
    },
    [props.geneFilters, geneFiltersGrid]
  );

  const geneTypeOnChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      const newGeneTypeFilters = { ...props.geneTypeFilters };

      if (!newGeneTypeFilters[subSection]) {
        newGeneTypeFilters[subSection] = {};
      }

      if (!newGeneTypeFilters[subSection][attributeId]) {
        newGeneTypeFilters[subSection][attributeId] = {};
      }

      geneTypeFiltersGrid[subSection][attributeId].checkedStatus = status;
      newGeneTypeFilters[subSection][attributeId].checkedStatus = status;
      props.setGeneTypeFilters(newGeneTypeFilters);
    },
    [props.geneTypeFilters, geneTypeFiltersGrid]
  );

  const transcriptTypeOnChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      const newTranscriptTypeFilters = { ...props.transcriptTypeFilters };

      if (!newTranscriptTypeFilters[subSection]) {
        newTranscriptTypeFilters[subSection] = {};
      }

      if (!newTranscriptTypeFilters[subSection][attributeId]) {
        newTranscriptTypeFilters[subSection][attributeId] = {};
      }
      transcriptTypeFiltersGrid[subSection][attributeId].checkedStatus = status;
      newTranscriptTypeFilters[subSection][attributeId].checkedStatus = status;
      props.setTranscriptTypeFilters(newTranscriptTypeFilters);
    },
    [props.transcriptTypeFilters, transcriptTypeFiltersGrid]
  );

  const accordionOnChange = useCallback(
    (newExpandedPanels: []) => {
      props.setFiltersAccordionExpandedGenePanels(newExpandedPanels);
    },
    [props.expandedPanels]
  );

  return (
    <>
      <div className={styles.checkboxGridWrapper}>
        <CheckBoxGrid
          checkboxOnChange={geneOnChangeHandler}
          gridData={geneFiltersGrid}
          columns={1}
        />
      </div>
      <Accordion
        allowMultipleExpanded={true}
        className={styles.geneAccordion}
        onChange={accordionOnChange}
        preExpanded={props.expandedPanels}
      >
        <AccordionItem uuid={'gene_type'}>
          <AccordionItemHeading>
            <AccordionItemButton className={styles.geneAccordionButton}>
              Gene type
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <CheckBoxGrid
              checkboxOnChange={geneTypeOnChangeHandler}
              gridData={geneTypeFiltersGrid}
              columns={3}
            />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'biotype'}>
          <AccordionItemHeading>
            <AccordionItemButton className={styles.geneAccordionButton}>
              Transcript type
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <CheckBoxGrid
              checkboxOnChange={transcriptTypeOnChangeHandler}
              gridData={transcriptTypeFiltersGrid}
              columns={3}
            />
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

type DispatchProps = {
  setGeneFilters: (setGeneFilters: any) => void;
  setGeneTypeFilters: (setGeneTypeFilters: any) => void;
  setTranscriptTypeFilters: (setTranscriptTypeFilters: any) => void;
  setFiltersAccordionExpandedGenePanels: (
    setVariationAccordionExpandedPanels: any
  ) => void;
};

const mapDispatchToProps: DispatchProps = {
  setGeneFilters,
  setGeneTypeFilters,
  setTranscriptTypeFilters,
  setFiltersAccordionExpandedGenePanels
};

type StateProps = {
  geneFilters: any;
  geneTypeFilters: any;
  transcriptTypeFilters: any;
  expandedPanels: [];
};

const mapStateToProps = (state: RootState): StateProps => ({
  geneFilters: getGeneFilters(state),
  geneTypeFilters: getGeneTypeFilters(state),
  transcriptTypeFilters: getTranscriptTypeFilters(state),
  expandedPanels: getFiltersAccordionExpandedGenePanels(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
