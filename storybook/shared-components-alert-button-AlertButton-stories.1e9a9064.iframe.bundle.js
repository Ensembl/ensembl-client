(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[1220],{"./stories/shared-components/alert-button/AlertButton.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ErrorAlertButtonOnlyStory:()=>ErrorAlertButtonOnlyStory,ErrorAlertButtonStory:()=>ErrorAlertButtonStory,WarningAlertButtonStory:()=>WarningAlertButtonStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>AlertButton_stories});var _path,classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),react=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const icon_alert_circle=props=>react.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",viewBox:"0 0 32 32"},props),_path||(_path=react.createElement("path",{d:"M16 31C7.7 31 1 24.3 1 16S7.7 1 16 1s15 6.7 15 15-6.7 15-15 15m2.2-17.3V7.3c0-.5-.4-.8-.8-.8h-2.9c-.5 0-.8.4-.8.8v9.6c0 .5.4.8.8.8h2.9c.5 0 .8-.4.8-.8zM16 20.3c-1.4 0-2.6 1.2-2.6 2.6s1.2 2.6 2.6 2.6 2.6-1.1 2.6-2.6-1.2-2.6-2.6-2.6"})));var useShowTooltip=__webpack_require__("./src/shared/hooks/useShowTooltip.ts"),Tooltip=__webpack_require__("./src/shared/components/tooltip/Tooltip.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),AlertButton_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/alert-button/AlertButton.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(AlertButton_module.A,options);const alert_button_AlertButton_module=AlertButton_module.A&&AlertButton_module.A.locals?AlertButton_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),AlertButton=props=>{var{level:alertLevel="red",tooltipContent}=props,{elementRef,onClick,onTooltipCloseSignal,shouldShowTooltip}=(0,useShowTooltip.i)(),alertButtonClass=classnames_default()(alert_button_AlertButton_module.alertButton,props.className,{[alert_button_AlertButton_module.alertButtonRed]:"red"===alertLevel},{[alert_button_AlertButton_module.alertButtonAmber]:"amber"===alertLevel},{[alert_button_AlertButton_module.noTooltip]:!props.tooltipContent});return(0,jsx_runtime.jsxs)("div",{ref:elementRef,className:alertButtonClass,onClick,children:[(0,jsx_runtime.jsx)(icon_alert_circle,{}),tooltipContent&&shouldShowTooltip&&(0,jsx_runtime.jsx)(Tooltip.A,{anchor:elementRef.current,autoAdjust:!0,onClose:onTooltipCloseSignal,delay:0,children:tooltipContent})]})};const alert_button_AlertButton=AlertButton;try{AlertButton.displayName="AlertButton",AlertButton.__docgenInfo={description:"",displayName:"AlertButton",props:{tooltipContent:{defaultValue:null,description:"",name:"tooltipContent",required:!1,type:{name:"ReactNode"}},level:{defaultValue:null,description:"",name:"level",required:!1,type:{name:"enum",value:[{value:'"red"'},{value:'"amber"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/alert-button/AlertButton.tsx#AlertButton"]={docgenInfo:AlertButton.__docgenInfo,name:"AlertButton",path:"src/shared/components/alert-button/AlertButton.tsx#AlertButton"})}catch(__react_docgen_typescript_loader_error){}var AlertButton_stories_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/alert-button/AlertButton.stories.module.css"),AlertButton_stories_module_options={};AlertButton_stories_module_options.styleTagTransform=styleTagTransform_default(),AlertButton_stories_module_options.setAttributes=setAttributesWithoutAttributes_default(),AlertButton_stories_module_options.insert=insertBySelector_default().bind(null,"head"),AlertButton_stories_module_options.domAPI=styleDomAPI_default(),AlertButton_stories_module_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(AlertButton_stories_module.A,AlertButton_stories_module_options);const alert_button_AlertButton_stories_module=AlertButton_stories_module.A&&AlertButton_stories_module.A.locals?AlertButton_stories_module.A.locals:void 0,AlertButton_stories={title:"Components/Shared Components/Alert button"};var ErrorAlertButtonStory=()=>(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("span",{className:alert_button_AlertButton_stories_module.text,children:"Some error has occured"}),(0,jsx_runtime.jsx)(alert_button_AlertButton,{tooltipContent:"This is a hint",className:alert_button_AlertButton_stories_module.alertIcon})]});ErrorAlertButtonStory.storyName="Error icon with tooltip";var WarningAlertButtonStory=()=>(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("span",{className:alert_button_AlertButton_stories_module.text,children:"Some warning to show"}),(0,jsx_runtime.jsx)(alert_button_AlertButton,{tooltipContent:"This is a hint",level:"amber",className:alert_button_AlertButton_stories_module.alertIcon})]});WarningAlertButtonStory.storyName="Warning icon with tooltip";var ErrorAlertButtonOnlyStory=()=>(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("span",{className:alert_button_AlertButton_stories_module.text,children:"Bigger error icon"}),(0,jsx_runtime.jsx)(alert_button_AlertButton,{className:alert_button_AlertButton_stories_module.largeAlertIcon})]});ErrorAlertButtonOnlyStory.storyName="Error icon with no tooltip",ErrorAlertButtonStory.parameters={...ErrorAlertButtonStory.parameters,docs:{...ErrorAlertButtonStory.parameters?.docs,source:{originalSource:'() => <div>\n    <span className={styles.text}>Some error has occured</span>\n    <AlertButton tooltipContent="This is a hint" className={styles.alertIcon} />\n  </div>',...ErrorAlertButtonStory.parameters?.docs?.source}}},WarningAlertButtonStory.parameters={...WarningAlertButtonStory.parameters,docs:{...WarningAlertButtonStory.parameters?.docs,source:{originalSource:'() => <div>\n    <span className={styles.text}>Some warning to show</span>\n    <AlertButton tooltipContent="This is a hint" level="amber" className={styles.alertIcon} />\n  </div>',...WarningAlertButtonStory.parameters?.docs?.source}}},ErrorAlertButtonOnlyStory.parameters={...ErrorAlertButtonOnlyStory.parameters,docs:{...ErrorAlertButtonOnlyStory.parameters?.docs,source:{originalSource:"() => <div>\n    <span className={styles.text}>Bigger error icon</span>\n    <AlertButton className={styles.largeAlertIcon} />\n  </div>",...ErrorAlertButtonOnlyStory.parameters?.docs?.source}}};const __namedExportsOrder=["ErrorAlertButtonStory","WarningAlertButtonStory","ErrorAlertButtonOnlyStory"]},"./src/shared/components/tooltip/Tooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>tooltip_Tooltip});__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),tooltip_constants=__webpack_require__("./src/shared/components/tooltip/tooltip-constants.ts"),PointerBox=__webpack_require__("./src/shared/components/pointer-box/PointerBox.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Tooltip_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/tooltip/Tooltip.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Tooltip_module.A,options);const tooltip_Tooltip_module=Tooltip_module.A&&Tooltip_module.A.locals?Tooltip_module.A.locals:void 0;var PointerBox_module=__webpack_require__("./src/shared/components/pointer-box/PointerBox.module.css"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==typeof i?i:i+""}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var Tooltip=props=>props.anchor?(0,jsx_runtime.jsx)(TooltipWithAnchor,function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}({},props)):null,TooltipWithAnchor=props=>{var _props$position,timeoutId,[isWaiting,setIsWaiting]=(0,react.useState)(!0),{delay=tooltip_constants.a}=props;if((0,react.useEffect)((()=>(timeoutId=setTimeout((()=>{setIsWaiting(!1)}),delay),()=>clearTimeout(timeoutId))),[]),isWaiting||!props.children)return null;var componentClasses=classnames_default()(tooltip_Tooltip_module.tooltip,PointerBox_module.A.pointerBoxShadow);return(0,jsx_runtime.jsx)(PointerBox.A,{position:null!==(_props$position=props.position)&&void 0!==_props$position?_props$position:PointerBox.y.BOTTOM_RIGHT,anchor:props.anchor,container:props.container,autoAdjust:props.autoAdjust,renderInsideAnchor:props.renderInsideAnchor,onClose:props.onClose,className:componentClasses,onOutsideClick:props.onClose,children:props.children})};const tooltip_Tooltip=Tooltip;try{TOOLTIP_TIMEOUT.displayName="TOOLTIP_TIMEOUT",TOOLTIP_TIMEOUT.__docgenInfo={description:'See the NOTICE file distributed with this work for additional information\nregarding copyright ownership.\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.',displayName:"TOOLTIP_TIMEOUT",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/tooltip/Tooltip.tsx#TOOLTIP_TIMEOUT"]={docgenInfo:TOOLTIP_TIMEOUT.__docgenInfo,name:"TOOLTIP_TIMEOUT",path:"src/shared/components/tooltip/Tooltip.tsx#TOOLTIP_TIMEOUT"})}catch(__react_docgen_typescript_loader_error){}try{Tooltip.displayName="Tooltip",Tooltip.__docgenInfo={description:"",displayName:"Tooltip",props:{position:{defaultValue:null,description:"",name:"position",required:!1,type:{name:"enum",value:[{value:'"top_left"'},{value:'"top_right"'},{value:'"right_top"'},{value:'"right_bottom"'},{value:'"bottom_right"'},{value:'"bottom_left"'},{value:'"left_bottom"'},{value:'"left_top"'}]}},container:{defaultValue:null,description:"",name:"container",required:!1,type:{name:"HTMLElement | null"}},autoAdjust:{defaultValue:null,description:"",name:"autoAdjust",required:!1,type:{name:"boolean"}},delay:{defaultValue:null,description:"",name:"delay",required:!1,type:{name:"number"}},renderInsideAnchor:{defaultValue:null,description:"",name:"renderInsideAnchor",required:!1,type:{name:"boolean"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void)"}},anchor:{defaultValue:null,description:"",name:"anchor",required:!0,type:{name:"HTMLElement | null"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/tooltip/Tooltip.tsx#Tooltip"]={docgenInfo:Tooltip.__docgenInfo,name:"Tooltip",path:"src/shared/components/tooltip/Tooltip.tsx#Tooltip"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/tooltip/tooltip-constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{a:()=>TOOLTIP_TIMEOUT});var TOOLTIP_TIMEOUT=800},"./src/shared/hooks/useHover.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>useHover});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js");function useHover(){var[isHovering,setIsHovering]=(0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(!1),isTouched=!1,ref=(0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null),handleMouseEnter=()=>{isTouched||setIsHovering(!0),isTouched=!1},handleMouseLeave=()=>{setIsHovering(!1)},handleTouch=()=>{isTouched=!0};return(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>{var element=ref.current;return null==element||element.addEventListener("mouseenter",handleMouseEnter),null==element||element.addEventListener("mouseleave",handleMouseLeave),null==element||element.addEventListener("click",handleMouseLeave),null==element||element.addEventListener("touchstart",handleTouch,{passive:!0}),document.addEventListener("visibilitychange",handleMouseLeave),()=>{null==element||element.removeEventListener("mouseenter",handleMouseEnter),null==element||element.removeEventListener("mouseleave",handleMouseLeave),null==element||element.removeEventListener("click",handleMouseLeave),null==element||element.removeEventListener("touchstart",handleTouch),document.removeEventListener("visibilitychange",handleMouseLeave)}}),[ref.current]),[ref,isHovering]}},"./src/shared/hooks/useShowTooltip.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{i:()=>useShowTooltip});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js"),_useHover__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/shared/hooks/useHover.tsx"),src_shared_components_tooltip_tooltip_constants__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/shared/components/tooltip/tooltip-constants.ts"),reducer=(_,action)=>{switch(action.type){case"showTooltipOnHover":return{event:"hover",isTooltipShown:!0};case"showTooltipOnClick":return{event:"click",isTooltipShown:!0};case"hideTooltip":return initialState}},initialState={event:null,isTooltipShown:!1},useShowTooltip=()=>{var[state,dispatch]=(0,react__WEBPACK_IMPORTED_MODULE_2__.useReducer)(reducer,initialState),[hoverRef,isHovered]=(0,_useHover__WEBPACK_IMPORTED_MODULE_3__.A)(),timeoutId=null;(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>(isHovered&&null===state.event?timeoutId=window.setTimeout((()=>{dispatch({type:"showTooltipOnHover"})}),src_shared_components_tooltip_tooltip_constants__WEBPACK_IMPORTED_MODULE_4__.a):state.isTooltipShown&&"hover"===state.event&&dispatch({type:"hideTooltip"}),()=>{timeoutId&&clearTimeout(timeoutId)})),[isHovered]);var cancelTimeout=()=>{timeoutId&&clearTimeout(timeoutId),timeoutId=null};return{elementRef:hoverRef,onClick:()=>{cancelTimeout(),state.isTooltipShown?dispatch({type:"hideTooltip"}):dispatch({type:"showTooltipOnClick"})},onTooltipCloseSignal:()=>{setTimeout((()=>{dispatch({type:"hideTooltip"})}),0)},shouldShowTooltip:state.isTooltipShown}}},"./node_modules/core-js/internals/array-method-is-strict.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var fails=__webpack_require__("./node_modules/core-js/internals/fails.js");module.exports=function(METHOD_NAME,argument){var method=[][METHOD_NAME];return!!method&&fails((function(){method.call(null,argument||function(){return 1},1)}))}},"./node_modules/core-js/internals/array-reduce.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),IndexedObject=__webpack_require__("./node_modules/core-js/internals/indexed-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),$TypeError=TypeError,REDUCE_EMPTY="Reduce of empty array with no initial value",createMethod=function(IS_RIGHT){return function(that,callbackfn,argumentsLength,memo){var O=toObject(that),self=IndexedObject(O),length=lengthOfArrayLike(O);if(aCallable(callbackfn),0===length&&argumentsLength<2)throw new $TypeError(REDUCE_EMPTY);var index=IS_RIGHT?length-1:0,i=IS_RIGHT?-1:1;if(argumentsLength<2)for(;;){if(index in self){memo=self[index],index+=i;break}if(index+=i,IS_RIGHT?index<0:length<=index)throw new $TypeError(REDUCE_EMPTY)}for(;IS_RIGHT?index>=0:length>index;index+=i)index in self&&(memo=callbackfn(memo,self[index],index,O));return memo}};module.exports={left:createMethod(!1),right:createMethod(!0)}},"./node_modules/core-js/internals/correct-is-regexp-logic.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var MATCH=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js")("match");module.exports=function(METHOD_NAME){var regexp=/./;try{"/./"[METHOD_NAME](regexp)}catch(error1){try{return regexp[MATCH]=!1,"/./"[METHOD_NAME](regexp)}catch(error2){}}return!1}},"./node_modules/core-js/internals/delete-property-or-throw.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var tryToString=__webpack_require__("./node_modules/core-js/internals/try-to-string.js"),$TypeError=TypeError;module.exports=function(O,P){if(!delete O[P])throw new $TypeError("Cannot delete property "+tryToString(P)+" of "+tryToString(O))}},"./node_modules/core-js/internals/engine-is-node.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var global=__webpack_require__("./node_modules/core-js/internals/global.js"),classof=__webpack_require__("./node_modules/core-js/internals/classof-raw.js");module.exports="process"===classof(global.process)},"./node_modules/core-js/internals/is-regexp.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var isObject=__webpack_require__("./node_modules/core-js/internals/is-object.js"),classof=__webpack_require__("./node_modules/core-js/internals/classof-raw.js"),MATCH=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js")("match");module.exports=function(it){var isRegExp;return isObject(it)&&(void 0!==(isRegExp=it[MATCH])?!!isRegExp:"RegExp"===classof(it))}},"./node_modules/core-js/internals/not-a-regexp.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var isRegExp=__webpack_require__("./node_modules/core-js/internals/is-regexp.js"),$TypeError=TypeError;module.exports=function(it){if(isRegExp(it))throw new $TypeError("The method doesn't accept regular expressions");return it}},"./node_modules/core-js/modules/es.array.reduce.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),$reduce=__webpack_require__("./node_modules/core-js/internals/array-reduce.js").left,arrayMethodIsStrict=__webpack_require__("./node_modules/core-js/internals/array-method-is-strict.js"),CHROME_VERSION=__webpack_require__("./node_modules/core-js/internals/engine-v8-version.js");$({target:"Array",proto:!0,forced:!__webpack_require__("./node_modules/core-js/internals/engine-is-node.js")&&CHROME_VERSION>79&&CHROME_VERSION<83||!arrayMethodIsStrict("reduce")},{reduce:function reduce(callbackfn){var length=arguments.length;return $reduce(this,callbackfn,length,length>1?arguments[1]:void 0)}})},"./node_modules/core-js/modules/es.array.unshift.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),setArrayLength=__webpack_require__("./node_modules/core-js/internals/array-set-length.js"),deletePropertyOrThrow=__webpack_require__("./node_modules/core-js/internals/delete-property-or-throw.js"),doesNotExceedSafeInteger=__webpack_require__("./node_modules/core-js/internals/does-not-exceed-safe-integer.js");$({target:"Array",proto:!0,arity:1,forced:1!==[].unshift(0)||!function(){try{Object.defineProperty([],"length",{writable:!1}).unshift()}catch(error){return error instanceof TypeError}}()},{unshift:function unshift(item){var O=toObject(this),len=lengthOfArrayLike(O),argCount=arguments.length;if(argCount){doesNotExceedSafeInteger(len+argCount);for(var k=len;k--;){var to=k+argCount;k in O?O[to]=O[k]:deletePropertyOrThrow(O,to)}for(var j=0;j<argCount;j++)O[j]=arguments[j]}return setArrayLength(O,len+argCount)}})},"./node_modules/core-js/modules/es.string.includes.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),notARegExp=__webpack_require__("./node_modules/core-js/internals/not-a-regexp.js"),requireObjectCoercible=__webpack_require__("./node_modules/core-js/internals/require-object-coercible.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),correctIsRegExpLogic=__webpack_require__("./node_modules/core-js/internals/correct-is-regexp-logic.js"),stringIndexOf=uncurryThis("".indexOf);$({target:"String",proto:!0,forced:!correctIsRegExpLogic("includes")},{includes:function includes(searchString){return!!~stringIndexOf(toString(requireObjectCoercible(this)),toString(notARegExp(searchString)),arguments.length>1?arguments[1]:void 0)}})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/alert-button/AlertButton.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".alertButton__AlertButton-module__o6eHn {\n  display: inline-block;\n  font-size: 0; /* to prevent extra space in the bottom of the button element */\n  padding: 2px;\n  -webkit-user-select: none;\n          user-select: none;\n}\n\n.alertButton__AlertButton-module__o6eHn > svg {\n  width: var(--alert-icon-diameter, 18px);\n  height: var(--alert-icon-diameter, 18px);\n  cursor: pointer;\n}\n\n.alertButtonRed__AlertButton-module__LjgE3 svg {\n  fill: var(--color-red);\n}\n\n.alertButtonAmber__AlertButton-module__AsSpA svg {\n  fill: var(--color-orange);\n}\n\n.noTooltip__AlertButton-module__VNRKu svg {\n  cursor: auto;\n}\n","",{version:3,sources:["webpack://./src/shared/components/alert-button/AlertButton.module.css"],names:[],mappings:"AAAA;EACE,qBAAqB;EACrB,YAAY,EAAE,+DAA+D;EAC7E,YAAY;EACZ,yBAAiB;UAAjB,iBAAiB;AACnB;;AAEA;EACE,uCAAuC;EACvC,wCAAwC;EACxC,eAAe;AACjB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,YAAY;AACd",sourcesContent:[".alertButton {\n  display: inline-block;\n  font-size: 0; /* to prevent extra space in the bottom of the button element */\n  padding: 2px;\n  user-select: none;\n}\n\n.alertButton > svg {\n  width: var(--alert-icon-diameter, 18px);\n  height: var(--alert-icon-diameter, 18px);\n  cursor: pointer;\n}\n\n.alertButtonRed svg {\n  fill: var(--color-red);\n}\n\n.alertButtonAmber svg {\n  fill: var(--color-orange);\n}\n\n.noTooltip svg {\n  cursor: auto;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={alertButton:"alertButton__AlertButton-module__o6eHn",alertButtonRed:"alertButtonRed__AlertButton-module__LjgE3",alertButtonAmber:"alertButtonAmber__AlertButton-module__AsSpA",noTooltip:"noTooltip__AlertButton-module__VNRKu"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/tooltip/Tooltip.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".tooltip__Tooltip-module__oS7zv {\n  --pointer-box-color: var(--color-dark-grey);\n  --pointer-box-padding: 6px 18px 8px;\n  border-radius: 4px;\n  font-size: 14px;\n  max-width: 300px;\n}\n","",{version:3,sources:["webpack://./src/shared/components/tooltip/Tooltip.module.css"],names:[],mappings:"AAAA;EACE,2CAA2C;EAC3C,mCAAmC;EACnC,kBAAkB;EAClB,eAAe;EACf,gBAAgB;AAClB",sourcesContent:[".tooltip {\n  --pointer-box-color: var(--color-dark-grey);\n  --pointer-box-padding: 6px 18px 8px;\n  border-radius: 4px;\n  font-size: 14px;\n  max-width: 300px;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={tooltip:"tooltip__Tooltip-module__oS7zv"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/alert-button/AlertButton.stories.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".text__AlertButton-stories-module__gUAO9 {\n  margin-right: 1rem;\n}\n\n.alertIcon__AlertButton-stories-module__n6JWP {\n  display: inline-block;\n  position: relative;\n  top: 4px;\n}\n\n.largeAlertIcon__AlertButton-stories-module__Txzls {\n  --alert-icon-diameter: 30px;\n  display: inline-block;\n  position: relative;\n  top: 10px;\n}\n","",{version:3,sources:["webpack://./stories/shared-components/alert-button/AlertButton.stories.module.css"],names:[],mappings:"AAAA;EACE,kBAAkB;AACpB;;AAEA;EACE,qBAAqB;EACrB,kBAAkB;EAClB,QAAQ;AACV;;AAEA;EACE,2BAA2B;EAC3B,qBAAqB;EACrB,kBAAkB;EAClB,SAAS;AACX",sourcesContent:[".text {\n  margin-right: 1rem;\n}\n\n.alertIcon {\n  display: inline-block;\n  position: relative;\n  top: 4px;\n}\n\n.largeAlertIcon {\n  --alert-icon-diameter: 30px;\n  display: inline-block;\n  position: relative;\n  top: 10px;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={text:"text__AlertButton-stories-module__gUAO9",alertIcon:"alertIcon__AlertButton-stories-module__n6JWP",largeAlertIcon:"largeAlertIcon__AlertButton-stories-module__Txzls"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/lodash/_baseFindIndex.js":module=>{module.exports=function baseFindIndex(array,predicate,fromIndex,fromRight){for(var length=array.length,index=fromIndex+(fromRight?1:-1);fromRight?index--:++index<length;)if(predicate(array[index],index,array))return index;return-1}},"./node_modules/lodash/before.js":(module,__unused_webpack_exports,__webpack_require__)=>{var toInteger=__webpack_require__("./node_modules/lodash/toInteger.js");module.exports=function before(n,func){var result;if("function"!=typeof func)throw new TypeError("Expected a function");return n=toInteger(n),function(){return--n>0&&(result=func.apply(this,arguments)),n<=1&&(func=void 0),result}}},"./node_modules/lodash/findIndex.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseFindIndex=__webpack_require__("./node_modules/lodash/_baseFindIndex.js"),baseIteratee=__webpack_require__("./node_modules/lodash/_baseIteratee.js"),toInteger=__webpack_require__("./node_modules/lodash/toInteger.js"),nativeMax=Math.max;module.exports=function findIndex(array,predicate,fromIndex){var length=null==array?0:array.length;if(!length)return-1;var index=null==fromIndex?0:toInteger(fromIndex);return index<0&&(index=nativeMax(length+index,0)),baseFindIndex(array,baseIteratee(predicate,3),index)}},"./node_modules/lodash/noop.js":module=>{module.exports=function noop(){}},"./node_modules/lodash/once.js":(module,__unused_webpack_exports,__webpack_require__)=>{var before=__webpack_require__("./node_modules/lodash/before.js");module.exports=function once(func){return before(2,func)}}}]);