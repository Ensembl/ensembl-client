import Prismic from 'prismic-javascript';
import ApiSearchResponse from 'prismic-javascript/d.ts/ApiSearchResponse';

import config from 'config';
import { HelpContent } from 'src/content/app/help-and-docs/types/help-content';

export enum HelpType {
  CONTENT = 'content',
  ARTICLE = 'article',
  VIDEO = 'video',
  FAQ = 'faq',
  DEFINITION = 'definition'
}

const { prismicApiEndpoint } = config;

const Client = Prismic.client(prismicApiEndpoint);

class HelpService {
  public async getContentsByComponentId(componentId: string) {
    if (!componentId) {
      return null;
    }
    const response = await Client.query(
      Prismic.Predicates.at(`my.article.component`, componentId),
      {}
    );

    if (response) {
      const data = response.results[0].data;

      const helpContent: HelpContent = {
        componentId,
        article: buildArticleFromResponse(response)
      };

      if (data.related_video) {
        helpContent.video = await this.getVideo(data.related_video.uid);
      }

      return helpContent;
    }
    return null;
  }

  public async getVideo(videoUid: string) {
    const response = await Client.query(
      Prismic.Predicates.at('my.video.uid', videoUid),
      {}
    );

    if (response) {
      // TODO: youtube_url is an object!!
      return buildVideoFromResponse(response);
    }
  }
}

const buildArticleFromResponse = (response: ApiSearchResponse) => {
  const data = response.results[0].data;

  return {
    title: data.title[0].text,
    body: data.body[0].text,
    parentArticle: data.parent?.uid
  };
};

const buildVideoFromResponse = (response: ApiSearchResponse) => {
  const data = response.results[0].data;
  return {
    title: data.title[0].text,
    embed_url: data.youtube_url.embed_url,
    description: data.youtube_url.title,
    embed_html: data.youtube_url.html
  };
};

const helpService = new HelpService();

export default helpService;
