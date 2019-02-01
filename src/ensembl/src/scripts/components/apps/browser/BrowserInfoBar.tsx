import React, { PureComponent } from 'react';
import ContentEditable from 'react-contenteditable';

import { browserInfoConfig } from '../../../configs/browserConfig';

import chevronUpIcon from 'assets/img/track-panel/chevron-up.svg';
import chevronDownIcon from 'assets/img/track-panel/chevron-down.svg';

type BrowserInfoBarProps = {
  browserNavOpened: boolean;
  expanded: boolean;
  toggleBrowserNav: () => void;
};

class BrowserInfoBar extends PureComponent<BrowserInfoBarProps> {
  public render() {
    const { navigator, reset } = browserInfoConfig;

    return (
      <div className="browser-info-bar">
        <dl className="browser-info-bar-left">
          <dt className="reset">
            <button>
              <img src={reset.icon.default} alt={reset.description} />
            </button>
          </dt>
          <dt className="slider">
            <button>
              <strong>BRAC2</strong>
              {this.props.expanded ? (
                <img src={chevronUpIcon} alt="collapse" />
              ) : (
                <img src={chevronDownIcon} alt="expand" />
              )}
            </button>
          </dt>
          <dt>Gene: ENSG00000139618</dt>
          <dt>
            <strong>84,793</strong> bp
          </dt>
          <dt>protein coding</dt>
          <dt>forward strand</dt>
        </dl>
        <dl className="browser-info-bar-right">
          <dt>
            Chromosome:{' '}
            <ContentEditable html={'13'} className="content-editable-box" />{' '}
            <ContentEditable html={'32,315,474 - 32,400,266'} />
          </dt>
          <dt className="navigator">
            <button
              title={navigator.description}
              onClick={this.props.toggleBrowserNav}
            >
              <img
                src={
                  this.props.browserNavOpened
                    ? navigator.icon.selected
                    : navigator.icon.default
                }
                alt={navigator.description}
              />
            </button>
          </dt>
        </dl>
      </div>
    );
  }
}

export default BrowserInfoBar;
