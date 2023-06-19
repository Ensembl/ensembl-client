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

import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

import { useAppDispatch } from 'src/store';

import {
  useGetHelpArticleQuery,
  useGetHelpMenuQuery,
  isArticleNotFoundError
} from 'src/content/app/help/state/api/helpApiSlice';
import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';

import {
  createAboutPageTitle,
  ABOUT_PAGE_FALLBACK_DESCRIPTION
} from './helpers/aboutPageMetaHelpers';

import { buildBreadcrumbs } from '../help/Help';

import {
  TextArticle,
  RelatedArticles,
  HelpArticleGrid
} from 'src/shared/components/help-article';
import HelpMenu from 'src/content/app/help/components/help-menu/HelpMenu';
import Breadcrumbs from 'src/shared/components/breadcrumbs/Breadcrumbs';
import { CircleLoader } from 'src/shared/components/loader';
import ConversationIcon from 'src/shared/components/communication-framework/ConversationIcon';
import { NotFoundErrorScreen } from 'src/shared/components/error-screen';

import helpStyles from '../help/Help.scss';
import styles from './About.scss';

const About = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const { currentData: menu } = useGetHelpMenuQuery({ name: 'about' });

  const { currentData: article, error: articleError } = useGetHelpArticleQuery({
    pathname
  });

  let breadcrumbs: string[] = [];

  useEffect(() => {
    if (!article) {
      return;
    }

    dispatch(
      updatePageMeta({
        title: createAboutPageTitle(article.title),
        description: article.description || ABOUT_PAGE_FALLBACK_DESCRIPTION
      })
    );
  }, [article]);

  if (isArticleNotFoundError(articleError)) {
    return <NotFoundErrorScreen />;
  }

  if (menu) {
    breadcrumbs = buildBreadcrumbs(menu, { url: pathname });
  }

  return (
    <div className={helpStyles.help}>
      <AppBar />
      {menu && <HelpMenu menu={menu} currentUrl={pathname} />}
      <div className={helpStyles.main}>
        <div className={helpStyles.breadcrumbsContainer}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className={helpStyles.articleContainer}>
          <HelpArticleGrid className={helpStyles.grid}>
            {article?.type === 'article' ? (
              <TextArticle article={article} />
            ) : (
              <div className={styles.spinnerContainer}>
                <CircleLoader />
              </div>
            )}
            <aside className={styles.aside}>
              {!!article?.related_articles.length && (
                <RelatedArticles
                  title="More about…"
                  articles={article.related_articles}
                  highlightActiveArticle={true}
                />
              )}
            </aside>
          </HelpArticleGrid>
        </div>
      </div>
    </div>
  );
};

const AppBar = () => {
  return (
    <div className={styles.appBar}>
      About Ensembl
      <div className={styles.conversationIcon}>
        <ConversationIcon withLabel={true} />
      </div>
    </div>
  );
};

export default About;
