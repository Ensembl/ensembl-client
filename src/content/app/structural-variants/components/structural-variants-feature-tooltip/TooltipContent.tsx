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

import classNames from 'classnames';

// NOTE: Using types imported from the structural variants package couples this component
// to structural variants
import type {
  MessageSection,
  MessageTextUnit
} from '@ensembl/ensembl-structural-variants';

import styles from './TooltipContent.module.css';

export type TooltipContentProps = {
  content: MessageSection[];
};

export const TooltipContent = (props: TooltipContentProps) => {
  const { content: sections } = props;

  const renderedContent = (
    <div className={styles.container}>
      {sections.map((section, index) => (
        <ContentSection key={index} content={section} />
      ))}
    </div>
  );

  return renderedContent;
};

type ContentSectionProps = {
  content: MessageSection;
};
export const ContentSection = (props: ContentSectionProps) => {
  const lines = props.content.data;

  return (
    <div className={styles.section}>
      {lines.map((blocks, index) => {
        return (
          <div className={styles.paragraph} key={index}>
            {blocks.map((block, blockIndex) => (
              <ContentBlock key={blockIndex} items={block.items} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

type ContentBlockProps = {
  items: MessageTextUnit[];
};

export const ContentBlock = (props: ContentBlockProps) => {
  return (
    <span className={styles.contentBlock}>
      {props.items.map((item, index) => (
        <ContentItem key={index} {...item} />
      ))}
    </span>
  );
};

export type ContentItemProps = MessageTextUnit;

export const ContentItem = (props: ContentItemProps) => {
  const { text, markup } = props;

  const className = classNames({
    [styles.markupLight]: markup.includes('light'),
    [styles.markupStrong]: markup.includes('strong'),
    [styles.markupEmphasis]: markup.includes('emphasis')
  });

  return <span className={className}>{text}</span>;
};

export default TooltipContent;
