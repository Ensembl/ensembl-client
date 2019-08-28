import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import { changeFocusObject } from 'src/content/app/browser/browserActions';

import styles from './Zmenu.scss';

import {
  ZmenuContentFeature as ZmenuContentFeatureType,
  ZmenuContentLine as ZmenuContentLineType,
  ZmenuContentBlock as ZmenuContentBlockType,
  ZmenuContentItem as ZmenuContentItemType,
  Markup
} from './zmenu-types';

type ZmenuContentProps = {
  content: ZmenuContentFeatureType[];
};

type ZmenuContentFeatureProps = {
  id: string;
  lines: ZmenuContentLineType[];
};

type ZmenuContentLineProps = {
  blocks: ZmenuContentBlockType[];
  id: string;
};

type ZmenuContentBlockProps = {
  items: ZmenuContentItemType[];
  id: string;
};

type ZmenuContentItemProps = ZmenuContentItemType & {
  changeFocusObject: (objectId: string) => void;
  id: string;
};

const ZmenuContent = (props: ZmenuContentProps) => {
  const features = props.content;
  const renderedContent = features.map((feature) => (
    <ZmenuContentFeature
      key={feature.id}
      id={feature.id}
      lines={feature.lines}
    />
  ));
  return <>{renderedContent}</>;
};

const ZmenuContentFeature = (props: ZmenuContentFeatureProps) => {
  return (
    <p className={styles.zmenuContentFeature}>
      {props.lines.map((line, index) => (
        <ZmenuContentLine key={index} id={props.id} blocks={line} />
      ))}
    </p>
  );
};

const ZmenuContentLine = (props: ZmenuContentLineProps) => {
  return (
    <span className={styles.zmenuContentLine}>
      {props.blocks.map((items, index) => (
        <ZmenuContentBlock key={index} id={props.id} items={items} />
      ))}
    </span>
  );
};

const ZmenuContentBlock = (props: ZmenuContentBlockProps) => {
  return (
    <span className={styles.zmenuContentBlock}>
      {props.items.map((item, index) => (
        <ConnectedZmenuContentItem key={index} id={props.id} {...item} />
      ))}
    </span>
  );
};

const ZmenuContentItem = (props: ZmenuContentItemProps) => {
  const { text, markup, id } = props;

  // FIXME: remove dependency on environment when ensObject api endpoint is ready
  const shouldAddLink =
    markup.includes(Markup.FOCUS) &&
    isEnvironment([Environment.DEVELOPMENT, Environment.INTERNAL]);

  const className = classNames({
    [styles.markupLight]: markup.includes(Markup.LIGHT),
    [styles.markupStrong]: markup.includes(Markup.STRONG),
    [styles.markupEmphasis]: markup.includes(Markup.EMPHASIS),
    [styles.markupFocus]: shouldAddLink
  });

  const handleClick = () => {
    props.changeFocusObject(id);
  };

  const itemProps = {
    className,
    onClick: shouldAddLink ? handleClick : undefined
  };

  return <span {...itemProps}>{text}</span>;
};

const mapDispatchToProps = {
  changeFocusObject
};

const ConnectedZmenuContentItem = connect(
  null,
  mapDispatchToProps
)(ZmenuContentItem);

export default ZmenuContent;
