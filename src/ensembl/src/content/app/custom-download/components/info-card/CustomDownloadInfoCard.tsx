import React from 'react';
import classNamesMerger from 'classnames';

import closeIcon from 'static/img/shared/close.svg';

import styles from './CustomDownloadInfoCard.scss';

type Props = {
  title: string;
  children: JSX.Element;
  classNames?: {
    infoCardClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
  };
  onClose?: () => void;
};

const CustomDownloadInfoCard = (props: Props) => {
  const { title, onClose, classNames } = props;

  const inforCardClassNames = classNames
    ? classNamesMerger(styles.infoCardDefault, classNames.infoCardClassName)
    : styles.infoCardDefault;
  const headerClassNames = classNames
    ? classNamesMerger(styles.headerDefault, classNames.headerClassName)
    : styles.headerDefault;
  const bodyClassNames = classNames
    ? classNamesMerger(styles.bodyDefault, classNames.bodyClassName)
    : styles.bodyDefault;

  return (
    <div className={inforCardClassNames}>
      <div className={headerClassNames}>{title}</div>
      <div className={bodyClassNames}>
        <div>{props.children}</div>
        {onClose && (
          <span className={styles.closeButton} onClick={onClose}>
            <img src={closeIcon}></img>
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomDownloadInfoCard;
