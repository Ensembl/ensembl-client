import 'src/styles/globalStyles.ts';

export const parameters = {
  options: {
    storySort: {
      order: [
        'Design Primitives',
        'Components', [ 'Genome Browser', 'Entity Viewer', 'Species', 'Blast', 'Shared Components' ],
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
