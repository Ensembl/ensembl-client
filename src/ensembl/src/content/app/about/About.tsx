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

import React, { ReactNode } from 'react';
import { useLocation } from 'react-router';

import useApiService from 'src/shared/hooks/useApiService';

import {
  TextArticle,
  HelpArticleGrid
} from 'src/shared/components/help-article';
import {
  TopMenu,
  SideMenu
} from 'src/content/app/about/components/about-menu/AboutMenu';

import { Menu as MenuType } from 'src/shared/types/help-and-docs/menu';
import { TextArticleData } from 'src/shared/types/help-and-docs/article';

import styles from './About.scss';

const About = () => {
  const location = useLocation();
  const { data: menu } = useApiService<MenuType>({
    endpoint: `/api/docs/menus?name=about`
  });
  const { data: article } = useApiService<TextArticleData>({
    endpoint: `/api/docs/article?url=${encodeURIComponent(location.pathname)}`
  });

  return (
    <>
      <div>
        <AppBar />
        <TopMenuBar>
          {menu && <TopMenu menu={menu} currentUrl={location.pathname} />}
        </TopMenuBar>
      </div>
      <HelpArticleGrid className={styles.grid}>
        {article && <TextArticle article={article} />}
        <aside className={styles.aside}>
          {menu && (
            <>
              <div className={styles.asideTitle}>More about...</div>
              <SideMenu menu={menu} currentUrl={location.pathname} />
            </>
          )}
        </aside>
      </HelpArticleGrid>
    </>
  );
};

const AppBar = () => {
  return <div className={styles.appBar}>About Ensembl</div>;
};

const TopMenuBar = (props: { children: ReactNode }) => {
  return <div className={styles.topMenuBar}>{props.children}</div>;
};

export default About;
