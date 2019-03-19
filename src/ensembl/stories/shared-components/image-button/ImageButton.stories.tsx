import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import classNames from 'classnames';

import { ReactComponent as Eye } from 'static/img/track-panel/eye.svg';
import { ReactComponent as Ellipsis } from 'static/img/track-panel/ellipsis.svg';
import { ReactComponent as Search } from 'static/img/track-panel/search.svg';

import styles from './ImageButton.stories.scss';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';

type Props = {
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  imagePath: string;
  imageName: string;
};

const sharedButtons: any = {
  Default: [Eye, 'static/img/track-panel/eye.svg'],
  EllipsisButton: [Ellipsis, 'static/img/track-panel/ellipsis.svg'],
  SearchButton: [Search, 'static/img/track-panel/search.svg'],
  VisibilityButton: [Eye, 'static/img/track-panel/eye.svg']
};

const ImageButtonParent = (props: Props) => {
  const [buttonStatus, setVisible] = useState(ImageButtonStatus.DEFAULT);

  const toggleImage = () => {
    switch (buttonStatus) {
      case ImageButtonStatus.DEFAULT:
        return setVisible(ImageButtonStatus.ACTIVE);
      case ImageButtonStatus.ACTIVE:
        return setVisible(ImageButtonStatus.INACTIVE);
      default:
        return setVisible(ImageButtonStatus.DEFAULT);
    }
  };

  return (
    <>
      <div className={classNames(styles.containerStyles)}>
        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={buttonStatus}
              description={'enable/disable'}
              image={props.image}
              classNames={styles}
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
              description={'enable/disable track'} 
              onClick={onClick} 
              image={VisibilityButton}
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
              classNames={styles}
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
              classNames={styles}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {ImageButtonStatus.INACTIVE}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={ImageButtonStatus.DISABLED}
              description={'enable/disable'}
              image={props.image}
              classNames={styles}
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

const stories = storiesOf('Components|Shared Components/ImageButton', module);

Object.keys(sharedButtons).forEach((buttonName: string) => {
  stories.add(buttonName, () => {
    return (
      <ImageButtonParent
        imageName={buttonName}
        image={sharedButtons[buttonName][0]}
        imagePath={sharedButtons[buttonName][1]}
      />
    );
  });
});
