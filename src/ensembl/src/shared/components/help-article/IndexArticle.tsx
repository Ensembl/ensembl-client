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
import { Link } from 'react-router-dom';

import {
  IndexArticle as IndexArticleType,
  IndexArticleItem as IndexArticleItemType
} from 'src/shared/types/help-and-docs/article';

import styles from './HelpArticle.scss';

type Props = {
  article: IndexArticleType;
};

const IndexArticle = (props: Props) => {
  const indexItems = props.article.items.map((item) => (
    <IndexItem {...item} key={item.url} />
  ));
  return <div className={styles.indexArticle}>{indexItems}</div>;
};

const IndexItem = (props: IndexArticleItemType) => {
  const { title, summary, url } = props;
  return (
    <div className={styles.indexItem}>
      <h2>{title}</h2>
      <p>{summary}</p>
      <div>
        <Link to={url}>See more</Link>
      </div>
    </div>
  );
};

export default IndexArticle;
