"use strict";(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[8848],{"./src/shared/components/image-button/ImageButton.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>image_button_ImageButton});__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react=__webpack_require__("./node_modules/react/index.js"),isEqual=__webpack_require__("./node_modules/lodash/isEqual.js"),isEqual_default=__webpack_require__.n(isEqual),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),useHover=__webpack_require__("./src/shared/hooks/useHover.tsx"),Tooltip=__webpack_require__("./src/shared/components/tooltip/Tooltip.tsx"),types_status=__webpack_require__("./src/shared/types/status.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),ImageButton_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/image-button/ImageButton.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(ImageButton_module.A,options);const image_button_ImageButton_module=ImageButton_module.A&&ImageButton_module.A.locals?ImageButton_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),_excluded=["status","description","image","className","type"];function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==typeof i?i:i+""}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var ImageButton=props=>{var{status=types_status.n.DEFAULT,description,image:Image,className:classNameFromProps,type:buttonTypeFromProps}=props,otherProps=_objectWithoutProperties(props,_excluded),[hoverRef,isHovered]=(0,useHover.A)(),imageButtonClasses=classnames_default()(image_button_ImageButton_module.imageButton,image_button_ImageButton_module[status],classNameFromProps),buttonType=null!=buttonTypeFromProps?buttonTypeFromProps:"button",shouldShowTooltip=Boolean(description)&&isHovered;return(0,jsx_runtime.jsxs)("div",{ref:hoverRef,className:imageButtonClasses,children:[(0,jsx_runtime.jsx)("button",_objectSpread(_objectSpread({type:buttonType},otherProps),{},{disabled:status===types_status.n.DISABLED,children:"string"==typeof props.image?(0,jsx_runtime.jsx)("img",{src:props.image,alt:description}):(0,jsx_runtime.jsx)(Image,{})})),shouldShowTooltip&&(0,jsx_runtime.jsx)(Tooltip.A,{anchor:hoverRef.current,autoAdjust:!0,children:description})]})};const image_button_ImageButton=(0,react.memo)(ImageButton,isEqual_default());try{ImageButton.displayName="ImageButton",ImageButton.__docgenInfo={description:"",displayName:"ImageButton",props:{status:{defaultValue:null,description:"",name:"status",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"selected"'},{value:'"unselected"'},{value:'"disabled"'}]}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"string"}},image:{defaultValue:null,description:"",name:"image",required:!0,type:{name:"string | FunctionComponent<{}>"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/image-button/ImageButton.tsx#ImageButton"]={docgenInfo:ImageButton.__docgenInfo,name:"ImageButton",path:"src/shared/components/image-button/ImageButton.tsx#ImageButton"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/tooltip/Tooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>tooltip_Tooltip});__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),tooltip_constants=__webpack_require__("./src/shared/components/tooltip/tooltip-constants.ts"),PointerBox=__webpack_require__("./src/shared/components/pointer-box/PointerBox.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Tooltip_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/tooltip/Tooltip.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Tooltip_module.A,options);const tooltip_Tooltip_module=Tooltip_module.A&&Tooltip_module.A.locals?Tooltip_module.A.locals:void 0;var PointerBox_module=__webpack_require__("./src/shared/components/pointer-box/PointerBox.module.css"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==typeof i?i:i+""}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var Tooltip=props=>props.anchor?(0,jsx_runtime.jsx)(TooltipWithAnchor,function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}({},props)):null,TooltipWithAnchor=props=>{var _props$position,timeoutId,[isWaiting,setIsWaiting]=(0,react.useState)(!0),{delay=tooltip_constants.a}=props;if((0,react.useEffect)((()=>(timeoutId=setTimeout((()=>{setIsWaiting(!1)}),delay),()=>clearTimeout(timeoutId))),[]),isWaiting||!props.children)return null;var componentClasses=classnames_default()(tooltip_Tooltip_module.tooltip,PointerBox_module.A.pointerBoxShadow);return(0,jsx_runtime.jsx)(PointerBox.A,{position:null!==(_props$position=props.position)&&void 0!==_props$position?_props$position:PointerBox.y.BOTTOM_RIGHT,anchor:props.anchor,container:props.container,autoAdjust:props.autoAdjust,renderInsideAnchor:props.renderInsideAnchor,onClose:props.onClose,className:componentClasses,onOutsideClick:props.onClose,children:props.children})};const tooltip_Tooltip=Tooltip;try{TOOLTIP_TIMEOUT.displayName="TOOLTIP_TIMEOUT",TOOLTIP_TIMEOUT.__docgenInfo={description:'See the NOTICE file distributed with this work for additional information\nregarding copyright ownership.\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.',displayName:"TOOLTIP_TIMEOUT",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/tooltip/Tooltip.tsx#TOOLTIP_TIMEOUT"]={docgenInfo:TOOLTIP_TIMEOUT.__docgenInfo,name:"TOOLTIP_TIMEOUT",path:"src/shared/components/tooltip/Tooltip.tsx#TOOLTIP_TIMEOUT"})}catch(__react_docgen_typescript_loader_error){}try{Tooltip.displayName="Tooltip",Tooltip.__docgenInfo={description:"",displayName:"Tooltip",props:{position:{defaultValue:null,description:"",name:"position",required:!1,type:{name:"enum",value:[{value:'"top_left"'},{value:'"top_right"'},{value:'"right_top"'},{value:'"right_bottom"'},{value:'"bottom_right"'},{value:'"bottom_left"'},{value:'"left_bottom"'},{value:'"left_top"'}]}},container:{defaultValue:null,description:"",name:"container",required:!1,type:{name:"HTMLElement | null"}},autoAdjust:{defaultValue:null,description:"",name:"autoAdjust",required:!1,type:{name:"boolean"}},delay:{defaultValue:null,description:"",name:"delay",required:!1,type:{name:"number"}},renderInsideAnchor:{defaultValue:null,description:"",name:"renderInsideAnchor",required:!1,type:{name:"boolean"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void)"}},anchor:{defaultValue:null,description:"",name:"anchor",required:!0,type:{name:"HTMLElement | null"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/tooltip/Tooltip.tsx#Tooltip"]={docgenInfo:Tooltip.__docgenInfo,name:"Tooltip",path:"src/shared/components/tooltip/Tooltip.tsx#Tooltip"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/tooltip/tooltip-constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{a:()=>TOOLTIP_TIMEOUT});var TOOLTIP_TIMEOUT=800},"./src/shared/hooks/useHover.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>useHover});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js");function useHover(){var[isHovering,setIsHovering]=(0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(!1),isTouched=!1,ref=(0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null),handleMouseEnter=()=>{isTouched||setIsHovering(!0),isTouched=!1},handleMouseLeave=()=>{setIsHovering(!1)},handleTouch=()=>{isTouched=!0};return(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>{var element=ref.current;return null==element||element.addEventListener("mouseenter",handleMouseEnter),null==element||element.addEventListener("mouseleave",handleMouseLeave),null==element||element.addEventListener("click",handleMouseLeave),null==element||element.addEventListener("touchstart",handleTouch,{passive:!0}),document.addEventListener("visibilitychange",handleMouseLeave),()=>{null==element||element.removeEventListener("mouseenter",handleMouseEnter),null==element||element.removeEventListener("mouseleave",handleMouseLeave),null==element||element.removeEventListener("click",handleMouseLeave),null==element||element.removeEventListener("touchstart",handleTouch),document.removeEventListener("visibilitychange",handleMouseLeave)}}),[ref.current]),[ref,isHovering]}},"./src/shared/types/status.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{n:()=>Status});var Status=function(Status){return Status.DEFAULT="default",Status.SELECTED="selected",Status.UNSELECTED="unselected",Status.DISABLED="disabled",Status.PARTIALLY_SELECTED="partially selected",Status.OPEN="open",Status.CLOSED="closed",Status}({})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/image-button/ImageButton.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".imageButton__ImageButton-module__AzL0i {\n  font-size: 0;\n  line-height: 0;\n  position: relative;\n  display: inline-block; /* buttons are normally inline-block elements */\n  vertical-align: middle;\n}\n\n.imageButton__ImageButton-module__AzL0i button {\n  display: inline-flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n\n.imageButton__ImageButton-module__AzL0i svg {\n  width: var(--image-button-svg-width, 100%);\n  height: var(--image-button-svg-height, 100%);\n}\n\n.default__ImageButton-module__Xt7a5 {\n  background-color: var(--image-button-default-bg-color);\n}\n\n.default__ImageButton-module__Xt7a5 svg {\n  fill: var(--image-button-default-svg-color, var(--color-blue));\n}\n\n.selected__ImageButton-module__bXT3Z {\n  background-color: var(--image-button-selected-bg-color, var(--color-blue));\n}\n\n.selected__ImageButton-module__bXT3Z svg {\n  fill: var(--image-button-selected-svg-color, var(--color-white));\n}\n\n.unselected__ImageButton-module__dSJ1w {\n  background-color: var(--image-button-unselected-bg-color);\n}\n\n.unselected__ImageButton-module__dSJ1w svg {\n  fill: var(--image-button-unselected-svg-color, var(--color-blue));\n}\n\n.disabled__ImageButton-module__WpZwW {\n  background-color: var(--image-button-disabled-bg-color);\n}\n\n.disabled__ImageButton-module__WpZwW svg {\n  fill: var(--image-button-disabled-svg-color, var(--color-grey));\n  opacity: 1;\n}\n","",{version:3,sources:["webpack://./src/shared/components/image-button/ImageButton.module.css"],names:[],mappings:"AAAA;EACE,YAAY;EACZ,cAAc;EACd,kBAAkB;EAClB,qBAAqB,EAAE,+CAA+C;EACtE,sBAAsB;AACxB;;AAEA;EACE,oBAAoB;EACpB,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,0CAA0C;EAC1C,4CAA4C;AAC9C;;AAEA;EACE,sDAAsD;AACxD;;AAEA;EACE,8DAA8D;AAChE;;AAEA;EACE,0EAA0E;AAC5E;;AAEA;EACE,gEAAgE;AAClE;;AAEA;EACE,yDAAyD;AAC3D;;AAEA;EACE,iEAAiE;AACnE;;AAEA;EACE,uDAAuD;AACzD;;AAEA;EACE,+DAA+D;EAC/D,UAAU;AACZ",sourcesContent:[".imageButton {\n  font-size: 0;\n  line-height: 0;\n  position: relative;\n  display: inline-block; /* buttons are normally inline-block elements */\n  vertical-align: middle;\n}\n\n.imageButton button {\n  display: inline-flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n\n.imageButton svg {\n  width: var(--image-button-svg-width, 100%);\n  height: var(--image-button-svg-height, 100%);\n}\n\n.default {\n  background-color: var(--image-button-default-bg-color);\n}\n\n.default svg {\n  fill: var(--image-button-default-svg-color, var(--color-blue));\n}\n\n.selected {\n  background-color: var(--image-button-selected-bg-color, var(--color-blue));\n}\n\n.selected svg {\n  fill: var(--image-button-selected-svg-color, var(--color-white));\n}\n\n.unselected {\n  background-color: var(--image-button-unselected-bg-color);\n}\n\n.unselected svg {\n  fill: var(--image-button-unselected-svg-color, var(--color-blue));\n}\n\n.disabled {\n  background-color: var(--image-button-disabled-bg-color);\n}\n\n.disabled svg {\n  fill: var(--image-button-disabled-svg-color, var(--color-grey));\n  opacity: 1;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={imageButton:"imageButton__ImageButton-module__AzL0i",default:"default__ImageButton-module__Xt7a5",selected:"selected__ImageButton-module__bXT3Z",unselected:"unselected__ImageButton-module__dSJ1w",disabled:"disabled__ImageButton-module__WpZwW"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/tooltip/Tooltip.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".tooltip__Tooltip-module__oS7zv {\n  --pointer-box-color: var(--color-dark-grey);\n  --pointer-box-padding: 6px 18px 8px;\n  border-radius: 4px;\n  font-size: 14px;\n  max-width: 300px;\n}\n","",{version:3,sources:["webpack://./src/shared/components/tooltip/Tooltip.module.css"],names:[],mappings:"AAAA;EACE,2CAA2C;EAC3C,mCAAmC;EACnC,kBAAkB;EAClB,eAAe;EACf,gBAAgB;AAClB",sourcesContent:[".tooltip {\n  --pointer-box-color: var(--color-dark-grey);\n  --pointer-box-padding: 6px 18px 8px;\n  border-radius: 4px;\n  font-size: 14px;\n  max-width: 300px;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={tooltip:"tooltip__Tooltip-module__oS7zv"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);