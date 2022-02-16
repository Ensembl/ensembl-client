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
import { useLocation, useNavigate } from 'react-router-dom';

import useApiService from 'src/shared/hooks/useApiService';
import useHelpHistory from 'src/content/app/help/hooks/useHelpHistory';

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
import HistoryButtons from 'src/shared/components/help-popup/HistoryButtons';

import {
  Menu as MenuType,
  MenuItem
} from 'src/shared/types/help-and-docs/menu';
import {
  TextArticleData,
  VideoArticleData
} from 'src/shared/types/help-and-docs/article';

import styles from './Help.scss';

type ArticleData = TextArticleData | VideoArticleData;

const Help = () => {
  const { pathname } = useLocation();
  const isIndexPage = isIndexRoute(pathname);
  const { data: menu } = useApiService<MenuType>({
    endpoint: `/api/docs/menus?name=help`
  });
  const { data: article } = useApiService<any>({
    endpoint: `/api/docs/article?url=${encodeURIComponent(pathname)}`,
    skip: isIndexPage
  });
  const { hasNext, hasPrevious } = useHelpHistory();

  let breadcrumbs: string[] = [];

  if (menu) {
    breadcrumbs = buildBreadcrumbs(menu, { url: pathname });
  }

  const main = isIndexPage ? (
    <main className={styles.main}>
      <div className={styles.breadcrumbsContainer}>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className={styles.articleContainer}>
        <HelpLanding />
      </div>
    </main>
  ) : article ? (
    <MainContent
      article={article}
      breadcrumbs={breadcrumbs}
      hasNext={hasNext}
      hasPrevious={hasPrevious}
    />
  ) : null;

  return (
    <div className={styles.help}>
      <AppBar />
      {menu && <HelpMenu menu={menu} currentUrl={pathname} />}
      {main}
    </div>
  );
};

const AppBar = () => {
  return (
    <div className={styles.appBar}>
      Help
      <div className={styles.conversationIcon}>
        <ConversationIcon withLabel={true} />
      </div>
    </div>
  );
};

const HelpHistoryButtons = (props: {
  hasNext: boolean;
  hasPrevious: boolean;
}) => {
  const { hasNext, hasPrevious } = props;
  const navigate = useNavigate();

  const onHistoryBack = () => {
    navigate(-1);
  };

  const onHistoryForward = () => {
    navigate(1);
  };

  return (
    <HistoryButtons
      onHistoryBack={onHistoryBack}
      onHistoryForward={onHistoryForward}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
    />
  );
};

const MainContent = (props: {
  article: ArticleData;
  breadcrumbs: string[];
  hasNext: boolean;
  hasPrevious: boolean;
}) => {
  const { article, breadcrumbs, hasNext, hasPrevious } = props;
  const isHelpContent = article.type === 'article' || article.type === 'video';

  if (!isHelpContent) {
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
      <div className={styles.breadcrumbsContainer}>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className={styles.articleContainer}>
        <HelpArticleGrid className={styles.articleGrid}>
          {renderedArticle}
          <aside>
            <HelpHistoryButtons hasNext={hasNext} hasPrevious={hasPrevious} />
            {!!article.related_articles.length && (
              <RelatedArticles articles={article.related_articles} />
            )}
          </aside>
        </HelpArticleGrid>
      </div>
    </>
  );

  return <main className={styles.main}>{content}</main>;
};

export const buildBreadcrumbs = (menu: MenuType, article: { url: string }) => {
  for (const rootMenuItem of menu.items) {
    const breadcrumbs = collectBreadcrumbs(rootMenuItem, article.url, []);
    if (breadcrumbs) {
      return breadcrumbs;
    }
  }

  return [];
};

// use depth-first search to traverse the menu tree
const collectBreadcrumbs = (
  menuItem: MenuItem,
  url: string,
  accumulator: string[]
): string[] | null => {
  accumulator = [...accumulator, menuItem.name];

  if (menuItem.url === url) {
    return accumulator;
  } else {
    if (menuItem.type === 'collection' && menuItem.items) {
      for (const childItem of menuItem.items) {
        const searchResult = collectBreadcrumbs(childItem, url, accumulator);
        if (searchResult) {
          return searchResult;
        }
      }
    }
  }

  return null;
};

export const isIndexRoute = (pathname: string) => {
  // handle both /help and /help/
  return pathname.replaceAll('/', '') === 'help';
};

export default Help;
