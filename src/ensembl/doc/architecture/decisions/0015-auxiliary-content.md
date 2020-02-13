# 15. Auxiliary content infrastructure

## Status

Ready to review

## Context

In order to support users of the new site, we need infrastructure that will supply help and documentation content (referred to hereafter as "auxiliary content") in a format that is easy to integrate into the React framework. This content will include the following:

* Context-sensitive help articles
* Images
* Tutorial videos
* Glossary terms fetched from the OLS REST service

## Decision

Current best practice in content management is to use a headless CMS - a backend storage which can be queried by frontend components, with a ready-made editing interface that can be used for content creation. There are many contenders in this arena, including some well-established free, open-source projects.

Markdown has been suggested as an appropriate format for stored documents, but its limited feature set makes it unsuitable for the variety of content we will need. In particular, it does not support tables, or embedded videos, both of which are essential to our documentation. There are extended flavours of Markdown available, such as Markdown Extra and GFM (GitHub Flavoured Markdown), but they are still limited in functionality.

At the other end of the scale is Strapi (www.strapi.io), a fully-featured headless CMS that allows you to define your own content templates, permissions, etc. Data can be fetched using either REST or GraphQL. Strapi is open source, and free if self-hosted; it is written in JavaScript and runs on NodeJS.

## Consequences

A fully-featured headless CMS will require more initial setup to create the templates, but should be much easier for non-web staff such as Outreach to maintain, as they will not have to start each time with a blank page.

Frontend developers would also need to create components that fetch the content via the appropriate API and drop it into an HTML template. This allows us to style the content to match the look'n'feel of the rest of the 2020 site, and even reuse and "remix" sections of content instead of having monolithic pages.
