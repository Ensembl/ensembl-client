declare module '*.png' {
  const png: string;
  export = png;
}

declare module '*.jpg' {
  const jpg: string;
  export = jpg;
}

declare module '*.svg' {
  const svg: string;
  export = svg;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}
