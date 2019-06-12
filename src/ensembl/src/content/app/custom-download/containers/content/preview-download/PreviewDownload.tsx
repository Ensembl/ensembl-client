import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import { Link } from 'react-router-dom';
import { getAttributes } from '../attributes-accordion/state/attributesAccordionSelector';
import { getFilters } from '../filter-accordion/state/filterAccordionSelector';

import { ReactComponent as closeIcon } from 'static/img/track-panel/close.svg';
import styles from './PreviewDownload.scss';

import { getSelectedAttributes } from '../result-holder/helpers';

import {
  setShowPreview,
  toggleTabButton
} from '../../../state/customDownloadActions';

import ImageButton from 'src/shared/image-button/ImageButton';

import { CustomDownloadAttributes } from 'src/content/app/custom-download/types/Attributes';

type StateProps = {
  attributes: CustomDownloadAttributes;
  filters: {};
};

type DispatchProps = {
  setShowPreview: (setShowPreview: boolean) => void;
  toggleTabButton: (toggleTabButton: string) => void;
};

type Props = StateProps & DispatchProps;

const PreviewDownload = (props: Props) => {
  const changeView = (tab: string) => {
    props.setShowPreview(false);
    props.toggleTabButton(tab);
  };

  const attributesList: [] = getSelectedAttributes(props.attributes);

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
              <table>
                <tbody>
                  <tr>
                    <td>Human</td>
                  </tr>
                  <tr>
                    <td>
                      <Link to={'/app/species-selector'}>Change</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  {attributesList.map((attribute, index) => {
                    return (
                      <tr key={index}>
                        <td>{attribute[3]}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td>
                      <span
                        className={styles.changeLink}
                        onClick={() => {
                          changeView('attributes');
                        }}
                      >
                        Change
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td>Transcripts</td>
                  </tr>
                  <tr>
                    <td>Protein Coding</td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        className={styles.changeLink}
                        onClick={() => {
                          changeView('filter');
                        }}
                      >
                        Change
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const mapDispatchToProps: DispatchProps = {
  setShowPreview,
  toggleTabButton
};

const mapStateToProps = (state: RootState): StateProps => ({
  attributes: getAttributes(state),
  filters: getFilters(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewDownload);
