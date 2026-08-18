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

- Download button behaviour
  - One button or two buttons (one for submission overall; the other in filters section)?
  - If two buttons, should the download button in the filters section also open a row of download options below it when it is pressed?
  - If one button, do we need more controls for downloading with filters vs downloading all data?
    - Consider that the download button in the submission header exists in the list view as well as in the results view


## TODO
- Remove `expandCommand` from VepFormOptionsPanel

- Delete src/content/app/tools/vep/components/vep-submission-header/DownloadOptions.tsx and src/content/app/tools/vep/components/vep-submission-header/DownloadOptions.module.css (at least as they are currently)
- In VepSubmissionHeader component, there currently is a commented-out implementation of a DownloadOptions component. Remember to delete the commented-out code.




## DONE
- Revert HGVS to single checkbox; drop custom code