import React from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import ReactMarkdown from 'react-markdown';
import config from 'config';

import Overlay from 'src/shared/components/overlay/Overlay';
import Panel from 'src/shared/components/panel/Panel';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';
import { ReactComponent as HelpQuestionIcon } from 'static/img/shared/help-question.svg';
import { ReactComponent as VideoIcon } from 'static/img/shared/video.svg';

import {
  isPopupShown,
  getActiveComponentId
} from 'src/content/app/help-and-docs/state/helpAndDocsSelectors';
import { togglePopup } from 'src/content/app/help-and-docs/state/helpAndDocsActions';

import { RootState } from 'src/store';
import { Video } from 'src/content/app/help-and-docs/types/video';
import { Article } from 'src/content/app/help-and-docs/types/article';

import styles from './PopupHelp.scss';

type Props = {
  shouldShowPopup: boolean;
  componentId: string | null;
  togglePopup: () => void;
};

const QUERY = gql`
  query Articles($uid: String) {
    articles(where: { uid: $uid }) {
      title
      body
      parent {
        title
        body
        uid
      }
      related_video {
        uid
        youtube_url
        title
        next_video {
          uid
          youtube_url
          title
        }
        previous_video {
          uid
          youtube_url
          title
        }
      }
    }
  }
`;

const PopupHelp = (props: Props) => {
  const { data } = useQuery<{ articles: Article[] }>(QUERY, {
    variables: { uid: props.componentId }
  });

  if (!data) {
    return null;
  }

  return <PopupHelpWithData article={data.articles[0]} {...props} />;
};

type PopupHelpWithDataProps = {
  shouldShowPopup: boolean;
  componentId: string | null;
  article: Article;
  togglePopup: () => void;
};

const PopupHelpWithData = (props: PopupHelpWithDataProps) => {
  const { article } = props;

  if (!props.shouldShowPopup || !article) {
    return null;
  }

  return (
    <>
      <Overlay className={styles.overlay} />
      <Panel
        classNames={{ panel: styles.helpPanel }}
        onClose={props.togglePopup}
      >
        <div className={styles.helpPanelContent}>
          <div className={styles.content}>
            {article && renerArticle(article)}
            {article.related_video && renderVideo(article.related_video)}
          </div>
          <div className={styles.moreHelp}>
            <span>more Help</span>
            <span>
              <ImageButton
                status={Status.DISABLED}
                image={HelpQuestionIcon}
                className={styles.imageContainer}
              />
            </span>
          </div>
        </div>
      </Panel>
    </>
  );
};

const renerArticle = (article: Article) => {
  return (
    <div className={styles.articleContainer}>
      <div className={styles.icon}>
        <ImageButton
          status={Status.DISABLED}
          image={HelpQuestionIcon}
          className={styles.imageContainer}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.iconHint}>All about...</div>
        <div className={styles.title}>{article.title}</div>
        <div className={styles.description}>
          <ReactMarkdown source={formatImageURL(article.body)} />
        </div>
        <div className={styles.relatedTitle}>Related...</div>
        <div className={styles.relatedContent}>
          {article.parent && <div>{article.parent.title}</div>}
        </div>
      </div>
    </div>
  );
};

const renderVideo = (video: Video) => {
  return (
    <div className={styles.videoContainer}>
      <div className={styles.icon}>
        <ImageButton
          status={Status.DISABLED}
          image={VideoIcon}
          className={styles.imageContainer}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.iconHint}>How to...</div>
        <div className={styles.title}>{video.title}</div>
        <div
          className={styles.video}
          dangerouslySetInnerHTML={{
            __html: `<iframe width="560" height="315" src="${video.youtube_url}" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>`
          }}
        ></div>
        <div className={styles.relatedTitle}>Related...</div>
        <div className={styles.relatedContent}>
          {video.next_video && <div>{video.next_video.title}</div>}
          {video.previous_video && <div>{video.previous_video.title}</div>}
        </div>
      </div>
    </div>
  );
};

const formatImageURL = (content: string): string => {
  // FIXME: Not sure if there is any other way to load the images
  return content.replace('(/uploads/', `(${config.helpApiEndpoint}/uploads/`);
};

const mapStateToProps = (state: RootState) => ({
  shouldShowPopup: isPopupShown(state),
  componentId: getActiveComponentId(state)
});

const mapDispatchToProps = {
  togglePopup
};
export default connect(mapStateToProps, mapDispatchToProps)(PopupHelp);
