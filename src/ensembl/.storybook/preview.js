import 'src/styles/main.scss';

export const parameters = {
  options: {
    storySort: {
      order: [
        'Design Primitives',
        'Components', [ 'Genome Browser', 'Entity Viewer', 'Shared Components' ],
        'Hooks',
        'Other'
      ]
    },
  },
  docs: { // recipe for migrating from addons/notes
    extractComponentDescription: (_, { notes }) => {
      if (notes) {
        return typeof notes === 'string' ? notes : notes.markdown || notes.text;
      }
      return null;
    },
  }
};
