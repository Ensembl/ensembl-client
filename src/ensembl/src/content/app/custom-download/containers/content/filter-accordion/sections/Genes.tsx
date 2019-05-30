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

import CheckboxWithSelects from '../../../../components/checkbox-with-selects/CheckboxWithSelects';
import CheckboxWithRadios from '../../../../components/checkbox-with-radios/CheckboxWithRadios';

import {
  getGeneFilters,
  getGeneTypeFilters,
  getTranscriptTypeFilters,
  getFiltersAccordionExpandedGenePanels,
  getGeneSourceFilters,
  getGencodeAnnotationFilters
} from '../filterAccordionSelector';

import {
  setGeneTypeFilters,
  setGeneSourceFilters,
  setGencodeAnnotationFilters,
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
      label: 'Ensembl',
      isSelected: false
    },
    {
      value: 'ensembl_havana',
      label: 'Ensembl Havana',
      isSelected: false
    },
    {
      value: 'havana',
      label: 'Havana',
      isSelected: false
    },
    {
      value: 'insdc',
      label: 'INSDC',
      isSelected: false
    },
    {
      value: 'mirbase',
      label: 'Mirbase',
      isSelected: false
    }
  ];

  const gencodeBasicAnnotationOptions = [
    {
      value: 'include',
      label: 'Include'
    },
    {
      value: 'exclude',
      label: 'Exclude'
    }
  ];

  const geneSourceFilterOnChange = useCallback(
    (selectedOptions: []) => {
      props.setGeneSourceFilters(selectedOptions);
    },
    [props.geneSourceFilters]
  );

  const gencodeAnnotationFilterOnChange = useCallback(
    (selectedOption: string) => {
      props.setGencodeAnnotationFilters(selectedOption);
    },
    [props.gencodeAnnotationFilters]
  );

  return (
    <>
      <div className={styles.checkboxGridWrapper}>
        <CheckboxWithSelects
          label={'Gene source'}
          onChange={geneSourceFilterOnChange}
          selectedOptions={props.geneSourceFilters}
          selectOptions={geneSourceSelectOptions}
        />
        <CheckboxWithRadios
          label={'GENCODE basic annotation'}
          onChange={gencodeAnnotationFilterOnChange}
          selectedOption={props.gencodeAnnotationFilters}
          radioOptions={gencodeBasicAnnotationOptions}
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
  setGencodeAnnotationFilters: (setGencodeAnnotationFilters: any) => void;
  setTranscriptTypeFilters: (setTranscriptTypeFilters: any) => void;
  setFiltersAccordionExpandedGenePanels: (
    setVariationAccordionExpandedPanels: any
  ) => void;
};

const mapDispatchToProps: DispatchProps = {
  setGeneTypeFilters,
  setGeneSourceFilters,
  setGencodeAnnotationFilters,
  setTranscriptTypeFilters,
  setFiltersAccordionExpandedGenePanels
};

type StateProps = {
  geneFilters: any;
  geneTypeFilters: any;
  transcriptTypeFilters: any;
  expandedPanels: [];
  geneSourceFilters: any;
  gencodeAnnotationFilters: string;
};

const mapStateToProps = (state: RootState): StateProps => ({
  geneFilters: getGeneFilters(state),
  geneTypeFilters: getGeneTypeFilters(state),
  transcriptTypeFilters: getTranscriptTypeFilters(state),
  expandedPanels: getFiltersAccordionExpandedGenePanels(state),
  geneSourceFilters: getGeneSourceFilters(state),
  gencodeAnnotationFilters: getGencodeAnnotationFilters(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
