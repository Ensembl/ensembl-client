import React from 'react';
import classNamesMerger from 'classnames';

import closeIcon from 'static/img/shared/close.svg';

import styles from './Panel.scss';

export type PanelProps = {
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

const Panel = (props: PanelProps) => {
  const { header, onClose, classNames } = props;

  const panelClassNames = classNames
    ? classNamesMerger(classNames.panel, styles.panel)
    : styles.panel;
  const headerClassNames = classNames
    ? classNamesMerger(classNames.header, styles.header)
    : styles.header;
  const bodyClassNames = classNames
    ? classNamesMerger(classNames.body, styles.body)
    : styles.body;

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
