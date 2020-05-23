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
import noop from 'lodash/noop';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as searchIcon } from 'static/img/sidebar/search.svg';
import { ReactComponent as bookmarkIcon } from 'static/img/sidebar/bookmark.svg';
import { ReactComponent as shareIcon } from 'static/img/sidebar/share.svg';
import { ReactComponent as downloadIcon } from 'static/img/sidebar/download.svg';

import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.scss';

export const EntityViewerSidebarToolstrip = () => {
  return (
    <>
      <ImageButton
        status={Status.DISABLED}
        description="Search"
        className={styles.sidebarIcon}
        key="search"
        onClick={noop}
        image={searchIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Bookmarks"
        className={styles.sidebarIcon}
        key="bookmarks"
        onClick={noop}
        image={bookmarkIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Share"
        className={styles.sidebarIcon}
        key="share"
        onClick={noop}
        image={shareIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Downloads"
        className={styles.sidebarIcon}
        key="downloads"
        onClick={noop}
        image={downloadIcon}
      />
    </>
  );
};

export default EntityViewerSidebarToolstrip;
