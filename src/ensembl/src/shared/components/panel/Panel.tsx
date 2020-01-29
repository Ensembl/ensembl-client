import React from 'react';
import classNamesMerger from 'classnames';

import closeIcon from 'static/img/shared/close.svg';

import styles from './Panel.scss';

type Props = {
  header: string | JSX.Element;
  children: JSX.Element;
  classNames?: {
    panel?: string;
    header?: string;
    body?: string;
    closeButton?: string;
  };
  onClose?: () => void;
};

const Panel = (props: Props) => {
  const { header, onClose, classNames } = props;

  const panelClassNames = classNames
    ? classNamesMerger(classNames.panel, styles.panelDefault)
    : styles.panelDefault;
  const headerClassNames = classNames
    ? classNamesMerger(classNames.header, styles.headerDefault)
    : styles.headerDefault;
  const bodyClassNames = classNames
    ? classNamesMerger(classNames.body, styles.bodyDefault)
    : styles.bodyDefault;

  const closeButtonClassNames = classNames
    ? classNamesMerger(classNames.closeButton, styles.closeButton)
    : styles.closeButton;

  return (
    <div className={panelClassNames}>
      {onClose && (
        <span className={closeButtonClassNames} onClick={onClose}>
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
