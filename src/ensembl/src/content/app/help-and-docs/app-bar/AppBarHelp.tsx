import React from 'react';
import { connect } from 'react-redux';

import { togglePopup } from 'src/content/app/help-and-docs/state/helpAndDocsActions';
import { getActiveComponentId } from 'src/content/app/help-and-docs/state/helpAndDocsSelectors';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';
import { ReactComponent as HelpQuestionIcon } from 'static/img/shared/help-question.svg';
import { ReactComponent as VideoIcon } from 'static/img/shared/video.svg';

import { RootState } from 'src/store';

import styles from './AppBarHelp.scss';

type AppBarHelpProps = {
  togglePopup: () => void;
  componentId: string | null;
};

const AppBarHelp = (props: AppBarHelpProps) => {
  const onClick = () => {
    if (props.componentId) {
      props.togglePopup();
    }
  };
  return (
    <div className={styles.helpLink} onClick={onClick}>
      <span className={styles.helpText}>Help</span>
      <span className={styles.questionIcon}>
        <ImageButton
          status={Status.DISABLED}
          image={HelpQuestionIcon}
          className={styles.imageContainer}
        />
      </span>
      <span className={styles.videoIcon}>
        <ImageButton
          status={Status.DISABLED}
          image={VideoIcon}
          className={styles.imageContainer}
        />
      </span>
    </div>
  );
};

// TODO: It might be better to set the active component using a middleware
const mapStateToProps = (state: RootState) => ({
  componentId: getActiveComponentId(state)
});

const mapDispatchToProps = {
  togglePopup
};

export default connect(mapStateToProps, mapDispatchToProps)(AppBarHelp);
