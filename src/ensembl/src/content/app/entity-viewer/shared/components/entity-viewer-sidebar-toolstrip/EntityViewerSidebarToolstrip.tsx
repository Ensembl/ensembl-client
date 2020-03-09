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
