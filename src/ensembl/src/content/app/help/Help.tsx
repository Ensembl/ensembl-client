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

import HelpMenu from './components/help-menu/HelpMenu';
import HelpLanding from './components/help-landing/HelpLanding';
import {
  TextArticle,
  RelatedArticles,
  HelpArticleGrid,
  VideoArticle
} from 'src/shared/components/help-article';

import { Menu as MenuType } from 'src/shared/types/help-and-docs/menu';
import {
  TextArticleData,
  VideoArticleData
} from 'src/shared/types/help-and-docs/article';

import styles from './Help.scss';

type ArticleData = TextArticleData | VideoArticleData;

const Help = () => {
  const location = useLocation();
  const isIndexPage = isIndexRoute(location.pathname);
  const { data: menu } = useApiService<MenuType>({
    endpoint: `/api/docs/menus?name=help`
  });
  const { data: article } = useApiService<any>({
    endpoint: `/api/docs/article?url=${encodeURIComponent(location.pathname)}`,
    skip: isIndexPage
  });
  const main = isIndexPage ? (
    <main className={styles.main}>
      <HelpLanding />
    </main>
  ) : article ? (
    <MainContent article={article} />
  ) : null;

  return (
    <div className={styles.help}>
      <AppBar />
      {menu && <HelpMenu menu={menu} currentUrl={location.pathname} />}
      {main}
    </div>
  );
};

const AppBar = () => {
  return <div className={styles.appBar}>Help</div>;
};

const MainContent = (props: { article: ArticleData }) => {
  const { article } = props;
  if (article.type !== 'article' && article.type !== 'video') {
    return null;
  }
  const renderedArticle =
    article.type === 'article' ? (
      <TextArticle article={article} />
    ) : (
      <VideoArticle video={article} />
    );

  const content = (
    <HelpArticleGrid className={styles.articleGrid}>
      {renderedArticle}
      {!!article.related_articles.length && (
        <RelatedArticles articles={article.related_articles} />
      )}
    </HelpArticleGrid>
  );

  return <main className={styles.main}>{content}</main>;
};

const isIndexRoute = (pathname: string) => {
  // handle both /help and /help/
  return pathname.replaceAll('/', '') === 'help';
};

export default Help;
