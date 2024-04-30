"use strict";(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[7273],{"./stories/variation/variant-vcf/VariantVCF.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ExportedVariantVCFStory:()=>ExportedVariantVCFStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>VariantVCF_stories});var variantVCFSampleData_namespaceObject={};__webpack_require__.r(variantVCFSampleData_namespaceObject),__webpack_require__.d(variantVCFSampleData_namespaceObject,{rs699:()=>rs699,rs71197234:()=>rs71197234});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),variantHelpers=__webpack_require__("./src/shared/helpers/variantHelpers.ts"),Copy=__webpack_require__("./src/shared/components/copy/Copy.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),VariantVCF_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/variant-vcf/VariantVCF.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(VariantVCF_module.A,options);const variant_vcf_VariantVCF_module=VariantVCF_module.A&&VariantVCF_module.A.locals?VariantVCF_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),VariantVCF=props=>{var vcfSequenceParts=getVCFStringParts(props.variant),componentClasses=classnames_default()(variant_vcf_VariantVCF_module.container,props.className);return(0,jsx_runtime.jsxs)("div",{className:componentClasses,children:[props.withCopy&&(0,jsx_runtime.jsx)(Copy.A,{value:vcfSequenceParts.vcfString,align:"left"}),(0,jsx_runtime.jsxs)("span",{className:variant_vcf_VariantVCF_module.vcfString,children:[(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.regionName}),(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.startCoordinate}),(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.variantName}),(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.referenceAlleleSequence}),(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.alternativeAlleleSequences.join(",")})]})]})},getVCFStringParts=variant=>{var _referenceAllele$refe,variantName=variant.name,startCoordinate=variant.slice.location.start,regionName=variant.slice.region.name,{referenceAllele,alternativeAlleles}=(0,variantHelpers.WZ)(variant.alleles),referenceAlleleSequence=null!==(_referenceAllele$refe=null==referenceAllele?void 0:referenceAllele.reference_sequence)&&void 0!==_referenceAllele$refe?_referenceAllele$refe:"",alternativeAlleleSequences=alternativeAlleles.map((allele=>allele.allele_sequence)),vcfString=[regionName,startCoordinate,variantName,referenceAlleleSequence,alternativeAlleleSequences.join(",")].join(" ");return{variantName,regionName,startCoordinate,referenceAlleleSequence,alternativeAlleleSequences,vcfString}};const variant_vcf_VariantVCF=VariantVCF;try{getVCFStringParts.displayName="getVCFStringParts",getVCFStringParts.__docgenInfo={description:"",displayName:"getVCFStringParts",props:{name:{defaultValue:null,description:"",name:"name",required:!0,type:{name:"string"}},slice:{defaultValue:null,description:"",name:"slice",required:!0,type:{name:"{ location: { start: number; }; region: { name: string; }; }"}},alleles:{defaultValue:null,description:"",name:"alleles",required:!0,type:{name:"{ reference_sequence: string; allele_sequence: string; allele_type: { value: string; }; }[]"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/variant-vcf/VariantVCF.tsx#getVCFStringParts"]={docgenInfo:getVCFStringParts.__docgenInfo,name:"getVCFStringParts",path:"src/shared/components/variant-vcf/VariantVCF.tsx#getVCFStringParts"})}catch(__react_docgen_typescript_loader_error){}try{VariantVCF.displayName="VariantVCF",VariantVCF.__docgenInfo={description:"",displayName:"VariantVCF",props:{variant:{defaultValue:null,description:"",name:"variant",required:!0,type:{name:"MinimumVariantData"}},withCopy:{defaultValue:null,description:"",name:"withCopy",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/variant-vcf/VariantVCF.tsx#VariantVCF"]={docgenInfo:VariantVCF.__docgenInfo,name:"VariantVCF",path:"src/shared/components/variant-vcf/VariantVCF.tsx#VariantVCF"})}catch(__react_docgen_typescript_loader_error){}var rs699={name:"rs699",slice:{location:{start:230710048},region:{name:"1"}},alleles:[{allele_sequence:"A",reference_sequence:"A",allele_type:{value:"biological_region"}},{allele_sequence:"G",reference_sequence:"A",allele_type:{value:"insertion"}}]},rs71197234={name:"rs71197234",slice:{location:{start:57932509},region:{name:"13"}},alleles:[{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATAT",allele_type:{value:"biological_region"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATACACACACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATACATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}}]},VariantVCF_stories_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/variation/variant-vcf/VariantVCF.stories.module.css"),VariantVCF_stories_module_options={};VariantVCF_stories_module_options.styleTagTransform=styleTagTransform_default(),VariantVCF_stories_module_options.setAttributes=setAttributesWithoutAttributes_default(),VariantVCF_stories_module_options.insert=insertBySelector_default().bind(null,"head"),VariantVCF_stories_module_options.domAPI=styleDomAPI_default(),VariantVCF_stories_module_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(VariantVCF_stories_module.A,VariantVCF_stories_module_options);const variant_vcf_VariantVCF_stories_module=VariantVCF_stories_module.A&&VariantVCF_stories_module.A.locals?VariantVCF_stories_module.A.locals:void 0;var VariantVCFStory=()=>{var[variantName,setVariantName]=(0,react.useState)("rs699"),variantData=variantVCFSampleData_namespaceObject[variantName];return(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("div",{className:variant_vcf_VariantVCF_stories_module.container,children:(0,jsx_runtime.jsx)(variant_vcf_VariantVCF,{variant:variantData,withCopy:!0})}),(0,jsx_runtime.jsxs)("form",{className:variant_vcf_VariantVCF_stories_module.options,children:[(0,jsx_runtime.jsxs)("label",{children:[(0,jsx_runtime.jsx)("input",{type:"radio",checked:"rs699"===variantName,onChange:()=>setVariantName("rs699")}),"rs699 (a SNP)"]}),(0,jsx_runtime.jsxs)("label",{children:[(0,jsx_runtime.jsx)("input",{type:"radio",checked:"rs71197234"===variantName,onChange:()=>setVariantName("rs71197234")}),"rs71197234 (an indel with many alleles)"]})]})]})},ExportedVariantVCFStory={name:"default",render:()=>(0,jsx_runtime.jsx)(VariantVCFStory,{})};const VariantVCF_stories={title:"Components/Variation/VariantVCF"};ExportedVariantVCFStory.parameters={...ExportedVariantVCFStory.parameters,docs:{...ExportedVariantVCFStory.parameters?.docs,source:{originalSource:"{\n  name: 'default',\n  render: () => <VariantVCFStory />\n}",...ExportedVariantVCFStory.parameters?.docs?.source}}};const __namedExportsOrder=["ExportedVariantVCFStory"]},"./src/shared/components/copy/Copy.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>copy_Copy});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.global-this.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Copy_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/copy/Copy.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Copy_module.A,options);const copy_Copy_module=Copy_module.A&&Copy_module.A.locals?Copy_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),Copy=props=>{var _globalThis$navigator,timeout,[copied,setCopied]=(0,react.useState)(!1);(0,react.useEffect)((()=>()=>timeout&&clearTimeout(timeout)),[]);if(null===globalThis||void 0===globalThis||null===(_globalThis$navigator=globalThis.navigator)||void 0===_globalThis$navigator||!_globalThis$navigator.clipboard)return null;var componentStyles=classnames_default()(copy_Copy_module.copyLozenge,{[copy_Copy_module.alignLeft]:"left"===props.align&&!copied,[copy_Copy_module.alignMiddle]:"middle"===props.align||!props.align||copied,[copy_Copy_module.alignRight]:"right"===props.align&&!copied,[copy_Copy_module.copyLozengeCopied]:copied},props.className);return(0,jsx_runtime.jsx)("span",{className:componentStyles,children:copied?"Copied":(0,jsx_runtime.jsx)("button",{className:copy_Copy_module.copy,onClick:()=>{var _props$onCopy;setCopied(!0),null===(_props$onCopy=props.onCopy)||void 0===_props$onCopy||_props$onCopy.call(props),navigator.clipboard.writeText(props.value),timeout=setTimeout((()=>setCopied(!1)),1500)},children:"Copy"})})};const copy_Copy=Copy;try{Copy.displayName="Copy",Copy.__docgenInfo={description:"",displayName:"Copy",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string"}},onCopy:{defaultValue:null,description:"",name:"onCopy",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},align:{defaultValue:null,description:"",name:"align",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"middle"'},{value:'"right"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/copy/Copy.tsx#Copy"]={docgenInfo:Copy.__docgenInfo,name:"Copy",path:"src/shared/components/copy/Copy.tsx#Copy"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/helpers/variantHelpers.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{WZ:()=>getReferenceAndAltAlleles});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");const constants_variantGroups=[{id:1,label:"Protein altering variant",variant_types:[{label:"frameshift_variant",so_accession_id:"SO:0001589",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001589"},{label:"inframe_deletion",so_accession_id:"SO:0001822",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001822"},{label:"inframe_insertion",so_accession_id:"SO:0001821",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001821"},{label:"missense_variant",so_accession_id:"SO:0001583",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001583"},{label:"protein_altering_variant",so_accession_id:"SO:0001818",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001818"},{label:"start_lost",so_accession_id:"SO:0002012",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0002012"},{label:"stop_gained",so_accession_id:"SO:0001587",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001587"},{label:"stop_lost",so_accession_id:"SO:0001578",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001578"}]},{id:2,label:"Splicing variant",variant_types:[{label:"splice_acceptor_variant",so_accession_id:"SO:0001574",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001574"},{label:"splice_donor_5th_base_variant",so_accession_id:"SO:0001787",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001787"},{label:"splice_donor_region_variant",so_accession_id:"SO:0002170",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0002170"},{label:"splice_donor_variant",so_accession_id:"SO:0001575",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001575"},{label:"splice_polypyrimidine_tract_variant",so_accession_id:"SO:0002169",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0002169"},{label:"splice_region_variant",so_accession_id:"SO:0001630",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001630"}]},{id:3,label:"Transcript variant",variant_types:[{label:"3_prime_UTR_variant",so_accession_id:"SO:0001624",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001624"},{label:"5_prime_UTR_variant",so_accession_id:"SO:0001623",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001623"},{label:"coding_sequence_variant",so_accession_id:"SO:0001580",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001580"},{label:"incomplete_terminal_codon_variant",so_accession_id:"SO:0001626",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001626"},{label:"intron_variant",so_accession_id:"SO:0001627",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001627"},{label:"mature_miRNA_variant",so_accession_id:"SO:0001620",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001620"},{label:"NMD_transcript_variant",so_accession_id:"SO:0001621",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001621"},{label:"non_coding_transcript_exon_variant",so_accession_id:"SO:0001792",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001792"},{label:"non_coding_transcript_variant",so_accession_id:"SO:0001619",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001619"},{label:"start_retained_variant",so_accession_id:"SO:0002019",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0002019"},{label:"stop_retained_variant",so_accession_id:"SO:0001567",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001567"},{label:"synonymous_variant",so_accession_id:"SO:0001819",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001819"}]},{id:4,label:"Regulatory region variant",variant_types:[{label:"regulatory_region_variant",so_accession_id:"SO:0001566",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001566"},{label:"TF_binding_site_variant",so_accession_id:"SO:0001782",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001782"}]},{id:5,label:"Intergenic variant",variant_types:[{label:"downstream_gene_variant",so_accession_id:"SO:0001632",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001632"},{label:"intergenic_variant",so_accession_id:"SO:0001628",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001628"},{label:"upstream_gene_variant",so_accession_id:"SO:0001631",url:"http://www.sequenceontology.org/miso/current_svn/term/SO:0001631"}]}];var getReferenceAndAltAlleles=alleles=>{var referenceAllele,alternativeAlleles=[];for(var allele of alleles)"biological_region"===allele.allele_type.value?referenceAllele=allele:alternativeAlleles.push(allele);return{referenceAllele,alternativeAlleles}};(()=>{var colourMap=new Map;for(var group of constants_variantGroups)for(var variantType of group.variant_types)colourMap.set(variantType.label,group.id)})(),new Map([[1,"var(--color-dark-pink)"],[2,"var(--color-dark-yellow)"],[3,"var(--color-lime)"],[4,"var(--color-teal)"],[5,"var(--color-duckegg-blue)"]])},"./node_modules/core-js/modules/es.global-this.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),global=__webpack_require__("./node_modules/core-js/internals/global.js");$({global:!0,forced:global.globalThis!==global},{globalThis:global})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/copy/Copy.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,'.copyLozenge__Copy-module__Qmr4T {\n  display: inline-flex;\n  width: 68px;\n  align-items: center;\n}\n\n/* \n  Considering that when the copy button is pressed, it shows\n  a lozenge that is wider than the initial text "Copy"\n  (the lozenge text says "Copied", and the lozenge itself\n  has padding left and right), below are three alignment classes\n  to position the initial label ("Copy") within the space taken by the lozenge.\n\n  The label "Copy" can be aligned to the left of the lozenge space,\n  or to its right, or to the middle.\n  Notice that the text "Copied" is always middle-aligned\n*/\n\n.alignLeft__Copy-module__cbgdQ {\n  justify-content: flex-start;\n}\n\n.alignMiddle__Copy-module__m7Ige {\n  justify-content: center;\n}\n\n.alignRight__Copy-module__ocLww {\n  justify-content: flex-end;\n}\n\n.copy__Copy-module__cq_Ce {\n  color: var(--color-blue);\n  line-height: inherit;\n}\n\n.copyLozengeCopied__Copy-module__z2ZTa {\n  color: var(--color-white);\n  background-color: var(--color-black);\n  border-radius: 30px;\n}\n',"",{version:3,sources:["webpack://./src/shared/components/copy/Copy.module.css"],names:[],mappings:"AAAA;EACE,oBAAoB;EACpB,WAAW;EACX,mBAAmB;AACrB;;AAEA;;;;;;;;;;CAUC;;AAED;EACE,2BAA2B;AAC7B;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,wBAAwB;EACxB,oBAAoB;AACtB;;AAEA;EACE,yBAAyB;EACzB,oCAAoC;EACpC,mBAAmB;AACrB",sourcesContent:['.copyLozenge {\n  display: inline-flex;\n  width: 68px;\n  align-items: center;\n}\n\n/* \n  Considering that when the copy button is pressed, it shows\n  a lozenge that is wider than the initial text "Copy"\n  (the lozenge text says "Copied", and the lozenge itself\n  has padding left and right), below are three alignment classes\n  to position the initial label ("Copy") within the space taken by the lozenge.\n\n  The label "Copy" can be aligned to the left of the lozenge space,\n  or to its right, or to the middle.\n  Notice that the text "Copied" is always middle-aligned\n*/\n\n.alignLeft {\n  justify-content: flex-start;\n}\n\n.alignMiddle {\n  justify-content: center;\n}\n\n.alignRight {\n  justify-content: flex-end;\n}\n\n.copy {\n  color: var(--color-blue);\n  line-height: inherit;\n}\n\n.copyLozengeCopied {\n  color: var(--color-white);\n  background-color: var(--color-black);\n  border-radius: 30px;\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={copyLozenge:"copyLozenge__Copy-module__Qmr4T",alignLeft:"alignLeft__Copy-module__cbgdQ",alignMiddle:"alignMiddle__Copy-module__m7Ige",alignRight:"alignRight__Copy-module__ocLww",copy:"copy__Copy-module__cq_Ce",copyLozengeCopied:"copyLozengeCopied__Copy-module__z2ZTa"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/variant-vcf/VariantVCF.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".container__VariantVCF-module__i_KUq {\n  display: flex;\n  flex-direction: column;\n  row-gap: 1ch;\n}\n\n.vcfString__VariantVCF-module__gtYfr {\n  display: inline-flex;\n  flex-wrap: wrap;\n  column-gap: 1ch;\n}\n\n.vcfString__VariantVCF-module__gtYfr > span {\n  word-break: break-all;\n}\n","",{version:3,sources:["webpack://./src/shared/components/variant-vcf/VariantVCF.module.css"],names:[],mappings:"AAAA;EACE,aAAa;EACb,sBAAsB;EACtB,YAAY;AACd;;AAEA;EACE,oBAAoB;EACpB,eAAe;EACf,eAAe;AACjB;;AAEA;EACE,qBAAqB;AACvB",sourcesContent:[".container {\n  display: flex;\n  flex-direction: column;\n  row-gap: 1ch;\n}\n\n.vcfString {\n  display: inline-flex;\n  flex-wrap: wrap;\n  column-gap: 1ch;\n}\n\n.vcfString > span {\n  word-break: break-all;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"container__VariantVCF-module__i_KUq",vcfString:"vcfString__VariantVCF-module__gtYfr"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/variation/variant-vcf/VariantVCF.stories.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".container__VariantVCF-stories-module__C06A2 {\n  border: 1px dashed black;\n  width: 480px;\n  word-break: break-all;\n}\n\n.options__VariantVCF-stories-module__pZko5 {\n  margin-top: 4rem;\n  display: flex;\n  flex-direction: column;\n}\n\n.options__VariantVCF-stories-module__pZko5 label {\n  display: inline-flex;\n  align-items: center;\n  column-gap: 0.6rem;\n}\n","",{version:3,sources:["webpack://./stories/variation/variant-vcf/VariantVCF.stories.module.css"],names:[],mappings:"AAAA;EACE,wBAAwB;EACxB,YAAY;EACZ,qBAAqB;AACvB;;AAEA;EACE,gBAAgB;EAChB,aAAa;EACb,sBAAsB;AACxB;;AAEA;EACE,oBAAoB;EACpB,mBAAmB;EACnB,kBAAkB;AACpB",sourcesContent:[".container {\n  border: 1px dashed black;\n  width: 480px;\n  word-break: break-all;\n}\n\n.options {\n  margin-top: 4rem;\n  display: flex;\n  flex-direction: column;\n}\n\n.options label {\n  display: inline-flex;\n  align-items: center;\n  column-gap: 0.6rem;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"container__VariantVCF-stories-module__C06A2",options:"options__VariantVCF-stories-module__pZko5"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);