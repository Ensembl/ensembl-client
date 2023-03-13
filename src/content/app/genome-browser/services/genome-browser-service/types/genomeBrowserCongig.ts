export type GenomeBrowserConfig = {
  backend_url: string;
  target_element: HTMLElement;
  // an alternative to the above is a field called "target_element_id" with a CSS identifier of the DOM element in question; but we don't want to use that
};