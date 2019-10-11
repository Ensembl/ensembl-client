import React from 'react';
import get from 'lodash/get';

import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { ReactComponent as closeIcon } from 'static/img/shared/close.svg';
import { getSelectedAttributes } from '../../../state/attributes/attributesSelector';
import { getSelectedFilters } from '../../../state/filters/filtersSelector';
import { getProcessedFilters } from '../result-loader/resultLoaderHelper';
import {
  getPreviewResult,
  getCustomDownloadActiveGenomeId
} from '../../../state/customDownloadSelectors';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';
import Panel from 'src/content/app/custom-download/components/panel/Panel';
import PreviewCard from 'src/content/app/custom-download/containers/content/preview-card/PreviewCard';
import { setShowPreview } from '../../../state/customDownloadActions';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import JSONValue from 'src/shared/types/JSON';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './PreviewDownload.scss';
import { getDisplayName } from 'src/shared/components/selected-species/selectedSpeciesHelpers';

type StateProps = {
  selectedAttributes: JSONValue;
  selectedFilters: JSONValue;
  preview: JSONValue;
  committedSpecies: CommittedItem | null;
};

type DispatchProps = {
  setShowPreview: (setShowPreview: boolean) => void;
};

type Props = StateProps & DispatchProps;

const PreviewDownload = (props: Props) => {
  const resultCount: number = props.preview.resultCount
    ? (props.preview.resultCount as number)
    : 0;

  const processedFilters = getProcessedFilters(props.selectedFilters);
  const gene_ids = get(
    processedFilters,
    'protein_and_domain_families.family_or_domain_ids.limit_to_genes',
    null
  );
  const gene_biotypes = get(processedFilters, 'genes.biotype', null);
  const gene_source = get(processedFilters, 'genes.gene_source', null);

  return (
    <div className={styles.previewDownload}>
      <span className={styles.closeButton}>
        <ImageButton
          description={'Close preview'}
          image={closeIcon}
          onClick={() => {
            props.setShowPreview(false);
          }}
        />
      </span>
      <table className={styles.previewDownloadTable}>
        <tbody>
          <tr className={styles.previewDownloadHeader}>
            <td className={styles.species}>Species</td>
            <td className={styles.example}>
              <Panel
                title={'Example data to download'}
                classNames={{ panelClassName: styles.exampleDataPanel }}
              >
                <PreviewCard />
              </Panel>
            </td>
            <td className={styles.filters}>
              Filters
              <div className={styles.resultCounter}>
                <span>{getCommaSeparatedNumber(resultCount)}</span> results
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                {props.committedSpecies &&
                  `${getDisplayName(props.committedSpecies)} ${
                    props.committedSpecies.assembly_name
                  }`}
              </div>
            </td>
            <td></td>
            <td>
              {!(gene_ids || gene_biotypes || gene_source) && (
                <div> No filters selected.</div>
              )}
              {!!gene_ids && <div>Limit to genes: {gene_ids.join(', ')}</div>}
              {!!gene_biotypes && (
                <div>Gene biotype: {Object.keys(gene_biotypes).join(', ')}</div>
              )}
              {!!gene_source && (
                <div>Gene source: {Object.keys(gene_source).join(', ')}</div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const mapDispatchToProps: DispatchProps = {
  setShowPreview
};

const mapStateToProps = (state: RootState): StateProps => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(state);
  const committedSpecies = activeGenomeId
    ? getCommittedSpeciesById(state, activeGenomeId)
    : null;

  return {
    selectedAttributes: getSelectedAttributes(state),
    selectedFilters: getSelectedFilters(state),
    preview: getPreviewResult(state),
    committedSpecies: committedSpecies
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewDownload);
