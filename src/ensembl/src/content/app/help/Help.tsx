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
import { get } from 'lodash';

import useApiService from 'src/shared/hooks/useApiService';

import ConversationIcon from 'src/shared/components/communication-framework/ConversationIcon';
import HelpMenu from './components/help-menu/HelpMenu';
import HelpLanding from './components/help-landing/HelpLanding';
import {
  TextArticle,
  RelatedArticles,
  HelpArticleGrid,
  VideoArticle
} from 'src/shared/components/help-article';
import Breadcrumbs from 'src/shared/components/breadcrumbs/Breadcrumbs';

import { Menu as MenuType } from 'src/shared/types/help-and-docs/menu';
import {
  TextArticleData,
  VideoArticleData
} from 'src/shared/types/help-and-docs/article';
import JSONValue from 'ensemblRoot/src/shared/types/JSON';

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

  let breadcrumbs: string[] | null = [];
  if (!isIndexPage && menu && article) {
    breadcrumbs = getBreadcrumbsFromMenu(menu, article.url);
  }

  const main = isIndexPage ? (
    <main className={styles.main}>
      <div className={styles.breadcrumbsContainer}>
        <Breadcrumbs breadcrumbs={['Overview']} />
      </div>
      <div className={styles.articleContainer}>
        <HelpLanding />
      </div>
    </main>
  ) : article ? (
    <MainContent article={article} breadcrumbs={breadcrumbs} />
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
  return (
    <div className={styles.appBar}>
      Help
      <div className={styles.conversationIcon}>
        <ConversationIcon />
      </div>
    </div>
  );
};

const MainContent = (props: {
  article: ArticleData;
  breadcrumbs: string[] | null;
}) => {
  const { article, breadcrumbs } = props;
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
    <>
      {breadcrumbs && (
        <div className={styles.breadcrumbsContainer}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      )}
      <div className={styles.articleContainer}>
        <HelpArticleGrid className={styles.articleGrid}>
          {renderedArticle}
          {!!article.related_articles.length && (
            <RelatedArticles articles={article.related_articles} />
          )}
        </HelpArticleGrid>
      </div>
    </>
  );

  return <main className={styles.main}>{content}</main>;
};

export const getBreadcrumbsFromMenu = (menu: MenuType, url: string) => {
  const getAllUrlKeysPaths = (menu: JSONValue, path = ''): string[] => {
    if (!menu || typeof menu !== 'object') {
      return [path];
    }

    return Object.keys(menu)
      .map((key) =>
        getAllUrlKeysPaths(
          menu[key] as JSONValue,
          path ? [path, key].join('.') : key
        )
      )
      .toString()
      .split(',')
      .filter((path) => path.includes('url'));
  };

  const urlKeysPaths = getAllUrlKeysPaths(menu);

  // Find the path matching the current article URL
  // example matched path: 'items.1.items.0.items.1.url'
  const matchedPath = urlKeysPaths.find((path) => get(menu, path) === url);

  if (!matchedPath) {
    return null;
  }

  // split the matched path using '.'
  const pathPortions = matchedPath?.split('.') || [];
  const breadcrumbs: string[] = [];

  /*
    The loop below does the following:
    Example matched path: 'items.1.items.0.items.1.url'
    iteration 1 gets `items.1.name` from menu
    iteration 2 gets `items.1.items.0.name` from menu
    iteration 3 gets `items.1.items.0.items.1.name` from menu
  */
  for (let i = 1; i <= pathPortions?.length / 2; i++) {
    const slicedPath = [...pathPortions.slice(0, i * 2), 'name'];

    breadcrumbs.push(get(menu, slicedPath));
  }

  return breadcrumbs;
};

export const isIndexRoute = (pathname: string) => {
  // handle both /help and /help/
  return pathname.replaceAll('/', '') === 'help';
};

export default Help;
