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
import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';

import { ReactComponent as SpeciesSelectorIcon } from 'static/img/launchbar/species-selector.svg';
import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';

import styles from './LabelledAppIcon.scss';

type AppName = 'speciesSelector' | 'genomeBrowser' | 'entityViewer';

type Size = 'regular' | 'small';

type Props = {
  app: AppName;
  size: Size;
};

const appNameToComponent: Record<AppName, React.FunctionComponent> = {
  speciesSelector: SpeciesSelectorIcon,
  genomeBrowser: BrowserIcon,
  entityViewer: EntityViewerIcon
};

const appNameToLabel: Record<AppName, string> = {
  speciesSelector: 'Species selector',
  genomeBrowser: 'Genome browser',
  entityViewer: 'Entity viewer'
};

const LabelledAppIcon = (props: Props) => {
  const { app, size } = props;

  const IconComponent = appNameToComponent[app];
  const label = appNameToLabel[app];

  const iconWrapperStyles = classNames(
    styles.iconWrapper,
    styles[`iconWrapper${upperFirst(size)}`]
  );

  const labelStyles = classNames(
    styles.label,
    styles[`label${upperFirst(size)}`]
  );

  return (
    <div className={styles.container}>
      <div className={iconWrapperStyles}>
        <IconComponent />
      </div>
      <div className={labelStyles}>{label}</div>
    </div>
  );
};

LabelledAppIcon.defaultProps = {
  size: 'regular'
};

export default LabelledAppIcon;
