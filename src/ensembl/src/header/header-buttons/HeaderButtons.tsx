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

import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { toggleAccount, toggleLaunchbar } from '../headerActions';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as LaunchbarIcon } from 'static/img/header/launchbar.svg';
import { ReactComponent as UserIcon } from 'static/img/header/user-grey.svg';
import { ReactComponent as HomeIcon } from 'static/img/header/home.svg';

import { Status } from 'src/shared/types/status';

import styles from './HeaderButtons.scss';

type HeaderButtonsProps = {
  toggleLaunchbar: () => void;
  toggleAccount: () => void;
};

export const HomeLink = () => (
  <div className={styles.homeLink}>
    <Link to="/">
      <HomeIcon />
    </Link>
  </div>
);

export const HeaderButtons: FunctionComponent<HeaderButtonsProps> = (props) => (
  <div className={styles.container}>
    <HomeLink />
    <ImageButton
      image={LaunchbarIcon}
      description="Ensembl app launchbar"
      className={styles.button}
      onClick={props.toggleLaunchbar}
    />
    <ImageButton
      image={UserIcon}
      description="Ensembl account"
      status={Status.DISABLED}
      className={styles.button}
      statusClasses={{
        [Status.DISABLED]: styles.headerButtonDisabled
      }}
    />
  </div>
);

const mapDispatchToProps = {
  toggleAccount,
  toggleLaunchbar
};

export default connect(null, mapDispatchToProps)(HeaderButtons);
