"use strict";(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[674],{"./src/shared/components/close-button/CloseButton.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>components_close_button_CloseButton});var _circle,react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const icon_close=props=>react.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",style:{enableBackground:"new 0 0 32 32"},viewBox:"0 0 32 32"},props),_circle||(_circle=react.createElement("circle",{cx:16,cy:16,r:15})),react.createElement("path",{d:"m18.6 16 5.1-5.1c.3-.3.3-.9 0-1.2l-1.4-1.4c-.3-.3-.9-.3-1.2 0L16 13.4l-5.1-5.1c-.3-.3-.9-.3-1.2 0L8.2 9.7c-.3.3-.3.9 0 1.2l5.1 5.1-5.1 5.1c-.3.3-.3.9 0 1.2l1.4 1.4c.3.3.9.3 1.2 0l5.1-5.1 5.1 5.1c.3.3.9.3 1.2 0l1.4-1.4c.3-.3.3-.9 0-1.2l-5-5.1z",style:{fill:"#fff"}}));var injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),CloseButton=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/close-button/CloseButton.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(CloseButton.Z,options);const close_button_CloseButton=CloseButton.Z&&CloseButton.Z.locals?CloseButton.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),CloseButton_CloseButton=props=>{var className=classnames_default()(close_button_CloseButton.closeButton,props.className);return(0,jsx_runtime.jsx)("button",{type:"button",className,onClick:props.onClick,children:(0,jsx_runtime.jsx)(icon_close,{className:close_button_CloseButton.icon})})};CloseButton_CloseButton.displayName="CloseButton";const components_close_button_CloseButton=CloseButton_CloseButton;try{CloseButton_CloseButton.displayName="CloseButton",CloseButton_CloseButton.__docgenInfo={description:"",displayName:"CloseButton",props:{onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/close-button/CloseButton.tsx#CloseButton"]={docgenInfo:CloseButton_CloseButton.__docgenInfo,name:"CloseButton",path:"src/shared/components/close-button/CloseButton.tsx#CloseButton"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/input/Input.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__),_Input_scss__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/shared/components/input/Input.scss"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/react/jsx-runtime.js");function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var Input=(props,ref)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input",function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}({className:classnames__WEBPACK_IMPORTED_MODULE_4___default()(_Input_scss__WEBPACK_IMPORTED_MODULE_5__.Z.input,props.className),ref,spellCheck:!1},props));Input.displayName="Input";const __WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_3__.forwardRef)(Input);try{Input.displayName="Input",Input.__docgenInfo={description:"",displayName:"Input",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/input/Input.tsx#Input"]={docgenInfo:Input.__docgenInfo,name:"Input",path:"src/shared/components/input/Input.tsx#Input"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/input/ShadedInput.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__),src_shared_hooks_useForwardedRef__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/shared/hooks/useForwardedRef.ts"),_useClearInput__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/shared/components/input/useClearInput.ts"),_useInputPlaceholder__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/shared/components/input/useInputPlaceholder.ts"),_Input__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/shared/components/input/Input.tsx"),src_shared_components_close_button_CloseButton__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/shared/components/close-button/CloseButton.tsx"),src_shared_components_question_button_QuestionButton__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./src/shared/components/question-button/QuestionButton.tsx"),_Input_scss__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./src/shared/components/input/Input.scss"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_excluded=["className","disabled","size","help","type","placeholder"];function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var ShadedInput=(props,ref)=>{var{className:classNameFromProps,disabled=!1,size,help,type="text",placeholder:placeholderFromProps}=props,otherProps=_objectWithoutProperties(props,_excluded),innerRef=(0,src_shared_hooks_useForwardedRef__WEBPACK_IMPORTED_MODULE_5__.Z)(ref),{canClearInput,clearInput}=(0,_useClearInput__WEBPACK_IMPORTED_MODULE_6__.Z)({ref:innerRef,inputType:type,help,minLength:props.minLength}),placeholder=(0,_useInputPlaceholder__WEBPACK_IMPORTED_MODULE_7__.Z)(innerRef,placeholderFromProps),wrapperClasses=classnames__WEBPACK_IMPORTED_MODULE_4___default()(_Input_scss__WEBPACK_IMPORTED_MODULE_11__.Z.shadedInputWrapper,classNameFromProps,{[_Input_scss__WEBPACK_IMPORTED_MODULE_11__.Z.shadedInputDisabled]:disabled,[_Input_scss__WEBPACK_IMPORTED_MODULE_11__.Z.shadedInputWrapperLarge]:"large"===size,[_Input_scss__WEBPACK_IMPORTED_MODULE_11__.Z.shadedInputWrapperSmall]:"small"===size}),rightCornerContent=null;return canClearInput?rightCornerContent=(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(src_shared_components_close_button_CloseButton__WEBPACK_IMPORTED_MODULE_9__.Z,{onClick:clearInput}):help&&(rightCornerContent=(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(src_shared_components_question_button_QuestionButton__WEBPACK_IMPORTED_MODULE_10__.Z,{styleOption:"in-input-field",helpText:help})),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div",{className:wrapperClasses,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_Input__WEBPACK_IMPORTED_MODULE_8__.Z,_objectSpread({ref:innerRef,disabled,type:"search"===type?void 0:props.type,placeholder},otherProps)),!disabled&&rightCornerContent&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div",{className:_Input_scss__WEBPACK_IMPORTED_MODULE_11__.Z.rightCorner,children:rightCornerContent})]})};ShadedInput.displayName="ShadedInput";const __WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_3__.forwardRef)(ShadedInput);try{ShadedInput.displayName="ShadedInput",ShadedInput.__docgenInfo={description:"",displayName:"ShadedInput",props:{size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"small"'},{value:'"large"'}]}},help:{defaultValue:null,description:"",name:"help",required:!1,type:{name:"ReactNode"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/input/ShadedInput.tsx#ShadedInput"]={docgenInfo:ShadedInput.__docgenInfo,name:"ShadedInput",path:"src/shared/components/input/ShadedInput.tsx#ShadedInput"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/input/useClearInput.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js");const __WEBPACK_DEFAULT_EXPORT__=_ref=>{var{ref,inputType,help,minLength}=_ref,[isClearable,setIsClearable]=(0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(!1);(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>{if(ref.current){var inputElement=ref.current,initialInputValue=inputElement.value;return setIsClearable(canUseClear(initialInputValue)),"search"===inputType&&inputElement.addEventListener("input",onInput),()=>inputElement.removeEventListener("input",onInput)}}),[ref.current,inputType,minLength]);var onInput=event=>{var inputValue=event.currentTarget.value;setIsClearable(canUseClear(inputValue))},canUseClear=inputValue=>{var shouldPreferHelp=help&&minLength&&inputValue.length<minLength;return"search"===inputType&&!!inputValue.length&&!shouldPreferHelp};return{canClearInput:isClearable,clearInput:()=>{var inputElement=null==ref?void 0:ref.current;inputElement&&(inputElement.value="",inputElement.dispatchEvent(new Event("input",{bubbles:!0})),inputElement.dispatchEvent(new Event("change",{bubbles:!0})),inputElement.focus())}}}},"./src/shared/components/input/useInputPlaceholder.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>input_useInputPlaceholder});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react=__webpack_require__("./node_modules/react/index.js");const input_useInputFocus=ref=>{var[isFocused,setIsFocused]=(0,react.useState)(!1);(0,react.useEffect)((()=>{if(ref.current){var inputElement=ref.current;return inputElement.addEventListener("focus",onFocus),inputElement.addEventListener("blur",onBlur),()=>{inputElement.removeEventListener("focus",onFocus),inputElement.removeEventListener("blur",onBlur)}}}),[ref.current]);var onFocus=()=>setIsFocused(!0),onBlur=()=>setIsFocused(!1);return isFocused};const input_useInputPlaceholder=(ref,placeholder)=>{var isFocused=input_useInputFocus(ref);return placeholder&&!isFocused?placeholder:void 0}},"./src/shared/hooks/useForwardedRef.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const __WEBPACK_DEFAULT_EXPORT__=ref=>{var innerRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{ref&&("function"==typeof ref?ref(innerRef.current):ref.current=innerRef.current)})),innerRef}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/close-button/CloseButton.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".closeButton__CloseButton__gcSj3{width:var(--close-button-size, 16px);height:var(--close-button-size, 16px);border-radius:100%;cursor:pointer}.icon__CloseButton__WWUYC{width:100%;height:100%;font-size:0}.icon__CloseButton__WWUYC circle{fill:#09f}.icon__CloseButton__WWUYC path{fill:#fff}","",{version:3,sources:["webpack://./src/shared/components/close-button/CloseButton.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,iCACE,oCAAA,CACA,qCAAA,CACA,kBAAA,CACA,cAAA,CAGF,0BACE,UAAA,CACA,WAAA,CACA,WAAA,CAEA,iCACE,SCcG,CDXL,+BACE,SAAA",sourcesContent:["@import 'src/styles/common';\n\n.closeButton {\n  width: var(--close-button-size, 16px);\n  height: var(--close-button-size, 16px);\n  border-radius: 100%;\n  cursor: pointer;\n}\n\n.icon {\n  width: 100%;\n  height: 100%;\n  font-size: 0; // to make the height of the svg independent on font-size settings\n\n  circle {\n    fill: $blue;\n  }\n\n  path {\n    fill: white;\n  }\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",closeButton:"closeButton__CloseButton__gcSj3",icon:"icon__CloseButton__WWUYC"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/input/Input.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".input__Input__Ixh8M::placeholder{font-weight:300}.input__Input__Ixh8M:focus,.input__Input__Ixh8M:active{outline:none}.rightCorner__Input__HaOdr{display:flex;align-items:center;flex:0 0 auto}.flatInputWrapper__Input__LXcdl,.shadedInputWrapper__Input__QrBGA{display:inline-flex}.flatInputWrapper__Input__LXcdl input,.shadedInputWrapper__Input__QrBGA input{background-color:rgba(0,0,0,0);flex-grow:1;border:none}.shadedInputWrapper__Input__QrBGA{border:none;box-shadow:inset 2px 2px 4px -2px #9aa7b1,inset -2px -2px 1px -2px #6f8190;background-color:var(--shaded-input-background-colour, #fff);padding:var(--shaded-input-padding, 0 15px);height:var(--shaded-input-height, 30px);width:var(--shaded-input-width, 100%)}.shadedInputWrapperLarge__Input__scpZf{--shaded-input-padding: 0 20px;--shaded-input-height: 40px;--question-button-size: 16px;--close-button-size: 16px}.shadedInputWrapperSmall__Input__KJea3{--question-button-size: 12px;--close-button-size: 12px}.shadedInputDisabled__Input__JmI1x{background-color:#f1f2f4}.flatInputWrapper__Input__LXcdl{background-color:var(--flat-input-background-colour, #fff);padding:0 15px;height:25px;width:var(--flat-input-width, 100%);--question-button-size: 12px;--close-button-size: 12px}.flatInputWrapperDisabled__Input__fxjs1{border:1px solid #b7c0c8;background-color:rgba(0,0,0,0)}","",{version:3,sources:["webpack://./src/shared/components/input/Input.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAGE,kCACE,eC8EI,CD3EN,uDAEE,YAAA,CAIJ,2BACE,YAAA,CACA,kBAAA,CACA,aAAA,CAGF,kEACE,mBAAA,CAEA,8EACE,8BAAA,CACA,WAAA,CACA,WAAA,CAIJ,kCACE,WAAA,CACA,0ECuBkB,CDtBlB,4DAAA,CACA,2CAAA,CACA,uCAAA,CACA,qCAAA,CAEA,uCACE,8BAAA,CACA,2BAAA,CACA,4BAAA,CACA,yBAAA,CAGF,uCACE,4BAAA,CACA,yBAAA,CAIJ,mCACE,wBCfW,CDkBb,gCACE,0DAAA,CACA,cAAA,CACA,WAAA,CACA,mCAAA,CACA,4BAAA,CACA,yBAAA,CAEA,wCACE,wBAAA,CACA,8BAAA",sourcesContent:["@import 'src/styles/common';\n\n.input {\n  &::placeholder {\n    font-weight: $light;\n  }\n\n  &:focus,\n  &:active {\n    outline: none;\n  }\n}\n\n.rightCorner {\n  display: flex;\n  align-items: center;\n  flex: 0 0 auto;\n}\n\n.flatInputWrapper, .shadedInputWrapper {\n  display: inline-flex;\n\n  input {\n    background-color: transparent;\n    flex-grow: 1;\n    border: none;\n  }\n}\n\n.shadedInputWrapper {\n  border: none;\n  box-shadow: $form-field-shadow;\n  background-color: var(--shaded-input-background-colour, $white);\n  padding: var(--shaded-input-padding, 0 15px);\n  height: var(--shaded-input-height, 30px);\n  width: var(--shaded-input-width, 100%);\n\n  &Large {\n    --shaded-input-padding: 0 20px;\n    --shaded-input-height: 40px;\n    --question-button-size: 16px;\n    --close-button-size: 16px;\n  }\n\n  &Small {\n    --question-button-size: 12px;\n    --close-button-size: 12px;\n  }\n}\n\n.shadedInputDisabled {\n  background-color: $light-grey;\n}\n\n.flatInputWrapper {\n  background-color: var(--flat-input-background-colour, $white);\n  padding: 0 15px;\n  height: 25px;\n  width: var(--flat-input-width, 100%);\n  --question-button-size: 12px;\n  --close-button-size: 12px;\n\n  &Disabled {\n    border: 1px solid $grey;\n    background-color: transparent;\n  }\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",input:"input__Input__Ixh8M",rightCorner:"rightCorner__Input__HaOdr",flatInputWrapper:"flatInputWrapper__Input__LXcdl",shadedInputWrapper:"shadedInputWrapper__Input__QrBGA",shadedInputWrapperLarge:"shadedInputWrapperLarge__Input__scpZf",shadedInputWrapperSmall:"shadedInputWrapperSmall__Input__KJea3",shadedInputDisabled:"shadedInputDisabled__Input__JmI1x",flatInputWrapperDisabled:"flatInputWrapperDisabled__Input__fxjs1"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/shared/components/input/Input.scss":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__),_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__),_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__),_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Input_scss__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/input/Input.scss"),options={};options.styleTagTransform=_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default(),options.setAttributes=_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default(),options.insert=_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null,"head"),options.domAPI=_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default(),options.insertStyleElement=_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default();_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Input_scss__WEBPACK_IMPORTED_MODULE_6__.Z,options);const __WEBPACK_DEFAULT_EXPORT__=_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Input_scss__WEBPACK_IMPORTED_MODULE_6__.Z&&_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Input_scss__WEBPACK_IMPORTED_MODULE_6__.Z.locals?_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Input_scss__WEBPACK_IMPORTED_MODULE_6__.Z.locals:void 0}}]);