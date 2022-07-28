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
import { useNavigate } from 'react-router';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';
// import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import ZmenuAppLinks from './ZmenuAppLinks';

import {
  ZmenuContentItem as ZmenuContentItemType,
  Markup,
  ZmenuContentTranscript,
  ZmenuContentGene
} from '@ensembl/ensembl-genome-browser';

import styles from './Zmenu.scss';

export type ZmenuContentProps = {
  features: (ZmenuContentTranscript | ZmenuContentGene)[];
  featureId: string;
  destroyZmenu: () => void;
};

export const ZmenuContent = (props: ZmenuContentProps) => {
  const { features, featureId } = props;

  const renderedContent = (
    <>
      {features.map((feature: any, index) => (
        <p key={index} className={styles.zmenuContentFeature}>
          <ZmenuContentFeature
            featureId={featureId}
            feature={feature}
            destroyZmenu={props.destroyZmenu}
          />
        </p>
      ))}
      <ZmenuAppLinks featureId={featureId} destroyZmenu={props.destroyZmenu} />
    </>
  );

  return renderedContent;
};

type ZmenuContentFeatureProps = {
  featureId: string;
  feature: ZmenuContentGene | ZmenuContentTranscript;
  destroyZmenu: () => void;
};
export const ZmenuContentFeature = (props: ZmenuContentFeatureProps) => {
  const lines = props.feature.data;

  return (
    <>
      {lines.map((blocks, index) => {
        return (
          <span className={styles.zmenuContentLine} key={index}>
            {blocks.map((block, blockIndex) => (
              <span key={blockIndex} className={styles.zmenuContentBlock}>
                <ZmenuContentBlock
                  items={block.items}
                  featureId={props.featureId}
                  destroyZmenu={props.destroyZmenu}
                />
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
  featureId: string;
  destroyZmenu: () => void;
};

export const ZmenuContentBlock = (props: ZmenuContentBlockProps) => {
  return (
    <>
      {props.items.map((item, index) => (
        <ZmenuContentItem
          key={index}
          featureId={props.featureId}
          destroyZmenu={props.destroyZmenu}
          {...item}
        />
      ))}
    </>
  );
};

export type ZmenuContentItemProps = ZmenuContentItemType & {
  featureId: string;
  destroyZmenu: () => void;
};

export const ZmenuContentItem = (props: ZmenuContentItemProps) => {
  const { genomeIdForUrl } = useGenomeBrowserIds();
  const navigate = useNavigate();

  const { text, markup, featureId } = props;
  const isFocusable = markup.includes(Markup.FOCUS);

  const className = classNames({
    [styles.markupLight]: markup.includes(Markup.LIGHT),
    [styles.markupStrong]: markup.includes(Markup.STRONG),
    [styles.markupEmphasis]: markup.includes(Markup.EMPHASIS),
    [styles.markupFocus]: isFocusable
  });

  const handleClick = () => {
    const url = urlFor.browser({
      genomeId: genomeIdForUrl,
      focus: featureId
    });
    navigate(url, { replace: true });
    props.destroyZmenu();
  };

  const itemProps = {
    className,
    ...(isFocusable && { onClick: handleClick })
  };

  return <span {...itemProps}>{text}</span>;
};

export default ZmenuContent;
