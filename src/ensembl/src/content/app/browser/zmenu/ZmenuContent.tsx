import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import styles from './Zmenu.scss';

import {
  ZmenuContentFeature as ZmenuContentFeatureType,
  ZmenuContentBlock as ZmenuContentBlockType,
  ZmenuContentItem as ZmenuContentItemType,
  Markup
} from './zmenu-types';

type ZmenuContentProps = {
  content: ZmenuContentFeatureType[];
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
  id: string;
};

const ZmenuContent = (props: ZmenuContentProps) => {
  const features = props.content;
  const renderedContent = features.map((feature) =>
    feature.lines.map((blocks, index) => (
      <ZmenuContentLine key={index} id={feature.id} blocks={blocks} />
    ))
  );
  return <>{renderedContent}</>;
};

const ZmenuContentLine = (props: ZmenuContentLineProps) => {
  return (
    <p className={styles.zmenuContentLine}>
      {props.blocks.map((items, index) => (
        <ZmenuContentBlock key={index} id={props.id} items={items} />
      ))}
    </p>
  );
};

const ZmenuContentBlock = (props: ZmenuContentBlockProps) => {
  return (
    <span>
      {props.items.map((item, index) => (
        <ZmenuContentItem key={index} id={props.id} {...item} />
      ))}
    </span>
  );
};

const ZmenuContentItem = (props: ZmenuContentItemProps) => {
  const { text, markup } = props;

  const className = classNames({
    [styles.markupLight]: markup.includes(Markup.LIGHT),
    [styles.markupStrong]: markup.includes(Markup.STRONG),
    [styles.markupEmphasis]: markup.includes(Markup.EMPHASIS),
    [styles.markupFocus]: markup.includes(Markup.FOCUS)
  });

  const item = <span className={className}>{text}</span>;

  // TODO: build correct link to the ensembl object in genome browser
  // after the browser chrome learns to support multiple genomes
  return markup.includes(Markup.FOCUS) ? <Link to="/">{item}</Link> : item;
};

export default ZmenuContent;
