import React from 'react';
import classNames from 'classnames';

import ExternalLink from '../external-link/ExternalLink';

import styles from './ExternalReference.scss';

export type ExternalReferenceProps = {
  label?: string;
  to: string;
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

  return (
    <div className={containerClass}>
      {!!props.label && <span className={labelClass}>{props.label}</span>}
      <ExternalLink
        to={props.to}
        linkText={props.linkText}
        classNames={props.classNames}
      />
    </div>
  );
};

export default ExternalReference;
