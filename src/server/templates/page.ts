/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs';
import path from 'path';

import { getPaths } from 'webpackDir/paths';

import { CONFIG_FIELD_ON_WINDOW } from 'src/shared/constants/globals';

import type { ServerSideState } from 'src/server/serverSideReduxStore';
import type { TransferredClientConfig } from 'src/server/helpers/getConfigForClient';

/**
 * From the talk 'Get your head straight', by Henry Roberts, 2021
 * - If something doesn't have to be in the head, get it out of there
 * - The optimal order of elements in the head is as follows:
 *   1) meta about the page (e.g. charset, viewport)
 *   2) title
 *   3) <link rel="preconnect">
 *   4) <script src="" async></script>
 *   5) CSS that includes @import (althought he doesn't like import in general)
 *   6) Synchronous JS
 *   7) Synchronous CSS
 *   8) <link rel="preload">
 *   9) <script src="" defer></script>
 *  10) <link rel="prefetch"> or <link rel="prerender">
 *  11) Everything else (SEO, meta tags, icons, open graph, etc.)
 */

const templatePlaceholders = {
  title: '<!-- Inject title -->',
  styles: '<!-- Inject CSS -->',
  scripts: '<!-- Inject body scripts -->',
  otherMeta: '<!-- Inject other meta -->'
};

const renderTemplate = (params: {
  assets: Record<string, string>;
  state: ServerSideState;
  config: TransferredClientConfig;
}) => {
  const { assets, state, config } = params;
  let template = getHtmlTemplate();

  template = injectTitle({
    title: state.pageMeta.title,
    template
  });
  template = injectOtherMeta({
    assets,
    state,
    template
  });
  template = injectCSS({
    assets,
    template
  });
  template = injectBodyScripts({
    state,
    config,
    assets,
    template
  });

  return template;
};

let template = '';

const getHtmlTemplate = () => {
  if (!template) {
    template = fs.readFileSync(
      path.resolve(getPaths().buildServerDir, 'templates/page.html'),
      { encoding: 'utf-8' }
    );
  }
  return template;
};

const injectTitle = (params: { title: string; template: string }) => {
  const { title, template } = params;
  const titleTag = `<title>${title}</title>`;
  return template.replace(templatePlaceholders.title, titleTag);
};

const injectOtherMeta = (params: {
  assets: Record<string, string>;
  state: ServerSideState;
  template: string;
}) => {
  const { assets, state, template } = params;
  const description = state.pageMeta.description;

  let tags = '';

  if (description) {
    tags += `<meta name="description" content="${description}" />`;
  }

  const favicons = `
    <link rel="icon" type="image/png" sizes="32x32" href="${assets['favicons/favicon-32x32.png']}" />
    <link rel="icon" type="image/png" sizes="16x16" href="${assets['favicons/favicon-16x16.png']}" />
  `;

  tags += favicons;

  return template.replace(templatePlaceholders.otherMeta, tags);
};

const injectCSS = (params: {
  assets: Record<string, string>;
  template: string;
}) => {
  const { assets, template } = params;
  const styleFileUrl = assets['client.css'];

  if (!styleFileUrl) {
    return template;
  }

  const linkTag = `<link rel="stylesheet" href="${styleFileUrl}" />`;
  return template.replace(templatePlaceholders.styles, linkTag);
};

const injectBodyScripts = (params: {
  state: ServerSideState;
  config: TransferredClientConfig;
  assets: Record<string, string>;
  template: string;
}) => {
  const { state, config, assets, template } = params;
  const scriptUrls = getBootstrapScripts(assets);

  const dataScript = `<script>
    window.__PRELOADED_STATE__ = ${JSON.stringify(state)};
    window.${CONFIG_FIELD_ON_WINDOW} = ${JSON.stringify(config)};
  </script>`;

  const appScripts = scriptUrls
    .map((script) => {
      return `<script src="${script}" async></script>`;
    })
    .join('');

  const scripts = `${dataScript}${appScripts}`;

  return template.replace(templatePlaceholders.scripts, scripts);
};

const getBootstrapScripts = (assetsManifest: Record<string, string>) => {
  // In the development environment, the only entry point is the client.js file (it's huge and contains the runtime, third-party libs, and css)
  // In production, webpack will code-split, and extract vendors.js and runtime-client.js chunks
  return [
    assetsManifest['client.js'],
    assetsManifest['vendors.js'],
    assetsManifest['runtime~client.js']
  ].filter(Boolean);
};

export default renderTemplate;
