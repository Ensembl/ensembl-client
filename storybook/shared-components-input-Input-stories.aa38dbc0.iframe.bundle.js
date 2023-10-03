"use strict";(self.webpackChunkensembl_new=self.webpackChunkensembl_new||[]).push([[2798],{"./stories/shared-components/input/Input.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{CustomInputStory:()=>Input_stories_CustomInputStory,FlatInputStory:()=>FlatInputStory,PlainInputStory:()=>PlainInputStory,ShadedInputStory:()=>ShadedInputStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>shared_components_input_Input_stories});__webpack_require__("./node_modules/core-js/modules/es.array.push.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js");var react=__webpack_require__("./node_modules/react/index.js"),Input=__webpack_require__("./src/shared/components/input/Input.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Input_stories=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/shared-components/input/Input.stories.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Input_stories.Z,options);const input_Input_stories=Input_stories.Z&&Input_stories.Z.locals?Input_stories.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),DefaultInputStory=()=>(0,jsx_runtime.jsx)("div",{className:input_Input_stories.wrapper,children:(0,jsx_runtime.jsx)(Input.Z,{placeholder:"Enter something..."})});DefaultInputStory.displayName="DefaultInputStory";var CustomInputStory=()=>(0,jsx_runtime.jsx)("div",{className:input_Input_stories.wrapper,children:(0,jsx_runtime.jsx)(Input.Z,{placeholder:"Enter something...",className:input_Input_stories.customizedInput})});CustomInputStory.displayName="CustomInputStory";__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.parse-int.js");var classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),ShadedInput=__webpack_require__("./src/shared/components/input/ShadedInput.tsx"),ShadedInputPlayground=()=>{var[inputSize,setInputSize]=(0,react.useState)("small"),[isDarkBackground,setIsDarkBackground]=(0,react.useState)(!1),[minLength,setMinLength]=(0,react.useState)(void 0),[withPlaceholder,setWithPlaceholder]=(0,react.useState)(!1),[withHelp,setWithHelp]=(0,react.useState)(!1),[isSearch,setIsSearch]=(0,react.useState)(!1),[isDisabled,setIsDisabled]=(0,react.useState)(!1),wrapperClasses=classnames_default()(input_Input_stories.shadedInputWrapper,{[input_Input_stories.greyStage]:isDarkBackground});return(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsxs)("div",{className:wrapperClasses,children:[(0,jsx_runtime.jsx)("h1",{children:"Shaded Input Playground"}),(0,jsx_runtime.jsx)(ShadedInput.Z,{size:inputSize,placeholder:withPlaceholder?"Type here....":void 0,minLength,help:withHelp?"Shows some text when hovered over":void 0,type:isSearch?"search":"text",disabled:isDisabled})]}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(Options,{withPlaceholder,setWithPlaceholder,inputSize,setInputSize,isDarkBackground,setIsDarkBackground,minLength,setMinLength,withHelp,setWithHelp,isSearch,setIsSearch,isDisabled,setIsDisabled})})]})};ShadedInputPlayground.displayName="ShadedInputPlayground";var Options=props=>{var[minLength,setMinLength]=(0,react.useState)(3);return(0,jsx_runtime.jsxs)("div",{className:input_Input_stories.shadedInputOptions,children:[(0,jsx_runtime.jsx)("h2",{children:"Options"}),(0,jsx_runtime.jsxs)("label",{children:["Against dark background",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:props.isDarkBackground,onChange:()=>props.setIsDarkBackground(!props.isDarkBackground)})]}),(0,jsx_runtime.jsxs)("label",{children:["Is large",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:"large"===props.inputSize,onChange:()=>{var nextSize="large"===props.inputSize?"small":"large";props.setInputSize(nextSize)}})]}),(0,jsx_runtime.jsxs)("label",{children:["Has placeholder",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:props.withPlaceholder,onChange:()=>props.setWithPlaceholder(!props.withPlaceholder)})]}),(0,jsx_runtime.jsxs)("label",{children:["With help",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:props.withHelp,onChange:()=>props.setWithHelp(!props.withHelp)})]}),(0,jsx_runtime.jsxs)("label",{children:["With clear button",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:props.isSearch,onChange:()=>props.setIsSearch(!props.isSearch)})]}),(0,jsx_runtime.jsxs)("label",{children:["With minimum input length",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:void 0!==props.minLength,onChange:()=>{props.minLength?props.setMinLength(void 0):props.setMinLength(minLength)}}),(0,jsx_runtime.jsx)("input",{type:"number",disabled:void 0===props.minLength,value:props.minLength,onChange:e=>{var value=parseInt(e.currentTarget.value);setMinLength(value),props.setMinLength(value)}})]}),(0,jsx_runtime.jsxs)("label",{children:["Is disabled",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:props.isDisabled,onChange:()=>props.setIsDisabled(!props.isDisabled)})]})]})};Options.displayName="Options";var useForwardedRef=__webpack_require__("./src/shared/hooks/useForwardedRef.ts"),useClearInput=__webpack_require__("./src/shared/components/input/useClearInput.ts"),useInputPlaceholder=__webpack_require__("./src/shared/components/input/useInputPlaceholder.ts"),CloseButton=__webpack_require__("./src/shared/components/close-button/CloseButton.tsx"),QuestionButton=__webpack_require__("./src/shared/components/question-button/QuestionButton.tsx"),input_Input=__webpack_require__("./src/shared/components/input/Input.scss"),_excluded=["className","disabled","help","type","placeholder"];function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var FlatInput=(props,ref)=>{var{className:classNameFromProps,disabled=!1,help,type="text",placeholder:placeholderFromProps}=props,otherProps=_objectWithoutProperties(props,_excluded),innerRef=(0,useForwardedRef.Z)(ref),{canClearInput,clearInput}=(0,useClearInput.Z)({ref:innerRef,inputType:type,help,minLength:props.minLength}),placeholder=(0,useInputPlaceholder.Z)(innerRef,placeholderFromProps),wrapperClasses=classnames_default()(input_Input.Z.flatInputWrapper,classNameFromProps,{[input_Input.Z.flatInputWrapperDisabled]:disabled}),rightCornerContent=null;return disabled?rightCornerContent=null:canClearInput?rightCornerContent=(0,jsx_runtime.jsx)(CloseButton.Z,{onClick:clearInput}):help&&(rightCornerContent=(0,jsx_runtime.jsx)(QuestionButton.Z,{helpText:help})),(0,jsx_runtime.jsxs)("div",{className:wrapperClasses,children:[(0,jsx_runtime.jsx)(Input.Z,_objectSpread({ref:innerRef,disabled,type:"search"===type?void 0:props.type,placeholder},otherProps)),rightCornerContent&&(0,jsx_runtime.jsx)("div",{className:input_Input.Z.rightCorner,children:rightCornerContent})]})};FlatInput.displayName="FlatInput";const input_FlatInput=(0,react.forwardRef)(FlatInput);try{FlatInput.displayName="FlatInput",FlatInput.__docgenInfo={description:"",displayName:"FlatInput",props:{help:{defaultValue:null,description:"",name:"help",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/input/FlatInput.tsx#FlatInput"]={docgenInfo:FlatInput.__docgenInfo,name:"FlatInput",path:"src/shared/components/input/FlatInput.tsx#FlatInput"})}catch(__react_docgen_typescript_loader_error){}var FlatInputPlayground=()=>{var[isDisabled,setIsDisabled]=(0,react.useState)(!1),[minLength,setMinLength]=(0,react.useState)(void 0),[withPlaceholder,setWithPlaceholder]=(0,react.useState)(!1),[withHelp,setWithHelp]=(0,react.useState)(!1),[isSearch,setIsSearch]=(0,react.useState)(!1),wrapperClasses=classnames_default()(input_Input_stories.flatInputWrapper,input_Input_stories.greyStage);return(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsxs)("div",{className:wrapperClasses,children:[(0,jsx_runtime.jsx)("h1",{children:"Flat Input Playground"}),(0,jsx_runtime.jsx)(input_FlatInput,{disabled:isDisabled,placeholder:withPlaceholder?"Type here....":void 0,minLength,help:withHelp?"Shows some text when hovered over":void 0,type:isSearch?"search":"text"})]}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(FlatInputStory_Options,{withPlaceholder,setWithPlaceholder,isDisabled,setIsDisabled,minLength,setMinLength,withHelp,setWithHelp,isSearch,setIsSearch})})]})};FlatInputPlayground.displayName="FlatInputPlayground";var _PlainInputStory$para,_PlainInputStory$para2,_ShadedInputStory$par,_ShadedInputStory$par2,_FlatInputStory$param,_FlatInputStory$param2,_CustomInputStory$par,_CustomInputStory$par2,FlatInputStory_Options=props=>{var[minLength,setMinLength]=(0,react.useState)(3);return(0,jsx_runtime.jsxs)("div",{className:input_Input_stories.shadedInputOptions,children:[(0,jsx_runtime.jsx)("h2",{children:"Options"}),(0,jsx_runtime.jsxs)("label",{children:["Has placeholder",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:props.withPlaceholder,onChange:()=>props.setWithPlaceholder(!props.withPlaceholder)})]}),(0,jsx_runtime.jsxs)("label",{children:["With help",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:props.withHelp,onChange:()=>props.setWithHelp(!props.withHelp)})]}),(0,jsx_runtime.jsxs)("label",{children:["With clear button",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:props.isSearch,onChange:()=>props.setIsSearch(!props.isSearch)})]}),(0,jsx_runtime.jsxs)("label",{children:["With minimum input length",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:void 0!==props.minLength,onChange:()=>{props.minLength?props.setMinLength(void 0):props.setMinLength(minLength)}}),(0,jsx_runtime.jsx)("input",{type:"number",disabled:void 0===props.minLength,value:props.minLength,onChange:e=>{var value=parseInt(e.currentTarget.value);setMinLength(value),props.setMinLength(value)}})]}),(0,jsx_runtime.jsxs)("label",{children:["Is disabled",(0,jsx_runtime.jsx)("input",{type:"checkbox",checked:props.isDisabled,onChange:()=>props.setIsDisabled(!props.isDisabled)})]})]})};function Input_stories_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function Input_stories_objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?Input_stories_ownKeys(Object(t),!0).forEach((function(r){Input_stories_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):Input_stories_ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function Input_stories_defineProperty(obj,key,value){return(key=function Input_stories_toPropertyKey(arg){var key=function Input_stories_toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}FlatInputStory_Options.displayName="Options";var PlainInputStory={name:"Input",render:()=>(0,jsx_runtime.jsx)(DefaultInputStory,{})},ShadedInputStory={name:"ShadedInput",render:()=>(0,jsx_runtime.jsx)(ShadedInputPlayground,{})},FlatInputStory={name:"FlatInput",render:()=>(0,jsx_runtime.jsx)(FlatInputPlayground,{})},Input_stories_CustomInputStory={name:"Customised Input",render:()=>(0,jsx_runtime.jsx)(CustomInputStory,{})};const shared_components_input_Input_stories={title:"Components/Shared Components/Input"};PlainInputStory.parameters=Input_stories_objectSpread(Input_stories_objectSpread({},PlainInputStory.parameters),{},{docs:Input_stories_objectSpread(Input_stories_objectSpread({},null===(_PlainInputStory$para=PlainInputStory.parameters)||void 0===_PlainInputStory$para?void 0:_PlainInputStory$para.docs),{},{source:Input_stories_objectSpread({originalSource:"{\n  name: 'Input',\n  render: () => <SimpleInputStories.DefaultInputStory />\n}"},null===(_PlainInputStory$para2=PlainInputStory.parameters)||void 0===_PlainInputStory$para2||null===(_PlainInputStory$para2=_PlainInputStory$para2.docs)||void 0===_PlainInputStory$para2?void 0:_PlainInputStory$para2.source)})}),ShadedInputStory.parameters=Input_stories_objectSpread(Input_stories_objectSpread({},ShadedInputStory.parameters),{},{docs:Input_stories_objectSpread(Input_stories_objectSpread({},null===(_ShadedInputStory$par=ShadedInputStory.parameters)||void 0===_ShadedInputStory$par?void 0:_ShadedInputStory$par.docs),{},{source:Input_stories_objectSpread({originalSource:"{\n  name: 'ShadedInput',\n  render: () => <ShadedInputPlayground />\n}"},null===(_ShadedInputStory$par2=ShadedInputStory.parameters)||void 0===_ShadedInputStory$par2||null===(_ShadedInputStory$par2=_ShadedInputStory$par2.docs)||void 0===_ShadedInputStory$par2?void 0:_ShadedInputStory$par2.source)})}),FlatInputStory.parameters=Input_stories_objectSpread(Input_stories_objectSpread({},FlatInputStory.parameters),{},{docs:Input_stories_objectSpread(Input_stories_objectSpread({},null===(_FlatInputStory$param=FlatInputStory.parameters)||void 0===_FlatInputStory$param?void 0:_FlatInputStory$param.docs),{},{source:Input_stories_objectSpread({originalSource:"{\n  name: 'FlatInput',\n  render: () => <FlatInputPlayground />\n}"},null===(_FlatInputStory$param2=FlatInputStory.parameters)||void 0===_FlatInputStory$param2||null===(_FlatInputStory$param2=_FlatInputStory$param2.docs)||void 0===_FlatInputStory$param2?void 0:_FlatInputStory$param2.source)})}),Input_stories_CustomInputStory.parameters=Input_stories_objectSpread(Input_stories_objectSpread({},Input_stories_CustomInputStory.parameters),{},{docs:Input_stories_objectSpread(Input_stories_objectSpread({},null===(_CustomInputStory$par=Input_stories_CustomInputStory.parameters)||void 0===_CustomInputStory$par?void 0:_CustomInputStory$par.docs),{},{source:Input_stories_objectSpread({originalSource:"{\n  name: 'Customised Input',\n  render: () => <SimpleInputStories.CustomInputStory />\n}"},null===(_CustomInputStory$par2=Input_stories_CustomInputStory.parameters)||void 0===_CustomInputStory$par2||null===(_CustomInputStory$par2=_CustomInputStory$par2.docs)||void 0===_CustomInputStory$par2?void 0:_CustomInputStory$par2.source)})});var __namedExportsOrder=["PlainInputStory","ShadedInputStory","FlatInputStory","CustomInputStory"]},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/shared-components/input/Input.stories.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".greyStage__Input-stories__sF3ya{background-color:#f1f2f4}.customizedInput__Input-stories__HYibT{color:#bc8f8f;font-size:36px;font-weight:bold;padding:16px}.shadedInputWrapper__Input-stories__F0BBr{max-width:450px;padding:2rem;padding-bottom:3rem}.shadedInputOptions__Input-stories__pWMy3{display:flex;flex-direction:column}.shadedInputOptions__Input-stories__pWMy3 input[type=number]{width:6ch}.shadedInputOptions__Input-stories__pWMy3 label{display:flex;align-items:center;column-gap:.4rem;-webkit-user-select:none;user-select:none}.flatInputWrapper__Input-stories__Uzp2j{max-width:320px;padding:2rem;padding-bottom:3rem}","",{version:3,sources:["webpack://./stories/shared-components/input/Input.stories.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,iCACE,wBCiCW,CD9Bb,uCACE,aAAA,CACA,cAAA,CACA,gBAAA,CACA,YAAA,CAGF,0CACE,eAAA,CACA,YAAA,CACA,mBAAA,CAGF,0CACE,YAAA,CACA,qBAAA,CAGF,6DACE,SAAA,CAGF,gDACE,YAAA,CACA,kBAAA,CACA,gBAAA,CACA,wBAAA,CAAA,gBAAA,CAGF,wCACE,eAAA,CACA,YAAA,CACA,mBAAA",sourcesContent:["@import 'src/styles/common';\n\n.greyStage {\n  background-color: $light-grey;\n}\n\n.customizedInput {\n  color: rosybrown;\n  font-size: 36px;\n  font-weight: bold;\n  padding: 16px;\n}\n\n.shadedInputWrapper {\n  max-width: 450px;\n  padding: 2rem;\n  padding-bottom: 3rem;\n}\n\n.shadedInputOptions {\n  display: flex;\n  flex-direction: column;\n}\n\n.shadedInputOptions input[type=\"number\"] {\n  width: 6ch;\n}\n\n.shadedInputOptions label {\n  display: flex;\n  align-items: center;\n  column-gap: 0.4rem;\n  user-select: none;\n}\n\n.flatInputWrapper {\n  max-width: 320px;\n  padding: 2rem;\n  padding-bottom: 3rem;\n}","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",greyStage:"greyStage__Input-stories__sF3ya",customizedInput:"customizedInput__Input-stories__HYibT",shadedInputWrapper:"shadedInputWrapper__Input-stories__F0BBr",shadedInputOptions:"shadedInputOptions__Input-stories__pWMy3",flatInputWrapper:"flatInputWrapper__Input-stories__Uzp2j"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);