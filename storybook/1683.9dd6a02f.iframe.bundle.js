"use strict";(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[1683],{"./src/services/window-service.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=new class WindowService{getWindow(){return window}getLocalStorage(){return window.localStorage}getSessionStorage(){return window.sessionStorage}getLocation(){return window.location}getFileReader(){return new FileReader}getResizeObserver(){return ResizeObserver}getMatchMedia(){return window.matchMedia}getDimensions(){var width=window.innerWidth,height=window.innerHeight;return{x:0,y:0,width,height,top:0,left:0,right:width,bottom:height}}}},"./src/shared/components/pointer-box/PointerBox.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>pointer_box_types_Position,Z:()=>components_pointer_box_PointerBox});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var react=__webpack_require__("./node_modules/react/index.js"),react_dom=__webpack_require__("./node_modules/react-dom/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),once=__webpack_require__("./node_modules/lodash/once.js"),once_default=__webpack_require__.n(once),noop=__webpack_require__("./node_modules/lodash/noop.js"),noop_default=__webpack_require__.n(noop),window_service=__webpack_require__("./src/services/window-service.ts"),useOutsideClick=__webpack_require__("./src/shared/hooks/useOutsideClick.tsx"),findIndex=(__webpack_require__("./node_modules/core-js/modules/es.array.reduce.js"),__webpack_require__("./node_modules/core-js/modules/es.array.includes.js"),__webpack_require__("./node_modules/core-js/modules/es.string.includes.js"),__webpack_require__("./node_modules/core-js/modules/es.array.unshift.js"),__webpack_require__("./node_modules/lodash/findIndex.js")),findIndex_default=__webpack_require__.n(findIndex),isEqual=__webpack_require__("./node_modules/lodash/isEqual.js"),isEqual_default=__webpack_require__.n(isEqual);const utils_bringToFront=(elements,promotedElement)=>{var promotedElementIndex=findIndex_default()(elements,(element=>isEqual_default()(element,promotedElement)));if(elements.length<2||-1===promotedElementIndex)return elements;var newElements=[...elements];return newElements.splice(promotedElementIndex,1),newElements.unshift(promotedElement),newElements};var pointer_box_types_Position=function(Position){return Position.TOP_LEFT="top_left",Position.TOP_RIGHT="top_right",Position.RIGHT_TOP="right_top",Position.RIGHT_BOTTOM="right_bottom",Position.BOTTOM_RIGHT="bottom_right",Position.BOTTOM_LEFT="bottom_left",Position.LEFT_BOTTOM="left_bottom",Position.LEFT_TOP="left_top",Position}({});function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var topRow=[pointer_box_types_Position.TOP_LEFT,pointer_box_types_Position.TOP_RIGHT],bottomRow=[pointer_box_types_Position.BOTTOM_LEFT,pointer_box_types_Position.BOTTOM_RIGHT],leftSide=[pointer_box_types_Position.LEFT_TOP,pointer_box_types_Position.LEFT_BOTTOM],rightSide=[pointer_box_types_Position.RIGHT_TOP,pointer_box_types_Position.RIGHT_BOTTOM],getPossiblePositions=params=>{var{position}=params;return topRow.includes(position)?[...utils_bringToFront(topRow,position),...bottomRow]:bottomRow.includes(position)?[...utils_bringToFront(bottomRow,position),...topRow]:leftSide.includes(position)?[...utils_bringToFront(leftSide,position),...rightSide]:rightSide.includes(position)?[...utils_bringToFront(rightSide,position),...leftSide]:[]},getTooltipOutOfBoundsArea=params=>{var{pointerBoxBoundingRect,rootBoundingRect,anchorBoundingRect,position,pointerWidth,pointerHeight,pointerOffset}=params,halfPointerWidth=Math.floor(pointerWidth/2),{width,height}=pointerBoxBoundingRect,{left:anchorLeft,right:anchorRight,width:anchorWidth,top:anchorTop,bottom:anchorBottom,height:anchorHeight}=anchorBoundingRect,anchorCentreX=anchorLeft+anchorWidth/2,anchorCentreY=anchorTop+anchorHeight/2,predictedLeft=0,predictedRight=0,predictedTop=0,predictedBottom=0;return position===pointer_box_types_Position.TOP_LEFT?(predictedRight=(predictedLeft=anchorCentreX-width+halfPointerWidth+pointerOffset)+width,predictedTop=anchorTop-pointerHeight-height,predictedBottom=anchorTop):position===pointer_box_types_Position.TOP_RIGHT?(predictedRight=(predictedLeft=anchorCentreX-halfPointerWidth-pointerOffset)+width,predictedTop=anchorTop-pointerHeight-height,predictedBottom=anchorTop):position===pointer_box_types_Position.BOTTOM_LEFT?(predictedRight=(predictedLeft=anchorCentreX-width+halfPointerWidth+pointerOffset)+width,predictedTop=anchorBottom,predictedBottom=anchorBottom+pointerHeight+height):position===pointer_box_types_Position.BOTTOM_RIGHT?(predictedRight=(predictedLeft=anchorCentreX-halfPointerWidth-pointerOffset)+width,predictedTop=anchorBottom,predictedBottom=anchorBottom+pointerHeight+height):position===pointer_box_types_Position.LEFT_TOP?(predictedLeft=anchorLeft-pointerHeight-width,predictedRight=anchorLeft,predictedBottom=(predictedTop=anchorCentreY-height+halfPointerWidth+pointerOffset)+height):position===pointer_box_types_Position.LEFT_BOTTOM?(predictedLeft=anchorLeft-pointerHeight-width,predictedRight=anchorLeft,predictedBottom=(predictedTop=anchorCentreY-halfPointerWidth-pointerOffset)+height):position===pointer_box_types_Position.RIGHT_TOP?(predictedLeft=anchorRight,predictedRight=anchorRight+pointerHeight+width,predictedBottom=(predictedTop=anchorCentreY-height+halfPointerWidth+pointerOffset)+height):position===pointer_box_types_Position.RIGHT_BOTTOM&&(predictedLeft=anchorRight,predictedRight=anchorRight+pointerHeight+width,predictedBottom=(predictedTop=anchorCentreY-halfPointerWidth-pointerOffset)+height),calculateOverflowArea({tooltip:{left:predictedLeft,right:predictedRight,top:predictedTop,bottom:predictedBottom,width,height},root:rootBoundingRect})},calculateOverflowArea=params=>{var{tooltip:{left:tooltipLeft,right:tooltipRight,top:tooltipTop,bottom:tooltipBottom,width:tooltipWidth,height:tooltipHeight},root:{left:rootLeft,right:rootRight,top:rootTop,bottom:rootBottom}}=params,deltaX=0,deltaY=0;return tooltipLeft<rootLeft?deltaX=rootLeft-tooltipLeft:tooltipRight>rootRight&&(deltaX=tooltipRight-rootRight),tooltipTop<rootTop?deltaY=rootTop-tooltipTop:tooltipBottom>rootBottom&&(deltaY=tooltipBottom-rootBottom),deltaX||deltaY?deltaX*(tooltipHeight-deltaY)+deltaY*(tooltipWidth-deltaX)+deltaX*deltaY:0};function pointer_box_inline_styles_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function pointer_box_inline_styles_objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?pointer_box_inline_styles_ownKeys(Object(t),!0).forEach((function(r){pointer_box_inline_styles_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):pointer_box_inline_styles_ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function pointer_box_inline_styles_defineProperty(obj,key,value){return(key=function pointer_box_inline_styles_toPropertyKey(arg){var key=function pointer_box_inline_styles_toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var getCommonStyles=params=>{var{pointerWidth,pointerHeight,pointerOffset}=params,halfPointerWidth=Math.floor(pointerWidth/2);switch(params.position){case pointer_box_types_Position.TOP_LEFT:return{boxStyles:{transform:"translateX(calc(".concat(pointerOffset,"px + ").concat(halfPointerWidth,"px - 100%))")},pointerStyles:{right:"".concat(pointerOffset,"px"),transform:"rotate(180deg)",bottom:"".concat(1-pointerHeight,"px")}};case pointer_box_types_Position.TOP_RIGHT:return{boxStyles:{},pointerStyles:{bottom:"".concat(1-pointerHeight,"px"),left:"".concat(pointerOffset,"px"),transform:"rotate(180deg)"}};case pointer_box_types_Position.BOTTOM_LEFT:return{boxStyles:{transform:"translateX(calc(-100% + ".concat(pointerOffset,"px + ").concat(halfPointerWidth,"px)")},pointerStyles:{top:"".concat(1-pointerHeight,"px"),left:"100%",transform:"translateX(calc(-100% - ".concat(pointerOffset,"px))")}};case pointer_box_types_Position.BOTTOM_RIGHT:return{boxStyles:{},pointerStyles:{top:"".concat(1-pointerHeight,"px"),left:"".concat(pointerOffset,"px")}};case pointer_box_types_Position.LEFT_TOP:return{boxStyles:{transform:"translateX(-100%) translateY(calc(-100% + ".concat(pointerOffset+halfPointerWidth,"px))")},pointerStyles:{left:"calc(100% - 4px)",bottom:"".concat(pointerOffset+pointerWidth,"px"),transform:"rotate(90deg)",transformOrigin:"left bottom"}};case pointer_box_types_Position.LEFT_BOTTOM:return{boxStyles:{transform:"translateX(-100%) translateY(-".concat(pointerOffset+halfPointerWidth,"px)")},pointerStyles:{left:"calc(100% - 4px)",top:"".concat(pointerOffset-pointerWidth,"px"),transform:"rotate(90deg)",transformOrigin:"left bottom"}};case pointer_box_types_Position.RIGHT_TOP:return{boxStyles:{transform:"translateY(calc(-100% + ".concat(halfPointerWidth,"px))")},pointerStyles:{left:"4px",bottom:"".concat(pointerOffset,"px"),transform:"rotate(-90deg)",transformOrigin:"left bottom"}};case pointer_box_types_Position.RIGHT_BOTTOM:return{boxStyles:{transform:"translateY(-".concat(pointerOffset+halfPointerWidth,"px)")},pointerStyles:{left:"4px",top:"".concat(pointerOffset,"px"),transform:"rotate(-90deg)",transformOrigin:"left bottom"}}}},getBoxStylesForRenderingIntoBody=params=>{var{anchor,pointerWidth,pointerHeight,pointerOffset}=params,anchorBoundingRect=anchor.getBoundingClientRect(),anchorWidth=anchorBoundingRect.width,halfAnchorWidth=anchorWidth/2,anchorHeight=anchorBoundingRect.height,halfAnchorHeight=anchorHeight/2,anchorLeft=Math.round(anchorBoundingRect.left),anchorTop=Math.round(anchorBoundingRect.top),halfPointerWidth=Math.floor(pointerWidth/2);switch(params.position){case pointer_box_types_Position.TOP_LEFT:return{left:"".concat(anchorLeft+anchorWidth/2,"px"),bottom:"".concat(window.innerHeight-window.scrollY-anchorTop+pointerHeight,"px")};case pointer_box_types_Position.TOP_RIGHT:return{left:"".concat(anchorLeft+halfAnchorWidth-pointerOffset-halfPointerWidth,"px"),bottom:"".concat(window.innerHeight-window.scrollY-anchorTop+pointerHeight,"px")};case pointer_box_types_Position.BOTTOM_LEFT:return{top:"".concat(anchorTop+window.scrollY+anchorHeight+pointerHeight,"px"),left:"".concat(anchorLeft+anchorWidth/2,"px")};case pointer_box_types_Position.BOTTOM_RIGHT:return{left:"".concat(anchorLeft+halfAnchorWidth-pointerOffset-halfPointerWidth,"px"),top:"".concat(anchorTop+window.scrollY+anchorHeight+pointerHeight,"px")};case pointer_box_types_Position.LEFT_TOP:case pointer_box_types_Position.LEFT_BOTTOM:return{left:"".concat(anchorLeft-pointerHeight,"px"),top:"".concat(anchorTop+window.scrollY+halfAnchorHeight,"px")};case pointer_box_types_Position.RIGHT_TOP:return{left:"".concat(anchorLeft+anchorWidth+pointerHeight,"px"),top:"".concat(anchorTop+window.scrollY+halfAnchorHeight+pointerOffset,"px")};case pointer_box_types_Position.RIGHT_BOTTOM:return{left:"".concat(anchorLeft+anchorWidth+pointerHeight,"px"),top:"".concat(anchorTop+window.scrollY+halfAnchorHeight,"px")}}},getBoxStylesForRenderingIntoAnchor=params=>{var{anchor,pointerWidth,pointerHeight,pointerOffset}=params,anchorBoundingRect=anchor.getBoundingClientRect(),halfAnchorWidth=anchorBoundingRect.width/2,anchorHeight=anchorBoundingRect.height,halfPointerWidth=Math.floor(pointerWidth/2);switch(params.position){case pointer_box_types_Position.TOP_LEFT:return{left:"50%",bottom:"".concat(anchorHeight+pointerHeight,"px")};case pointer_box_types_Position.TOP_RIGHT:return{left:"calc(50% - ".concat(pointerOffset+halfPointerWidth,"px)"),bottom:"".concat(anchorHeight+pointerHeight,"px")};case pointer_box_types_Position.BOTTOM_LEFT:return{top:"".concat(anchorHeight+pointerHeight,"px"),left:"50%"};case pointer_box_types_Position.BOTTOM_RIGHT:return{left:"".concat(halfAnchorWidth-pointerOffset-halfPointerWidth,"px"),top:"".concat(anchorHeight+pointerHeight,"px")};case pointer_box_types_Position.LEFT_TOP:case pointer_box_types_Position.LEFT_BOTTOM:return{left:"-".concat(pointerHeight,"px"),top:"50%"};case pointer_box_types_Position.RIGHT_TOP:return{left:"calc(100% + ".concat(pointerHeight,"px)"),top:"calc(50% + ".concat(pointerOffset,"px)")};case pointer_box_types_Position.RIGHT_BOTTOM:return{left:"calc(100% + ".concat(pointerHeight,"px)"),top:"50%"}}},injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),PointerBox=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/pointer-box/PointerBox.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(PointerBox.Z,options);const pointer_box_PointerBox=PointerBox.Z&&PointerBox.Z.locals?PointerBox.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function PointerBox_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function PointerBox_objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?PointerBox_ownKeys(Object(t),!0).forEach((function(r){PointerBox_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):PointerBox_ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function PointerBox_defineProperty(obj,key,value){return(key=function PointerBox_toPropertyKey(arg){var key=function PointerBox_toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var defaultProps={position:pointer_box_types_Position.BOTTOM_RIGHT,renderInsideAnchor:!1,autoAdjust:!1,pointerWidth:18,pointerHeight:13,pointerOffset:20,onOutsideClick:noop_default(),onClose:noop_default()},PointerBox_PointerBox=props=>{var _props$classNames,_props$classNames2,{position:positionFromProps=defaultProps.position,renderInsideAnchor=defaultProps.renderInsideAnchor,autoAdjust=defaultProps.autoAdjust,pointerWidth:pointerWidthFromProps=defaultProps.pointerWidth,pointerHeight:pointerHeightFromProps=defaultProps.pointerHeight,pointerOffset:pointerOffsetFromProps=defaultProps.pointerOffset,onOutsideClick=defaultProps.onOutsideClick,onClose=defaultProps.onClose}=props,[isPositioning,setIsPositioning]=(0,react.useState)(autoAdjust),positionRef=(0,react.useRef)(positionFromProps),anchorRectRef=(0,react.useRef)(null),[inlineStyles,setInlineStyles]=(0,react.useState)({boxStyles:{},pointerStyles:{}}),pointerBoxRef=(0,react.useRef)(null);(0,useOutsideClick.Z)(pointerBoxRef,onOutsideClick),(0,react.useEffect)((()=>{var pointerBoxElement=pointerBoxRef.current;setInlineStyles(getInlineStyles(props)),anchorRectRef.current=props.anchor.getBoundingClientRect(),autoAdjust&&adjustPosition(pointerBoxElement,props.anchor)}),[]);var closeOnScroll=once_default()(onClose);(0,react.useEffect)((()=>{if(!renderInsideAnchor)return document.addEventListener("scroll",closeOnScroll,!0),()=>document.removeEventListener("scroll",closeOnScroll,!0)}),[]);var getInlineStyles=props=>{var params=PointerBox_objectSpread(PointerBox_objectSpread({},defaultProps),props);return renderInsideAnchor?(params=>{var commonStyles=getCommonStyles(params);return pointer_box_inline_styles_objectSpread(pointer_box_inline_styles_objectSpread({},commonStyles),{},{boxStyles:pointer_box_inline_styles_objectSpread(pointer_box_inline_styles_objectSpread({},commonStyles.boxStyles),getBoxStylesForRenderingIntoAnchor(params))})})(params):(params=>{var commonStyles=getCommonStyles(params);return pointer_box_inline_styles_objectSpread(pointer_box_inline_styles_objectSpread({},commonStyles),{},{boxStyles:pointer_box_inline_styles_objectSpread(pointer_box_inline_styles_objectSpread({},commonStyles.boxStyles),getBoxStylesForRenderingIntoBody(params))})})(params)},adjustPosition=(pointerBox,anchor)=>{var params,pointerBoxBoundingRect=pointerBox.getBoundingClientRect(),rootBoundingRect=props.container?props.container.getBoundingClientRect():window_service.Z.getDimensions(),anchorBoundingRect=anchor.getBoundingClientRect(),optimalPosition=(params={pointerBoxBoundingRect,anchorBoundingRect,rootBoundingRect,position:positionRef.current||positionFromProps,pointerWidth:pointerWidthFromProps,pointerHeight:pointerHeightFromProps,pointerOffset:pointerOffsetFromProps},getPossiblePositions(params).reduce(((result,position)=>{var outOfBoundsArea=getTooltipOutOfBoundsArea(_objectSpread(_objectSpread({},params),{},{position}));return outOfBoundsArea<result.outOfBoundsArea?{position,outOfBoundsArea}:result}),{position:params.position,outOfBoundsArea:1/0}).position);optimalPosition!==positionRef.current&&(positionRef.current=optimalPosition),setInlineStyles(getInlineStyles(PointerBox_objectSpread(PointerBox_objectSpread({},props),{},{position:optimalPosition}))),setIsPositioning(!1)},bodyClasses=classnames_default()(pointer_box_PointerBox.pointerBox,null===(_props$classNames=props.classNames)||void 0===_props$classNames?void 0:_props$classNames.box,positionFromProps,{[pointer_box_PointerBox.invisible]:isPositioning||!Object.keys(inlineStyles.boxStyles).length}),renderedPointerBox=(0,jsx_runtime.jsxs)("div",{className:bodyClasses,ref:pointerBoxRef,style:inlineStyles.boxStyles,children:[(0,jsx_runtime.jsx)(Pointer,{className:null===(_props$classNames2=props.classNames)||void 0===_props$classNames2?void 0:_props$classNames2.pointer,width:pointerWidthFromProps,height:pointerHeightFromProps,style:inlineStyles.pointerStyles}),props.children]}),renderTarget=renderInsideAnchor?props.anchor:document.body;return react_dom.createPortal(renderedPointerBox,renderTarget)},Pointer=props=>{var{width:pointerWidth,height:pointerHeight}=props,pointerEndX=pointerWidth/2,style=PointerBox_objectSpread(PointerBox_objectSpread({},props.style),{},{width:"".concat(pointerWidth,"px"),height:"".concat(pointerHeight,"px")}),pointerClasses=classnames_default()(pointer_box_PointerBox.pointer,props.className),polygonPoints="0,".concat(pointerHeight," ").concat(pointerWidth,",").concat(pointerHeight," ").concat(pointerEndX,",0");return(0,jsx_runtime.jsx)("svg",{className:pointerClasses,style,xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",viewBox:"0 0 ".concat(pointerWidth," ").concat(pointerHeight),children:(0,jsx_runtime.jsx)("polygon",{points:polygonPoints})})};Pointer.displayName="Pointer";const components_pointer_box_PointerBox=PointerBox_PointerBox;try{Position.displayName="Position",Position.__docgenInfo={description:'See the NOTICE file distributed with this work for additional information\nregarding copyright ownership.\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.',displayName:"Position",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/pointer-box/PointerBox.tsx#Position"]={docgenInfo:Position.__docgenInfo,name:"Position",path:"src/shared/components/pointer-box/PointerBox.tsx#Position"})}catch(__react_docgen_typescript_loader_error){}try{PointerBox_PointerBox.displayName="PointerBox",PointerBox_PointerBox.__docgenInfo={description:"",displayName:"PointerBox",props:{position:{defaultValue:null,description:"",name:"position",required:!1,type:{name:"enum",value:[{value:'"top_left"'},{value:'"top_right"'},{value:'"right_top"'},{value:'"right_bottom"'},{value:'"bottom_right"'},{value:'"bottom_left"'},{value:'"left_bottom"'},{value:'"left_top"'}]}},anchor:{defaultValue:null,description:"",name:"anchor",required:!0,type:{name:"HTMLElement"}},container:{defaultValue:null,description:"",name:"container",required:!1,type:{name:"HTMLElement | null"}},autoAdjust:{defaultValue:null,description:"",name:"autoAdjust",required:!1,type:{name:"boolean"}},renderInsideAnchor:{defaultValue:null,description:"",name:"renderInsideAnchor",required:!1,type:{name:"boolean"}},pointerWidth:{defaultValue:null,description:"",name:"pointerWidth",required:!1,type:{name:"number"}},pointerHeight:{defaultValue:null,description:"",name:"pointerHeight",required:!1,type:{name:"number"}},pointerOffset:{defaultValue:null,description:"",name:"pointerOffset",required:!1,type:{name:"number"}},classNames:{defaultValue:null,description:"",name:"classNames",required:!1,type:{name:"{ box?: string; pointer?: string; } | undefined"}},onOutsideClick:{defaultValue:null,description:"",name:"onOutsideClick",required:!1,type:{name:"(() => void) | ((event: Event) => void)"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/pointer-box/PointerBox.tsx#PointerBox"]={docgenInfo:PointerBox_PointerBox.__docgenInfo,name:"PointerBox",path:"src/shared/components/pointer-box/PointerBox.tsx#PointerBox"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/hooks/useOutsideClick.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useOutsideClick});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js");function useOutsideClick(refOrRefs,callback){var refs=Array.isArray(refOrRefs)?refOrRefs:[refOrRefs],handleClickOutside=event=>{var isClickInside=!1;for(var ref of refs){var _ref$current;null!==(_ref$current=ref.current)&&void 0!==_ref$current&&_ref$current.contains(event.target)&&(isClickInside=!0)}isClickInside||callback(event)};(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>(document.addEventListener("click",handleClickOutside,{capture:!0}),()=>{document.removeEventListener("click",handleClickOutside,!0)})))}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/pointer-box/PointerBox.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".pointerBox__PointerBox__Zkzln{position:absolute;z-index:1000;width:max-content;box-sizing:content-box;padding:6px}.invisible__PointerBox__kOMBk{visibility:hidden;position:fixed;top:0;left:0}.pointer__PointerBox__P7ZcL{position:absolute;mix-blend-mode:lighten}","",{version:3,sources:["webpack://./src/shared/components/pointer-box/PointerBox.scss"],names:[],mappings:"AAAA,+BACE,iBAAA,CACA,YAAA,CACA,iBAAA,CACA,sBAAA,CACA,WAAA,CAOF,8BACE,iBAAA,CACA,cAAA,CACA,KAAA,CACA,MAAA,CAGF,4BACE,iBAAA,CACA,sBAAA",sourcesContent:['.pointerBox {\n  position: absolute;\n  z-index: 1000;\n  width: max-content; // not supported in IE or non-webkit Edge\n  box-sizing: content-box; // Safari doesn\'t seem to respect "width: max-content" if box-sizing is border-box\n  padding: 6px;\n}\n\n// Class applied to pointer box while the code is finding appropriate position for it.\n// Pointer box should be invisible, but have width and height required for calculations.\n// It should also not change dimensions of the page (and cause sliders to appear);\n// hence it is placed in top left corner of the screen with position: fixed\n.invisible {\n  visibility: hidden;\n  position: fixed;\n  top: 0;\n  left: 0;\n}\n\n.pointer {\n  position: absolute;\n  mix-blend-mode: lighten;\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={pointerBox:"pointerBox__PointerBox__Zkzln",invisible:"invisible__PointerBox__kOMBk",pointer:"pointer__PointerBox__P7ZcL"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);