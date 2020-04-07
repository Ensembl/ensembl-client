import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';
import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId,
  isFocusObjectPositionDefault
} from '../browserSelectors';

import { ToggleButton as ToolboxToggleButton } from 'src/shared/components/toolbox';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import { RootState } from 'src/store';

import styles from './Zmenu.scss';

type Props = {
  featureId: string;
  activeFeatureId: string | null;
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
  // (also, probably move this check in a parent component)
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

  const shouldShowBrowserButton =
    props.featureId !== props.activeFeatureId || !props.isInDefaultPosition;

  type linkType = {
    ev?: string;
    gb?: string;
  };

  const links: Partial<linkType> = {};

  if (shouldShowBrowserButton) {
    links['gb'] = getBrowserLink();
  }
  links['ev'] = getEntityViewerLink();

  return (
    <div className={styles.zmenuAppLinks}>
      <ViewInApp links={links} />
      <ToolboxToggleButton
        className={styles.zmenuToggleFooter}
        openElement={<span>Download</span>}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  genomeId: getBrowserActiveGenomeId(state),
  activeFeatureId: getBrowserActiveEnsObjectId(state),
  isInDefaultPosition: isFocusObjectPositionDefault(state)
});

const mapDispatchToProps = {
  push
};

export default connect(mapStateToProps, mapDispatchToProps)(ZmenuAppLinks);
