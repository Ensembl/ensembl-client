import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import { Link } from 'react-router-dom';
import { getSelectedAttributes } from '../attributes-accordion/state/attributesAccordionSelector';
import { getSelectedFilters } from '../filter-accordion/state/filterAccordionSelector';

import { ReactComponent as closeIcon } from 'static/img/track-panel/close.svg';
import styles from './PreviewDownload.scss';
import get from 'lodash/get';

import {
  getProcessedAttributes,
  flattenObject,
  attributeDisplayNames,
  getProcessedFilters
} from '../result-holder/resultHolderHelper';

import {
  setShowPreview,
  toggleTab
} from '../../../state/customDownloadActions';

import ImageButton from 'src/shared/image-button/ImageButton';

import { Attributes } from 'src/content/app/custom-download/types/Attributes';
import { Filters } from 'src/content/app/custom-download/types/Filters';

type StateProps = {
  selectedAttributes: Attributes;
  selectedFilters: Filters;
};

type DispatchProps = {
  setShowPreview: (setShowPreview: boolean) => void;
  toggleTab: (toggleTab: string) => void;
};

type Props = StateProps & DispatchProps;

const PreviewDownload = (props: Props) => {
  const changeView = (tab: string) => {
    props.setShowPreview(false);
    props.toggleTab(tab);
  };

  const attributesList: string[] = getProcessedAttributes(
    flattenObject(props.selectedAttributes)
  );
  const processedFilters = getProcessedFilters(props.selectedFilters);
  const gene_ids = get(
    processedFilters,
    'protein_and_domain_families.family_or_domain_ids.limit_to_genes'
  );
  const gene_biotypes = get(processedFilters, 'genes.gene_type.biotype');
  const gene_source = get(processedFilters, 'genes.gene_source');

  return (
    <div className={styles.previewDownload}>
      <span className={styles.closeButton}>
        <ImageButton
          description={'Close preview'}
          image={closeIcon}
          onClick={() => {
            changeView('attributes');
          }}
        />
      </span>
      <table className={styles.previewDownloadTable}>
        <tbody>
          <tr className={styles.previewDownloadHeader}>
            <td>Species</td>
            <td>Attributes</td>
            <td>Filters</td>
          </tr>
          <tr>
            <td>
              <div>Human</div>
              <div>
                <Link to={'/app/species-selector'}>Change</Link>
              </div>
            </td>
            <td>
              {attributesList.map((attribute, index) => {
                return (
                  <div key={index}>{attributeDisplayNames[attribute]}</div>
                );
              })}

              <div
                className={styles.changeLink}
                onClick={() => {
                  changeView('attributes');
                }}
              >
                Change
              </div>
            </td>
            <td>
              {!!gene_ids && <div>Limit to genes: {gene_ids.join(', ')}</div>}
              {!!gene_biotypes && (
                <div>Gene biotype: {gene_biotypes.join(', ')}</div>
              )}
              {!!gene_source && (
                <div>Gene source: {gene_source.join(', ')}</div>
              )}
              <div
                className={styles.changeLink}
                onClick={() => {
                  changeView('filter');
                }}
              >
                Change
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const mapDispatchToProps: DispatchProps = {
  setShowPreview,
  toggleTab
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedAttributes: getSelectedAttributes(state),
  selectedFilters: getSelectedFilters(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewDownload);
