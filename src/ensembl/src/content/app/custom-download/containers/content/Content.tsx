import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './Content.scss';
import {
  getSelectedTabButton,
  getShowPreviewResult,
  getPreviewResult
} from '../../customDownloadSelectors';
import { setAttributes } from './attributes-accordion/attributesAccordionActions';
import { getAttributes } from './attributes-accordion/attributesAccordionSelector';

import AttributesAccordion from './attributes-accordion/AttributesAccordion';
import FiltersAccordion from './filter-accordion/FiltersAccordion';
import TabButtons from './tab-buttons/TabButtons';
import ResultHolder from './result-holder/ResultHolder';
import { RootState } from 'src/store';
import { attributes } from '../../sampledata';
import PreviewTable from '../../components/preview-table/PreviewTable';
import { fetchGeneAttributes } from 'src/services/custom-download';

import { getSelectedAttributes, formatResults } from './result-holder/helpers';

type Props = StateProps & DispatchProps;

// display: true
// displayName: "Ashbya Genome Database"
// facet: true
// name: "AGD_GENE"
// search: true
// sort: true
// type: "TERM"

const getGeneAttributes = async (props: Props) => {
  const allAttributes = await fetchGeneAttributes();

  const attributes: any = {};

  let sections = ['gene'];

  allAttributes.forEach((attribute: any) => {
    if (attribute.type === 'TERM') {
      if (attribute.name.split('.').length > 1) {
        sections = attribute.name.split('.');
      }
    }

    if (!attributes[sections[0]]) {
      attributes[sections[0]] = {};
    }

    if (
      sections[1] &&
      sections.length !== 2 &&
      !attributes[sections[0]][sections[1]]
    ) {
      attributes[sections[0]][sections[1]] = {};
    } else if (sections.length == 2) {
      attributes[sections[0]][sections[1]] = {
        id: attribute.name,
        label: attribute.displayName,
        checkedStatus: false
      };
    }

    if (sections[2] && !attributes[sections[0]][sections[1]][sections[2]]) {
      attributes[sections[0]][sections[1]][sections[2]] = {};
    }

    if (
      sections[3] &&
      !attributes[sections[0]][sections[1]][sections[2]][sections[3]]
    ) {
      attributes[sections[0]][sections[1]][sections[2]][sections[3]] = {};
    }
  });
  console.log(attributes);
};

const Content = (props: Props) => {
  useEffect(() => {
    getGeneAttributes(props);
    props.setAttributes(attributes);
  }, []);

  const selectedAttributes: any = getSelectedAttributes(props.attributes);
  let formatedPreviewResult = [];
  if (props.previewResult.results) {
    formatedPreviewResult = formatResults(
      props.previewResult,
      selectedAttributes
    );
  }

  return (
    <div>
      {!props.showPreview && (
        <div>
          <div className={styles.resultList}>
            <ResultHolder />
          </div>
          <div className={styles.tabList}>
            <TabButtons />
          </div>
          <div className={styles.dataSelector}>
            {props.selectedTabButton === 'attributes' && (
              <AttributesAccordion />
            )}
            {props.selectedTabButton === 'filter' && <FiltersAccordion />}
          </div>
        </div>
      )}
      {props.showPreview && (
        <div>
          {' '}
          <PreviewTable resultData={formatedPreviewResult} />{' '}
        </div>
      )}
    </div>
  );
};

type StateProps = {
  selectedTabButton: string;
  showPreview: boolean;
  previewResult: any;
  attributes: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedTabButton: getSelectedTabButton(state),
  showPreview: getShowPreviewResult(state),
  previewResult: getPreviewResult(state),
  attributes: getAttributes(state)
});

type DispatchProps = {
  setAttributes: (setAttributes: {}) => void;
};

const mapDispatchToProps: DispatchProps = {
  setAttributes
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);
