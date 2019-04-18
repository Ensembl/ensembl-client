/*

Shape of a popular species data object

{
  "production_name": string, // a unique identifier
  "common_name": string | null, // common name (if present)
  "scientific_name": string, // should always be present
  "assembly_name": string, // notice on mockups that every popular species has an assembly
  image: string, // link to the svg or base64-encoded svg
}

*/

// QUESTION: should filtering of popular species (by divisions) happen on the client side or on the server side?
// If on the client side, then there should also be something like a 'divisions' field
