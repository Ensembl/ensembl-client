import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import ImageButton, {
  ImageButtonStatus,
  ImageButtonStatuses
} from 'src/shared/components/image-button/ImageButton';

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
  const imageButtonStatus = getImageButtonStatus({
    isDisabled: !props.enabled,
    isActive
  });

  const imageButton = (
    <ImageButton
      classNames={{
        [ImageButtonStatuses.DEFAULT]: styles.launchbarButtonImage,
        [ImageButtonStatuses.ACTIVE]: styles.launchbarButtonSelectedImage,
        [ImageButtonStatuses.DISABLED]: styles.launchbarButtonDisabledImage
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

const getImageButtonStatus = ({
  isDisabled,
  isActive
}: {
  isDisabled: boolean;
  isActive: boolean;
}): ImageButtonStatus => {
  if (isDisabled) {
    return ImageButtonStatuses.DISABLED;
  } else if (isActive) {
    return ImageButtonStatuses.ACTIVE;
  } else {
    return ImageButtonStatuses.DEFAULT;
  }
};

export default withRouter(LaunchbarButton);
