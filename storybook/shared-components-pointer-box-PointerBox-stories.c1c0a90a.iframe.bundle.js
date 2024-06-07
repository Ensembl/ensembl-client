(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[6644],{"./stories/shared-components/pointer-box/PointerBox.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{PointerBoxPositioning:()=>PointerBoxPositioning,PointerBoxScrolling:()=>PointerBoxScrolling,PointerBoxVariants:()=>PointerBoxVariants,__namedExportsOrder:()=>__namedExportsOrder,default:()=>PointerBox_stories});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),esm=__webpack_require__("./node_modules/@faker-js/faker/dist/esm/index.mjs"),PointerBox=__webpack_require__("./src/shared/components/pointer-box/PointerBox.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),PointerBox_stories_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/pointer-box/PointerBox.stories.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(PointerBox_stories_module.A,options);const pointer_box_PointerBox_stories_module=PointerBox_stories_module.A&&PointerBox_stories_module.A.locals?PointerBox_stories_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const pointerBoxVariantsStory=()=>{var[visibleId,setVisibleId]=(0,react.useState)(null),topLeftRef=(0,react.useRef)(null),topRightRef=(0,react.useRef)(null),rightTopRef=(0,react.useRef)(null),rightBottomRef=(0,react.useRef)(null),bottomLeftRef=(0,react.useRef)(null),bottomRightRef=(0,react.useRef)(null),leftTopRef=(0,react.useRef)(null),leftBottomRef=(0,react.useRef)(null),handleClose=()=>{setVisibleId(null)};return(0,jsx_runtime.jsxs)("div",{className:pointer_box_PointerBox_stories_module.variantsStoryLayout,children:[(0,jsx_runtime.jsx)("h1",{children:"Click on the dots to see the pointer box"}),(0,jsx_runtime.jsxs)("div",{className:pointer_box_PointerBox_stories_module.variantsStoryContainer,children:[(0,jsx_runtime.jsx)("div",{ref:topLeftRef,className:classnames_default()(pointer_box_PointerBox_stories_module.variantsStoryAnchor,pointer_box_PointerBox_stories_module.variantsStoryTopLeft),onClick:()=>setVisibleId(PointerBox.y.TOP_LEFT),children:visibleId===PointerBox.y.TOP_LEFT&&topLeftRef.current&&(0,jsx_runtime.jsx)(PointerBox.A,{anchor:topLeftRef.current,onOutsideClick:handleClose,position:PointerBox.y.TOP_LEFT,className:pointer_box_PointerBox_stories_module.pointerBox,children:"TOP LEFT"})}),(0,jsx_runtime.jsx)("div",{ref:topRightRef,className:classnames_default()(pointer_box_PointerBox_stories_module.variantsStoryAnchor,pointer_box_PointerBox_stories_module.variantsStoryTopRight),onClick:()=>setVisibleId(PointerBox.y.TOP_RIGHT),children:visibleId===PointerBox.y.TOP_RIGHT&&topRightRef.current&&(0,jsx_runtime.jsx)(PointerBox.A,{anchor:topRightRef.current,onOutsideClick:handleClose,position:PointerBox.y.TOP_RIGHT,className:pointer_box_PointerBox_stories_module.pointerBox,children:"TOP RIGHT"})}),(0,jsx_runtime.jsx)("div",{ref:rightTopRef,className:classnames_default()(pointer_box_PointerBox_stories_module.variantsStoryAnchor,pointer_box_PointerBox_stories_module.variantsStoryRightTop),onClick:()=>setVisibleId(PointerBox.y.RIGHT_BOTTOM),children:visibleId===PointerBox.y.RIGHT_BOTTOM&&rightTopRef.current&&(0,jsx_runtime.jsxs)(PointerBox.A,{anchor:rightTopRef.current,onOutsideClick:handleClose,position:PointerBox.y.RIGHT_BOTTOM,className:pointer_box_PointerBox_stories_module.pointerBox,children:[(0,jsx_runtime.jsx)("p",{children:"RIGHT BOTTOM (grows down)"}),(0,jsx_runtime.jsx)("p",{children:esm.Jb.lorem.paragraph()})]})}),(0,jsx_runtime.jsx)("div",{ref:rightBottomRef,className:classnames_default()(pointer_box_PointerBox_stories_module.variantsStoryAnchor,pointer_box_PointerBox_stories_module.variantsStoryRightBottom),onClick:()=>setVisibleId(PointerBox.y.RIGHT_TOP),children:visibleId===PointerBox.y.RIGHT_TOP&&rightBottomRef.current&&(0,jsx_runtime.jsxs)(PointerBox.A,{anchor:rightBottomRef.current,onOutsideClick:handleClose,position:PointerBox.y.RIGHT_TOP,className:pointer_box_PointerBox_stories_module.pointerBox,children:[(0,jsx_runtime.jsx)("p",{children:"RIGHT TOP (grows up)"}),(0,jsx_runtime.jsx)("p",{children:esm.Jb.lorem.sentence()})]})}),(0,jsx_runtime.jsx)("div",{ref:bottomLeftRef,className:classnames_default()(pointer_box_PointerBox_stories_module.variantsStoryAnchor,pointer_box_PointerBox_stories_module.variantsStoryBottomLeft),onClick:()=>setVisibleId(PointerBox.y.BOTTOM_LEFT),children:visibleId===PointerBox.y.BOTTOM_LEFT&&bottomLeftRef.current&&(0,jsx_runtime.jsx)(PointerBox.A,{anchor:bottomLeftRef.current,onOutsideClick:handleClose,position:PointerBox.y.BOTTOM_LEFT,className:pointer_box_PointerBox_stories_module.pointerBox,children:"BOTTOM LEFT"})}),(0,jsx_runtime.jsx)("div",{ref:bottomRightRef,className:classnames_default()(pointer_box_PointerBox_stories_module.variantsStoryAnchor,pointer_box_PointerBox_stories_module.variantsStoryBottomRight),onClick:()=>setVisibleId(PointerBox.y.BOTTOM_RIGHT),children:visibleId===PointerBox.y.BOTTOM_RIGHT&&bottomRightRef.current&&(0,jsx_runtime.jsx)(PointerBox.A,{anchor:bottomRightRef.current,onOutsideClick:handleClose,position:PointerBox.y.BOTTOM_RIGHT,className:pointer_box_PointerBox_stories_module.pointerBox,children:"BOTTOM RIGHT"})}),(0,jsx_runtime.jsx)("div",{ref:leftTopRef,className:classnames_default()(pointer_box_PointerBox_stories_module.variantsStoryAnchor,pointer_box_PointerBox_stories_module.variantsStoryLeftTop),onClick:()=>setVisibleId(PointerBox.y.LEFT_BOTTOM),children:visibleId===PointerBox.y.LEFT_BOTTOM&&leftTopRef.current&&(0,jsx_runtime.jsxs)(PointerBox.A,{anchor:leftTopRef.current,onOutsideClick:handleClose,position:PointerBox.y.LEFT_BOTTOM,className:pointer_box_PointerBox_stories_module.pointerBox,children:[(0,jsx_runtime.jsx)("p",{children:"LEFT TOP (grows up)"}),(0,jsx_runtime.jsx)("p",{children:esm.Jb.lorem.sentence()})]})}),(0,jsx_runtime.jsx)("div",{ref:leftBottomRef,className:classnames_default()(pointer_box_PointerBox_stories_module.variantsStoryAnchor,pointer_box_PointerBox_stories_module.variantsStoryLeftBottom),onClick:()=>setVisibleId(PointerBox.y.LEFT_TOP),children:visibleId===PointerBox.y.LEFT_TOP&&leftBottomRef.current&&(0,jsx_runtime.jsxs)(PointerBox.A,{anchor:leftBottomRef.current,onOutsideClick:handleClose,position:PointerBox.y.LEFT_TOP,className:pointer_box_PointerBox_stories_module.pointerBox,children:[(0,jsx_runtime.jsx)("p",{children:"LEFT BOTTOM (grows down)"}),(0,jsx_runtime.jsx)("p",{children:esm.Jb.lorem.sentence()})]})})]})]})};__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==typeof i?i:i+""}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var Item=props=>{var[showPointerBox,setShowPointerBox]=(0,react.useState)(!1),anchorRef=(0,react.useRef)(null),className=classnames_default()(pointer_box_PointerBox_stories_module.positioningStoryItem,props.className);return(0,jsx_runtime.jsxs)("div",{ref:anchorRef,className,onClick:()=>setShowPointerBox(!showPointerBox),children:["Click me",showPointerBox&&(0,jsx_runtime.jsx)(PointerBox.A,{anchor:anchorRef.current,onOutsideClick:()=>setShowPointerBox(!1),position:props.position,container:props.container.current,autoAdjust:!0,className:pointer_box_PointerBox_stories_module.pointerBox,pointerOffset:5,children:"Hello sailor!"})]})},Items=props=>(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Item,_objectSpread(_objectSpread({},props),{},{className:pointer_box_PointerBox_stories_module.positioningStoryItemTopLeft})),(0,jsx_runtime.jsx)(Item,_objectSpread(_objectSpread({},props),{},{className:pointer_box_PointerBox_stories_module.positioningStoryItemTopRight})),(0,jsx_runtime.jsx)(Item,_objectSpread(_objectSpread({},props),{},{className:pointer_box_PointerBox_stories_module.positioningStoryItemBottomLeft})),(0,jsx_runtime.jsx)(Item,_objectSpread(_objectSpread({},props),{},{className:pointer_box_PointerBox_stories_module.positioningStoryItemBottomRight})),(0,jsx_runtime.jsx)(Item,_objectSpread(_objectSpread({},props),{},{className:pointer_box_PointerBox_stories_module.positioningStoryItemCenter}))]}),Positions=props=>{var positions=[];for(var _position in PointerBox.y)positions.push(_position);var positionOptions=positions.map((position=>(0,jsx_runtime.jsx)("option",{value:PointerBox.y[position],children:position},position)));return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("span",{children:"Select pointer box position: "}),(0,jsx_runtime.jsx)("div",{className:pointer_box_PointerBox_stories_module.positioningStorySelector,children:(0,jsx_runtime.jsx)("select",{onChange:e=>props.onChange(e.target.value),value:props.selectedPosition,children:positionOptions})})]})};const pointerBoxPositioningStory=()=>{var[position,setPosition]=(0,react.useState)(PointerBox.y.BOTTOM_LEFT),containerRef=(0,react.useRef)(null);return(0,jsx_runtime.jsxs)("div",{className:pointer_box_PointerBox_stories_module.positioningStoryLayout,children:[(0,jsx_runtime.jsx)("h1",{children:"Auto-positioning of the pointer box"}),(0,jsx_runtime.jsx)("div",{ref:containerRef,className:pointer_box_PointerBox_stories_module.positioningStoryContainer,children:(0,jsx_runtime.jsx)(Items,{container:containerRef,position})}),(0,jsx_runtime.jsx)(Positions,{selectedPosition:position,onChange:newPosition=>setPosition(newPosition)})]})};var RenderingTarget=function(RenderingTarget){return RenderingTarget.BODY="body",RenderingTarget.ANCHOR="anchor",RenderingTarget}(RenderingTarget||{}),RenderingSwitch=props=>{var targets=[RenderingTarget.BODY,RenderingTarget.ANCHOR],texts=["Render into body","Render into anchor"],switchItems=targets.map(((target,index)=>{var classes=classnames_default()(pointer_box_PointerBox_stories_module.renderSwitchItem,{[pointer_box_PointerBox_stories_module.renderSwitchItemActive]:target===props.target});return(0,jsx_runtime.jsx)("span",{className:classes,onClick:()=>props.onChange(target),children:texts[index]},index)}));return(0,jsx_runtime.jsx)("div",{className:pointer_box_PointerBox_stories_module.renderSwitch,children:switchItems})},Info=props=>{var text=props.target===RenderingTarget.BODY?"Scroll the page and click the button — PointerBox will disappear on scroll":"Scroll the page and click the button — PointerBox will remain correctly positioned while scrolling";return(0,jsx_runtime.jsx)("p",{children:text})};const pointerBoxScrollingStory=()=>{var[showPointerBox,setShowPointerBox]=(0,react.useState)(!1),[renderingTarget,setRenderingTarget]=(0,react.useState)(RenderingTarget.BODY),anchorRef=(0,react.useRef)(null);return(0,react.useEffect)((()=>{setShowPointerBox(!1)}),[renderingTarget]),(0,jsx_runtime.jsxs)("div",{className:pointer_box_PointerBox_stories_module.scrollingStoryContainer,children:[(0,jsx_runtime.jsxs)("div",{className:pointer_box_PointerBox_stories_module.scrollingStoryHeader,children:[(0,jsx_runtime.jsx)(Info,{target:renderingTarget}),(0,jsx_runtime.jsx)(RenderingSwitch,{target:renderingTarget,onChange:setRenderingTarget})]}),(0,jsx_runtime.jsx)("div",{className:pointer_box_PointerBox_stories_module.scrollingStoryAnchorContainer,children:(0,jsx_runtime.jsxs)("div",{className:pointer_box_PointerBox_stories_module.scrollingStoryAnchorContainerInner,children:[(0,jsx_runtime.jsx)("button",{ref:anchorRef,className:pointer_box_PointerBox_stories_module.scrollingStoryButton,onClick:()=>setShowPointerBox(!showPointerBox),children:"Click me"}),showPointerBox&&(0,jsx_runtime.jsx)(PointerBox.A,{anchor:anchorRef.current,position:PointerBox.y.BOTTOM_LEFT,onClose:()=>setShowPointerBox(!1),renderInsideAnchor:renderingTarget===RenderingTarget.ANCHOR,className:pointer_box_PointerBox_stories_module.pointerBox,children:"Hello sailor!"})]})})]})},PointerBox_stories={title:"Components/Shared Components/PointerBox"};var PointerBoxVariants=()=>(0,jsx_runtime.jsx)(pointerBoxVariantsStory,{});PointerBoxVariants.storyName="variants";var PointerBoxPositioning=()=>(0,jsx_runtime.jsx)(pointerBoxPositioningStory,{});PointerBoxPositioning.storyName="positioning";var PointerBoxScrolling=()=>(0,jsx_runtime.jsx)(pointerBoxScrollingStory,{});PointerBoxScrolling.storyName="scrolling",PointerBoxVariants.parameters={...PointerBoxVariants.parameters,docs:{...PointerBoxVariants.parameters?.docs,source:{originalSource:"() => {\n  return <VariantsStory />;\n}",...PointerBoxVariants.parameters?.docs?.source}}},PointerBoxPositioning.parameters={...PointerBoxPositioning.parameters,docs:{...PointerBoxPositioning.parameters?.docs,source:{originalSource:"() => {\n  return <PositioningStory />;\n}",...PointerBoxPositioning.parameters?.docs?.source}}},PointerBoxScrolling.parameters={...PointerBoxScrolling.parameters,docs:{...PointerBoxScrolling.parameters?.docs,source:{originalSource:"() => {\n  return <ScrollingStory />;\n}",...PointerBoxScrolling.parameters?.docs?.source}}};const __namedExportsOrder=["PointerBoxVariants","PointerBoxPositioning","PointerBoxScrolling"]},"./node_modules/core-js/internals/array-method-is-strict.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var fails=__webpack_require__("./node_modules/core-js/internals/fails.js");module.exports=function(METHOD_NAME,argument){var method=[][METHOD_NAME];return!!method&&fails((function(){method.call(null,argument||function(){return 1},1)}))}},"./node_modules/core-js/internals/array-reduce.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),IndexedObject=__webpack_require__("./node_modules/core-js/internals/indexed-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),$TypeError=TypeError,REDUCE_EMPTY="Reduce of empty array with no initial value",createMethod=function(IS_RIGHT){return function(that,callbackfn,argumentsLength,memo){var O=toObject(that),self=IndexedObject(O),length=lengthOfArrayLike(O);if(aCallable(callbackfn),0===length&&argumentsLength<2)throw new $TypeError(REDUCE_EMPTY);var index=IS_RIGHT?length-1:0,i=IS_RIGHT?-1:1;if(argumentsLength<2)for(;;){if(index in self){memo=self[index],index+=i;break}if(index+=i,IS_RIGHT?index<0:length<=index)throw new $TypeError(REDUCE_EMPTY)}for(;IS_RIGHT?index>=0:length>index;index+=i)index in self&&(memo=callbackfn(memo,self[index],index,O));return memo}};module.exports={left:createMethod(!1),right:createMethod(!0)}},"./node_modules/core-js/internals/correct-is-regexp-logic.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var MATCH=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js")("match");module.exports=function(METHOD_NAME){var regexp=/./;try{"/./"[METHOD_NAME](regexp)}catch(error1){try{return regexp[MATCH]=!1,"/./"[METHOD_NAME](regexp)}catch(error2){}}return!1}},"./node_modules/core-js/internals/delete-property-or-throw.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var tryToString=__webpack_require__("./node_modules/core-js/internals/try-to-string.js"),$TypeError=TypeError;module.exports=function(O,P){if(!delete O[P])throw new $TypeError("Cannot delete property "+tryToString(P)+" of "+tryToString(O))}},"./node_modules/core-js/internals/is-regexp.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var isObject=__webpack_require__("./node_modules/core-js/internals/is-object.js"),classof=__webpack_require__("./node_modules/core-js/internals/classof-raw.js"),MATCH=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js")("match");module.exports=function(it){var isRegExp;return isObject(it)&&(void 0!==(isRegExp=it[MATCH])?!!isRegExp:"RegExp"===classof(it))}},"./node_modules/core-js/internals/not-a-regexp.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var isRegExp=__webpack_require__("./node_modules/core-js/internals/is-regexp.js"),$TypeError=TypeError;module.exports=function(it){if(isRegExp(it))throw new $TypeError("The method doesn't accept regular expressions");return it}},"./node_modules/core-js/modules/es.array.includes.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),$includes=__webpack_require__("./node_modules/core-js/internals/array-includes.js").includes,fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),addToUnscopables=__webpack_require__("./node_modules/core-js/internals/add-to-unscopables.js");$({target:"Array",proto:!0,forced:fails((function(){return!Array(1).includes()}))},{includes:function includes(el){return $includes(this,el,arguments.length>1?arguments[1]:void 0)}}),addToUnscopables("includes")},"./node_modules/core-js/modules/es.array.reduce.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),$reduce=__webpack_require__("./node_modules/core-js/internals/array-reduce.js").left,arrayMethodIsStrict=__webpack_require__("./node_modules/core-js/internals/array-method-is-strict.js"),CHROME_VERSION=__webpack_require__("./node_modules/core-js/internals/engine-v8-version.js");$({target:"Array",proto:!0,forced:!__webpack_require__("./node_modules/core-js/internals/engine-is-node.js")&&CHROME_VERSION>79&&CHROME_VERSION<83||!arrayMethodIsStrict("reduce")},{reduce:function reduce(callbackfn){var length=arguments.length;return $reduce(this,callbackfn,length,length>1?arguments[1]:void 0)}})},"./node_modules/core-js/modules/es.array.unshift.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),setArrayLength=__webpack_require__("./node_modules/core-js/internals/array-set-length.js"),deletePropertyOrThrow=__webpack_require__("./node_modules/core-js/internals/delete-property-or-throw.js"),doesNotExceedSafeInteger=__webpack_require__("./node_modules/core-js/internals/does-not-exceed-safe-integer.js");$({target:"Array",proto:!0,arity:1,forced:1!==[].unshift(0)||!function(){try{Object.defineProperty([],"length",{writable:!1}).unshift()}catch(error){return error instanceof TypeError}}()},{unshift:function unshift(item){var O=toObject(this),len=lengthOfArrayLike(O),argCount=arguments.length;if(argCount){doesNotExceedSafeInteger(len+argCount);for(var k=len;k--;){var to=k+argCount;k in O?O[to]=O[k]:deletePropertyOrThrow(O,to)}for(var j=0;j<argCount;j++)O[j]=arguments[j]}return setArrayLength(O,len+argCount)}})},"./node_modules/core-js/modules/es.string.includes.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),notARegExp=__webpack_require__("./node_modules/core-js/internals/not-a-regexp.js"),requireObjectCoercible=__webpack_require__("./node_modules/core-js/internals/require-object-coercible.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),correctIsRegExpLogic=__webpack_require__("./node_modules/core-js/internals/correct-is-regexp-logic.js"),stringIndexOf=uncurryThis("".indexOf);$({target:"String",proto:!0,forced:!correctIsRegExpLogic("includes")},{includes:function includes(searchString){return!!~stringIndexOf(toString(requireObjectCoercible(this)),toString(notARegExp(searchString)),arguments.length>1?arguments[1]:void 0)}})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/pointer-box/PointerBox.stories.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".pointerBox__PointerBox-stories-module__GhhSI {\n  --pointer-box-padding: 6px 12px;\n}\n\n.pointerBox__PointerBox-stories-module__GhhSI p {\n  max-width: 200px;\n}\n\n.pointerBoxPointer__PointerBox-stories-module__bWh_i {\n  fill: black;\n}\n\n.variantsStoryLayout__PointerBox-stories-module__boNLG {\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n\n.variantsStoryLayout__PointerBox-stories-module__boNLG h1 {\n  position: absolute;\n  top: 2em;\n}\n\n.variantsStoryContainer__PointerBox-stories-module__BH6W0 {\n  position: relative;\n  width: 200px;\n  height: 200px;\n}\n\n.variantsStoryAnchor__PointerBox-stories-module__DT496 {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  background: black;\n  border-radius: 50%;\n  cursor: pointer;\n}\n\n.variantsStoryAnchor__PointerBox-stories-module__DT496:hover {\n  background: green;\n}\n\n.variantsStoryTopLeft__PointerBox-stories-module__FyG8Y {\n  left: 10%;\n  top: 0;\n}\n\n.variantsStoryTopRight__PointerBox-stories-module__AE3YJ {\n  right: 10%;\n  top: 0;\n}\n\n.variantsStoryRightTop__PointerBox-stories-module__czCtX {\n  right: 0%;\n  top: 10%;\n}\n\n.variantsStoryRightBottom__PointerBox-stories-module__AhVCw {\n  right: 0;\n  bottom: 10%;\n}\n\n.variantsStoryBottomLeft__PointerBox-stories-module__xwDPc {\n  bottom: 0;\n  left: 10%;\n}\n\n.variantsStoryBottomRight__PointerBox-stories-module__v9p6f {\n  bottom: 0;\n  right: 10%;\n}\n\n.variantsStoryLeftTop__PointerBox-stories-module__GCJgc {\n  left: 0;\n  top: 10%;\n}\n\n.variantsStoryLeftBottom__PointerBox-stories-module__n72FV {\n  left: 0;\n  bottom: 10%;\n}\n\n.positioningStoryLayout__PointerBox-stories-module__uVyRR {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-height: 100vh;\n  max-width: 900px;\n  margin: auto;\n  padding-bottom: 70px;\n}\n\n.positioningStoryContainer__PointerBox-stories-module__BrjbA {\n  position: relative;\n  height: 600px;\n  width: 600px;\n  background: var(--color-light-grey);\n}\n\n.positioningStoryItem__PointerBox-stories-module__uOuje {\n  position: absolute;\n  padding: 1.5em;\n  background: var(--color-grey);\n}\n\n.positioningStoryItemTopLeft__PointerBox-stories-module__atMMf {\n  left: 2em;\n  top: 2em;\n}\n\n.positioningStoryItemTopRight__PointerBox-stories-module__ElDUh {\n  right: 2em;\n  top: 2em;\n}\n\n.positioningStoryItemBottomLeft__PointerBox-stories-module__UAocw {\n  left: 2em;\n  bottom: 2em;\n}\n\n.positioningStoryItemBottomRight__PointerBox-stories-module__YFOtc {\n  right: 2em;\n  bottom: 2em;\n}\n\n.positioningStoryItemCenter__PointerBox-stories-module__fFH8p {\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n\n.positioningStorySelector__PointerBox-stories-module__qMYqn {\n  display: inline-block;\n  margin-top: 1em;\n}\n\n.scrollingStoryContainer__PointerBox-stories-module__effeQ {\n  display: flex;\n  padding-top: 10vh;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  height: 150vh;\n}\n\n.scrollingStoryAnchorContainer__PointerBox-stories-module__Qi3dE {\n  height: 40vh;\n  width: 30vw;\n  overflow: auto;\n  border: 1px black dashed;\n}\n\n.scrollingStoryHeader__PointerBox-stories-module__zrdf0 {\n  padding-bottom: 1em;\n}\n\n.scrollingStoryAnchorContainerInner__PointerBox-stories-module__qKOp8 {\n  height: 150%;\n  width: 150%;\n  padding: 2em;\n}\n\n.scrollingStoryInfo__PointerBox-stories-module__O6pp2 {\n  width: 600px;\n  margin: auto;\n  padding-top: 0.6em;\n  font-size: 16px;\n}\n\n.scrollingStoryButton__PointerBox-stories-module__mz5r6 {\n  position: relative;\n  padding: 1.5em;\n  background: var(--color-grey);\n}\n\n.renderSwitch__PointerBox-stories-module__Quidz {\n  text-align: center;\n}\n\n.renderSwitchItem__PointerBox-stories-module__yHloV {\n  color: var(--color-blue);\n  -webkit-text-decoration: underline;\n  text-decoration: underline;\n  text-decoration-style: dotted;\n  cursor: pointer;\n}\n\n.renderSwitchItem__PointerBox-stories-module__yHloV:first-child {\n  margin-right: 1em;\n}\n\n.renderSwitchItemActive__PointerBox-stories-module__R6Qrz {\n  color: black;\n  -webkit-text-decoration: none;\n  text-decoration: none;\n}\n","",{version:3,sources:["webpack://./stories/shared-components/pointer-box/PointerBox.stories.module.css"],names:[],mappings:"AAAA;EACE,+BAA+B;AACjC;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,aAAa;EACb,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,uBAAuB;AACzB;;AAEA;EACE,kBAAkB;EAClB,QAAQ;AACV;;AAEA;EACE,kBAAkB;EAClB,YAAY;EACZ,aAAa;AACf;;AAEA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,eAAe;AACjB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,SAAS;EACT,MAAM;AACR;;AAEA;EACE,UAAU;EACV,MAAM;AACR;;AAEA;EACE,SAAS;EACT,QAAQ;AACV;;AAEA;EACE,QAAQ;EACR,WAAW;AACb;;AAEA;EACE,SAAS;EACT,SAAS;AACX;;AAEA;EACE,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,OAAO;EACP,QAAQ;AACV;;AAEA;EACE,OAAO;EACP,WAAW;AACb;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;EACjB,gBAAgB;EAChB,YAAY;EACZ,oBAAoB;AACtB;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,YAAY;EACZ,mCAAmC;AACrC;;AAEA;EACE,kBAAkB;EAClB,cAAc;EACd,6BAA6B;AAC/B;;AAEA;EACE,SAAS;EACT,QAAQ;AACV;;AAEA;EACE,UAAU;EACV,QAAQ;AACV;;AAEA;EACE,SAAS;EACT,WAAW;AACb;;AAEA;EACE,UAAU;EACV,WAAW;AACb;;AAEA;EACE,QAAQ;EACR,SAAS;EACT,gCAAgC;AAClC;;AAEA;EACE,qBAAqB;EACrB,eAAe;AACjB;;AAEA;EACE,aAAa;EACb,iBAAiB;EACjB,sBAAsB;EACtB,2BAA2B;EAC3B,mBAAmB;EACnB,aAAa;AACf;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,cAAc;EACd,wBAAwB;AAC1B;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,YAAY;AACd;;AAEA;EACE,YAAY;EACZ,YAAY;EACZ,kBAAkB;EAClB,eAAe;AACjB;;AAEA;EACE,kBAAkB;EAClB,cAAc;EACd,6BAA6B;AAC/B;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,wBAAwB;EACxB,kCAA0B;EAA1B,0BAA0B;EAC1B,6BAA6B;EAC7B,eAAe;AACjB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,YAAY;EACZ,6BAAqB;EAArB,qBAAqB;AACvB",sourcesContent:[".pointerBox {\n  --pointer-box-padding: 6px 12px;\n}\n\n.pointerBox p {\n  max-width: 200px;\n}\n\n.pointerBoxPointer {\n  fill: black;\n}\n\n.variantsStoryLayout {\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n\n.variantsStoryLayout h1 {\n  position: absolute;\n  top: 2em;\n}\n\n.variantsStoryContainer {\n  position: relative;\n  width: 200px;\n  height: 200px;\n}\n\n.variantsStoryAnchor {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  background: black;\n  border-radius: 50%;\n  cursor: pointer;\n}\n\n.variantsStoryAnchor:hover {\n  background: green;\n}\n\n.variantsStoryTopLeft {\n  left: 10%;\n  top: 0;\n}\n\n.variantsStoryTopRight {\n  right: 10%;\n  top: 0;\n}\n\n.variantsStoryRightTop {\n  right: 0%;\n  top: 10%;\n}\n\n.variantsStoryRightBottom {\n  right: 0;\n  bottom: 10%;\n}\n\n.variantsStoryBottomLeft {\n  bottom: 0;\n  left: 10%;\n}\n\n.variantsStoryBottomRight {\n  bottom: 0;\n  right: 10%;\n}\n\n.variantsStoryLeftTop {\n  left: 0;\n  top: 10%;\n}\n\n.variantsStoryLeftBottom {\n  left: 0;\n  bottom: 10%;\n}\n\n.positioningStoryLayout {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-height: 100vh;\n  max-width: 900px;\n  margin: auto;\n  padding-bottom: 70px;\n}\n\n.positioningStoryContainer {\n  position: relative;\n  height: 600px;\n  width: 600px;\n  background: var(--color-light-grey);\n}\n\n.positioningStoryItem {\n  position: absolute;\n  padding: 1.5em;\n  background: var(--color-grey);\n}\n\n.positioningStoryItemTopLeft {\n  left: 2em;\n  top: 2em;\n}\n\n.positioningStoryItemTopRight {\n  right: 2em;\n  top: 2em;\n}\n\n.positioningStoryItemBottomLeft {\n  left: 2em;\n  bottom: 2em;\n}\n\n.positioningStoryItemBottomRight {\n  right: 2em;\n  bottom: 2em;\n}\n\n.positioningStoryItemCenter {\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n\n.positioningStorySelector {\n  display: inline-block;\n  margin-top: 1em;\n}\n\n.scrollingStoryContainer {\n  display: flex;\n  padding-top: 10vh;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  height: 150vh;\n}\n\n.scrollingStoryAnchorContainer {\n  height: 40vh;\n  width: 30vw;\n  overflow: auto;\n  border: 1px black dashed;\n}\n\n.scrollingStoryHeader {\n  padding-bottom: 1em;\n}\n\n.scrollingStoryAnchorContainerInner {\n  height: 150%;\n  width: 150%;\n  padding: 2em;\n}\n\n.scrollingStoryInfo {\n  width: 600px;\n  margin: auto;\n  padding-top: 0.6em;\n  font-size: 16px;\n}\n\n.scrollingStoryButton {\n  position: relative;\n  padding: 1.5em;\n  background: var(--color-grey);\n}\n\n.renderSwitch {\n  text-align: center;\n}\n\n.renderSwitchItem {\n  color: var(--color-blue);\n  text-decoration: underline;\n  text-decoration-style: dotted;\n  cursor: pointer;\n}\n\n.renderSwitchItem:first-child {\n  margin-right: 1em;\n}\n\n.renderSwitchItemActive {\n  color: black;\n  text-decoration: none;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={pointerBox:"pointerBox__PointerBox-stories-module__GhhSI",pointerBoxPointer:"pointerBoxPointer__PointerBox-stories-module__bWh_i",variantsStoryLayout:"variantsStoryLayout__PointerBox-stories-module__boNLG",variantsStoryContainer:"variantsStoryContainer__PointerBox-stories-module__BH6W0",variantsStoryAnchor:"variantsStoryAnchor__PointerBox-stories-module__DT496",variantsStoryTopLeft:"variantsStoryTopLeft__PointerBox-stories-module__FyG8Y",variantsStoryTopRight:"variantsStoryTopRight__PointerBox-stories-module__AE3YJ",variantsStoryRightTop:"variantsStoryRightTop__PointerBox-stories-module__czCtX",variantsStoryRightBottom:"variantsStoryRightBottom__PointerBox-stories-module__AhVCw",variantsStoryBottomLeft:"variantsStoryBottomLeft__PointerBox-stories-module__xwDPc",variantsStoryBottomRight:"variantsStoryBottomRight__PointerBox-stories-module__v9p6f",variantsStoryLeftTop:"variantsStoryLeftTop__PointerBox-stories-module__GCJgc",variantsStoryLeftBottom:"variantsStoryLeftBottom__PointerBox-stories-module__n72FV",positioningStoryLayout:"positioningStoryLayout__PointerBox-stories-module__uVyRR",positioningStoryContainer:"positioningStoryContainer__PointerBox-stories-module__BrjbA",positioningStoryItem:"positioningStoryItem__PointerBox-stories-module__uOuje",positioningStoryItemTopLeft:"positioningStoryItemTopLeft__PointerBox-stories-module__atMMf",positioningStoryItemTopRight:"positioningStoryItemTopRight__PointerBox-stories-module__ElDUh",positioningStoryItemBottomLeft:"positioningStoryItemBottomLeft__PointerBox-stories-module__UAocw",positioningStoryItemBottomRight:"positioningStoryItemBottomRight__PointerBox-stories-module__YFOtc",positioningStoryItemCenter:"positioningStoryItemCenter__PointerBox-stories-module__fFH8p",positioningStorySelector:"positioningStorySelector__PointerBox-stories-module__qMYqn",scrollingStoryContainer:"scrollingStoryContainer__PointerBox-stories-module__effeQ",scrollingStoryAnchorContainer:"scrollingStoryAnchorContainer__PointerBox-stories-module__Qi3dE",scrollingStoryHeader:"scrollingStoryHeader__PointerBox-stories-module__zrdf0",scrollingStoryAnchorContainerInner:"scrollingStoryAnchorContainerInner__PointerBox-stories-module__qKOp8",scrollingStoryInfo:"scrollingStoryInfo__PointerBox-stories-module__O6pp2",scrollingStoryButton:"scrollingStoryButton__PointerBox-stories-module__mz5r6",renderSwitch:"renderSwitch__PointerBox-stories-module__Quidz",renderSwitchItem:"renderSwitchItem__PointerBox-stories-module__yHloV",renderSwitchItemActive:"renderSwitchItemActive__PointerBox-stories-module__R6Qrz"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/lodash/_baseFindIndex.js":module=>{module.exports=function baseFindIndex(array,predicate,fromIndex,fromRight){for(var length=array.length,index=fromIndex+(fromRight?1:-1);fromRight?index--:++index<length;)if(predicate(array[index],index,array))return index;return-1}},"./node_modules/lodash/_baseTrim.js":(module,__unused_webpack_exports,__webpack_require__)=>{var trimmedEndIndex=__webpack_require__("./node_modules/lodash/_trimmedEndIndex.js"),reTrimStart=/^\s+/;module.exports=function baseTrim(string){return string?string.slice(0,trimmedEndIndex(string)+1).replace(reTrimStart,""):string}},"./node_modules/lodash/_trimmedEndIndex.js":module=>{var reWhitespace=/\s/;module.exports=function trimmedEndIndex(string){for(var index=string.length;index--&&reWhitespace.test(string.charAt(index)););return index}},"./node_modules/lodash/before.js":(module,__unused_webpack_exports,__webpack_require__)=>{var toInteger=__webpack_require__("./node_modules/lodash/toInteger.js");module.exports=function before(n,func){var result;if("function"!=typeof func)throw new TypeError("Expected a function");return n=toInteger(n),function(){return--n>0&&(result=func.apply(this,arguments)),n<=1&&(func=void 0),result}}},"./node_modules/lodash/findIndex.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseFindIndex=__webpack_require__("./node_modules/lodash/_baseFindIndex.js"),baseIteratee=__webpack_require__("./node_modules/lodash/_baseIteratee.js"),toInteger=__webpack_require__("./node_modules/lodash/toInteger.js"),nativeMax=Math.max;module.exports=function findIndex(array,predicate,fromIndex){var length=null==array?0:array.length;if(!length)return-1;var index=null==fromIndex?0:toInteger(fromIndex);return index<0&&(index=nativeMax(length+index,0)),baseFindIndex(array,baseIteratee(predicate,3),index)}},"./node_modules/lodash/isEqual.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseIsEqual=__webpack_require__("./node_modules/lodash/_baseIsEqual.js");module.exports=function isEqual(value,other){return baseIsEqual(value,other)}},"./node_modules/lodash/noop.js":module=>{module.exports=function noop(){}},"./node_modules/lodash/once.js":(module,__unused_webpack_exports,__webpack_require__)=>{var before=__webpack_require__("./node_modules/lodash/before.js");module.exports=function once(func){return before(2,func)}},"./node_modules/lodash/toFinite.js":(module,__unused_webpack_exports,__webpack_require__)=>{var toNumber=__webpack_require__("./node_modules/lodash/toNumber.js");module.exports=function toFinite(value){return value?Infinity===(value=toNumber(value))||-Infinity===value?17976931348623157e292*(value<0?-1:1):value==value?value:0:0===value?value:0}},"./node_modules/lodash/toInteger.js":(module,__unused_webpack_exports,__webpack_require__)=>{var toFinite=__webpack_require__("./node_modules/lodash/toFinite.js");module.exports=function toInteger(value){var result=toFinite(value),remainder=result%1;return result==result?remainder?result-remainder:result:0}},"./node_modules/lodash/toNumber.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseTrim=__webpack_require__("./node_modules/lodash/_baseTrim.js"),isObject=__webpack_require__("./node_modules/lodash/isObject.js"),isSymbol=__webpack_require__("./node_modules/lodash/isSymbol.js"),reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt;module.exports=function toNumber(value){if("number"==typeof value)return value;if(isSymbol(value))return NaN;if(isObject(value)){var other="function"==typeof value.valueOf?value.valueOf():value;value=isObject(other)?other+"":other}if("string"!=typeof value)return 0===value?value:+value;value=baseTrim(value);var isBinary=reIsBinary.test(value);return isBinary||reIsOctal.test(value)?freeParseInt(value.slice(2),isBinary?2:8):reIsBadHex.test(value)?NaN:+value}}}]);