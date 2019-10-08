import React from 'react';
import { default as classNamesMerger } from 'classnames';

import closeIcon from 'static/img/shared/close.svg';

import styles from './Panel.scss';

type Props = {
  title: string;
  children: JSX.Element;
  classNames?: {
    panelClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
  };
  onClose?: () => void;
};

const Panel = (props: Props) => {
  const { title, onClose, classNames, ...rest } = props;

  const panelClassNames = classNames
    ? classNamesMerger(styles.panelDefault, classNames.panelClassName)
    : styles.panelDefault;
  const headerClassNames = classNames
    ? classNamesMerger(styles.panelHeaderDefault, classNames.headerClassName)
    : styles.panelHeaderDefault;
  const panelBodyClassNames = classNames
    ? classNamesMerger(styles.panelBodyDefault, classNames.bodyClassName)
    : styles.panelBodyDefault;

  return (
    <div className={panelClassNames}>
      <div className={headerClassNames}>{title}</div>
      <div className={panelBodyClassNames}>
        <div {...rest}></div>
        {onClose && (
          <span className={styles.closeButton} onClick={onClose}>
            <img src={closeIcon}></img>
          </span>
        )}
      </div>
    </div>
  );
};

export default Panel;
