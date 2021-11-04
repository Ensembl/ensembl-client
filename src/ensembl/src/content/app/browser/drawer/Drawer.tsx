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
import { useSelector } from 'react-redux';

import TrackDetails from './drawer-views/track-details/TrackDetails';
import DrawerBookmarks from './drawer-views/DrawerBookmarks';
import GeneSummary from './drawer-views/gene-summary/GeneSummary';
import TranscriptSummary from './drawer-views/transcript-summary/TranscriptSummary';

import { getActiveDrawerView } from 'src/content/app/browser/state/drawer/drawerSelectors';

import styles from './Drawer.scss';

export const Drawer = () => {
  const drawerView = useSelector(getActiveDrawerView);

  if (!drawerView) {
    return null;
  }

  const getDrawerViewComponent = () => {
    switch (drawerView.name) {
      case 'track_details':
        return <TrackDetails drawerView={drawerView} />;
      case 'gene_summary':
        return <GeneSummary />;
      case 'transcript_summary':
        return <TranscriptSummary drawerView={drawerView} />;
      case 'bookmarks':
        return <DrawerBookmarks />;
    }
  };

  return (
    <section className={styles.drawer}>{getDrawerViewComponent()}</section>
  );
};

export default Drawer;
