import React, { PureComponent } from 'react';

type BrowserImageProps = {};

class BrowserImage extends PureComponent<BrowserImageProps> {
  private browserCanvas: React.RefObject<HTMLDivElement>;

  constructor(props: BrowserImageProps) {
    super(props);

    this.browserCanvas = React.createRef();
  }

  public componentDidMount() {
    const moveEvent = new CustomEvent('bpane-start', {
      bubbles: true,
      detail: {}
    });

    const currentEl = this.browserCanvas.current;

    if (currentEl && currentEl.ownerDocument) {
      const browserEl = currentEl.ownerDocument.querySelector(
        'body'
      ) as HTMLBodyElement;

      if (browserEl) {
        browserEl.dispatchEvent(moveEvent);
      }
    }
  }

  public render() {
    return (
      <div className="browser-image" ref={this.browserCanvas}>
        <div id="stage" />
      </div>
    );
  }
}

export default BrowserImage;
