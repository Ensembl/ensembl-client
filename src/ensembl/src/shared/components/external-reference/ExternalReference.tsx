import React from 'react';
import classNames from 'classnames';

import { ReactComponent as LinkIcon } from 'static/img/shared/external-link.svg';

import styles from './ExternalReference.scss';

export type ExternalReferenceProps = {
  label?: string;
  href: string;
  linkText: string;
  classNames?: {
    container?: string;
    label?: string;
    icon?: string;
    link?: string;
  };
};

const ExternalReference = (props: ExternalReferenceProps) => {
  const containerClass = classNames(
    styles.defaultContainer,
    props.classNames?.container
  );

  const labelClass = classNames(styles.defaultLabel, props.classNames?.label);

  const iconClass = classNames(styles.defaultIcon, props.classNames?.icon);

  const linkClass = classNames(styles.defaultLink, props.classNames?.link);

  return (
    <div className={containerClass}>
      {!!props.label && <div className={labelClass}>{props.label}</div>}
      <div className={styles.linkHolder}>
        <LinkIcon className={iconClass} />
        <a className={linkClass} href={props.href}>
          {props.linkText}
        </a>
      </div>
    </div>
  );
};

export default ExternalReference;
