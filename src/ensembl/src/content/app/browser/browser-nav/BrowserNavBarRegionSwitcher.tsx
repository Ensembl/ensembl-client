import React, { useState } from 'react';

import BrowserRegionEditor from '../browser-region-editor/BrowserRegionEditor';
import BrowserRegionField from '../browser-region-field/BrowserRegionField';

import { RootState } from 'src/store';

import styles from './BrowserNavBarRegionSwitcher.scss';

const BrowserNavBarRegionSwitcher = () => {
  return (
    <div className={styles.regionSwitcher}>
      <div className={styles.regionFieldWrapper}>
        <BrowserRegionField />
      </div>
      <div className={styles.regionEditorWrapper}>
        <BrowserRegionEditor />
      </div>
    </div>
  );
};

export default BrowserNavBarRegionSwitcher;
