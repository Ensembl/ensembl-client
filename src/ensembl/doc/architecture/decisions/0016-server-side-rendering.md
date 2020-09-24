# 16. Server-Side Rendering

## Status
Under review.

## Definitions
- **Server-Side Rendering** means generating HTML string representation of a web page on the server. The HTML string is sent over to the web browser, where it is parsed into a DOM tree and displayed on user's screen.
- **Client-Side Rendering** means building the DOM tree of a web page directly in the browser, by executing a script that the browser receives from the server.

## Context
As of the time of writing this document, the new Ensembl site is rendered entirely client-side, which means that no matter which page is requested, the browser always receives the same minimal html payload with a link to the bootstrap javascript file. That file, in its turn, will trigger the download of the rest of javascript files, which will then fetch the necessary data and render the page.

## Motivation
### Shortcomings of client-side rendering
#### Loss of control over HTTP status codes
With client-side rendering, the browser always gets the same html file that comes in a response with an HTTP status code `200: OK`. Thus, there is no way to signal, from the server, the intent to redirect the browser to a different page (300-range codes) or to message that the requested page does not exist (400-range errors).

_**Note:** Use of improper http status codes can negatively impact search engine ranking. Google’s recommended solution for avoiding what it calls "soft 404 errors" (404-error pages with status code 200) is either to use javascript to send the browser to an actual 404-error page, or to add a `<meta name="robots" content="noindex">` tag in order to prevent the bot from indexing such a page._

#### Negative impact on search engine discoverability and ranking
While Google is very open about the capabilities of the modern version of Googlebot (Google’s web crawler), which can execute client-side javascript, we do not know to what extent other web crawlers can do the same.

##### Experiment (conducted in September 2020)
HGNC's site `genenames.org` is an Angular-based site, with its metadata tags filled in dynamically in the browser. The html layout returned from the server has the following metatags (note that they are empty and contain Angular bindings to be activated when Angular gets loaded in):

```html
<title ng-bind="vm.headTitle"></title>
<meta name="Description" content="{[{vm.metaDescription}]}" />
```

A sample query `brca2 site:https://www.genenames.org/` in different search engines yields the following results:
- Google shows the relevant page (`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:1101`) in the list of search results, with correct values read from the title and description tags after they have been populated on the client side.
- DuckDuckGo (uses Bing search engine) cannot find the page.

This experiment confirms that Google is capable of indexing client-side-rendered web pages, but that other search engines struggle. With server-side-rendered pages, all search engines should be perfectly capable of indexing them.

#### Lack of contextual information for 3rd-party bots
When someone shares url to a web page on social media or in a messaging app such as Slack, this service will often send a web crawler to the shared url to get a preview of the page. These crawlers will scrape the most fundamental information about the page, such as its title, its description, and possibly an image. These crawlers do not execute javascript; so with client-side rendering, they will not be able re retrieve the title and the description of the shared page.

### Additional benefits of server-side rendering
The points below are expected to offer only a marginal benefit in the context of the new Ensembl website, and are mentioned only for the sake of exhaustiveness.

#### Higher page reliability
With client-side rendering, if anything happens to the javascript bundle, the page will not render. In contrast, with server-side rendering, the browser will display the contents of the page as it was rendered on the server.

_**However**, we recognize that in the case of the Ensembl site, there is little value in being able to view the page, but not interact with it._

#### Potentially perceptually faster page load
While the time to first byte with server-side rendering will inevitably be slower than with client-sidee rendering, it is, in principle, possible that the server-rendered page will arrive to the browser earlier than the time it takes a client-rendered page to fetch the script and the data required for building page content.

_**However**, we do recognize that in practice, these gains will be negligible, if at all attainable. We expect that Ensembl users are bioinformaticians or clinicians accessing Ensembl from office computers, which are sufficiently powerful and are on sufficiently fast networks that performance gains will not be meaningful._

## Implementation

Assuming that we agree that server-side rendering is a desirable functionality of the new Ensembl site, below is the discussion of how to achieve it.

The new Ensembl site is being developed using React, which can be run on the server and render a web page to an HTML string or to a Node stream. This points us to a solution that utilizes React itself rather than adding a dedicated rendering service such as Rendertron.

### Requirements for the server
1. The server must be able to execute React code and respond with either an HTML string or a stream that React renders to.
2. The server must be able to fetch data required by the page from relevant JSON APIs.
3. The server must be capable of discerning between pages that need or do not need to be rendered on the server side. Examples:
  - Help&Docs section is a good candidate for being rendered on the server (ideally, even pre-rendered to static HTML pages). These pages will have the least interactivity, but a lot of content that we want to be findable via search engines.
  - Most of the genome browser page does not need to be rendered on the server. Genome browser pages are highly interactive and have minimal textual content visible before user starts interacting with the page.
  - Entity viewer occupies an intermediate position between these two. It deals with genomic features that we would like to be findable via search engines; but at the same time, it is a highly interactive page with most of the text hidden from the view.
4. The server should be capable of rendering only a part of the page, such as the `<head>` tag with the relevant metadata tags in it. This will ensure that bots can easily retrieve page metadata.
5. It should be possible to hook into the server-side code so as to enable custom logging, error reporting, or adding custom response headers (e.g. session cookies) if required.

### Available options

#### Build our own rendering server
**Requirements:**
- The server will be written in Node to enable execution of the React code
- The server will be written in Typescript
- A dedicated webpack config file will be required for the server in order to properly handle both the typescript with React's jsx syntax, and non-standard imports (scss, static files, etc.)
- the setup must guarantee productive developer experience; a change in the server-side or client-side code should be picked up within single seconds

**Advantages:**
- Building our own rendering server offers us the complete control and the highest flexibility.
- It does not require us to introduce new complex dependencies.
- This is probably the most future-proof option, because we will the full control over the implementation.

**Disadvantages:**
- This option will require dedicated developer time.
- We do not yet know the full extent of the task and the full complexity of the problem, so it's hard to predict how successful we will be in solving it. 

#### Use existing 3rd-party solutions

##### Next.js

Next.js is a React-based framework that supports various rendering options, such as client-side rendering, server-side rendering at request time (server side rendering proper), and server-side rendering at build time (pre-rendering, or static site generation).

**Advantages**
- Allows combination of various rendering strategies within a single application
- Offers great developer experience, with updates to source code very quickly picked up
- Is a long-established project: was released in 2016
- Has a huge following
- Continues to be actively developed, and is an early adopter of new features introduced by the React team

**Disadvantages**
- It is an external dependency.
- Although Next.js is an open-source project, and its code is perfectly capable of being run standalone, Next.js development is first and foremost focussed on the use of Next in the context of the Vercel platform, the main source of their revenue. 
- While offering some escape hatches from its opinionated setup (see [the docs on using a custom server](https://nextjs.org/docs/advanced-features/custom-server)), it does not provide well-trodden idiomatic solutions to common server-side concerns, such as server-side logging (see discussion of [this issue](https://github.com/vercel/next.js/issues/1852) on github). Besides, the documentation is warning that using an escape hatch such as a custom server will remove important performance optimizations.

**Notes**
- Next.js uses its own router which is different from the router that the Ensembl site is using currently.

#### Other libraries and frameworks

- [Razzle](https://github.com/jaredpalmer/razzle) — a framework-agnostic starter kit for building server-rendered universal javascript applications (not just React-based).
- [After.js](https://github.com/jaredpalmer/after.js) — React-based framework built by the same developer who created Razzle. Uses ReactRouter rather than its own router like Next.js does.
- [Remix](https://remix.run/) — worth mentioning because it's being built by the creators of ReactRouter. However, it's neither yet finished, nor free; and thus is unsuitable for the Ensembl site.

Razzle and After.js are far less popular than Next.js, and thus their future is far less certain; but they can provide useful insights and inspiration for building our own rendering server. 

## Decisions
- Server-side rendering for the new Ensembl site is a desirable goal.
- It is not yet clear whether to build our own rendering server or to use the off-the-shelf solution that is Next.js
- Building prototypes will help us choose between these two options.
- A prototype should demonstrate that it is possible to achieve:
  - different rendering strategies for different routes:
    - rendering one page on the server and a different page on the client
    - rendering page `head` tag with page metadata on the server and page body on the client
  - fetching remote data required for rendering, using either redux actions of apollo graphql client
  - code splitting of javascript bundle into smaller chunks to be used at different routes
  - adding custom headers to the response (e.g. session cookies), and running a server-side logging service
  - good developer experience (fast code reloading)

## References
### General
- [Rendering on the Web](https://developers.google.com/web/updates/2019/02/rendering-on-the-web) on web.dev.
### SEO
- [Understand the JavaScript SEO Basics](https://developers.google.com/search/docs/guides/javascript-seo-basics)
### Next.js
- [Documentation site](https://nextjs.org/docs/getting-started)
- [4 years of Next.js: Lessons Learned](https://youtu.be/FtQ21RAzjA4), a talk by Guillermo Rauch, the creator of Next.js
