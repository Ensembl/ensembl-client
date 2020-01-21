import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';

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
        [Status.UNSELECTED]: styles.launchbarButtonImage,
        [Status.SELECTED]: styles.launchbarButtonSelectedImage,
        [Status.DISABLED]: styles.launchbarButtonDisabledImage
      }}
      buttonStatus={imageButtonStatus as ImageButtonStatus}
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
}): Status => {
  if (isDisabled) {
    return Status.DISABLED;
  } else if (isActive) {
    return Status.SELECTED;
  } else {
    return Status.UNSELECTED;
  }
};

export default withRouter(LaunchbarButton);
