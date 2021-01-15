/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { closeDrawer } from './drawerActions';
import { getDrawerView } from './drawerSelectors';
import { getBrowserActiveEnsObject } from '../browserSelectors';

import { DrawerView } from 'src/content/app/browser/drawer/drawerState';
// import DrawerGene from './drawer-views/DrawerGene';
// import DrawerTranscript from './drawer-views/DrawerTranscript';
// import ProteinCodingGenes from './drawer-views/ProteinCodingGenes';
// import OtherGenes from './drawer-views/OtherGenes';
// import DrawerContigs from './drawer-views/DrawerContigs';
// import DrawerGC from './drawer-views/DrawerGC';
// import SnpIndels from './drawer-views/SnpIndels';
import TrackDetails from 'src/content/app/browser/drawer/drawer-views/TrackDetails';
import DrawerBookmarks from './drawer-views/DrawerBookmarks';

import {
  EnsObject
  // EnsObjectGene
} from 'src/shared/state/ens-object/ensObjectTypes';

import styles from './Drawer.scss';

export type DrawerProps = {
  drawerView: DrawerView | null;
  ensObject: EnsObject | null;
};

export const Drawer = (props: DrawerProps) => {
  const { ensObject, drawerView } = props;

  if (!ensObject) {
    return null;
  }

  const getDrawerViewComponent = () => {
    switch (drawerView) {
      // case 'track:gene-feat':
      //   return <DrawerGene ensObject={ensObject as EnsObjectGene} />;
      // case 'track:gene-feat-1':
      //   return <DrawerTranscript ensObject={ensObject as EnsObjectGene} />;
      // case 'track:gene-pc-fwd':
      //   return <ProteinCodingGenes forwardStrand={true} />;
      // case 'track:gene-other-fwd':
      //   return <OtherGenes forwardStrand={true} />;
      // case 'track:gene-pc-rev':
      //   return <ProteinCodingGenes forwardStrand={false} />;
      // case 'track:gene-other-rev':
      //   return <OtherGenes forwardStrand={false} />;
      // case 'track:contig':
      //   return <DrawerContigs />;
      // case 'track:gc':
      //   return <DrawerGC />;
      // case 'track:variant':
      //   return <SnpIndels />;

      case DrawerView.TRACK_DETAILS:
        return <TrackDetails />;
      case DrawerView.BOOKMARKS:
        return <DrawerBookmarks />;
    }
  };

  return (
    <section className={styles.drawer}>{getDrawerViewComponent()}</section>
  );
};

const mapStateToProps = (state: RootState) => ({
  drawerView: getDrawerView(state),
  ensObject: getBrowserActiveEnsObject(state)
});

const mapDispatchToProps = {
  closeDrawer
};

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
