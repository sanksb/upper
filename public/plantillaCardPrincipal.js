function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function plantillaModalCardPrincipal(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (dogs) {// iterate dogs
;(function(){
  var $$obj = dogs;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var dog = $$obj[pug_index0];
pug_html = pug_html + "\u003Cdiv class=\"card\"\u003E\u003Cdiv class=\"img\"\u003E\u003Cimg" + (pug_attr("src", dog.imagen, true, false)+" width=\"100%\" height=\"100%\"") + "\u002F\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"contexto\"\u003E\u003Ch4\u003E" + (pug_escape(null == (pug_interp = dog.nombre) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E\u003Cp\u003E" + (pug_escape(null == (pug_interp = dog.descripcion.substring(0,149)) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Ca href=\"#modal\"\u003ELeer mas\u003C\u002Fa\u003E\u003Ch5\u003E" + (pug_escape(null == (pug_interp = dog._id) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var dog = $$obj[pug_index0];
pug_html = pug_html + "\u003Cdiv class=\"card\"\u003E\u003Cdiv class=\"img\"\u003E\u003Cimg" + (pug_attr("src", dog.imagen, true, false)+" width=\"100%\" height=\"100%\"") + "\u002F\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"contexto\"\u003E\u003Ch4\u003E" + (pug_escape(null == (pug_interp = dog.nombre) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E\u003Cp\u003E" + (pug_escape(null == (pug_interp = dog.descripcion.substring(0,149)) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Ca href=\"#modal\"\u003ELeer mas\u003C\u002Fa\u003E\u003Ch5\u003E" + (pug_escape(null == (pug_interp = dog._id) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
    }
  }
}).call(this);
}.call(this,"dogs" in locals_for_with?locals_for_with.dogs:typeof dogs!=="undefined"?dogs:undefined));;return pug_html;}