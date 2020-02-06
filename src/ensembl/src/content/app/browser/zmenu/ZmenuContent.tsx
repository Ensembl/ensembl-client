import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { changeFocusObject } from 'src/content/app/browser/browserActions';

import {
  ZmenuContentFeature as ZmenuContentFeatureType,
  ZmenuContentLine as ZmenuContentLineType,
  ZmenuContentBlock as ZmenuContentBlockType,
  ZmenuContentItem as ZmenuContentItemType,
  Markup
} from './zmenu-types';

import styles from './Zmenu.scss';

export type ZmenuContentProps = {
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

export type ZmenuContentItemProps = ZmenuContentItemType & {
  changeFocusObject: (objectId: string) => void;
  id: string;
};

export const ZmenuContent = (props: ZmenuContentProps) => {
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

export const ZmenuContentFeature = (props: ZmenuContentFeatureProps) => {
  return (
    <p className={styles.zmenuContentFeature}>
      {props.lines.map((line, index) => (
        <ZmenuContentLine key={index} id={props.id} blocks={line} />
      ))}
    </p>
  );
};

export const ZmenuContentLine = (props: ZmenuContentLineProps) => {
  return (
    <span className={styles.zmenuContentLine}>
      {props.blocks.map((items, index) => (
        <ZmenuContentBlock key={index} id={props.id} items={items} />
      ))}
    </span>
  );
};

export const ZmenuContentBlock = (props: ZmenuContentBlockProps) => {
  return (
    <span className={styles.zmenuContentBlock}>
      {props.items.map((item, index) => (
        <ConnectedZmenuContentItem key={index} id={props.id} {...item} />
      ))}
    </span>
  );
};

export const ZmenuContentItem = (props: ZmenuContentItemProps) => {
  const { text, markup, id } = props;
  const isFocusable = markup.includes(Markup.FOCUS);

  const className = classNames({
    [styles.markupLight]: markup.includes(Markup.LIGHT),
    [styles.markupStrong]: markup.includes(Markup.STRONG),
    [styles.markupEmphasis]: markup.includes(Markup.EMPHASIS),
    [styles.markupFocus]: isFocusable
  });

  const handleClick = () => {
    props.changeFocusObject(id);
  };

  const itemProps = {
    className,
    ...(isFocusable && { onClick: handleClick })
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
