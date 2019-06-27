import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { toggleDrawer } from './drawerActions';
import { getDrawerView } from './drawerSelectors';
import {
  getEnsObjectInfo,
  getEnsObjectTracks
} from 'src/ens-object/ensObjectSelectors';

import DrawerGene from './drawer-views/DrawerGene';
import DrawerTranscript from './drawer-views/DrawerTranscript';
import ProteinCodingGenes from './drawer-views/ProteinCodingGenes';
import OtherGenes from './drawer-views/OtherGenes';
import DrawerContigs from './drawer-views/DrawerContigs';
import DrawerGC from './drawer-views/DrawerGC';

import closeIcon from 'static/img/track-panel/close.svg';

import { find } from 'lodash';
import styles from './Drawer.scss';
import SnpIndels from './drawer-views/SnpIndels';

import { EnsObject, EnsObjectTrack } from 'src/ens-object/ensObjectTypes';

type StateProps = {
  drawerView: string;
  ensObjectInfo: EnsObject;
  ensObjectTracks: EnsObjectTrack;
};

type DispatchProps = {
  toggleDrawer: (drawerOpened?: boolean) => void;
};

type OwnProps = {};

type DrawerProps = StateProps & DispatchProps & OwnProps;

const Drawer: FunctionComponent<DrawerProps> = (props: DrawerProps) => {
  const getTrackDetails = () => {
    const childTracks = props.ensObjectTracks['child_tracks'];

    return find(childTracks, { track_id: props.drawerView });
  };

  const getDrawerViewComponent = () => {
    switch (props.drawerView) {
      case 'gene-feat':
        return <DrawerGene ensObjectInfo={props.ensObjectInfo} />;
      case 'gene-feat-1':
        return (
          <DrawerTranscript
            ensObjectInfo={props.ensObjectInfo}
            ensObjectTrack={getTrackDetails()}
          />
        );
      case 'gene-pc-fwd':
        return <ProteinCodingGenes forwardStrand={true} />;
      case 'gene-other-fwd':
        return <OtherGenes forwardStrand={true} />;
      case 'gene-pc-rev':
        return <ProteinCodingGenes forwardStrand={false} />;
      case 'gene-other-rev':
        return <OtherGenes forwardStrand={false} />;
      case 'contig':
        return <DrawerContigs />;
      case 'gc':
        return <DrawerGC />;
      case 'snps-and-indels':
        return <SnpIndels />;
    }
  };

  const closeDrawer = () => props.toggleDrawer(false);

  return (
    <section className={styles.drawer}>
      <button className={styles.closeButton} onClick={closeDrawer}>
        <img src={closeIcon} alt="close drawer" />
      </button>
      <div className={styles.drawerView}>{getDrawerViewComponent()}</div>
    </section>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  drawerView: getDrawerView(state),
  ensObjectInfo: getEnsObjectInfo(state),
  ensObjectTracks: getEnsObjectTracks(state)
});

const mapDispatchToProps: DispatchProps = {
  toggleDrawer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer);
