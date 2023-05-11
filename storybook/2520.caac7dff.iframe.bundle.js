"use strict";(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[2520],{"./src/shared/components/question-button/QuestionButton.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>components_question_button_QuestionButton});var _path,_path2,react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),useShowTooltip=__webpack_require__("./src/shared/hooks/useShowTooltip.ts"),Tooltip=__webpack_require__("./src/shared/components/tooltip/Tooltip.tsx");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const icon_question_circle=props=>react.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",style:{enableBackground:"new 0 0 32 32"},viewBox:"0 0 32 32"},props),_path||(_path=react.createElement("path",{d:"M18.3 22.9c0 1.5-1.2 2.6-2.6 2.6s-2.6-1.2-2.6-2.6 1.2-2.6 2.6-2.6 2.6 1.1 2.6 2.6zm4-10.9c0 4.2-4.5 4.2-4.5 5.8v.4c0 .4-.3.8-.8.8h-2.9c-.4 0-.8-.3-.8-.8v-.5c0-2.2 1.7-3.1 3-3.8 1.1-.6 1.8-1 1.8-1.8 0-1.1-1.4-1.8-2.5-1.8-1.5 0-2.1.7-3 1.8-.3.3-.7.4-1 .1L10 10.9c-.3-.3-.4-.7-.2-1 1.5-2.2 3.4-3.4 6.3-3.4 3 0 6.2 2.4 6.2 5.5z"})),_path2||(_path2=react.createElement("path",{d:"M16 31C7.7 31 1 24.3 1 16S7.7 1 16 1s15 6.7 15 15-6.7 15-15 15zm0-27.3C9.2 3.7 3.7 9.2 3.7 16c0 6.8 5.5 12.3 12.3 12.3 6.8 0 12.3-5.5 12.3-12.3 0-6.8-5.5-12.3-12.3-12.3z"})));var injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),QuestionButton=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/question-button/QuestionButton.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(QuestionButton.Z,options);const question_button_QuestionButton=QuestionButton.Z&&QuestionButton.Z.locals?QuestionButton.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),QuestionButton_QuestionButton=props=>{var _props$className,_props$className2,{helpText,styleOption="inline"}=props,{elementRef,onClick,onTooltipCloseSignal,shouldShowTooltip}=(0,useShowTooltip.S)();if(!helpText)return null;var className=classnames_default()(question_button_QuestionButton.questionButton,{[question_button_QuestionButton[styleOption]]:styleOption},null===(_props$className=props.className)||void 0===_props$className?void 0:_props$className.inline,null===(_props$className2=props.className)||void 0===_props$className2?void 0:_props$className2["in-input-field"]);return(0,jsx_runtime.jsxs)("div",{ref:elementRef,className,onClick,children:[(0,jsx_runtime.jsx)(icon_question_circle,{}),shouldShowTooltip&&(0,jsx_runtime.jsx)(Tooltip.Z,{anchor:elementRef.current,autoAdjust:!0,onClose:onTooltipCloseSignal,delay:0,children:helpText})]})};QuestionButton_QuestionButton.displayName="QuestionButton";const components_question_button_QuestionButton=QuestionButton_QuestionButton;try{QuestionButton_QuestionButton.displayName="QuestionButton",QuestionButton_QuestionButton.__docgenInfo={description:"",displayName:"QuestionButton",props:{helpText:{defaultValue:null,description:"",name:"helpText",required:!0,type:{name:"ReactNode"}},styleOption:{defaultValue:null,description:"",name:"styleOption",required:!1,type:{name:"enum",value:[{value:'"inline"'},{value:'"in-input-field"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"Partial<Record<QuestionButtonStyleOption, string>>"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/question-button/QuestionButton.tsx#QuestionButton"]={docgenInfo:QuestionButton_QuestionButton.__docgenInfo,name:"QuestionButton",path:"src/shared/components/question-button/QuestionButton.tsx#QuestionButton"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/tooltip/Tooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>components_tooltip_Tooltip});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var react=__webpack_require__("./node_modules/react/index.js"),tooltip_constants=__webpack_require__("./src/shared/components/tooltip/tooltip-constants.ts"),PointerBox=__webpack_require__("./src/shared/components/pointer-box/PointerBox.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Tooltip=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/tooltip/Tooltip.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Tooltip.Z,options);const tooltip_Tooltip=Tooltip.Z&&Tooltip.Z.locals?Tooltip.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var Tooltip_Tooltip=props=>props.anchor?(0,jsx_runtime.jsx)(TooltipWithAnchor,function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}({},props)):null,TooltipWithAnchor=props=>{var _props$position,timeoutId,[isWaiting,setIsWaiting]=(0,react.useState)(!0),{delay=tooltip_constants.W}=props;return(0,react.useEffect)((()=>(timeoutId=setTimeout((()=>{setIsWaiting(!1)}),delay),()=>clearTimeout(timeoutId))),[]),isWaiting||!props.children?null:(0,jsx_runtime.jsx)(PointerBox.Z,{position:null!==(_props$position=props.position)&&void 0!==_props$position?_props$position:PointerBox.L.BOTTOM_RIGHT,anchor:props.anchor,container:props.container,autoAdjust:props.autoAdjust,renderInsideAnchor:props.renderInsideAnchor,onClose:props.onClose,classNames:{box:tooltip_Tooltip.tooltip,pointer:tooltip_Tooltip.tooltipTip},onOutsideClick:props.onClose,children:props.children})};TooltipWithAnchor.displayName="TooltipWithAnchor";const components_tooltip_Tooltip=Tooltip_Tooltip;try{TOOLTIP_TIMEOUT.displayName="TOOLTIP_TIMEOUT",TOOLTIP_TIMEOUT.__docgenInfo={description:'See the NOTICE file distributed with this work for additional information\nregarding copyright ownership.\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.',displayName:"TOOLTIP_TIMEOUT",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/tooltip/Tooltip.tsx#TOOLTIP_TIMEOUT"]={docgenInfo:TOOLTIP_TIMEOUT.__docgenInfo,name:"TOOLTIP_TIMEOUT",path:"src/shared/components/tooltip/Tooltip.tsx#TOOLTIP_TIMEOUT"})}catch(__react_docgen_typescript_loader_error){}try{Tooltip_Tooltip.displayName="Tooltip",Tooltip_Tooltip.__docgenInfo={description:"",displayName:"Tooltip",props:{position:{defaultValue:null,description:"",name:"position",required:!1,type:{name:"enum",value:[{value:'"top_left"'},{value:'"top_right"'},{value:'"right_top"'},{value:'"right_bottom"'},{value:'"bottom_right"'},{value:'"bottom_left"'},{value:'"left_bottom"'},{value:'"left_top"'}]}},container:{defaultValue:null,description:"",name:"container",required:!1,type:{name:"HTMLElement | null"}},autoAdjust:{defaultValue:null,description:"",name:"autoAdjust",required:!1,type:{name:"boolean"}},delay:{defaultValue:null,description:"",name:"delay",required:!1,type:{name:"number"}},renderInsideAnchor:{defaultValue:null,description:"",name:"renderInsideAnchor",required:!1,type:{name:"boolean"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void)"}},anchor:{defaultValue:null,description:"",name:"anchor",required:!0,type:{name:"HTMLElement | null"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/tooltip/Tooltip.tsx#Tooltip"]={docgenInfo:Tooltip_Tooltip.__docgenInfo,name:"Tooltip",path:"src/shared/components/tooltip/Tooltip.tsx#Tooltip"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/tooltip/tooltip-constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{W:()=>TOOLTIP_TIMEOUT});var TOOLTIP_TIMEOUT=800},"./src/shared/hooks/useHover.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useHover});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js");function useHover(){var[isHovering,setIsHovering]=(0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(!1),isTouched=!1,ref=(0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null),handleMouseEnter=()=>{isTouched||setIsHovering(!0),isTouched=!1},handleMouseLeave=()=>{setIsHovering(!1)},handleTouch=()=>{isTouched=!0};return(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>{var element=ref.current;return null==element||element.addEventListener("mouseenter",handleMouseEnter),null==element||element.addEventListener("mouseleave",handleMouseLeave),null==element||element.addEventListener("click",handleMouseLeave),null==element||element.addEventListener("touchstart",handleTouch,{passive:!0}),document.addEventListener("visibilitychange",handleMouseLeave),()=>{null==element||element.removeEventListener("mouseenter",handleMouseEnter),null==element||element.removeEventListener("mouseleave",handleMouseLeave),null==element||element.removeEventListener("click",handleMouseLeave),null==element||element.removeEventListener("touchstart",handleTouch),document.removeEventListener("visibilitychange",handleMouseLeave)}}),[ref.current]),[ref,isHovering]}},"./src/shared/hooks/useShowTooltip.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{S:()=>useShowTooltip});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js"),_useHover__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/shared/hooks/useHover.tsx"),src_shared_components_tooltip_tooltip_constants__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/shared/components/tooltip/tooltip-constants.ts"),reducer=(_,action)=>{switch(action.type){case"showTooltipOnHover":return{event:"hover",isTooltipShown:!0};case"showTooltipOnClick":return{event:"click",isTooltipShown:!0};case"hideTooltip":return initialState}},initialState={event:null,isTooltipShown:!1},useShowTooltip=()=>{var[state,dispatch]=(0,react__WEBPACK_IMPORTED_MODULE_2__.useReducer)(reducer,initialState),[hoverRef,isHovered]=(0,_useHover__WEBPACK_IMPORTED_MODULE_3__.Z)(),timeoutId=null;(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>(isHovered&&null===state.event?timeoutId=window.setTimeout((()=>{dispatch({type:"showTooltipOnHover"})}),src_shared_components_tooltip_tooltip_constants__WEBPACK_IMPORTED_MODULE_4__.W):state.isTooltipShown&&"hover"===state.event&&dispatch({type:"hideTooltip"}),()=>{timeoutId&&clearTimeout(timeoutId)})),[isHovered]);var cancelTimeout=()=>{timeoutId&&clearTimeout(timeoutId),timeoutId=null};return{elementRef:hoverRef,onClick:()=>{cancelTimeout(),state.isTooltipShown?dispatch({type:"hideTooltip"}):dispatch({type:"showTooltipOnClick"})},onTooltipCloseSignal:()=>{setTimeout((()=>{dispatch({type:"hideTooltip"})}),0)},shouldShowTooltip:state.isTooltipShown}}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/question-button/QuestionButton.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".questionButton__QuestionButton__K8_Xb{position:relative;display:inline-block;-webkit-user-select:none;user-select:none;cursor:pointer;padding:2px;font-size:0}.questionButton__QuestionButton__K8_Xb>svg{width:100%;height:100%;fill:#09f}.in-input-field__QuestionButton__s4TcB{padding:0;height:var(--question-button-size, 16px);width:var(--question-button-size, 16px)}.inline__QuestionButton__TjBrU{width:16px;height:16px}","",{version:3,sources:["webpack://./src/shared/components/question-button/QuestionButton.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,uCACE,iBAAA,CACA,oBAAA,CACA,wBAAA,CAAA,gBAAA,CACA,cAAA,CACA,WAAA,CACA,WAAA,CAEA,2CACE,UAAA,CACA,WAAA,CACA,SCgBG,CDZP,uCACE,SAAA,CACA,wCAAA,CACA,uCAAA,CAGF,+BACE,UAAA,CACA,WAAA",sourcesContent:["@import 'src/styles/common';\n\n.questionButton {\n  position: relative;\n  display: inline-block;\n  user-select: none;\n  cursor: pointer;\n  padding: 2px;\n  font-size: 0;\n\n  > svg {\n    width: 100%;\n    height: 100%;\n    fill: $blue;\n  }\n}\n\n.in-input-field {\n  padding: 0;\n  height: var(--question-button-size, 16px);\n  width: var(--question-button-size, 16px);\n}\n\n.inline {\n  width: 16px;\n  height: 16px;\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$orange: #ff9900;\n$mustard: #cc9933;\n\n$green: #47d147;\n\n$dark-pink: #E685AE;\n$dark-yellow: #F8C041;\n$lime: #84FA3A;\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",questionButton:"questionButton__QuestionButton__K8_Xb","in-input-field":"in-input-field__QuestionButton__s4TcB",inline:"inline__QuestionButton__TjBrU"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/tooltip/Tooltip.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".tooltip__Tooltip__SIHYt{background:#6f8190;padding:6px 18px 8px;filter:drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.4));cursor:default;color:#fff;border-radius:4px;font-size:14px;max-width:300px}.tooltipTip__Tooltip__tuePM{fill:#6f8190}","",{version:3,sources:["webpack://./src/shared/components/tooltip/Tooltip.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAIA,yBACE,kBCgCU,CD/BV,oBAAA,CACA,kDAAA,CACA,cAAA,CACA,UCHM,CDIN,iBAAA,CACA,cAAA,CACA,eAAA,CAGF,4BACE,YCqBU",sourcesContent:["@import 'src/styles/common';\n\n$fill-color: $dark-grey;\n\n.tooltip {\n  background: $fill-color;\n  padding: 6px 18px 8px;\n  filter: drop-shadow(2px 2px 3px $shadow-color);\n  cursor: default;\n  color: $white;\n  border-radius: 4px;\n  font-size: 14px;\n  max-width: 300px;\n}\n\n.tooltipTip {\n  fill: $fill-color;\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$orange: #ff9900;\n$mustard: #cc9933;\n\n$green: #47d147;\n\n$dark-pink: #E685AE;\n$dark-yellow: #F8C041;\n$lime: #84FA3A;\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",tooltip:"tooltip__Tooltip__SIHYt",tooltipTip:"tooltipTip__Tooltip__tuePM"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);