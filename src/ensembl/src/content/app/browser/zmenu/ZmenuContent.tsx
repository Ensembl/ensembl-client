/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import classNames from 'classnames';

import ZmenuAppLinks from './ZmenuAppLinks';

import {
  ZmenuContentFeature as ZmenuContentFeatureType,
  ZmenuContentLine as ZmenuContentLineType,
  ZmenuContentBlock as ZmenuContentBlockType,
  ZmenuContentItem as ZmenuContentItemType,
  Markup
} from './zmenu-types';

import styles from './Zmenu.scss';
import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

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
  id: string;
};

export const ZmenuContent = (props: ZmenuContentProps) => {
  const features = props.content;
  const renderedContent = features.map((feature) => (
    <div key={feature.id}>
      <ZmenuContentFeature id={feature.id} lines={feature.lines} />
      <ZmenuAppLinks featureId={feature.id} />
    </div>
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
        <ZmenuContentItem key={index} id={props.id} {...item} />
      ))}
    </span>
  );
};

export const ZmenuContentItem = (props: ZmenuContentItemProps) => {
  const { changeFocusObject } = useGenomeBrowser();

  const { text, markup, id } = props;
  const isFocusable = markup.includes(Markup.FOCUS);

  const className = classNames({
    [styles.markupLight]: markup.includes(Markup.LIGHT),
    [styles.markupStrong]: markup.includes(Markup.STRONG),
    [styles.markupEmphasis]: markup.includes(Markup.EMPHASIS),
    [styles.markupFocus]: isFocusable
  });

  const handleClick = () => {
    changeFocusObject(id);
  };

  const itemProps = {
    className,
    ...(isFocusable && { onClick: handleClick })
  };

  return <span {...itemProps}>{text}</span>;
};

export default ZmenuContent;
