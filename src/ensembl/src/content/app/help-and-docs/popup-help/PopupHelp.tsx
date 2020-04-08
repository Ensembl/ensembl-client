import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Overlay from 'src/shared/components/overlay/Overlay';
import Panel from 'src/shared/components/panel/Panel';

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
    if (!props.helpContent) {
      props.fetchHelpContent(props.componentId);
    }
  }, [props.helpContent]);

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
        <div>{props.helpContent.toString()}</div>
      </Panel>
    </>
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
