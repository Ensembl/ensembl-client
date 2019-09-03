import React, { useState } from 'react';
import ImageButton, {
  ImageButtonStatus,
  ImageButtonStatuses
} from 'src/shared/components/image-button/ImageButton';

import classNames from 'classnames';
type Props = {
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  imagePath: string;
  imageName: string;
  classNames: any;
};

import styles from './ImageButton.stories.scss';

const ImageButtonParent = (props: Props) => {
  const [buttonStatus, setVisible] = useState<ImageButtonStatus>(
    ImageButtonStatuses.DEFAULT
  );

  const toggleImage = () => {
    switch (buttonStatus) {
      case ImageButtonStatuses.DEFAULT:
        return setVisible(ImageButtonStatuses.ACTIVE);
      case ImageButtonStatuses.ACTIVE:
        return setVisible(ImageButtonStatuses.INACTIVE);
      case ImageButtonStatuses.INACTIVE:
        return setVisible(ImageButtonStatuses.HIGHLIGHTED);
      default:
        return setVisible(ImageButtonStatuses.DEFAULT);
    }
  };

  const computedStyles = { ...styles, ...props.classNames };
  return (
    <>
      <div className={classNames(styles.containerStyles)}>
        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={buttonStatus}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
              onClick={toggleImage}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {buttonStatus}
          </div>
        </div>

        <div className={classNames(styles.codeContent)}>
          <h3>Usage:</h3>
          {`import ImageButton, {ImageButtonStatus} from 'src/shared/image-button/ImageButton';`}
          <br />
          {`import { ReactComponent as ${props.imageName} } from '${props.imagePath}';`}
          <br />
          {`
              <ImageButton buttonStatus={ImageButtonStatus.${buttonStatus.toUpperCase()}} 
                description={'enable/disable'} 
                image={${props.imageName}}
              />
            `}
        </div>
      </div>
      <div className={classNames(styles.containerStyles)}>
        <div>Available styles:</div>
        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={ImageButtonStatuses.ACTIVE}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {ImageButtonStatuses.ACTIVE}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={ImageButtonStatuses.INACTIVE}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {ImageButtonStatuses.INACTIVE}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={ImageButtonStatuses.HIGHLIGHTED}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {ImageButtonStatuses.HIGHLIGHTED}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={ImageButtonStatuses.DISABLED}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {ImageButtonStatuses.DISABLED}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageButtonParent;
