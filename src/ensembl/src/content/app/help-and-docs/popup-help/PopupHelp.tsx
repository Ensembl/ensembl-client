import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Overlay from 'src/shared/components/overlay/Overlay';
import Panel from 'src/shared/components/panel/Panel';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';
import { ReactComponent as HelpQuestionIcon } from 'static/img/shared/help-question.svg';
import { ReactComponent as VideoIcon } from 'static/img/shared/video.svg';

import {
  isPopupShown,
  getActiveComponentId,
  getActiveComponentHelpContent
} from 'src/content/app/help-and-docs/state/helpAndDocsSelectors';
import {
  togglePopup,
  fetchHelpContent
} from 'src/content/app/help-and-docs/state/helpAndDocsActions';

import { RootState } from 'src/store';
import { HelpContent } from 'src/content/app/help-and-docs/types/help-content';
import { Video } from 'src/content/app/help-and-docs/types/video';
import { Article } from 'src/content/app/help-and-docs/types/article';

import styles from './PopupHelp.scss';

type Props = {
  shouldShowPopup: boolean;
  componentId: string | null;
  helpContent: HelpContent | null;
  togglePopup: () => void;
  fetchHelpContent: (componentId: string | null) => void;
};

const PopupHelp = (props: Props) => {
  useEffect(() => {
    if (!props.helpContent?.article) {
      props.fetchHelpContent(props.componentId);
    }
  }, [props.helpContent, props.componentId]);

  if (!props.shouldShowPopup || !props.helpContent) {
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
            {props.helpContent.article &&
              renerArticle(props.helpContent.article)}
            {props.helpContent.video && renderVideo(props.helpContent.video)}
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
          <ReactMarkdown source={article.body} />
        </div>
        <div className={styles.relatedTitle}>Related...</div>
        <div className={styles.relatedContent}>
          {article.parentArticle && <div>{article.parentArticle.title}</div>}
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
            __html: `<iframe width="560" height="315" src="${video.embedUrl}" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>`
          }}
        ></div>
        <div className={styles.relatedTitle}>Related...</div>
        <div className={styles.relatedContent}>
          {video.nextVideo && <div>{video.nextVideo.title}</div>}
          {video.previousVideo && <div>{video.previousVideo.title}</div>}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  shouldShowPopup: isPopupShown(state),
  componentId: getActiveComponentId(state),
  helpContent: getActiveComponentHelpContent(state)
});

const mapDispatchToProps = {
  fetchHelpContent,
  togglePopup
};
export default connect(mapStateToProps, mapDispatchToProps)(PopupHelp);
