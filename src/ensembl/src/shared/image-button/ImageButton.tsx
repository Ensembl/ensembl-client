import React from 'react';
import defaultStyles from './ImageButton.scss';
import ImageHolder from './ImageHolder';

export enum ImageButtonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled',
  DEFAULT = 'default',
  HIGHLIGHTED = 'highlighted'
}

type Props = {
  buttonStatus: ImageButtonStatus;
  description: string;
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  classNames?: any;
  onClick?: () => void;
};

const ImageButton = (props: Props) => {
  const buttonProps =
    props.buttonStatus === ImageButtonStatus.DISABLED
      ? {}
      : { onClick: props.onClick };

  const { classNames, ...rest } = props;

  const styles = { ...defaultStyles, ...props.classNames };
  return (
    <div {...buttonProps}>
      <ImageHolder {...rest} classNames={styles} />
    </div>
  );
};

ImageButton.defaultProps = {
  buttonStatus: ImageButtonStatus.DEFAULT,
  description: '',
  image: ''
};

export default ImageButton;
