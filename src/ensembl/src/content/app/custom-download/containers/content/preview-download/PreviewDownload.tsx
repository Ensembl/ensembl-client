import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import { Link } from 'react-router-dom';
import { getAttributes } from '../attributes-accordion/state/attributesAccordionSelector';
import { getFilters } from '../filter-accordion/state/filterAccordionSelector';

import { ReactComponent as closeIcon } from 'static/img/track-panel/close.svg';
import styles from './PreviewDownload.scss';

import {
  getProcessedAttributes,
  flattenObject,
  attributeDisplayNames
} from '../result-holder/resultHolderHelper';

import {
  setShowPreview,
  toggleTab
} from '../../../state/customDownloadActions';

import ImageButton from 'src/shared/image-button/ImageButton';

import { Attributes } from 'src/content/app/custom-download/types/Attributes';

type StateProps = {
  attributes: Attributes;
  filters: {};
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

  //FIXME: Get and display the selected attributes
  const attributesList: [] = getProcessedAttributes(
    flattenObject(props.attributes)
  );

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
              <div>Transcripts</div>
              <div>Protein Coding</div>
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
  attributes: getAttributes(state),
  filters: getFilters(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewDownload);
