import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import styles from './Zmenu.scss';

import {
  ZmenuContentFeature as ZmenuContentFeatureType,
  ZmenuContentItem as ZmenuContentItemType,
  Markup
} from './zmenu-types';

type ZmenuContentItemProps = ZmenuContentItemType & {
  id: string;
};

type ZmenuContentProps = {
  content: ZmenuContentFeatureType[]
};

const ZmenuContent = (props: ZmenuContentProps) => {
  const features = props.content;
  return features
    .map(feature =>
      feature.map(section =>
        section.lines.map(line =>
          line.map(block => block.map(item => (
            <ZmenuContentItem
              key={`${section.id}-${item.text}`}
              id={section.id}
              {...item}
            />
          ))))));
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
