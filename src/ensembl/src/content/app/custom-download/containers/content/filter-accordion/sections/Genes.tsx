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

import CheckboxMultiselect from '../../../../components/checkbox-multiselect/CheckboxMultiselect';

import {
  getGeneFilters,
  getGeneTypeFilters,
  getTranscriptTypeFilters,
  getFiltersAccordionExpandedGenePanels,
  getGeneSourceFilters
} from '../filterAccordionSelector';

import {
  setGeneTypeFilters,
  setGeneSourceFilters,
  setTranscriptTypeFilters,
  setFiltersAccordionExpandedGenePanels
} from '../filterAccordionActions';
import CheckBoxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import {
  geneTypeFiltersGrid,
  transcriptTypeFiltersGrid
} from 'src/content/app/custom-download/sampledata';

import styles from './Styles.scss';

type Props = StateProps & DispatchProps;

const Genes = (props: Props) => {
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

  const geneSourceSelectOptions = [
    {
      value: 'ensembl',
      label: 'ensembl',
      isSelected: false
    },
    {
      value: 'ensembl_havana',
      label: 'ensembl_havana',
      isSelected: false
    },
    {
      value: 'havana',
      label: 'havana',
      isSelected: false
    },
    {
      value: 'insdc',
      label: 'insdc',
      isSelected: false
    },
    {
      value: 'mirbase',
      label: 'mirbase',
      isSelected: false
    }
  ];

  const geneSourceFilterOnChange = useCallback(
    (selectedOptions: []) => {
      props.setGeneSourceFilters(selectedOptions);
    },
    [props.geneSourceFilters]
  );

  return (
    <>
      <div className={styles.checkboxGridWrapper}>
        <CheckboxMultiselect
          label={'Gene source'}
          onChange={geneSourceFilterOnChange}
          selectedOptions={props.geneSourceFilters}
          selectOptions={geneSourceSelectOptions}
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
  setGeneTypeFilters: (setGeneTypeFilters: any) => void;
  setGeneSourceFilters: (setGeneSourceFilters: any) => void;
  setTranscriptTypeFilters: (setTranscriptTypeFilters: any) => void;
  setFiltersAccordionExpandedGenePanels: (
    setVariationAccordionExpandedPanels: any
  ) => void;
};

const mapDispatchToProps: DispatchProps = {
  setGeneTypeFilters,
  setGeneSourceFilters,
  setTranscriptTypeFilters,
  setFiltersAccordionExpandedGenePanels
};

type StateProps = {
  geneFilters: any;
  geneTypeFilters: any;
  transcriptTypeFilters: any;
  expandedPanels: [];
  geneSourceFilters: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  geneFilters: getGeneFilters(state),
  geneTypeFilters: getGeneTypeFilters(state),
  transcriptTypeFilters: getTranscriptTypeFilters(state),
  expandedPanels: getFiltersAccordionExpandedGenePanels(state),
  geneSourceFilters: getGeneSourceFilters(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
