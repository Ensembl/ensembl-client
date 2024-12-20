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

import { useRef, useEffect, RefObject } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { TextArticleData } from 'src/shared/types/help-and-docs/article';

import styles from './HelpArticle.module.css';
import cssVariables from './helpArticleVariables.module.css';

type Props = {
  article: TextArticleData;
  className?: string;
  onInternalLinkClick?: (link: string) => void;
};

const TextArticle = (props: Props) => {
  const articleRef = useRef<HTMLElement | null>(null);
  useRoutingRules(articleRef, props.onInternalLinkClick);
  const articleClasses = classNames(
    styles.textArticle,
    cssVariables.variablesContainer,
    props.className
  );

  return (
    <article
      ref={articleRef}
      className={articleClasses}
      dangerouslySetInnerHTML={{ __html: props.article.body }}
    />
  );
};

const useRoutingRules = <T extends HTMLElement | null>(
  ref: RefObject<T>,
  onInternalLinkClick?: (link: string) => void
) => {
  const navigate = useNavigate();

  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target?.matches('a')) {
      return;
    }
    event.preventDefault();

    const href = target.getAttribute('href') as string;
    if (href.startsWith('/')) {
      // This is an internal link
      if (onInternalLinkClick) {
        onInternalLinkClick(href);
      } else {
        navigate(href);
      }
    } else {
      // A href containing an absolute urls, with a protocol and a hostname
      // is treated as a link to an external resource; open it in a new tab
      window.open(href);
    }
  };

  useEffect(() => {
    const element = ref.current;
    element?.addEventListener('click', onClick);

    return () => element?.removeEventListener('click', onClick);
  });
};

export default TextArticle;
