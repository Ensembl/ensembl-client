import React, { FunctionComponent, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';

import styles from './Launchbar.scss';

type LaunchbarButtonProps = {
  app: string;
  description: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  enabled: boolean;
} & RouteComponentProps;

const LaunchbarButton: FunctionComponent<LaunchbarButtonProps> = (
  props: LaunchbarButtonProps
) => {
  const pathTo = `/app/${props.app}`;
  const isActive = new RegExp(`^${pathTo}`).test(props.location.pathname);
  const imageButtonStatus = !props.enabled
    ? ImageButtonStatus.DISABLED
    : isActive
    ? ImageButtonStatus.ACTIVE
    : ImageButtonStatus.DEFAULT;
  const imageButton = (
    <ImageButton
      classNames={{
        [ImageButtonStatus.DEFAULT]: styles.launchbarButtonImage,
        [ImageButtonStatus.ACTIVE]: styles.launchbaeButtonSelectedImage,
        [ImageButtonStatus.DISABLED]: styles.launchbarButtonDisabledImage
      }}
      buttonStatus={imageButtonStatus}
      description={props.description}
      image={props.icon}
    />
  );

  return props.enabled ? (
    <NavLink
      className={styles.launchbarButton}
      to={pathTo}
      activeClassName={styles.launchbarButtonSelected}
    >
      {imageButton}
    </NavLink>
  ) : (
    <div
      className={`${styles.launchbarButton} ${styles.launchbarButtonDisabled}`}
    >
      {imageButton}
    </div>
  );
};

export default withRouter(LaunchbarButton);
