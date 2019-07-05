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
import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';
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

import filters from 'src/content/app/custom-download/sample-data/filters';

import styles from './Genes.scss';

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

  return <>{ContentBuilder(filters['genes'])}</>;
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
  expandedPanels: string[];
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
