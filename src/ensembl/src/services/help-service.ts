import Prismic from 'prismic-javascript';
import config from 'config';
import { HelpContent } from 'src/content/app/help-and-docs/types/help-content';

import { Video } from 'src/content/app/help-and-docs/types/video';

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
  public async searchContent() {
    const response = await Client.query(
      Prismic.Predicates.at('document.type', 'article'),
      {}
    );

    if (response) {
      return response.results as HelpContent;
    }

    return null;
  }

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
        article: {
          title: data.title[0].text,
          body: data.body[0].text,
          parentArticle: data.parent?.uid
        }
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
      const data = response.results[0].data;

      // TODO: youtube_url is an object??????!!
      return {
        title: data.title[0].text,
        uri: data.youtube_url.html,
        description: data.youtube_url.title
      } as Video;
    }
  }
}

const helpService = new HelpService();

export default helpService;
