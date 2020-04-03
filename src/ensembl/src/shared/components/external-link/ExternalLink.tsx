import React from 'react';
import classNames from 'classnames';

import { ReactComponent as LinkIcon } from 'static/img/shared/external-link.svg';

import styles from './ExternalLink.scss';

export type ExternalLinkProps = {
  to: string;
  linkText: string;
  classNames?: {
    label?: string;
    icon?: string;
    link?: string;
  };
};

const ExternalLink = (props: ExternalLinkProps) => {
  const iconClass = classNames(styles.defaultIcon, props.classNames?.icon);

  const linkClass = classNames(styles.defaultLink, props.classNames?.link);

  return (
    <div className={styles.linkHolder}>
      <LinkIcon className={iconClass} />
      <a className={linkClass} href={props.to}>
        {props.linkText}
      </a>
    </div>
  );
};

export default ExternalLink;
