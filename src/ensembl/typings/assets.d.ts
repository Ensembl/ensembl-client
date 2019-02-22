declare module '*.png' {
  const png: string;
  export = png;
}

declare module '*.jpg' {
  const jpg: string;
  export = jpg;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}
