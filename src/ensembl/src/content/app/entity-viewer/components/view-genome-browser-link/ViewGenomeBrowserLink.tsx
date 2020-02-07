import React from 'react';
import { Link } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { ImageButton } from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';

import { Status } from 'src/shared/types/status';

import styles from './ViewGenomeBrowserLink.scss';

export const ViewGenomeBrowserLink = () => {
  return (
    <>
      <div className={styles.entityViewerAppLinkButtons}>
        <span className={styles.viewIn}>View in</span>
        <Link className={styles.entityViewerAppLink} to={urlFor.browser()}>
          <ImageButton
            status={Status.DEFAULT}
            description="Genome browser"
            image={BrowserIcon}
          />
        </Link>
      </div>
    </>
  );
};
