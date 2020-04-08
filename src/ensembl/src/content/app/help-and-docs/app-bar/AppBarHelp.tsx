import React from 'react';
import { connect } from 'react-redux';
import { togglePopup } from 'src/content/app/help-and-docs/state/helpAndDocsActions';

import chevronRightIcon from 'static/img/shared/chevron-right-grey.svg';

import styles from './AppBarHelp.scss';

type AppBarHelpProps = {
  togglePopup: () => void;
};

// this is a temporary component; will need update/refactoring once we have help resources
const AppBarHelp = (props: AppBarHelpProps) => {
  return (
    <div className={styles.helpLink}>
      <a onClick={props.togglePopup}>
        Help &amp; documentation <img src={chevronRightIcon} alt="" />
      </a>
    </div>
  );
};

const mapDispatchToProps = {
  togglePopup
};

export default connect(null, mapDispatchToProps)(AppBarHelp);
