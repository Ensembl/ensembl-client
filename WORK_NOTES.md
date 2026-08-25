# Need to review

## API
- The vepFormConfig endpoint (`/vep/form_config/:genome_id`) has been updated to take two optional parameters: `species_taxonomy_id` and `assembly_name`, alongside genome_id. But genome_id should be sufficient on its own for the backend to discover all the data that it needs.
==> Can we remove these parameters from this endpoint


### The form config
Explore the contract of the response
  - The purpose (and the name) of the `locked_children` field?
  - The purpose (and the name) of the `requires_any_sub_option` field?

Note that the `hgvs` option is a single "boolean", but it is rendered as two checkboxes. Why?


### Results
1. DisplaySpec -> plugin_scopes: should the value type be changed from string to "transcript" | "allele"?



## UI
- The 20px indents in Andrea's design — are they necessary? Aren't we losing precious space:
  - left/right indent for the grey details panel
  - left indent of the section body after the section title
- Light font used for labels sometimes — not sure I understand the pattern (and not sure I can reproduce it)
- Dark/plain font used in tables — not sure I can reproduce this
- Line in table heading: "Submissions not contributing to the aggregate classification shown in light text"

## TODO
- Add popular species?
- Remove `expandCommand` from `VepFormOptionsPanel` (and from `VepFormOptionsSection`)
- Remove requirement to pass `assembly_name` and `species_taxonomy_id` to requests for form config (see `vepFormSlice`)

## CHECK AND REMOVE?
- Check if the logic of the `resultsPanels` function is still necessary
- `[styles.tokenInputMono]: config.mono` - why monospace font in TokenListInput?
- Check for all remaining FIXME comments


## WTF
- What the hell is featureExplorerUrls file?
- Client has `isHumanGRCh38` flag in `VepSubmissionResults`
- There is a client-side builder of opentargets variant ids
  see `openTargetsVariantId`
- `VepFormOptionsPanel` knows the `utrannotator` id of an option
- Filters are human-centric:
 pattern: /^ENST\d{11}(\.\d+)?$/,
 invalidHint: 'expected ENST + 11 digits'



## DONE
- Revert HGVS to single checkbox; drop custom code


## PAIN

- Labels for Allele frequency sources are defined on the client
- Client-side removal of gene versions (ENSG) - if we don't remove the version, genes or transcripts may not be found

```ts
const AF_SOURCE_LABELS: Record<string, string> = {
  gnomad_exomes: 'gnomAD exomes',
  gnomad_genomes: 'gnomAD genomes',
  all_of_us: 'All of Us',
  gnomad_sv: 'gnomAD SV',
  gnomad_cnv: 'gnomAD CNV'
};
```

- Filters are hard-coded on the client (see `resultsFilterFields.ts`)
- Help is hard-coded on the client (see `optionHelp.ts`)
