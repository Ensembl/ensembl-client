"use strict";(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[2401],{"./stories/shared-components/proportion-indicator/ProportionIndicator.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ExportedCircularFractionIndicatorStory:()=>ExportedCircularFractionIndicatorStory,ExportedCircularPercentageIndicatorStory:()=>ExportedCircularPercentageIndicatorStory,ExportedLinearFractionIndicatorStory:()=>ExportedLinearFractionIndicatorStory,ExportedLinearPercentageIndicatorStory:()=>ExportedLinearPercentageIndicatorStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>shared_components_proportion_indicator_ProportionIndicator_stories});__webpack_require__("./node_modules/core-js/modules/es.parse-float.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var react=__webpack_require__("./node_modules/react/index.js"),numberFormatter=__webpack_require__("./src/shared/helpers/formatters/numberFormatter.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),CircularProportionIndicator=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/proportion-indicator/CircularProportionIndicator.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(CircularProportionIndicator.Z,options);const proportion_indicator_CircularProportionIndicator=CircularProportionIndicator.Z&&CircularProportionIndicator.Z.locals?CircularProportionIndicator.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),defaultValueFormatOptions={maximumFractionDigits:2},CircularProportionIndicator_CircularProportionIndicator=props=>{var diagramStyles={"--circular-proportion-indicator-value":"".concat(props.value,"%")};return(0,jsx_runtime.jsx)("div",{className:proportion_indicator_CircularProportionIndicator.diagram,style:diagramStyles})};CircularProportionIndicator_CircularProportionIndicator.displayName="CircularProportionIndicator";var CircularPercentageIndicator=props=>{var formattedValue,{value,valueFormatOptions=defaultValueFormatOptions,withPercentSign=!0,valueFormatter}=props;return valueFormatter?formattedValue=valueFormatter(value):(formattedValue=(0,numberFormatter.u)(value,valueFormatOptions),withPercentSign&&(formattedValue+="%")),(0,jsx_runtime.jsxs)("div",{className:proportion_indicator_CircularProportionIndicator.grid,children:[(0,jsx_runtime.jsx)(CircularProportionIndicator_CircularProportionIndicator,{value}),(0,jsx_runtime.jsx)("span",{className:proportion_indicator_CircularProportionIndicator.label,children:formattedValue})]})};CircularPercentageIndicator.displayName="CircularPercentageIndicator";var CircularFractionIndicator=props=>{var{value,valueFormatOptions=defaultValueFormatOptions,valueFormatter}=props,formattedValue=valueFormatter?valueFormatter(value):(0,numberFormatter.u)(value,valueFormatOptions);return(0,jsx_runtime.jsxs)("div",{className:proportion_indicator_CircularProportionIndicator.grid,children:[(0,jsx_runtime.jsx)(CircularProportionIndicator_CircularProportionIndicator,{value:100*value}),(0,jsx_runtime.jsx)("span",{className:proportion_indicator_CircularProportionIndicator.label,children:formattedValue})]})};CircularFractionIndicator.displayName="CircularFractionIndicator";try{CircularProportionIndicator_CircularProportionIndicator.displayName="CircularProportionIndicator",CircularProportionIndicator_CircularProportionIndicator.__docgenInfo={description:"This component renders a circle that has a coloured sector\nrepresenting a value between 0 and 100%.",displayName:"CircularProportionIndicator",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"number"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/proportion-indicator/CircularProportionIndicator.tsx#CircularProportionIndicator"]={docgenInfo:CircularProportionIndicator_CircularProportionIndicator.__docgenInfo,name:"CircularProportionIndicator",path:"src/shared/components/proportion-indicator/CircularProportionIndicator.tsx#CircularProportionIndicator"})}catch(__react_docgen_typescript_loader_error){}try{CircularPercentageIndicator.displayName="CircularPercentageIndicator",CircularPercentageIndicator.__docgenInfo={description:"This component renders CircularProportionIndicator with a value next to it.\nis meant to be used with values between 0 and 100",displayName:"CircularPercentageIndicator",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"number"}},valueFormatOptions:{defaultValue:null,description:"",name:"valueFormatOptions",required:!1,type:{name:"NumberFormatOptions"}},valueFormatter:{defaultValue:null,description:"",name:"valueFormatter",required:!1,type:{name:"((value: number) => ReactNode)"}},withPercentSign:{defaultValue:null,description:"",name:"withPercentSign",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/proportion-indicator/CircularProportionIndicator.tsx#CircularPercentageIndicator"]={docgenInfo:CircularPercentageIndicator.__docgenInfo,name:"CircularPercentageIndicator",path:"src/shared/components/proportion-indicator/CircularProportionIndicator.tsx#CircularPercentageIndicator"})}catch(__react_docgen_typescript_loader_error){}try{CircularFractionIndicator.displayName="CircularFractionIndicator",CircularFractionIndicator.__docgenInfo={description:"This component renders CircularProportionIndicator with a value next to it.\nIt is meant to be used with values between 0 and 1",displayName:"CircularFractionIndicator",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"number"}},valueFormatOptions:{defaultValue:null,description:"",name:"valueFormatOptions",required:!1,type:{name:"NumberFormatOptions"}},valueFormatter:{defaultValue:null,description:"",name:"valueFormatter",required:!1,type:{name:"((value: number) => ReactNode)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/proportion-indicator/CircularProportionIndicator.tsx#CircularFractionIndicator"]={docgenInfo:CircularFractionIndicator.__docgenInfo,name:"CircularFractionIndicator",path:"src/shared/components/proportion-indicator/CircularProportionIndicator.tsx#CircularFractionIndicator"})}catch(__react_docgen_typescript_loader_error){}var LinearProportionIndicator=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/proportion-indicator/LinearProportionIndicator.scss"),LinearProportionIndicator_options={};LinearProportionIndicator_options.styleTagTransform=styleTagTransform_default(),LinearProportionIndicator_options.setAttributes=setAttributesWithoutAttributes_default(),LinearProportionIndicator_options.insert=insertBySelector_default().bind(null,"head"),LinearProportionIndicator_options.domAPI=styleDomAPI_default(),LinearProportionIndicator_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(LinearProportionIndicator.Z,LinearProportionIndicator_options);const proportion_indicator_LinearProportionIndicator=LinearProportionIndicator.Z&&LinearProportionIndicator.Z.locals?LinearProportionIndicator.Z.locals:void 0;var LinearProportionIndicator_defaultValueFormatOptions={maximumFractionDigits:2},LinearProportionIndicator_LinearProportionIndicator=props=>{var diagramStyles={"--linear-proportion-indicator-value":"".concat(props.value,"%")};return(0,jsx_runtime.jsx)("div",{className:proportion_indicator_LinearProportionIndicator.diagram,style:diagramStyles})};LinearProportionIndicator_LinearProportionIndicator.displayName="LinearProportionIndicator";var LinearPercentageIndicator=props=>{var formattedValue,{value,valueFormatOptions=LinearProportionIndicator_defaultValueFormatOptions,withPercentSign=!0,valueFormatter}=props;return valueFormatter?formattedValue=valueFormatter(value):(formattedValue=(0,numberFormatter.u)(value,valueFormatOptions),withPercentSign&&(formattedValue+="%")),(0,jsx_runtime.jsxs)("div",{className:proportion_indicator_LinearProportionIndicator.grid,children:[(0,jsx_runtime.jsx)(LinearProportionIndicator_LinearProportionIndicator,{value}),(0,jsx_runtime.jsx)("span",{className:proportion_indicator_LinearProportionIndicator.label,children:formattedValue})]})};LinearPercentageIndicator.displayName="LinearPercentageIndicator";var LinearFractionIndicator=props=>{var{value,valueFormatOptions=LinearProportionIndicator_defaultValueFormatOptions,valueFormatter}=props,formattedValue=valueFormatter?valueFormatter(value):(0,numberFormatter.u)(value,valueFormatOptions);return(0,jsx_runtime.jsxs)("div",{className:proportion_indicator_LinearProportionIndicator.grid,children:[(0,jsx_runtime.jsx)(LinearProportionIndicator_LinearProportionIndicator,{value:100*value}),(0,jsx_runtime.jsx)("span",{className:proportion_indicator_LinearProportionIndicator.label,children:formattedValue})]})};LinearFractionIndicator.displayName="LinearFractionIndicator";try{LinearPercentageIndicator.displayName="LinearPercentageIndicator",LinearPercentageIndicator.__docgenInfo={description:"This component renders LinearProportionIndicator with a value next to it.\nis meant to be used with values between 0 and 100",displayName:"LinearPercentageIndicator",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"number"}},valueFormatOptions:{defaultValue:null,description:"",name:"valueFormatOptions",required:!1,type:{name:"NumberFormatOptions"}},valueFormatter:{defaultValue:null,description:"",name:"valueFormatter",required:!1,type:{name:"((value: number) => ReactNode)"}},withPercentSign:{defaultValue:null,description:"",name:"withPercentSign",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/proportion-indicator/LinearProportionIndicator.tsx#LinearPercentageIndicator"]={docgenInfo:LinearPercentageIndicator.__docgenInfo,name:"LinearPercentageIndicator",path:"src/shared/components/proportion-indicator/LinearProportionIndicator.tsx#LinearPercentageIndicator"})}catch(__react_docgen_typescript_loader_error){}try{LinearFractionIndicator.displayName="LinearFractionIndicator",LinearFractionIndicator.__docgenInfo={description:"This component renders LinearProportionIndicator with a value next to it.\nIt is meant to be used with values between 0 and 1",displayName:"LinearFractionIndicator",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"number"}},valueFormatOptions:{defaultValue:null,description:"",name:"valueFormatOptions",required:!1,type:{name:"NumberFormatOptions"}},valueFormatter:{defaultValue:null,description:"",name:"valueFormatter",required:!1,type:{name:"((value: number) => ReactNode)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/proportion-indicator/LinearProportionIndicator.tsx#LinearFractionIndicator"]={docgenInfo:LinearFractionIndicator.__docgenInfo,name:"LinearFractionIndicator",path:"src/shared/components/proportion-indicator/LinearProportionIndicator.tsx#LinearFractionIndicator"})}catch(__react_docgen_typescript_loader_error){}var ProportionIndicator_stories=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/shared-components/proportion-indicator/ProportionIndicator.stories.scss"),ProportionIndicator_stories_options={};ProportionIndicator_stories_options.styleTagTransform=styleTagTransform_default(),ProportionIndicator_stories_options.setAttributes=setAttributesWithoutAttributes_default(),ProportionIndicator_stories_options.insert=insertBySelector_default().bind(null,"head"),ProportionIndicator_stories_options.domAPI=styleDomAPI_default(),ProportionIndicator_stories_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(ProportionIndicator_stories.Z,ProportionIndicator_stories_options);const proportion_indicator_ProportionIndicator_stories=ProportionIndicator_stories.Z&&ProportionIndicator_stories.Z.locals?ProportionIndicator_stories.Z.locals:void 0;var _ExportedCircularPerc,_ExportedCircularPerc2,_ExportedCircularFrac,_ExportedCircularFrac2,_ExportedLinearPercen,_ExportedLinearPercen2,_ExportedLinearFracti,_ExportedLinearFracti2;function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var percentageControlDefaults={min:0,max:100,step:.5},fractionControlDefaults={min:0,max:1,step:.01},renderControls=props=>{var{value,setValue,min,max,step}=props;return(0,jsx_runtime.jsxs)("div",{className:proportion_indicator_ProportionIndicator_stories.controls,children:[(0,jsx_runtime.jsx)("label",{children:"Change value"}),(0,jsx_runtime.jsx)("input",{type:"range",min,max,step,value,onChange:event=>{var newValue=parseFloat(event.currentTarget.value);setValue(newValue)}})]})};renderControls.displayName="renderControls";var CircularPercentageIndicatorStory=()=>{var[value,setValue]=(0,react.useState)(20);return(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)(CircularPercentageIndicator,{value}),renderControls(_objectSpread({value,setValue},percentageControlDefaults))]})};CircularPercentageIndicatorStory.displayName="CircularPercentageIndicatorStory";var CircularFractionIndicatorStory=()=>{var[value,setValue]=(0,react.useState)(.3);return(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)(CircularFractionIndicator,{value}),renderControls(_objectSpread({value,setValue},fractionControlDefaults))]})};CircularFractionIndicatorStory.displayName="CircularFractionIndicatorStory";var LinearPercentageIndicatorStory=()=>{var[value,setValue]=(0,react.useState)(20);return(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)(LinearPercentageIndicator,{value}),renderControls(_objectSpread({value,setValue},percentageControlDefaults))]})};LinearPercentageIndicatorStory.displayName="LinearPercentageIndicatorStory";var LinearFractionIndicatorStory=()=>{var[value,setValue]=(0,react.useState)(.3);return(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)(LinearFractionIndicator,{value}),renderControls(_objectSpread({value,setValue},fractionControlDefaults))]})};LinearFractionIndicatorStory.displayName="LinearFractionIndicatorStory";var ExportedCircularPercentageIndicatorStory={name:"CircularPercentageIndicator",render:()=>(0,jsx_runtime.jsx)(CircularPercentageIndicatorStory,{})},ExportedCircularFractionIndicatorStory={name:"CirculaFractionIndicator",render:()=>(0,jsx_runtime.jsx)(CircularFractionIndicatorStory,{})},ExportedLinearPercentageIndicatorStory={name:"LinearPercentageIndicator",render:()=>(0,jsx_runtime.jsx)(LinearPercentageIndicatorStory,{})},ExportedLinearFractionIndicatorStory={name:"LinearFractionIndicator",render:()=>(0,jsx_runtime.jsx)(LinearFractionIndicatorStory,{})};const shared_components_proportion_indicator_ProportionIndicator_stories={title:"Components/Shared Components/ProportionIndicator"};ExportedCircularPercentageIndicatorStory.parameters=_objectSpread(_objectSpread({},ExportedCircularPercentageIndicatorStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_ExportedCircularPerc=ExportedCircularPercentageIndicatorStory.parameters)||void 0===_ExportedCircularPerc?void 0:_ExportedCircularPerc.docs),{},{source:_objectSpread({originalSource:"{\n  name: 'CircularPercentageIndicator',\n  render: () => <CircularPercentageIndicatorStory />\n}"},null===(_ExportedCircularPerc2=ExportedCircularPercentageIndicatorStory.parameters)||void 0===_ExportedCircularPerc2||null===(_ExportedCircularPerc2=_ExportedCircularPerc2.docs)||void 0===_ExportedCircularPerc2?void 0:_ExportedCircularPerc2.source)})}),ExportedCircularFractionIndicatorStory.parameters=_objectSpread(_objectSpread({},ExportedCircularFractionIndicatorStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_ExportedCircularFrac=ExportedCircularFractionIndicatorStory.parameters)||void 0===_ExportedCircularFrac?void 0:_ExportedCircularFrac.docs),{},{source:_objectSpread({originalSource:"{\n  name: 'CirculaFractionIndicator',\n  render: () => <CircularFractionIndicatorStory />\n}"},null===(_ExportedCircularFrac2=ExportedCircularFractionIndicatorStory.parameters)||void 0===_ExportedCircularFrac2||null===(_ExportedCircularFrac2=_ExportedCircularFrac2.docs)||void 0===_ExportedCircularFrac2?void 0:_ExportedCircularFrac2.source)})}),ExportedLinearPercentageIndicatorStory.parameters=_objectSpread(_objectSpread({},ExportedLinearPercentageIndicatorStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_ExportedLinearPercen=ExportedLinearPercentageIndicatorStory.parameters)||void 0===_ExportedLinearPercen?void 0:_ExportedLinearPercen.docs),{},{source:_objectSpread({originalSource:"{\n  name: 'LinearPercentageIndicator',\n  render: () => <LinearPercentageIndicatorStory />\n}"},null===(_ExportedLinearPercen2=ExportedLinearPercentageIndicatorStory.parameters)||void 0===_ExportedLinearPercen2||null===(_ExportedLinearPercen2=_ExportedLinearPercen2.docs)||void 0===_ExportedLinearPercen2?void 0:_ExportedLinearPercen2.source)})}),ExportedLinearFractionIndicatorStory.parameters=_objectSpread(_objectSpread({},ExportedLinearFractionIndicatorStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_ExportedLinearFracti=ExportedLinearFractionIndicatorStory.parameters)||void 0===_ExportedLinearFracti?void 0:_ExportedLinearFracti.docs),{},{source:_objectSpread({originalSource:"{\n  name: 'LinearFractionIndicator',\n  render: () => <LinearFractionIndicatorStory />\n}"},null===(_ExportedLinearFracti2=ExportedLinearFractionIndicatorStory.parameters)||void 0===_ExportedLinearFracti2||null===(_ExportedLinearFracti2=_ExportedLinearFracti2.docs)||void 0===_ExportedLinearFracti2?void 0:_ExportedLinearFracti2.source)})});var __namedExportsOrder=["ExportedCircularPercentageIndicatorStory","ExportedCircularFractionIndicatorStory","ExportedLinearPercentageIndicatorStory","ExportedLinearFractionIndicatorStory"]},"./src/shared/helpers/formatters/numberFormatter.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>formatNumber});__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"),__webpack_require__("./node_modules/core-js/modules/es.string.replace.js");var formatNumber=(input,options)=>Intl.NumberFormat("en-GB",options).format(input)},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/proportion-indicator/CircularProportionIndicator.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".grid__CircularProportionIndicator__k606N{display:inline-grid;grid-template-columns:repeat(2, auto);column-gap:var(--circular-proportion-indicator-label-distance, 20px);align-items:center}.diagram__CircularProportionIndicator__TF7nH{--_value: var(--circular-proportion-indicator-value, 0%);--_color-completed: var(--circular-proportion-indicator-value-color, #b7c0c8);--_color-remaining: var(--circular-proportion-indicator-background-color, #f1f2f4);width:var(--circular-proportion-indicator-size, 28px);height:var(--circular-proportion-indicator-size, 28px);border-radius:50%;background:conic-gradient(var(--_color-completed) 0, var(--_color-completed) var(--_value), var(--_color-remaining) var(--_value), var(--_color-remaining) 100%)}.label__CircularProportionIndicator__UJb5x{font-weight:300}","",{version:3,sources:["webpack://./src/shared/components/proportion-indicator/CircularProportionIndicator.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,0CACE,mBAAA,CACA,qCAAA,CACA,oEAAA,CACA,kBAAA,CAGF,6CACE,wDAAA,CACA,6EAAA,CACA,kFAAA,CACA,qDAAA,CACA,sDAAA,CACA,iBAAA,CACA,gKAAA,CAQF,2CACE,eCyDM",sourcesContent:["@import 'src/styles/common';\n\n.grid {\n  display: inline-grid;\n  grid-template-columns: repeat(2, auto);\n  column-gap: var(--circular-proportion-indicator-label-distance, 20px);\n  align-items: center;\n}\n\n.diagram {\n  --_value: var(--circular-proportion-indicator-value, 0%);\n  --_color-completed: var(--circular-proportion-indicator-value-color, #{$grey});\n  --_color-remaining: var(--circular-proportion-indicator-background-color, #{$light-grey});\n  width: var(--circular-proportion-indicator-size, 28px);\n  height: var(--circular-proportion-indicator-size, 28px);\n  border-radius: 50%;\n  background: conic-gradient(\n    var(--_color-completed) 0,\n    var(--_color-completed) var(--_value),\n    var(--_color-remaining) var(--_value),\n    var(--_color-remaining) 100%\n  );\n}\n\n.label {\n  font-weight: $light;\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",grid:"grid__CircularProportionIndicator__k606N",diagram:"diagram__CircularProportionIndicator__TF7nH",label:"label__CircularProportionIndicator__UJb5x"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/proportion-indicator/LinearProportionIndicator.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".grid__LinearProportionIndicator__xSq0L{display:inline-grid;grid-template-columns:repeat(2, auto);column-gap:var(--linear-proportion-indicator-label-distance, 18px);align-items:center}.diagram__LinearProportionIndicator__BKpCL{--_value: var(--linear-proportion-indicator-value, 0%);--_color-completed: var(--linear-proportion-indicator-value-color, #cc9933);--_color-remaining: var(--linear-proportion-indicator-background-color, #f1f2f4);width:var(--linear-proportion-indicator-size, 62px);height:var(--linear-proportion-indicator-size, 9px);background:linear-gradient(to right, var(--_color-completed) 0 var(--_value), var(--_color-remaining) var(--_value) 100%)}.label__LinearProportionIndicator__QHkj5{font-weight:300}","",{version:3,sources:["webpack://./src/shared/components/proportion-indicator/LinearProportionIndicator.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,wCACE,mBAAA,CACA,qCAAA,CACA,kEAAA,CACA,kBAAA,CAGF,2CACE,sDAAA,CACA,2EAAA,CACA,gFAAA,CACA,mDAAA,CACA,mDAAA,CACA,yHAAA,CAOF,yCACE,eC2DM",sourcesContent:["@import 'src/styles/common';\n\n.grid {\n  display: inline-grid;\n  grid-template-columns: repeat(2, auto);\n  column-gap: var(--linear-proportion-indicator-label-distance, 18px);\n  align-items: center;\n}\n\n.diagram {\n  --_value: var(--linear-proportion-indicator-value, 0%);\n  --_color-completed: var(--linear-proportion-indicator-value-color, #{$mustard});\n  --_color-remaining: var(--linear-proportion-indicator-background-color, #{$light-grey});\n  width: var(--linear-proportion-indicator-size, 62px);\n  height: var(--linear-proportion-indicator-size, 9px);\n  background: linear-gradient(\n    to right,\n    var(--_color-completed) 0 var(--_value),\n    var(--_color-remaining) var(--_value) 100%\n  );\n}\n\n.label {\n  font-weight: $light;\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",grid:"grid__LinearProportionIndicator__xSq0L",diagram:"diagram__LinearProportionIndicator__BKpCL",label:"label__LinearProportionIndicator__QHkj5"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/shared-components/proportion-indicator/ProportionIndicator.stories.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".controls__ProportionIndicator-stories__mW9Ex{margin-top:2rem}.controls__ProportionIndicator-stories__mW9Ex label{display:block}","",{version:3,sources:["webpack://./stories/shared-components/proportion-indicator/ProportionIndicator.stories.scss"],names:[],mappings:"AAAA,8CACE,eAAA,CAGF,oDACE,aAAA",sourcesContent:[".controls {\n  margin-top: 2rem;\n}\n\n.controls label {\n  display: block;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={controls:"controls__ProportionIndicator-stories__mW9Ex"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);