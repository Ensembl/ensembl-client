import React from 'react';
import classNames from 'classnames';

import { ReactComponent as LinkIcon } from 'static/img/shared/icon-xlink.svg';

import styles from './ExternalLink.scss';

export type ExternalLinkProps = {
  label?: string;
  linkUrl: string;
  linkText: string;
  classNames?: {
    containerClass?: string;
    labelClass?: string;
    iconClass?: string;
    linkClass?: string;
  };
};

const ExternalLink = (props: ExternalLinkProps) => {
  const containerClass = classNames(
    styles.defaultContainer,
    props.classNames?.containerClass
  );

  const labelClass = classNames(
    styles.defaultLabel,
    props.classNames?.labelClass
  );

  const iconClass = classNames(styles.defaultIcon, props.classNames?.iconClass);

  const linkClass = classNames(styles.defaultLink, props.classNames?.linkClass);

  return (
    <div className={containerClass}>
      {!!props.label && <div className={labelClass}>{props.label}</div>}
      <div className={iconClass}>
        <LinkIcon />
      </div>
      <a className={linkClass} href={props.linkUrl}>
        {props.linkText}
      </a>
    </div>
  );
};

export default ExternalLink;
