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

import { useState, useEffect } from 'react';

import useApiService from 'src/shared/hooks/useApiService';

import {
  HelpArticle,
  HelpVideo,
  RelatedArticle,
  SlugReference,
  PathReference
} from './types';

const getQuery = (params: { reference: SlugReference | PathReference }) => {
  if ('slug' in params.reference) {
    return `slug=${params.reference.slug}`;
  } else {
    return `path=${encodeURIComponent(params.reference.path)}`;
  }
};

type Reference = SlugReference | PathReference;

export type ArticleReference = {
  type: 'article';
  reference: Reference;
};

export type VideoReference = {
  type: 'video';
  youtube_id: string;
};

export type RelatedItems = {
  articles: RelatedArticle[];
  videos: HelpVideo[];
};

export type CurrentArticle = HelpArticle & { type: 'article' };
export type CurrentVideo = HelpVideo & { type: 'video' };
export type CurrentItem = CurrentArticle | CurrentVideo;

export const emptyRelatedItems: RelatedItems = {
  articles: [],
  videos: []
};

const useHelpArticle = (reference: ArticleReference | VideoReference) => {
  const [currentHelpItem, setCurrentHelpItem] = useState<CurrentItem | null>(
    null
  );
  const [relatedHelpItems, setRelatedHelpItems] = useState<RelatedItems | null>(
    null
  );

  const query = reference.type === 'article' ? getQuery(reference) : null;
  const url = query ? `/help-api/article?${query}` : '';

  const { data: article, loadingState } = useApiService<HelpArticle>({
    endpoint: url,
    skip: !url
  });

  useEffect(() => {
    if (
      article &&
      reference.type === 'article' &&
      (('slug' in reference.reference &&
        reference.reference.slug === article.slug) ||
        ('path' in reference.reference &&
          reference.reference.path === article.path))
    ) {
      setCurrentHelpItem({
        ...article,
        type: 'article'
      });
    } else if (relatedHelpItems && reference.type === 'video') {
      const video = relatedHelpItems.videos.find(
        (video) => video.youtube_id === reference.youtube_id
      ) as HelpVideo;
      setCurrentHelpItem({ ...video, type: 'video' });
    }
  }, [article?.path, reference.type]);

  useEffect(() => {
    if (!article || relatedHelpItems) {
      return;
    }
    // keep track only for the article that was fetched initially
    setRelatedHelpItems(prepareRelatedItems(article));
  });

  return {
    loadingState,
    relatedHelpItems,
    currentHelpItem
  };
};

const prepareRelatedItems = (article: HelpArticle): RelatedItems => {
  const currentArticle = {
    title: article.title,
    slug: article.slug,
    path: article.path
  };
  const relatedArticles = [currentArticle, ...article.related_articles];
  return {
    articles: relatedArticles,
    videos: article.videos
  };
};

export default useHelpArticle;
