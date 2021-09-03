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

import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

import ZmenuAppLinks from './ZmenuAppLinks';

import {
  ZmenuContentFeature as ZmenuContentFeatureType,
  ZmenuContentLine as ZmenuContentLineType,
  ZmenuContentItem as ZmenuContentItemType,
  Markup,
  ZmenuContentGeneMetadata
} from './zmenu-types';

import styles from './Zmenu.scss';

export type ZmenuContentProps = {
  content: ZmenuContentFeatureType[];
};

export const ZmenuContent = (props: ZmenuContentProps) => {
  const { content } = props;

  const { id } = content[1].metadata as ZmenuContentGeneMetadata;
  const featureId = `gene:${id}`;

  const renderedContent = content.map((feature: any, index) => (
    <div key={index}>
      <ZmenuContentFeature id={featureId} feature={feature} />
      <ZmenuAppLinks featureId={featureId} />
    </div>
  ));
  return <>{renderedContent}</>;
};

type ZmenuContentFeatureProps = {
  id: string;
  feature: ZmenuContentFeatureType;
};
export const ZmenuContentFeature = (props: ZmenuContentFeatureProps) => {
  return (
    <p className={styles.zmenuContentFeature}>
      {props.feature.data.map((line, index) => (
        <ZmenuContentLine key={index} id={props.id} line={line} />
      ))}
    </p>
  );
};

type ZmenuContentLineProps = {
  line: ZmenuContentLineType;
  id: string;
};
export const ZmenuContentLine = (props: ZmenuContentLineProps) => {
  if (props.line.type === 'line-break') {
    return (
      <span className={styles.zmenuContentBlock}>
        <br />
      </span>
    );
  }

  return (
    <span className={styles.zmenuContentLine}>
      <ZmenuContentBlock id={props.id} items={props.line.items} />
    </span>
  );
};

type ZmenuContentBlockProps = {
  items: ZmenuContentItemType[];
  id: string;
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

export type ZmenuContentItemProps = ZmenuContentItemType & {
  id: string;
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
