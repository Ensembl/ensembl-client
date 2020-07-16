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

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import config from 'config';

import useApiService from 'src/shared/hooks/useApiService';
import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import Modal from 'src/shared/components/modal/Modal';
import HelpPopupBody, { HelpArticle } from './HelpPopupBody';
import { HelpAndDocumentation } from 'src/shared/components/app-bar/AppBar';

import { ReactComponent as HelpIcon } from 'static/img/launchbar/help.svg';
import { ReactComponent as VideoIcon } from 'static/img/shared/video.svg';

import styles from './HelpPopupButton.scss';

type SlugReference = {
  slug: string; // slug of the help article, e.g. "selecting-a-species"
};

type PathReference = {
  path: string; // path to the article in the help&docs repo starting from the docs root folder, e.g. "ensembl-help/getting-started/about-the-site"
};

type ArticleReference = SlugReference | PathReference;

type Props = ArticleReference;

const getQuery = (params: SlugReference | PathReference) => {
  if ('slug' in params) {
    return `slug=${params.slug}`;
  } else {
    return `path=${encodeURIComponent(params.path)}`;
  }
};

const HelpPopupButton = (props: Props) => {
  const [slug, setSlug] = useState<string | null>(null);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { helpApiHost } = config; // FIXME move to env and config

  const query = slug ? getQuery({ slug }) : getQuery(props);

  const url = `${helpApiHost}/api/article?${query}`;

  // TODO: decide whether we want to show spinner while article content is loaded
  // (it's gonna be fast, but we still might)
  const { data: article } = useApiService<HelpArticle>({
    endpoint: url,
    skip: !shouldShowModal
  });

  useEffect(() => {
    if (!shouldShowModal) {
      setSlug(null);
    }
  }, [shouldShowModal]);

  const handleArticleChange = (slug: string) => {
    setSlug(slug);
  };

  const openModal = () => {
    setShouldShowModal(true);
  };

  const closeModal = () => {
    setShouldShowModal(false);
  };

  const videoButtonClasses = classNames(styles.button, styles.button_video);

  if (isEnvironment([Environment.PRODUCTION])) {
    return <HelpAndDocumentation />;
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={styles.label}>Help</span>
        <div className={styles.button} onClick={openModal}>
          <HelpIcon className={styles.icon} />
        </div>
        <div className={videoButtonClasses} onClick={openModal}>
          <VideoIcon className={styles.icon} />
        </div>
      </div>
      {shouldShowModal && article && (
        <Modal onClose={closeModal}>
          <HelpPopupBody
            article={article}
            onArticleChange={handleArticleChange}
          />
        </Modal>
      )}
    </>
  );
};

export default HelpPopupButton;
