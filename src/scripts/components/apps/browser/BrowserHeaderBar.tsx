import React, { Component } from 'react';

type BrowserHeaderBarProps = {};

class BrowserHeaderBar extends Component<BrowserHeaderBarProps> {
  public render() {
    return (
      <div className="browser-header-bar">
        <dl className="browser-header-bar-left">
          <dt>
            <button>Human</button>
          </dt>
          <dt>
            <button>Mouse</button>
          </dt>
          <dt>
            <button>+</button>
          </dt>
        </dl>
        <dl className="browser-header-bar-right">
          <dt>
            <button>Key Data</button>
          </dt>
          <dt>
            <button>Variation</button>
          </dt>
          <dt>
            <button>Expression</button>
          </dt>
        </dl>
      </div>
    );
  }
}

export default BrowserHeaderBar;
