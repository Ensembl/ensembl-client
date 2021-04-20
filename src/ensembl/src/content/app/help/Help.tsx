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
import { useLocation } from 'react-router';

import useApiService from 'src/shared/hooks/useApiService';

import HelpMenu from './help-menu/HelpMenu';
import {
  IndexArticle,
  TextArticle,
  RelatedArticles,
  HelpArticleGrid
} from 'src/shared/components/help-article';

import { Menu as MenuType } from 'src/shared/types/help-and-docs/menu';
import {
  TextArticle as TextArticleType,
  VideoArticle as VideoArticleType,
  IndexArticle as IndexArticleType
} from 'src/shared/types/help-and-docs/article';

import styles from './Help.scss';

type ArticleType = TextArticleType | VideoArticleType | IndexArticleType;

const Help = () => {
  const location = useLocation();
  const { data: menu } = useApiService<MenuType>({
    endpoint: `/api/docs/menus?name=help`
  });
  const { data: article } = useApiService<any>({
    endpoint: `/api/docs/article?url=${encodeURIComponent(location.pathname)}`
  });

  if (!article) {
    return null; // FIXME
  }

  return (
    <>
      <AppBar />
      <div>
        {menu && <HelpMenu menu={menu} currentUrl={location.pathname} />}
        {article && <MainContent article={article} />}
      </div>
    </>
  );
};

const AppBar = () => {
  return <div className={styles.appBar}>Help</div>;
};

const MainContent = (props: { article: ArticleType }) => {
  const { article } = props;
  let content;
  if (article.type === 'index') {
    content = <IndexArticle article={article} />;
  } else if (article.type === 'article') {
    content = (
      <HelpArticleGrid>
        <TextArticle article={article} />
        {!!article.related_articles.length && (
          <RelatedArticles articles={article.related_articles} />
        )}
      </HelpArticleGrid>
    );
  }
  return <main className={styles.main}>{content}</main>;
};

export default Help;
