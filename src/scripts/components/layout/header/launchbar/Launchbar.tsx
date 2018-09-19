import React, { PureComponent, ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import SlideDown from 'react-slidedown';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  LaunchbarCategory,
  launchbarConfig,
  LaunchbarApp
} from '../../../../configs/launchbarConfig';

import LaunchbarIcon from './LaunchbarIcon';
import { RootState } from '../../../../reducers';
import { changeCurrentApp } from '../../../../actions/headerActions';

type LaunchbarParams = {};

type LaunchbarProps = RouteComponentProps<LaunchbarParams> & {
  changeCurrentApp: (currentApp: string) => void;
  currentApp: string;
  launchbarExpanded: boolean;
};

class Launchbar extends PureComponent<LaunchbarProps> {
  constructor(props: LaunchbarProps) {
    super(props);

    this.changeCurrentApp = this.changeCurrentApp.bind(this);
  }

  public changeCurrentApp(currentApp: string) {
    this.props.history.push(`/app/${currentApp}`);
    this.props.changeCurrentApp(currentApp);
  }

  public getSeparatorClass(separator: boolean): string {
    return separator ? 'border' : '';
  }

  public render() {
    const LaunchbarChildren: ReactNode = (
      <div className="launchbar">
        <div className="categories-wrapper">
          <div className="categories">
            {launchbarConfig.categories.map((category: LaunchbarCategory) => (
              <dl className={this.getSeparatorClass(category.separator)} key={category.name}>
                {category.apps.map((app: LaunchbarApp) => (
                  <LaunchbarIcon
                    app={app}
                    changeCurrentApp={this.changeCurrentApp}
                    currentApp={this.props.currentApp}
                    key={app.name}
                  />
                ))}
              </dl>
            ))}
          </div>
        </div>
        <div className="about">
          <dl>
            <LaunchbarIcon
              app={launchbarConfig.about}
              changeCurrentApp={this.props.changeCurrentApp}
              currentApp={this.props.currentApp}
            />
          </dl>
        </div>
      </div>
    );

    return (
      <SlideDown transitionOnAppear={false}>
        {this.props.launchbarExpanded ? LaunchbarChildren : null}
      </SlideDown>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { currentApp, launchbarExpanded } = state.header;
  return { currentApp, launchbarExpanded };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeCurrentApp: (currentApp: string) =>
    dispatch(changeCurrentApp(currentApp))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Launchbar)
);
