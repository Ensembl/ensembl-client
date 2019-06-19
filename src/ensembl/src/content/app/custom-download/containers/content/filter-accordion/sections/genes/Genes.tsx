import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/accordion';

import CheckboxWithSelects from 'src/content/app/custom-download/components/checkbox-with-selects/CheckboxWithSelects';
import CheckboxWithRadios from 'src/content/app/custom-download/components/checkbox-with-radios/CheckboxWithRadios';
import { RadioOptions } from 'src/shared/radio/Radio';

import {
  getGeneFilters,
  getGeneTypeFilters,
  getTranscriptTypeFilters,
  getFiltersAccordionExpandedGenePanels,
  getGeneSourceFilters,
  getGencodeAnnotationFilters
} from '../../state/filterAccordionSelector';

import {
  setGeneTypeFilters,
  setGeneSourceFilters,
  setGencodeAnnotationFilters,
  setTranscriptTypeFilters,
  setFiltersAccordionExpandedGenePanels
} from '../../state/filterAccordionActions';
import CheckboxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import {
  geneTypeFiltersGrid,
  transcriptTypeFiltersGrid
} from 'src/content/app/custom-download/sampledata';

import { Option } from 'src/shared/select/Select';

import styles from './Genes.scss';

// Will be fetched from the API when we have one
const geneSourceoptions: Option[] = [
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
// Will be fetched from the API when we have one
const gencodeBasicAnnotationOptions: RadioOptions = [
  {
    value: 'include',
    label: 'Include'
  },
  {
    value: 'exclude',
    label: 'Exclude'
  }
];

type Props = StateProps & DispatchProps;

const Genes = (props: Props) => {
  const geneTypeOnChangeHandler = (
    status: boolean,
    subSection: string,
    attributeId: string
  ) => {
    const newGeneTypeFilters = { ...props.geneTypeFilters };

    if (!newGeneTypeFilters[subSection] && status) {
      newGeneTypeFilters[subSection] = {};

      if (!newGeneTypeFilters[subSection][attributeId]) {
        newGeneTypeFilters[subSection][attributeId] = {};
        newGeneTypeFilters[subSection][attributeId].isChecked = status;
      }
    } else if (!status) {
      delete newGeneTypeFilters[subSection][attributeId];

      // cleanup
      if (Object.keys(newGeneTypeFilters[subSection]).length == 0) {
        delete newGeneTypeFilters[subSection];
      }
    }

    geneTypeFiltersGrid[subSection][attributeId].isChecked = status;
    props.setGeneTypeFilters(newGeneTypeFilters);
  };

  const transcriptTypeOnChangeHandler = (
    status: boolean,
    subSection: string,
    attributeId: string
  ) => {
    const newTranscriptTypeFilters = { ...props.transcriptTypeFilters };
    if (!newTranscriptTypeFilters[subSection] && status) {
      newTranscriptTypeFilters[subSection] = {};

      if (!newTranscriptTypeFilters[subSection][attributeId]) {
        newTranscriptTypeFilters[subSection][attributeId] = {};
        newTranscriptTypeFilters[subSection][attributeId].isChecked = status;
      }
    } else if (!status) {
      delete newTranscriptTypeFilters[subSection][attributeId];
      // cleanup
      if (Object.keys(newTranscriptTypeFilters[subSection]).length == 0) {
        delete newTranscriptTypeFilters[subSection];
      }
    }

    transcriptTypeFiltersGrid[subSection][attributeId].isChecked = status;
    props.setTranscriptTypeFilters(newTranscriptTypeFilters);
  };

  const accordionOnChange = (newExpandedPanels: []) => {
    props.setFiltersAccordionExpandedGenePanels(newExpandedPanels);
  };

  const geneSourceFilterOnChange = (selectedOptions: string[]) => {
    props.setGeneSourceFilters(selectedOptions);
  };

  const gencodeAnnotationFilterOnChange = (
    selectedOption: string | number | boolean
  ) => {
    props.setGencodeAnnotationFilters(selectedOption);
  };

  return (
    <>
      <div className={styles.checkboxGridWrapper}>
        <CheckboxWithSelects
          label={'Gene source'}
          onChange={geneSourceFilterOnChange}
          selectedOptions={props.geneSourceFilters}
          options={geneSourceoptions}
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
            <CheckboxGrid
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
            <CheckboxGrid
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
