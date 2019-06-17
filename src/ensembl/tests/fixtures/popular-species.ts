import faker from 'faker';

export const createPopularSpecies = () => ({
  genome_id: faker.random.uuid(),
  reference_genome_id: null,
  common_name: null,
  scientific_name: faker.lorem.words(),
  assembly_name: faker.lorem.word(),
  image: faker.image.imageUrl(),
  division_ids: [],
  is_available: true
});
