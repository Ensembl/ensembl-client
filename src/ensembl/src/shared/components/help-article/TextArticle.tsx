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

import React, { useRef, useEffect, RefObject } from 'react';
import { TextArticle as TextArticleType } from 'src/shared/types/help-and-docs/article';

import styles from './HelpArticle.scss';

type Props = {
  article: TextArticleType;
  className?: string;
};

const TextArticle = (props: Props) => {
  const articleRef = useRef<HTMLElement | null>(null);
  useRoutingRules(articleRef);

  return (
    <article
      ref={articleRef}
      className={styles.textArticle}
      dangerouslySetInnerHTML={{ __html: props.article.body }}
    />
  );
};

const useRoutingRules = <T extends HTMLElement>(ref: RefObject<T>) => {
  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;

    if (!target?.matches('a')) {
      return;
    }

    const href = target.getAttribute('href') as string;
    if (href.startsWith('http')) {
      // This is a link to an external source.
      // Hopefully we won't have links starting with ftp or other protocols
      window.open(href);
    } else {
      // TODO
    }
  };

  useEffect(() => {
    ref?.current?.addEventListener('click', onClick);

    return () => ref?.current?.removeEventListener('click', onClick);
  });
};

export default TextArticle;
