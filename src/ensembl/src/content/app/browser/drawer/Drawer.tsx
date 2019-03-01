import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { RootState } from 'src/rootReducer';
import { changeCurrentDrawerSection, toggleDrawer } from '../browserActions';
import {
  getCurrentDrawerSection,
  getCurrentTrack,
  getDrawerSections
} from '../browserSelectors';

import { DrawerSection } from './drawerSectionConfig';

import DrawerGene from './drawer-views/DrawerGene';
import DrawerTranscript from './drawer-views/DrawerTranscript';
import ProteinCodingGenes from './drawer-views/ProteinCodingGenes';
import OtherGenes from './drawer-views/OtherGenes';
import DrawerContigs from './drawer-views/DrawerContigs';
import DrawerGC from './drawer-views/DrawerGC';

import closeIcon from 'static/img/track-panel/close.svg';

import styles from './Drawer.scss';

type StateProps = {
  currentDrawerSection: string;
  currentTrack: string;
  drawerSections: DrawerSection[];
};

type DispatchProps = {
  changeCurrentDrawerSection: (currentDrawerSection: string) => void;
  toggleDrawer: (drawerOpened?: boolean) => void;
};

type OwnProps = {};

type DrawerProps = StateProps & DispatchProps & OwnProps;

const Drawer: FunctionComponent<DrawerProps> = (props: DrawerProps) => {
  const getDrawerView = () => {
    switch (props.currentTrack) {
      case 'gene':
        return <DrawerGene />;
      case 'transcript':
        return <DrawerTranscript />;
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
    }
  };

  const closeDrawer = () => props.toggleDrawer(false);

  return (
    <section className={styles.drawer}>
      <button className={styles.closeButton} onClick={closeDrawer}>
        <img src={closeIcon} alt="close drawer" />
      </button>
      <div className={styles.drawerView}>{getDrawerView()}</div>
    </section>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  currentDrawerSection: getCurrentDrawerSection(state),
  currentTrack: getCurrentTrack(state),
  drawerSections: getDrawerSections(state)
});

const mapDispatchToProps: DispatchProps = {
  changeCurrentDrawerSection,
  toggleDrawer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer);
