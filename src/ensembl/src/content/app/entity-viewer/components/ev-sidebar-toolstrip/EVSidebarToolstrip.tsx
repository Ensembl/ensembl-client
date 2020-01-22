import React from 'react';
import noop from 'lodash/noop';

import {
  evSidebarToolstripConfig,
  EVSidebarToolstripItem
} from './evSidebarToolstripConfig';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.scss';

export const EVSidebarToolstrip = () => {
  return (
    <>
      {evSidebarToolstripConfig.map((item: EVSidebarToolstripItem) => (
        <div className={styles.sidebarIcon} key={item.name}>
          <ImageButton
            key={item.name}
            buttonStatus={Status.INACTIVE}
            description={item.description}
            onClick={noop}
            image={item.icon}
          />
        </div>
      ))}
    </>
  );
};

export default EVSidebarToolstrip;
