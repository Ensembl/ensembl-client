import React, { useState } from 'react';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';

import classNames from 'classnames';
type Props = {
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  imagePath: string;
  imageName: string;
  classNames: any;
};

import styles from './ImageButton.stories.scss';

const ImageButtonParent = (props: Props) => {
  const [buttonStatus, setVisible] = useState(ImageButtonStatus.DEFAULT);

  const toggleImage = () => {
    switch (buttonStatus) {
      case ImageButtonStatus.DEFAULT:
        return setVisible(ImageButtonStatus.ACTIVE);
      case ImageButtonStatus.ACTIVE:
        return setVisible(ImageButtonStatus.INACTIVE);
      case ImageButtonStatus.INACTIVE:
        return setVisible(ImageButtonStatus.HIGHLIGHTED);
      default:
        return setVisible(ImageButtonStatus.DEFAULT);
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
          {`import { ReactComponent as ${props.imageName} } from '${
            props.imagePath
          }';`}
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
              buttonStatus={ImageButtonStatus.ACTIVE}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {ImageButtonStatus.ACTIVE}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={ImageButtonStatus.INACTIVE}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {ImageButtonStatus.INACTIVE}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={ImageButtonStatus.HIGHLIGHTED}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {ImageButtonStatus.HIGHLIGHTED}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={ImageButtonStatus.DISABLED}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {ImageButtonStatus.DISABLED}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageButtonParent;
