(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[9845],{"./node_modules/core-js/internals/advance-string-index.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var charAt=__webpack_require__("./node_modules/core-js/internals/string-multibyte.js").charAt;module.exports=function(S,index,unicode){return index+(unicode?charAt(S,index).length:1)}},"./node_modules/core-js/internals/engine-ff-version.js":(module,__unused_webpack_exports,__webpack_require__)=>{var firefox=__webpack_require__("./node_modules/core-js/internals/engine-user-agent.js").match(/firefox\/(\d+)/i);module.exports=!!firefox&&+firefox[1]},"./node_modules/core-js/internals/engine-is-ie-or-edge.js":(module,__unused_webpack_exports,__webpack_require__)=>{var UA=__webpack_require__("./node_modules/core-js/internals/engine-user-agent.js");module.exports=/MSIE|Trident/.test(UA)},"./node_modules/core-js/internals/engine-webkit-version.js":(module,__unused_webpack_exports,__webpack_require__)=>{var webkit=__webpack_require__("./node_modules/core-js/internals/engine-user-agent.js").match(/AppleWebKit\/(\d+)\./);module.exports=!!webkit&&+webkit[1]},"./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");var uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this-clause.js"),defineBuiltIn=__webpack_require__("./node_modules/core-js/internals/define-built-in.js"),regexpExec=__webpack_require__("./node_modules/core-js/internals/regexp-exec.js"),fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),createNonEnumerableProperty=__webpack_require__("./node_modules/core-js/internals/create-non-enumerable-property.js"),SPECIES=wellKnownSymbol("species"),RegExpPrototype=RegExp.prototype;module.exports=function(KEY,exec,FORCED,SHAM){var SYMBOL=wellKnownSymbol(KEY),DELEGATES_TO_SYMBOL=!fails((function(){var O={};return O[SYMBOL]=function(){return 7},7!=""[KEY](O)})),DELEGATES_TO_EXEC=DELEGATES_TO_SYMBOL&&!fails((function(){var execCalled=!1,re=/a/;return"split"===KEY&&((re={}).constructor={},re.constructor[SPECIES]=function(){return re},re.flags="",re[SYMBOL]=/./[SYMBOL]),re.exec=function(){return execCalled=!0,null},re[SYMBOL](""),!execCalled}));if(!DELEGATES_TO_SYMBOL||!DELEGATES_TO_EXEC||FORCED){var uncurriedNativeRegExpMethod=uncurryThis(/./[SYMBOL]),methods=exec(SYMBOL,""[KEY],(function(nativeMethod,regexp,str,arg2,forceStringMethod){var uncurriedNativeMethod=uncurryThis(nativeMethod),$exec=regexp.exec;return $exec===regexpExec||$exec===RegExpPrototype.exec?DELEGATES_TO_SYMBOL&&!forceStringMethod?{done:!0,value:uncurriedNativeRegExpMethod(regexp,str,arg2)}:{done:!0,value:uncurriedNativeMethod(str,regexp,arg2)}:{done:!1}}));defineBuiltIn(String.prototype,KEY,methods[0]),defineBuiltIn(RegExpPrototype,SYMBOL,methods[1])}SHAM&&createNonEnumerableProperty(RegExpPrototype[SYMBOL],"sham",!0)}},"./node_modules/core-js/internals/get-substitution.js":(module,__unused_webpack_exports,__webpack_require__)=>{var uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),floor=Math.floor,charAt=uncurryThis("".charAt),replace=uncurryThis("".replace),stringSlice=uncurryThis("".slice),SUBSTITUTION_SYMBOLS=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,SUBSTITUTION_SYMBOLS_NO_NAMED=/\$([$&'`]|\d{1,2})/g;module.exports=function(matched,str,position,captures,namedCaptures,replacement){var tailPos=position+matched.length,m=captures.length,symbols=SUBSTITUTION_SYMBOLS_NO_NAMED;return void 0!==namedCaptures&&(namedCaptures=toObject(namedCaptures),symbols=SUBSTITUTION_SYMBOLS),replace(replacement,symbols,(function(match,ch){var capture;switch(charAt(ch,0)){case"$":return"$";case"&":return matched;case"`":return stringSlice(str,0,position);case"'":return stringSlice(str,tailPos);case"<":capture=namedCaptures[stringSlice(ch,1,-1)];break;default:var n=+ch;if(0===n)return match;if(n>m){var f=floor(n/10);return 0===f?match:f<=m?void 0===captures[f-1]?charAt(ch,1):captures[f-1]+charAt(ch,1):match}capture=captures[n-1]}return void 0===capture?"":capture}))}},"./node_modules/core-js/internals/regexp-exec-abstract.js":(module,__unused_webpack_exports,__webpack_require__)=>{var call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),classof=__webpack_require__("./node_modules/core-js/internals/classof-raw.js"),regexpExec=__webpack_require__("./node_modules/core-js/internals/regexp-exec.js"),$TypeError=TypeError;module.exports=function(R,S){var exec=R.exec;if(isCallable(exec)){var result=call(exec,R,S);return null!==result&&anObject(result),result}if("RegExp"===classof(R))return call(regexpExec,R,S);throw $TypeError("RegExp#exec called on incompatible receiver")}},"./node_modules/core-js/internals/regexp-exec.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var re1,re2,call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),regexpFlags=__webpack_require__("./node_modules/core-js/internals/regexp-flags.js"),stickyHelpers=__webpack_require__("./node_modules/core-js/internals/regexp-sticky-helpers.js"),shared=__webpack_require__("./node_modules/core-js/internals/shared.js"),create=__webpack_require__("./node_modules/core-js/internals/object-create.js"),getInternalState=__webpack_require__("./node_modules/core-js/internals/internal-state.js").get,UNSUPPORTED_DOT_ALL=__webpack_require__("./node_modules/core-js/internals/regexp-unsupported-dot-all.js"),UNSUPPORTED_NCG=__webpack_require__("./node_modules/core-js/internals/regexp-unsupported-ncg.js"),nativeReplace=shared("native-string-replace",String.prototype.replace),nativeExec=RegExp.prototype.exec,patchedExec=nativeExec,charAt=uncurryThis("".charAt),indexOf=uncurryThis("".indexOf),replace=uncurryThis("".replace),stringSlice=uncurryThis("".slice),UPDATES_LAST_INDEX_WRONG=(re2=/b*/g,call(nativeExec,re1=/a/,"a"),call(nativeExec,re2,"a"),0!==re1.lastIndex||0!==re2.lastIndex),UNSUPPORTED_Y=stickyHelpers.BROKEN_CARET,NPCG_INCLUDED=void 0!==/()??/.exec("")[1];(UPDATES_LAST_INDEX_WRONG||NPCG_INCLUDED||UNSUPPORTED_Y||UNSUPPORTED_DOT_ALL||UNSUPPORTED_NCG)&&(patchedExec=function exec(string){var result,reCopy,lastIndex,match,i,object,group,re=this,state=getInternalState(re),str=toString(string),raw=state.raw;if(raw)return raw.lastIndex=re.lastIndex,result=call(patchedExec,raw,str),re.lastIndex=raw.lastIndex,result;var groups=state.groups,sticky=UNSUPPORTED_Y&&re.sticky,flags=call(regexpFlags,re),source=re.source,charsAdded=0,strCopy=str;if(sticky&&(flags=replace(flags,"y",""),-1===indexOf(flags,"g")&&(flags+="g"),strCopy=stringSlice(str,re.lastIndex),re.lastIndex>0&&(!re.multiline||re.multiline&&"\n"!==charAt(str,re.lastIndex-1))&&(source="(?: "+source+")",strCopy=" "+strCopy,charsAdded++),reCopy=new RegExp("^(?:"+source+")",flags)),NPCG_INCLUDED&&(reCopy=new RegExp("^"+source+"$(?!\\s)",flags)),UPDATES_LAST_INDEX_WRONG&&(lastIndex=re.lastIndex),match=call(nativeExec,sticky?reCopy:re,strCopy),sticky?match?(match.input=stringSlice(match.input,charsAdded),match[0]=stringSlice(match[0],charsAdded),match.index=re.lastIndex,re.lastIndex+=match[0].length):re.lastIndex=0:UPDATES_LAST_INDEX_WRONG&&match&&(re.lastIndex=re.global?match.index+match[0].length:lastIndex),NPCG_INCLUDED&&match&&match.length>1&&call(nativeReplace,match[0],reCopy,(function(){for(i=1;i<arguments.length-2;i++)void 0===arguments[i]&&(match[i]=void 0)})),match&&groups)for(match.groups=object=create(null),i=0;i<groups.length;i++)object[(group=groups[i])[0]]=match[group[1]];return match}),module.exports=patchedExec},"./node_modules/core-js/internals/regexp-sticky-helpers.js":(module,__unused_webpack_exports,__webpack_require__)=>{var fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),$RegExp=__webpack_require__("./node_modules/core-js/internals/global.js").RegExp,UNSUPPORTED_Y=fails((function(){var re=$RegExp("a","y");return re.lastIndex=2,null!=re.exec("abcd")})),MISSED_STICKY=UNSUPPORTED_Y||fails((function(){return!$RegExp("a","y").sticky})),BROKEN_CARET=UNSUPPORTED_Y||fails((function(){var re=$RegExp("^r","gy");return re.lastIndex=2,null!=re.exec("str")}));module.exports={BROKEN_CARET,MISSED_STICKY,UNSUPPORTED_Y}},"./node_modules/core-js/internals/regexp-unsupported-dot-all.js":(module,__unused_webpack_exports,__webpack_require__)=>{var fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),$RegExp=__webpack_require__("./node_modules/core-js/internals/global.js").RegExp;module.exports=fails((function(){var re=$RegExp(".","s");return!(re.dotAll&&re.exec("\n")&&"s"===re.flags)}))},"./node_modules/core-js/internals/regexp-unsupported-ncg.js":(module,__unused_webpack_exports,__webpack_require__)=>{var fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),$RegExp=__webpack_require__("./node_modules/core-js/internals/global.js").RegExp;module.exports=fails((function(){var re=$RegExp("(?<a>b)","g");return"b"!==re.exec("b").groups.a||"bc"!=="b".replace(re,"$<a>c")}))},"./node_modules/core-js/modules/es.array.sort.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),deletePropertyOrThrow=__webpack_require__("./node_modules/core-js/internals/delete-property-or-throw.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),internalSort=__webpack_require__("./node_modules/core-js/internals/array-sort.js"),arrayMethodIsStrict=__webpack_require__("./node_modules/core-js/internals/array-method-is-strict.js"),FF=__webpack_require__("./node_modules/core-js/internals/engine-ff-version.js"),IE_OR_EDGE=__webpack_require__("./node_modules/core-js/internals/engine-is-ie-or-edge.js"),V8=__webpack_require__("./node_modules/core-js/internals/engine-v8-version.js"),WEBKIT=__webpack_require__("./node_modules/core-js/internals/engine-webkit-version.js"),test=[],nativeSort=uncurryThis(test.sort),push=uncurryThis(test.push),FAILS_ON_UNDEFINED=fails((function(){test.sort(void 0)})),FAILS_ON_NULL=fails((function(){test.sort(null)})),STRICT_METHOD=arrayMethodIsStrict("sort"),STABLE_SORT=!fails((function(){if(V8)return V8<70;if(!(FF&&FF>3)){if(IE_OR_EDGE)return!0;if(WEBKIT)return WEBKIT<603;var code,chr,value,index,result="";for(code=65;code<76;code++){switch(chr=String.fromCharCode(code),code){case 66:case 69:case 70:case 72:value=3;break;case 68:case 71:value=4;break;default:value=2}for(index=0;index<47;index++)test.push({k:chr+index,v:value})}for(test.sort((function(a,b){return b.v-a.v})),index=0;index<test.length;index++)chr=test[index].k.charAt(0),result.charAt(result.length-1)!==chr&&(result+=chr);return"DGBEFHACIJK"!==result}}));$({target:"Array",proto:!0,forced:FAILS_ON_UNDEFINED||!FAILS_ON_NULL||!STRICT_METHOD||!STABLE_SORT},{sort:function sort(comparefn){void 0!==comparefn&&aCallable(comparefn);var array=toObject(this);if(STABLE_SORT)return void 0===comparefn?nativeSort(array):nativeSort(array,comparefn);var itemsLength,index,items=[],arrayLength=lengthOfArrayLike(array);for(index=0;index<arrayLength;index++)index in array&&push(items,array[index]);for(internalSort(items,function(comparefn){return function(x,y){return void 0===y?-1:void 0===x?1:void 0!==comparefn?+comparefn(x,y)||0:toString(x)>toString(y)?1:-1}}(comparefn)),itemsLength=lengthOfArrayLike(items),index=0;index<itemsLength;)array[index]=items[index++];for(;index<arrayLength;)deletePropertyOrThrow(array,index++);return array}})},"./node_modules/core-js/modules/es.regexp.exec.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),exec=__webpack_require__("./node_modules/core-js/internals/regexp-exec.js");$({target:"RegExp",proto:!0,forced:/./.exec!==exec},{exec})},"./node_modules/core-js/modules/es.string.replace.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var apply=__webpack_require__("./node_modules/core-js/internals/function-apply.js"),call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),fixRegExpWellKnownSymbolLogic=__webpack_require__("./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js"),fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),isNullOrUndefined=__webpack_require__("./node_modules/core-js/internals/is-null-or-undefined.js"),toIntegerOrInfinity=__webpack_require__("./node_modules/core-js/internals/to-integer-or-infinity.js"),toLength=__webpack_require__("./node_modules/core-js/internals/to-length.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),requireObjectCoercible=__webpack_require__("./node_modules/core-js/internals/require-object-coercible.js"),advanceStringIndex=__webpack_require__("./node_modules/core-js/internals/advance-string-index.js"),getMethod=__webpack_require__("./node_modules/core-js/internals/get-method.js"),getSubstitution=__webpack_require__("./node_modules/core-js/internals/get-substitution.js"),regExpExec=__webpack_require__("./node_modules/core-js/internals/regexp-exec-abstract.js"),REPLACE=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js")("replace"),max=Math.max,min=Math.min,concat=uncurryThis([].concat),push=uncurryThis([].push),stringIndexOf=uncurryThis("".indexOf),stringSlice=uncurryThis("".slice),REPLACE_KEEPS_$0="$0"==="a".replace(/./,"$0"),REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE=!!/./[REPLACE]&&""===/./[REPLACE]("a","$0");fixRegExpWellKnownSymbolLogic("replace",(function(_,nativeReplace,maybeCallNative){var UNSAFE_SUBSTITUTE=REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE?"$":"$0";return[function replace(searchValue,replaceValue){var O=requireObjectCoercible(this),replacer=isNullOrUndefined(searchValue)?void 0:getMethod(searchValue,REPLACE);return replacer?call(replacer,searchValue,O,replaceValue):call(nativeReplace,toString(O),searchValue,replaceValue)},function(string,replaceValue){var rx=anObject(this),S=toString(string);if("string"==typeof replaceValue&&-1===stringIndexOf(replaceValue,UNSAFE_SUBSTITUTE)&&-1===stringIndexOf(replaceValue,"$<")){var res=maybeCallNative(nativeReplace,rx,S,replaceValue);if(res.done)return res.value}var functionalReplace=isCallable(replaceValue);functionalReplace||(replaceValue=toString(replaceValue));var global=rx.global;if(global){var fullUnicode=rx.unicode;rx.lastIndex=0}for(var results=[];;){var result=regExpExec(rx,S);if(null===result)break;if(push(results,result),!global)break;""===toString(result[0])&&(rx.lastIndex=advanceStringIndex(S,toLength(rx.lastIndex),fullUnicode))}for(var it,accumulatedResult="",nextSourcePosition=0,i=0;i<results.length;i++){for(var matched=toString((result=results[i])[0]),position=max(min(toIntegerOrInfinity(result.index),S.length),0),captures=[],j=1;j<result.length;j++)push(captures,void 0===(it=result[j])?it:String(it));var namedCaptures=result.groups;if(functionalReplace){var replacerArgs=concat([matched],captures,position,S);void 0!==namedCaptures&&push(replacerArgs,namedCaptures);var replacement=toString(apply(replaceValue,void 0,replacerArgs))}else replacement=getSubstitution(matched,S,position,captures,namedCaptures,replaceValue);position>=nextSourcePosition&&(accumulatedResult+=stringSlice(S,nextSourcePosition,position)+replacement,nextSourcePosition=position+matched.length)}return accumulatedResult+stringSlice(S,nextSourcePosition)}]}),!!fails((function(){var re=/./;return re.exec=function(){var result=[];return result.groups={a:"7"},result},"7"!=="".replace(re,"$<a>")}))||!REPLACE_KEEPS_$0||REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE)}}]);