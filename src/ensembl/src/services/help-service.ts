import Strapi from 'strapi-sdk-javascript/build/main';
import config from 'config';
import { HelpContent } from 'src/content/app/help-and-docs/types/help-content';
import JSONValue from 'src/shared/types/JSON';
import { Article } from 'src/content/app/help-and-docs/types/article';
import { Video } from 'src/content/app/help-and-docs/types/video';

const { helpApiEndpoint } = config;

const strapi = new Strapi(helpApiEndpoint);

class HelpService {
  public async getContentsByComponentId(componentId: string) {
    if (!componentId) {
      return null;
    }

    const response = await strapi.request(
      'get',
      `/articles?uid=${componentId}`
    );

    if (response[0]) {
      const article = response[0] as JSONValue;
      const helpContent: HelpContent = {
        componentId,
        article: buildArticle(article)
      };

      if (article.related_video) {
        const relatedVideo = article.related_video as JSONValue;
        const videoResponse = await strapi.request(
          'get',
          `/videos/${relatedVideo.id}`
        );
        helpContent.video = buildVideo(videoResponse as JSONValue);
      }

      return helpContent;
    }
    return null;
  }
}

const buildArticle = (article: JSONValue): Article => {
  let body = article.body as string;

  // FIXME: Not sure if there is any other way to load the images
  body = body.replace('(/uploads/', `(${helpApiEndpoint}/uploads/`);

  return {
    title: article.title as string,
    body: body,
    parentArticle: article.parent
      ? buildArticle(article.parent as Article)
      : undefined
  };
};

const buildVideo = (video: JSONValue): Video => {
  const previousVideo = video.previous_video as JSONValue;
  const nextVideo = video.next_video as JSONValue;

  return {
    title: video.title as string,
    embedUrl: video.youtube_url as string,
    previousVideo: previousVideo?.id
      ? buildVideo(video.previous_video as JSONValue)
      : undefined,
    nextVideo: nextVideo?.id
      ? buildVideo(video.next_video as JSONValue)
      : undefined
  };
};

const helpService = new HelpService();

export default helpService;
