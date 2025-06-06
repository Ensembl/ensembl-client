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

import ImageButton from 'src/shared/components/image-button/ImageButton';

import SearchIcon from 'static/icons/icon_search.svg';
import BookmarkIcon from 'static/icons/icon_bookmark.svg';
import ShareIcon from 'static/icons/icon_share.svg';
import DownloadIcon from 'static/icons/icon_download.svg';

import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.module.css';

const ActivityViewerSidebarToolstrip = () => {
  return (
    <>
      <ImageButton
        status={Status.DISABLED}
        description="Search"
        className={styles.sidebarIcon}
        image={SearchIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Previously viewed"
        className={styles.sidebarIcon}
        image={BookmarkIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Share"
        className={styles.sidebarIcon}
        image={ShareIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Download"
        className={styles.sidebarIcon}
        image={DownloadIcon}
      />
    </>
  );
};

export default ActivityViewerSidebarToolstrip;
