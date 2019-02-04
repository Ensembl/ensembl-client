import React, { PureComponent } from 'react';

type BrowserImageProps = {};

class BrowserImage extends PureComponent<BrowserImageProps> {
  private browserCanvas: React.RefObject<HTMLDivElement>;

  constructor(props: BrowserImageProps) {
    super(props);

    this.browserCanvas = React.createRef();
  }

  activate_if_possible(currentEl: HTMLElement | null) {
    const activateEvent = new CustomEvent('bpane-activate', {
      bubbles: true,
      detail: {
        key: 'main'
      }
    });

    let done = false;
    if (currentEl && currentEl.ownerDocument) {
      const browserEl = currentEl.ownerDocument.querySelector(
        '.browser-stage'
      ) as HTMLBodyElement;

      const bodyEl = currentEl.ownerDocument.querySelector('body');
      if (bodyEl && bodyEl.classList.contains('browser-app-ready')) {
        browserEl.dispatchEvent(activateEvent);
        done = true;
      }
    }
    if (!done) {
      setTimeout(() => this.activate_if_possible(currentEl), 50);
    }
  }

  public componentDidMount() {
    const currentEl = this.browserCanvas.current;
    this.activate_if_possible(currentEl);
  }

  public render() {
    return <div className="browser-stage" ref={this.browserCanvas} />;
  }
}

export default BrowserImage;
