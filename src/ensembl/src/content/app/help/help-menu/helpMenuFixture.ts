import { Menu as MenuType } from 'src/shared/types/help-and-docs/menu';

const menu: MenuType = {
  name: "help",
  items: [
    {
      name: "Getting Started",
      type: "collection",
      url: "/getting-started",
      items: [
        {
          name: "Species selector",
          type: "article",
          url: "/help/articles/species-selector",
        },
        {
          name: "Species homepage",
          type: "article",
          url: "/help/articles/species-homepage",
        },
      ],
    },
    {
      name: "Using Ensembl",
      type: "collection",
      items: [
        {
          name: "Viewing Ensembl data",
          type: "collection",
          items: [
            {
              name: "Genome browser",
              type: "collection",
              items: [
                {
                  name: "What is the Genome browser?",
                  type: "article",
                  url: "/help/articles/what-is-the-genome-browser",
                },
                {
                  name: "Track configuration",
                  type: "article",
                  url: "/help/articles/track-configuration",
                },
                {
                  name: "Genome browser navigation",
                  type: "article",
                  url: "/help/articles/genome-browser-navigation",
                },
                {
                  name: "What is a Focus entity?",
                  type: "article",
                  url: "/help/articles/what-is-a-focus-entity",
                },
              ],
            },
            {
              name: "Entity viewer",
              type: "collection",
              items: [
                {
                  name: "What is the Entity viewer?",
                  type: "article",
                  url: "/help/articles/what-is-the-entity-viewer",
                },
                {
                  name: "What’s in the Transcripts view?",
                  type: "article",
                  url: "/help/articles/what-s-in-the-transcripts-view",
                },
                {
                  name: "What’s in the Gene function?",
                  type: "article",
                  url: "/help/articles/what-s-in-the-gene-function",
                },
                {
                  name: "What’s in the Overview panel?",
                  type: "article",
                  url: "/help/articles/what-s-in-the-overview-panel",
                },
                {
                  name: "What’s in the External references panel?",
                  type: "article",
                  url: "/help/articles/what-s-in-the-external-references-panel",
                },
              ],
            },
          ],
        }
      ],
    },
  ],
};

export default menu;
