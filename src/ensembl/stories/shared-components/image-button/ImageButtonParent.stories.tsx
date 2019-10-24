import React, { useState } from 'react';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';

import classNames from 'classnames';
type Props = {
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  imagePath: string;
  imageName: string;
  classNames: any;
};

import styles from './ImageButton.stories.scss';

const ImageButtonParent = (props: Props) => {
  const [buttonStatus, setVisible] = useState(Status.DEFAULT);

  const toggleImage = () => {
    switch (buttonStatus) {
      case Status.DEFAULT:
        return setVisible(Status.ACTIVE);
      case Status.ACTIVE:
        return setVisible(Status.INACTIVE);
      case Status.INACTIVE:
        return setVisible(Status.HIGHLIGHTED);
      default:
        return setVisible(Status.DEFAULT);
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
              buttonStatus={Status.ACTIVE}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {Status.ACTIVE}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={Status.INACTIVE}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {Status.INACTIVE}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={Status.HIGHLIGHTED}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {Status.HIGHLIGHTED}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={Status.DISABLED}
              description={'enable/disable'}
              image={props.image}
              classNames={computedStyles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {Status.DISABLED}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageButtonParent;
