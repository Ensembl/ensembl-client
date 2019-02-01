import React, { Component, RefObject } from 'react';
import { hot } from 'react-hot-loader';

import { DrawerSection } from '../../../configs/drawerSectionConfig';
import { ReactRefs } from '../../../types/objects';

type TrackOneProps = {
  currentDrawerSection: string;
  drawerSections: DrawerSection[];
};

class TrackOne extends Component<TrackOneProps> {
  public idRefs: ReactRefs = {
    main: React.createRef()
  };

  public sectionRef: RefObject<HTMLDivElement> = React.createRef();

  public componentDidMount() {
    if (this.props.currentDrawerSection !== '') {
      this.scrollToSection();
    }
  }

  public componentDidUpdate(prevProps: TrackOneProps) {
    if (this.props.currentDrawerSection !== prevProps.currentDrawerSection) {
      this.scrollToSection();
    }
  }

  public render() {
    return (
      <div className="track-section-wrapper track-one" ref={this.sectionRef}>
        <section ref={this.idRefs.main}>
          <h3>Main</h3>
          <h2>Content for Track 1</h2>
        </section>
        {this.props.drawerSections &&
          this.props.drawerSections.map((drawerSection: DrawerSection) => (
            <section
              key={drawerSection.name}
              ref={this.getIdRef(drawerSection.name)}
            >
              <h3>{drawerSection.label}</h3>
            </section>
          ))}
      </div>
    );
  }

  private getIdRef(key: string) {
    if (!this.idRefs.hasOwnProperty(key)) {
      this.idRefs[key] = React.createRef();
    }

    return this.idRefs[key];
  }

  private scrollToSection() {
    const { currentDrawerSection } = this.props;
    const currentSectionNode = this.idRefs[currentDrawerSection]
      .current as HTMLElement;

    if (currentSectionNode !== undefined) {
      currentSectionNode.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
}

export default hot(module)(TrackOne);
