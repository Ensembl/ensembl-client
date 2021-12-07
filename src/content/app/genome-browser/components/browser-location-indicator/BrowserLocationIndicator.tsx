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
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getActualChrLocation } from 'src/content/app/genome-browser/state/browser-location/browserLocationSelectors';
import { toggleBrowserNav } from 'src/content/app/genome-browser/state/browser-nav/browserNavSlice';

import styles from './BrowserLocationIndicator.scss';

type Props = {
  disabled?: boolean;
};

export const BrowserLocationIndicator = (props: Props) => {
  const actualChrLocation = useSelector(getActualChrLocation);
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const dispatch = useDispatch();

  const [chrCode, chrStart, chrEnd] = actualChrLocation || [];
  if (!chrCode || !chrStart || !chrEnd || !activeGenomeId) {
    return null;
  }

  const className = classNames(styles.browserLocationIndicator, {
    [styles.browserLocationIndicatorDisabled]: props.disabled
  });
  const onClickProps = props.disabled
    ? {}
    : { onClick: () => dispatch(toggleBrowserNav({ activeGenomeId })) };

  return (
    <div className={className}>
      <div className={styles.chrLabel}>Chromosome</div>
      <div className={styles.chrLocationView} {...onClickProps}>
        <div className={styles.chrCode}>{chrCode}</div>
        <div className={styles.chrRegion}>
          <span>{getCommaSeparatedNumber(chrStart as number)}</span>
          <span className={styles.chrSeparator}>-</span>
          <span>{getCommaSeparatedNumber(chrEnd as number)}</span>
        </div>
      </div>
    </div>
  );
};

export default BrowserLocationIndicator;
