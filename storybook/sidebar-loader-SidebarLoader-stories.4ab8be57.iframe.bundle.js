/*! For license information please see sidebar-loader-SidebarLoader-stories.4ab8be57.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[4853],{"./stories/sidebar-loader/SidebarLoader.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{FullPageLoader:()=>FullPageLoader,__namedExportsOrder:()=>__namedExportsOrder,default:()=>stories_sidebar_loader_SidebarLoader_stories});__webpack_require__("./node_modules/core-js/modules/es.array.push.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/react/index.js");var loader=__webpack_require__("./src/shared/components/loader/index.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),SidebarLoader_stories=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/sidebar-loader/SidebarLoader.stories.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(SidebarLoader_stories.Z,options);const sidebar_loader_SidebarLoader_stories=SidebarLoader_stories.Z&&SidebarLoader_stories.Z.locals?SidebarLoader_stories.Z.locals:void 0;var _FullPageLoader$param,_FullPageLoader$param2,jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}const stories_sidebar_loader_SidebarLoader_stories={title:"Components/Shared Components/SidebarLoader"};var FullPageLoader=()=>(0,jsx_runtime.jsx)("div",{className:sidebar_loader_SidebarLoader_stories.fullPageWrapper,children:(0,jsx_runtime.jsx)(loader.J,{})});FullPageLoader.displayName="FullPageLoader",FullPageLoader.storyName="full-page",FullPageLoader.parameters=_objectSpread(_objectSpread({},FullPageLoader.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_FullPageLoader$param=FullPageLoader.parameters)||void 0===_FullPageLoader$param?void 0:_FullPageLoader$param.docs),{},{source:_objectSpread({originalSource:"() => <div className={styles.fullPageWrapper}>\n    <SidebarLoader />\n  </div>"},null===(_FullPageLoader$param2=FullPageLoader.parameters)||void 0===_FullPageLoader$param2||null===(_FullPageLoader$param2=_FullPageLoader$param2.docs)||void 0===_FullPageLoader$param2?void 0:_FullPageLoader$param2.source)})});var __namedExportsOrder=["FullPageLoader"]},"./src/shared/components/loader/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{B:()=>components_loader_CircleLoader,J:()=>components_loader_SidebarLoader});__webpack_require__("./node_modules/react/index.js");var classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),upperFirst=__webpack_require__("./node_modules/lodash/upperFirst.js"),upperFirst_default=__webpack_require__.n(upperFirst),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),CircleLoader=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/loader/CircleLoader.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(CircleLoader.Z,options);const loader_CircleLoader=CircleLoader.Z&&CircleLoader.Z.locals?CircleLoader.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),CircleLoader_CircleLoader=props=>{var _props$size,loaderSize=null!==(_props$size=props.size)&&void 0!==_props$size?_props$size:"default",className=classnames_default()(loader_CircleLoader.circleLoader,loader_CircleLoader["circleLoader".concat(upperFirst_default()(loaderSize))],props.className);return(0,jsx_runtime.jsx)("div",{className})};CircleLoader_CircleLoader.displayName="CircleLoader";const components_loader_CircleLoader=CircleLoader_CircleLoader;try{CircleLoader_CircleLoader.displayName="CircleLoader",CircleLoader_CircleLoader.__docgenInfo={description:"",displayName:"CircleLoader",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"small"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/loader/CircleLoader.tsx#CircleLoader"]={docgenInfo:CircleLoader_CircleLoader.__docgenInfo,name:"CircleLoader",path:"src/shared/components/loader/CircleLoader.tsx#CircleLoader"})}catch(__react_docgen_typescript_loader_error){}var SidebarLoader=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/loader/SidebarLoader.scss"),SidebarLoader_options={};SidebarLoader_options.styleTagTransform=styleTagTransform_default(),SidebarLoader_options.setAttributes=setAttributesWithoutAttributes_default(),SidebarLoader_options.insert=insertBySelector_default().bind(null,"head"),SidebarLoader_options.domAPI=styleDomAPI_default(),SidebarLoader_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(SidebarLoader.Z,SidebarLoader_options);const loader_SidebarLoader=SidebarLoader.Z&&SidebarLoader.Z.locals?SidebarLoader.Z.locals:void 0;var SidebarLoader_SidebarLoader=props=>{var className=classnames_default()(loader_SidebarLoader.sidebarLoader,props.className);return(0,jsx_runtime.jsxs)("div",{className,children:[(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.listHeading}),(0,jsx_runtime.jsxs)("section",{children:[(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.shortItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.shortItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.shortItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.shortItem})]}),(0,jsx_runtime.jsxs)("section",{children:[(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.shortItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.shortItem})]}),(0,jsx_runtime.jsxs)("section",{children:[(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.longItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.longItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.longItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.longItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.longItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.longItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.longItem}),(0,jsx_runtime.jsx)("div",{className:loader_SidebarLoader.longItem})]})]})};SidebarLoader_SidebarLoader.displayName="SidebarLoader";const components_loader_SidebarLoader=SidebarLoader_SidebarLoader;try{SidebarLoader_SidebarLoader.displayName="SidebarLoader",SidebarLoader_SidebarLoader.__docgenInfo={description:"",displayName:"SidebarLoader",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/loader/SidebarLoader.tsx#SidebarLoader"]={docgenInfo:SidebarLoader_SidebarLoader.__docgenInfo,name:"SidebarLoader",path:"src/shared/components/loader/SidebarLoader.tsx#SidebarLoader"})}catch(__react_docgen_typescript_loader_error){}},"./node_modules/classnames/index.js":(module,exports)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var hasOwn={}.hasOwnProperty;function classNames(){for(var classes=[],i=0;i<arguments.length;i++){var arg=arguments[i];if(arg){var argType=typeof arg;if("string"===argType||"number"===argType)classes.push(arg);else if(Array.isArray(arg)){if(arg.length){var inner=classNames.apply(null,arg);inner&&classes.push(inner)}}else if("object"===argType){if(arg.toString!==Object.prototype.toString&&!arg.toString.toString().includes("[native code]")){classes.push(arg.toString());continue}for(var key in arg)hasOwn.call(arg,key)&&arg[key]&&classes.push(key)}}}return classes.join(" ")}module.exports?(classNames.default=classNames,module.exports=classNames):void 0===(__WEBPACK_AMD_DEFINE_RESULT__=function(){return classNames}.apply(exports,[]))||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/core-js/internals/object-get-own-property-names.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var internalObjectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys-internal.js"),hiddenKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js").concat("length","prototype");exports.f=Object.getOwnPropertyNames||function getOwnPropertyNames(O){return internalObjectKeys(O,hiddenKeys)}},"./node_modules/core-js/modules/es.symbol.description.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),global=__webpack_require__("./node_modules/core-js/internals/global.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),hasOwn=__webpack_require__("./node_modules/core-js/internals/has-own-property.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),isPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-is-prototype-of.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),defineBuiltInAccessor=__webpack_require__("./node_modules/core-js/internals/define-built-in-accessor.js"),copyConstructorProperties=__webpack_require__("./node_modules/core-js/internals/copy-constructor-properties.js"),NativeSymbol=global.Symbol,SymbolPrototype=NativeSymbol&&NativeSymbol.prototype;if(DESCRIPTORS&&isCallable(NativeSymbol)&&(!("description"in SymbolPrototype)||void 0!==NativeSymbol().description)){var EmptyStringDescriptionStore={},SymbolWrapper=function Symbol(){var description=arguments.length<1||void 0===arguments[0]?void 0:toString(arguments[0]),result=isPrototypeOf(SymbolPrototype,this)?new NativeSymbol(description):void 0===description?NativeSymbol():NativeSymbol(description);return""===description&&(EmptyStringDescriptionStore[result]=!0),result};copyConstructorProperties(SymbolWrapper,NativeSymbol),SymbolWrapper.prototype=SymbolPrototype,SymbolPrototype.constructor=SymbolWrapper;var NATIVE_SYMBOL="Symbol(description detection)"===String(NativeSymbol("description detection")),thisSymbolValue=uncurryThis(SymbolPrototype.valueOf),symbolDescriptiveString=uncurryThis(SymbolPrototype.toString),regexp=/^Symbol\((.*)\)[^)]+$/,replace=uncurryThis("".replace),stringSlice=uncurryThis("".slice);defineBuiltInAccessor(SymbolPrototype,"description",{configurable:!0,get:function description(){var symbol=thisSymbolValue(this);if(hasOwn(EmptyStringDescriptionStore,symbol))return"";var string=symbolDescriptiveString(symbol),desc=NATIVE_SYMBOL?stringSlice(string,7,-1):replace(string,regexp,"$1");return""===desc?void 0:desc}}),$({global:!0,constructor:!0,forced:!0},{Symbol:SymbolWrapper})}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/loader/CircleLoader.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".circleLoader__CircleLoader__g3AnK{display:var(--circle-loader-display, inline-block);border-radius:100%;animation:loader-spin__CircleLoader__nFH1B 1.3s linear infinite;border-style:solid;border-color:#b7c0c8;border-top-color:#d90000}.circleLoaderDefault__CircleLoader__IavI6{width:var(--circle-loader-diameter, 40px);height:var(--circle-loader-diameter, 40px);border-width:var(--circle-loader-border-width, 3px)}.circleLoaderSmall__CircleLoader__GelE4{width:var(--circle-loader-diameter, 30px);height:var(--circle-loader-diameter, 30px);border-width:var(--circle-loader-border-width, 2px)}@keyframes loader-spin__CircleLoader__nFH1B{to{transform:rotate(360deg)}}","",{version:3,sources:["webpack://./src/shared/components/loader/CircleLoader.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,mCACE,kDAAA,CACA,kBAAA,CACA,+DAAA,CACA,kBAAA,CACA,oBC+BK,CD9BL,wBCkCI,CD/BN,0CACE,yCAAA,CACA,0CAAA,CACA,mDAAA,CAGF,wCACE,yCAAA,CACA,0CAAA,CACA,mDAAA,CAGF,4CACE,GACE,wBAAA,CAAA",sourcesContent:["@import 'src/styles/common';\n\n.circleLoader {\n  display: var(--circle-loader-display, inline-block);\n  border-radius: 100%;\n  animation: loader-spin 1.3s linear infinite;\n  border-style: solid;\n  border-color: $grey;\n  border-top-color: $red;\n}\n\n.circleLoaderDefault {\n  width: var(--circle-loader-diameter, 40px);\n  height: var(--circle-loader-diameter, 40px);\n  border-width: var(--circle-loader-border-width, 3px);\n}\n\n.circleLoaderSmall {\n  width: var(--circle-loader-diameter, 30px);\n  height: var(--circle-loader-diameter, 30px);\n  border-width: var(--circle-loader-border-width, 2px);\n}\n\n@keyframes loader-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",circleLoader:"circleLoader__CircleLoader__g3AnK","loader-spin":"loader-spin__CircleLoader__nFH1B",circleLoaderDefault:"circleLoaderDefault__CircleLoader__IavI6",circleLoaderSmall:"circleLoaderSmall__CircleLoader__GelE4"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/loader/SidebarLoader.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".sidebarLoader__SidebarLoader__bgQdN{box-sizing:border-box;display:flex;margin:12px 0 0 10px;flex-direction:column}.sidebarLoader__SidebarLoader__bgQdN section{margin-top:45px}.sidebarLoader__SidebarLoader__bgQdN div{background-color:#f1f2f4;border-radius:20px;height:9px;margin-bottom:10px;animation:fade-in__SidebarLoader__kkgIv .5s ease-in}.sidebarLoader__SidebarLoader__bgQdN .listHeading__SidebarLoader__ssRPs{width:50%}.sidebarLoader__SidebarLoader__bgQdN .shortItem__SidebarLoader__LPkWJ{width:70%}.sidebarLoader__SidebarLoader__bgQdN .longItem__SidebarLoader__hGRYr{width:85%}@keyframes fade-in__SidebarLoader__kkgIv{0%{opacity:.1}100%{opacity:1}}","",{version:3,sources:["webpack://./src/shared/components/loader/SidebarLoader.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,qCACE,qBAAA,CACA,YAAA,CACA,oBAAA,CACA,qBAAA,CAEA,6CACE,eAAA,CAGF,yCACE,wBCuBS,CDtBT,kBAAA,CACA,UAAA,CACA,kBAAA,CACA,mDAAA,CAGF,wEACE,SAAA,CAGF,sEACE,SAAA,CAGF,qEACE,SAAA,CAIJ,yCACE,GACE,UAAA,CAGF,KACE,SAAA,CAAA",sourcesContent:["@import 'src/styles/common';\n\n.sidebarLoader {\n  box-sizing: border-box;\n  display: flex;\n  margin: 12px 0 0 10px;\n  flex-direction: column;\n\n  section {\n    margin-top: 45px;\n  }\n\n  div {\n    background-color: $light-grey;\n    border-radius: 20px;\n    height: 9px;\n    margin-bottom: 10px;\n    animation: fade-in 0.5s ease-in;\n  }\n\n  .listHeading {\n    width: 50%;\n  }\n\n  .shortItem {\n    width: 70%;\n  }\n\n  .longItem {\n    width: 85%;\n  }\n}\n\n@keyframes fade-in {\n  0% {\n    opacity: 0.1;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",sidebarLoader:"sidebarLoader__SidebarLoader__bgQdN","fade-in":"fade-in__SidebarLoader__kkgIv",listHeading:"listHeading__SidebarLoader__ssRPs",shortItem:"shortItem__SidebarLoader__LPkWJ",longItem:"longItem__SidebarLoader__hGRYr"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/sidebar-loader/SidebarLoader.stories.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".fullPageWrapper__SidebarLoader-stories__UHBQm{border:1px solid #f1f2f4;padding:20px;height:500px;width:450px}","",{version:3,sources:["webpack://./stories/sidebar-loader/SidebarLoader.stories.scss"],names:[],mappings:"AAEA,+CACE,wBAAA,CACA,YAAA,CACA,YAAA,CACA,WAAA",sourcesContent:["@import 'src/styles/common';\n\n.fullPageWrapper {\n  border: 1px solid $light-grey;\n  padding: 20px;\n  height: 500px;\n  width: 450px;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",fullPageWrapper:"fullPageWrapper__SidebarLoader-stories__UHBQm"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/lodash/_asciiToArray.js":module=>{module.exports=function asciiToArray(string){return string.split("")}},"./node_modules/lodash/_baseSlice.js":module=>{module.exports=function baseSlice(array,start,end){var index=-1,length=array.length;start<0&&(start=-start>length?0:length+start),(end=end>length?length:end)<0&&(end+=length),length=start>end?0:end-start>>>0,start>>>=0;for(var result=Array(length);++index<length;)result[index]=array[index+start];return result}},"./node_modules/lodash/_castSlice.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseSlice=__webpack_require__("./node_modules/lodash/_baseSlice.js");module.exports=function castSlice(array,start,end){var length=array.length;return end=void 0===end?length:end,!start&&end>=length?array:baseSlice(array,start,end)}},"./node_modules/lodash/_createCaseFirst.js":(module,__unused_webpack_exports,__webpack_require__)=>{var castSlice=__webpack_require__("./node_modules/lodash/_castSlice.js"),hasUnicode=__webpack_require__("./node_modules/lodash/_hasUnicode.js"),stringToArray=__webpack_require__("./node_modules/lodash/_stringToArray.js"),toString=__webpack_require__("./node_modules/lodash/toString.js");module.exports=function createCaseFirst(methodName){return function(string){string=toString(string);var strSymbols=hasUnicode(string)?stringToArray(string):void 0,chr=strSymbols?strSymbols[0]:string.charAt(0),trailing=strSymbols?castSlice(strSymbols,1).join(""):string.slice(1);return chr[methodName]()+trailing}}},"./node_modules/lodash/_hasUnicode.js":module=>{var reHasUnicode=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");module.exports=function hasUnicode(string){return reHasUnicode.test(string)}},"./node_modules/lodash/_stringToArray.js":(module,__unused_webpack_exports,__webpack_require__)=>{var asciiToArray=__webpack_require__("./node_modules/lodash/_asciiToArray.js"),hasUnicode=__webpack_require__("./node_modules/lodash/_hasUnicode.js"),unicodeToArray=__webpack_require__("./node_modules/lodash/_unicodeToArray.js");module.exports=function stringToArray(string){return hasUnicode(string)?unicodeToArray(string):asciiToArray(string)}},"./node_modules/lodash/_unicodeToArray.js":module=>{var rsAstral="[\\ud800-\\udfff]",rsCombo="[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",rsFitz="\\ud83c[\\udffb-\\udfff]",rsNonAstral="[^\\ud800-\\udfff]",rsRegional="(?:\\ud83c[\\udde6-\\uddff]){2}",rsSurrPair="[\\ud800-\\udbff][\\udc00-\\udfff]",reOptMod="(?:"+rsCombo+"|"+rsFitz+")"+"?",rsSeq="[\\ufe0e\\ufe0f]?"+reOptMod+("(?:\\u200d(?:"+[rsNonAstral,rsRegional,rsSurrPair].join("|")+")[\\ufe0e\\ufe0f]?"+reOptMod+")*"),rsSymbol="(?:"+[rsNonAstral+rsCombo+"?",rsCombo,rsRegional,rsSurrPair,rsAstral].join("|")+")",reUnicode=RegExp(rsFitz+"(?="+rsFitz+")|"+rsSymbol+rsSeq,"g");module.exports=function unicodeToArray(string){return string.match(reUnicode)||[]}},"./node_modules/lodash/upperFirst.js":(module,__unused_webpack_exports,__webpack_require__)=>{var upperFirst=__webpack_require__("./node_modules/lodash/_createCaseFirst.js")("toUpperCase");module.exports=upperFirst},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);