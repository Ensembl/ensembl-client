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
  ZmenuContentGeneMetadata,
  ZmenuContentFeature as ZmenuContentFeatureType,
  ZmenuContentItem as ZmenuContentItemType,
  ZmenuContentBlock as ZmenuContentBlockType,
  Markup
} from 'ensembl-genome-browser';

import styles from './Zmenu.scss';

export type ZmenuContentProps = {
  content: ZmenuContentFeatureType[];
};

export const ZmenuContent = (props: ZmenuContentProps) => {
  const { content } = props;

  const { id } = content[1].metadata as ZmenuContentGeneMetadata;
  const unversionedId = id.split('.')[0];
  const featureId = `gene:${unversionedId}`;

  const renderedContent = (
    <>
      {content.map((feature: any, index) => (
        <p key={index} className={styles.zmenuContentFeature}>
          <ZmenuContentFeature id={featureId} feature={feature} />
        </p>
      ))}
      <ZmenuAppLinks featureId={featureId} />
    </>
  );

  return renderedContent;
};

type ZmenuContentFeatureProps = {
  id: string;
  feature: ZmenuContentFeatureType;
};
export const ZmenuContentFeature = (props: ZmenuContentFeatureProps) => {
  const lines = props.feature.data.reduce(
    (lines, block) => {
      if (block.type === 'line-break') {
        lines.push([]);
      } else {
        const lastLine = lines[lines.length - 1];
        lastLine.push(block);
      }
      return lines;
    },
    [[]] as ZmenuContentBlockType[][]
  );

  return (
    <>
      {lines.map((blocks, index) => {
        return (
          <span className={styles.zmenuContentLine} key={index}>
            {blocks.map((block, blockIndex) => (
              <span key={blockIndex} className={styles.zmenuContentBlock}>
                <ZmenuContentBlock items={block.items} id={props.id} />
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
};

type ZmenuContentBlockProps = {
  items: ZmenuContentItemType[];
  id: string;
};

export const ZmenuContentBlock = (props: ZmenuContentBlockProps) => {
  return (
    <>
      {props.items.map((item, index) => (
        <ZmenuContentItem key={index} id={props.id} {...item} />
      ))}
    </>
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
