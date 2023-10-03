"use strict";(self.webpackChunkensembl_new=self.webpackChunkensembl_new||[]).push([[6976],{"./stories/variation/variant-vcf/VariantVCF.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ExportedVariantVCFStory:()=>ExportedVariantVCFStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>variation_variant_vcf_VariantVCF_stories});var variantVCFSampleData_namespaceObject={};__webpack_require__.r(variantVCFSampleData_namespaceObject),__webpack_require__.d(variantVCFSampleData_namespaceObject,{rs699:()=>rs699,rs71197234:()=>rs71197234});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),variantHelpers=__webpack_require__("./src/shared/helpers/variantHelpers.ts"),injectStylesIntoStyleTag=(__webpack_require__("./node_modules/core-js/modules/es.global-this.js"),__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Copy=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/copy/Copy.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Copy.Z,options);const copy_Copy=Copy.Z&&Copy.Z.locals?Copy.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),Copy_Copy=props=>{var _globalThis$navigator,timeout,[copied,setCopied]=(0,react.useState)(!1);(0,react.useEffect)((()=>()=>timeout&&clearTimeout(timeout)),[]);if(null===globalThis||void 0===globalThis||null===(_globalThis$navigator=globalThis.navigator)||void 0===_globalThis$navigator||!_globalThis$navigator.clipboard)return null;var componentStyles=classnames_default()(copy_Copy.copyLozenge,{[copy_Copy.copyLozengeCopied]:copied},props.className);return(0,jsx_runtime.jsx)("span",{className:componentStyles,children:copied?"Copied":(0,jsx_runtime.jsx)("button",{className:copy_Copy.copy,onClick:()=>{var _props$onCopy;setCopied(!0),null===(_props$onCopy=props.onCopy)||void 0===_props$onCopy||_props$onCopy.call(props),navigator.clipboard.writeText(props.value),timeout=setTimeout((()=>setCopied(!1)),1500)},children:"Copy"})})};Copy_Copy.displayName="Copy";const components_copy_Copy=Copy_Copy;try{Copy_Copy.displayName="Copy",Copy_Copy.__docgenInfo={description:"",displayName:"Copy",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string"}},onCopy:{defaultValue:null,description:"",name:"onCopy",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/copy/Copy.tsx#Copy"]={docgenInfo:Copy_Copy.__docgenInfo,name:"Copy",path:"src/shared/components/copy/Copy.tsx#Copy"})}catch(__react_docgen_typescript_loader_error){}var VariantVCF=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/variant-vcf/VariantVCF.scss"),VariantVCF_options={};VariantVCF_options.styleTagTransform=styleTagTransform_default(),VariantVCF_options.setAttributes=setAttributesWithoutAttributes_default(),VariantVCF_options.insert=insertBySelector_default().bind(null,"head"),VariantVCF_options.domAPI=styleDomAPI_default(),VariantVCF_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(VariantVCF.Z,VariantVCF_options);const variant_vcf_VariantVCF=VariantVCF.Z&&VariantVCF.Z.locals?VariantVCF.Z.locals:void 0;var VariantVCF_VariantVCF=props=>{var vcfSequenceParts=getVCFStringParts(props.variant),componentClasses=classnames_default()(variant_vcf_VariantVCF.container,props.className);return(0,jsx_runtime.jsxs)("div",{className:componentClasses,children:[(0,jsx_runtime.jsxs)("span",{className:variant_vcf_VariantVCF.vcfString,children:[(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.regionName}),(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.startCoordinate}),(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.variantName}),(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.referenceAlleleSequence}),(0,jsx_runtime.jsx)("span",{children:vcfSequenceParts.alternativeAlleleSequences.join(",")})]}),props.withCopy&&(0,jsx_runtime.jsx)(components_copy_Copy,{value:vcfSequenceParts.vcfString})]})};VariantVCF_VariantVCF.displayName="VariantVCF";var getVCFStringParts=variant=>{var _referenceAllele$refe,variantName=variant.name,startCoordinate=variant.slice.location.start,regionName=variant.slice.region.name,{referenceAllele,alternativeAlleles}=(0,variantHelpers.S)(variant.alleles),referenceAlleleSequence=null!==(_referenceAllele$refe=null==referenceAllele?void 0:referenceAllele.reference_sequence)&&void 0!==_referenceAllele$refe?_referenceAllele$refe:"",alternativeAlleleSequences=alternativeAlleles.map((allele=>allele.allele_sequence)),vcfString=[regionName,startCoordinate,variantName,referenceAlleleSequence,alternativeAlleleSequences.join(",")].join(" ");return{variantName,regionName,startCoordinate,referenceAlleleSequence,alternativeAlleleSequences,vcfString}};const components_variant_vcf_VariantVCF=VariantVCF_VariantVCF;try{getVCFStringParts.displayName="getVCFStringParts",getVCFStringParts.__docgenInfo={description:"",displayName:"getVCFStringParts",props:{name:{defaultValue:null,description:"",name:"name",required:!0,type:{name:"string"}},slice:{defaultValue:null,description:"",name:"slice",required:!0,type:{name:"{ location: { start: number; }; region: { name: string; }; }"}},alleles:{defaultValue:null,description:"",name:"alleles",required:!0,type:{name:"{ reference_sequence: string; allele_sequence: string; allele_type: { value: string; }; }[]"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/variant-vcf/VariantVCF.tsx#getVCFStringParts"]={docgenInfo:getVCFStringParts.__docgenInfo,name:"getVCFStringParts",path:"src/shared/components/variant-vcf/VariantVCF.tsx#getVCFStringParts"})}catch(__react_docgen_typescript_loader_error){}try{VariantVCF_VariantVCF.displayName="VariantVCF",VariantVCF_VariantVCF.__docgenInfo={description:"",displayName:"VariantVCF",props:{variant:{defaultValue:null,description:"",name:"variant",required:!0,type:{name:"MinimumVariantData"}},withCopy:{defaultValue:null,description:"",name:"withCopy",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/variant-vcf/VariantVCF.tsx#VariantVCF"]={docgenInfo:VariantVCF_VariantVCF.__docgenInfo,name:"VariantVCF",path:"src/shared/components/variant-vcf/VariantVCF.tsx#VariantVCF"})}catch(__react_docgen_typescript_loader_error){}var rs699={name:"rs699",slice:{location:{start:230710048},region:{name:"1"}},alleles:[{allele_sequence:"A",reference_sequence:"A",allele_type:{value:"biological_region"}},{allele_sequence:"G",reference_sequence:"A",allele_type:{value:"insertion"}}]},rs71197234={name:"rs71197234",slice:{location:{start:57932509},region:{name:"13"}},alleles:[{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATAT",allele_type:{value:"biological_region"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATACACACACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATACATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATATATATACATATATATATATAT",allele_type:{value:"insertion"}},{reference_sequence:"ATATATATATATAT",allele_sequence:"ATATATATATATATATATATATATATATACACATATATATATATAT",allele_type:{value:"insertion"}}]},VariantVCF_stories=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/variation/variant-vcf/VariantVCF.stories.scss"),VariantVCF_stories_options={};VariantVCF_stories_options.styleTagTransform=styleTagTransform_default(),VariantVCF_stories_options.setAttributes=setAttributesWithoutAttributes_default(),VariantVCF_stories_options.insert=insertBySelector_default().bind(null,"head"),VariantVCF_stories_options.domAPI=styleDomAPI_default(),VariantVCF_stories_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(VariantVCF_stories.Z,VariantVCF_stories_options);const variant_vcf_VariantVCF_stories=VariantVCF_stories.Z&&VariantVCF_stories.Z.locals?VariantVCF_stories.Z.locals:void 0;var _ExportedVariantVCFSt,_ExportedVariantVCFSt2;function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var VariantVCFStory=()=>{var[variantName,setVariantName]=(0,react.useState)("rs699"),variantData=variantVCFSampleData_namespaceObject[variantName];return(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("div",{className:variant_vcf_VariantVCF_stories.container,children:(0,jsx_runtime.jsx)(components_variant_vcf_VariantVCF,{variant:variantData,withCopy:!0})}),(0,jsx_runtime.jsxs)("form",{className:variant_vcf_VariantVCF_stories.options,children:[(0,jsx_runtime.jsxs)("label",{children:[(0,jsx_runtime.jsx)("input",{type:"radio",checked:"rs699"===variantName,onChange:()=>setVariantName("rs699")}),"rs699 (a SNP)"]}),(0,jsx_runtime.jsxs)("label",{children:[(0,jsx_runtime.jsx)("input",{type:"radio",checked:"rs71197234"===variantName,onChange:()=>setVariantName("rs71197234")}),"rs71197234 (an indel with many alleles)"]})]})]})};VariantVCFStory.displayName="VariantVCFStory";var ExportedVariantVCFStory={name:"default",render:()=>(0,jsx_runtime.jsx)(VariantVCFStory,{})};const variation_variant_vcf_VariantVCF_stories={title:"Components/Variation/VariantVCF"};ExportedVariantVCFStory.parameters=_objectSpread(_objectSpread({},ExportedVariantVCFStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_ExportedVariantVCFSt=ExportedVariantVCFStory.parameters)||void 0===_ExportedVariantVCFSt?void 0:_ExportedVariantVCFSt.docs),{},{source:_objectSpread({originalSource:"{\n  name: 'default',\n  render: () => <VariantVCFStory />\n}"},null===(_ExportedVariantVCFSt2=ExportedVariantVCFStory.parameters)||void 0===_ExportedVariantVCFSt2||null===(_ExportedVariantVCFSt2=_ExportedVariantVCFSt2.docs)||void 0===_ExportedVariantVCFSt2?void 0:_ExportedVariantVCFSt2.source)})});var __namedExportsOrder=["ExportedVariantVCFStory"]},"./src/shared/helpers/variantHelpers.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{S:()=>getReferenceAndAltAlleles});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var getReferenceAndAltAlleles=alleles=>{var referenceAllele,alternativeAlleles=[];for(var allele of alleles)"biological_region"===allele.allele_type.value?referenceAllele=allele:alternativeAlleles.push(allele);return{referenceAllele,alternativeAlleles}}},"./node_modules/core-js/modules/es.global-this.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),global=__webpack_require__("./node_modules/core-js/internals/global.js");$({global:!0,forced:global.globalThis!==global},{globalThis:global})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/copy/Copy.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".copyLozenge__Copy__kyoFd{display:inline-flex;height:18px;padding:0 14px;align-items:center;justify-content:center}.copy__Copy__LMX_4{color:#09f}.copyLozengeCopied__Copy__JLmty{color:#fff;background-color:#1b2c39;border-radius:30px}","",{version:3,sources:["webpack://./src/shared/components/copy/Copy.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,0BACE,mBAAA,CACA,WAAA,CACA,cAAA,CACA,kBAAA,CACA,sBAAA,CAGF,mBACE,UCkBK,CDfP,gCACE,UCTM,CDUN,wBCXM,CDYN,kBAAA",sourcesContent:["@import 'src/styles/common';\n\n.copyLozenge {\n  display: inline-flex;\n  height: 18px;\n  padding: 0 14px;\n  align-items: center;\n  justify-content: center;\n}\n\n.copy {\n  color: $blue;\n}\n\n.copyLozengeCopied {\n  color: $white;\n  background-color: $black;\n  border-radius: 30px;\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",copyLozenge:"copyLozenge__Copy__kyoFd",copy:"copy__Copy__LMX_4",copyLozengeCopied:"copyLozengeCopied__Copy__JLmty"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/variant-vcf/VariantVCF.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".container__VariantVCF__yMsHX{display:flex;flex-wrap:wrap;column-gap:2ch;row-gap:1ch}.vcfString__VariantVCF__j1IhP{display:inline-flex;flex-wrap:wrap;column-gap:1ch}.vcfString__VariantVCF__j1IhP>span{word-break:break-all}","",{version:3,sources:["webpack://./src/shared/components/variant-vcf/VariantVCF.scss"],names:[],mappings:"AAAA,8BACE,YAAA,CACA,cAAA,CACA,cAAA,CACA,WAAA,CAGF,8BACE,mBAAA,CACA,cAAA,CACA,cAAA,CAGF,mCACE,oBAAA",sourcesContent:[".container {\n  display: flex;\n  flex-wrap: wrap;\n  column-gap: 2ch;\n  row-gap: 1ch;  \n}\n\n.vcfString {\n  display: inline-flex;\n  flex-wrap: wrap;\n  column-gap: 1ch;\n}\n\n.vcfString > span {\n  word-break: break-all;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"container__VariantVCF__yMsHX",vcfString:"vcfString__VariantVCF__j1IhP"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/variation/variant-vcf/VariantVCF.stories.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".container__VariantVCF-stories__IE5JD{border:1px dashed #000;width:480px;word-break:break-all}.options__VariantVCF-stories__yhdt3{margin-top:4rem;display:flex;flex-direction:column}.options__VariantVCF-stories__yhdt3 label{display:inline-flex;align-items:center;column-gap:.6rem}","",{version:3,sources:["webpack://./stories/variation/variant-vcf/VariantVCF.stories.scss"],names:[],mappings:"AAAA,sCACE,sBAAA,CACA,WAAA,CACA,oBAAA,CAGF,oCACE,eAAA,CACA,YAAA,CACA,qBAAA,CAGF,0CACE,mBAAA,CACA,kBAAA,CACA,gBAAA",sourcesContent:[".container {\n  border: 1px dashed black;\n  width: 480px;\n  word-break: break-all;\n}\n\n.options {\n  margin-top: 4rem;\n  display: flex;\n  flex-direction: column;\n}\n\n.options label {\n  display: inline-flex;\n  align-items: center;\n  column-gap: 0.6rem;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"container__VariantVCF-stories__IE5JD",options:"options__VariantVCF-stories__yhdt3"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);