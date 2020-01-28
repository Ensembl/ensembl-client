import React from 'react';
import classNamesMerger from 'classnames';

import closeIcon from 'static/img/shared/close.svg';

import styles from './Panel.scss';

type Props = {
  header: string | JSX.Element;
  children: JSX.Element;
  classNames?: {
    panelClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
  };
  onClose?: () => void;
};

const Panel = (props: Props) => {
  const { header, onClose, classNames } = props;

  const panelClassNames = classNames
    ? classNamesMerger(classNames.panelClassName, styles.panelDefault)
    : styles.panelDefault;
  const headerClassNames = classNames
    ? classNamesMerger(classNames.headerClassName, styles.headerDefault)
    : styles.headerDefault;
  const bodyClassNames = classNames
    ? classNamesMerger(classNames.bodyClassName, styles.bodyDefault)
    : styles.bodyDefault;

  return (
    <div className={panelClassNames}>
      {onClose && (
        <span className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon}></img>
        </span>
      )}
      <div className={headerClassNames}>{header}</div>
      <div className={bodyClassNames}>
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default Panel;
