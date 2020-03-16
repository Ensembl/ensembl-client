import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';
import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  getBrowserActiveGenomeId,
  isFocusObjectPositionDefault
} from '../browserSelectors';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ToggleButton as ToolboxToggleButton } from 'src/shared/components/toolbox';

import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';

import { RootState } from 'src/store';

import styles from './Zmenu.scss';

type Props = {
  featureId: string;
  genomeId: string | null;
  isInDefaultPosition: boolean;
  push: (path: string) => void;
};

const ZmenuAppLinks = (props: Props) => {
  if (!isEnvironment([Environment.DEVELOPMENT, Environment.INTERNAL])) {
    return null;
  }

  // FIXME: the row of buttons should be shown only for the gene feature.
  // Change this temporary hack to using the "type" field when genome browser
  // starts reporting the type of clicked features
  if (!props.featureId.includes(':gene:')) {
    return null;
  }

  const getBrowserLink = () =>
    urlFor.browser({ genomeId: props.genomeId, focus: props.featureId });

  const getEntityViewerLink = () =>
    urlFor.entityViewer({
      genomeId: props.genomeId,
      entityId: props.featureId
    });

  return (
    <div className={styles.zmenuAppLinks}>
      <span>View in</span>
      {!props.isInDefaultPosition && (
        <ImageButton
          className={styles.zmenuAppButton}
          image={BrowserIcon}
          onClick={() => props.push(getBrowserLink())}
        />
      )}
      <ImageButton
        className={styles.zmenuAppButton}
        image={EntityViewerIcon}
        onClick={() => props.push(getEntityViewerLink())}
      />
      <ToolboxToggleButton
        className={styles.zmenuToggleFooter}
        openElement={<span>Download</span>}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  genomeId: getBrowserActiveGenomeId(state),
  isInDefaultPosition: isFocusObjectPositionDefault(state)
});

const mapDispatchToProps = {
  push
};

export default connect(mapStateToProps, mapDispatchToProps)(ZmenuAppLinks);
