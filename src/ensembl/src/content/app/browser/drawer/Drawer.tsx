import React from 'react';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { closeDrawer } from './drawerActions';
import { getDrawerView } from './drawerSelectors';
import { getBrowserActiveEnsObject } from '../browserSelectors';

import DrawerGene from './drawer-views/DrawerGene';
import DrawerTranscript from './drawer-views/DrawerTranscript';
import ProteinCodingGenes from './drawer-views/ProteinCodingGenes';
import OtherGenes from './drawer-views/OtherGenes';
import DrawerContigs from './drawer-views/DrawerContigs';
import DrawerGC from './drawer-views/DrawerGC';
import DrawerBookmarks from './drawer-views/DrawerBookmarks';

import styles from './Drawer.scss';
import SnpIndels from './drawer-views/SnpIndels';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

export type DrawerProps = {
  drawerView: string;
  ensObject: EnsObject | null;
};

export const Drawer = (props: DrawerProps) => {
  const { ensObject, drawerView } = props;

  if (!ensObject) {
    return null;
  }

  const getDrawerViewComponent = () => {
    switch (drawerView) {
      case 'track:gene-feat':
        return <DrawerGene ensObject={ensObject} />;
      case 'track:gene-feat-1':
        return <DrawerTranscript ensObject={ensObject} />;
      case 'track:gene-pc-fwd':
        return <ProteinCodingGenes forwardStrand={true} />;
      case 'track:gene-other-fwd':
        return <OtherGenes forwardStrand={true} />;
      case 'track:gene-pc-rev':
        return <ProteinCodingGenes forwardStrand={false} />;
      case 'track:gene-other-rev':
        return <OtherGenes forwardStrand={false} />;
      case 'track:contig':
        return <DrawerContigs />;
      case 'track:gc':
        return <DrawerGC />;
      case 'track:variant':
        return <SnpIndels />;
      case 'bookmarks':
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
