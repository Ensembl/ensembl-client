import React from 'react';
import { Link } from 'react-router-dom';

import {
  IndexArticle as IndexArticleType,
  IndexArticleItem as IndexArticleItemType
} from 'src/shared/types/help-and-docs/article';

type Props = {
  article: IndexArticleType;
};

const IndexArticle = (props: Props) => {

};

const IndexItem = (props: IndexArticleItemType) => {
  const { title, summary, url } = props
  return (
    <div>
      <h2>
        {title}
      </h2>
      <p>
        {summary}
      </p>
      <div>
        <Link to={url}/>
      </div>
    </div>
  );
};
