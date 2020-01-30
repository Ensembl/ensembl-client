import React from 'react';
import noop from 'lodash/noop';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';

import { ReactComponent as searchIcon } from 'static/img/sidebar/search.svg';
import { ReactComponent as bookmarkIcon } from 'static/img/sidebar/bookmark.svg';
import { ReactComponent as shareIcon } from 'static/img/sidebar/share.svg';
import { ReactComponent as downloadIcon } from 'static/img/sidebar/download.svg';

import styles from 'src/shared/components/layout/StandardAppLayout.scss';

export const EntityViewerSidebarToolstrip = () => {
  return (
    <>
      <div className={styles.sidebarIcon} key="search">
        <ImageButton
          status={Status.DISABLED}
          description="Search"
          onClick={noop}
          image={searchIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="bookmarks">
        <ImageButton
          status={Status.DISABLED}
          description="Bookmarks"
          onClick={noop}
          image={bookmarkIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="share">
        <ImageButton
          status={Status.DISABLED}
          description="Share"
          onClick={noop}
          image={shareIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="downloads">
        <ImageButton
          status={Status.DISABLED}
          description="Downloads"
          onClick={noop}
          image={downloadIcon}
        />
      </div>
    </>
  );
};

export default EntityViewerSidebarToolstrip;
