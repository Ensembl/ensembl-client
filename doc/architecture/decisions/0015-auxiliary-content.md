# 15. Auxiliary content infrastructure

## Status

Under review.

## Context

In order to support users of the new site, we need infrastructure that will supply help and documentation (referred to hereafter as "auxiliary content") in a format that is easy to integrate into the React framework. This content will include the following:

* Context-sensitive help articles
* Longer articles, e.g. technical documentation
* Tutorial videos
* FAQs

**Exception**: glossary terms will be fetched direct from the OLS or made available via a backend micro-service similar to other biological data.

### Required features

* User-friendly editing interface
* Flexible, customisable content templates (not just monolithic pages)
* Media support, e.g. image uploads
* Efficient fetching of content for embedding in the client
* Data stored in a format that allows it to be easily consumed by our React components

## Decision

Current best practice in content management is to use a headless CMS: a backend content store with a ready-made editing interface that can be used for content creation.

We trialled two such ready-made systems (Prismic, a commercial PaaS, and Strapi, an open-source headless CMS) as well as an in-house prototype using plain Markdown files in a GitHub repository. All three candidates were tried out by members of Outreach, who expressed a preference (slight in some cases, stronger in others) for the home-grown product, based mainly on the ease of navigating a document hierarchy vs the flat structure presented by the web-based GUIs.

We have therefore decided to go with the home-grown option, on the understanding that we will be required to develop additional features that are normally baked into database-driven CMSes. These include:

* Validation scripts to ensure that page IDs are unique and metadata is consistent

* Search engine integration

We also discussed the desirability of using static site generation in order to incorporate dynamic content (such as the glossary) into static pages. This would also allow us to distribute the content more easily to end-users who wish to set up their own mirror.

## Consequences

### Pros

* Building the system in-house will allow us to develop just the features we need

* It also gives us complete ownership of the content

* Most of our staff are familiar with GitHub, and Markdown is easy to learn

### Cons

* A good deal more work is required by the webteam to develop such a system than if we had selected a prebuilt product
