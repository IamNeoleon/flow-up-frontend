export function getCaretCoordinates(textarea: HTMLTextAreaElement, position: number) {
   const div = document.createElement("div");
   const style = window.getComputedStyle(textarea);

   const props = [
      "direction", "boxSizing", "width", "height", "overflowX", "overflowY",
      "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
      "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
      "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize",
      "lineHeight", "fontFamily", "textAlign", "letterSpacing", "whiteSpace",
      "wordBreak", "tabSize", "MozTabSize"
   ] as const;

   props.forEach((p) => div.style.setProperty(p, style.getPropertyValue(p)));

   div.style.position = "absolute";
   div.style.visibility = "hidden";
   div.style.whiteSpace = "pre-wrap";
   div.style.wordWrap = "break-word";

   // важное: НЕ ставим top/left от textarea и НЕ используем getBoundingClientRect тут
   div.textContent = textarea.value.substring(0, position);

   const span = document.createElement("span");
   span.textContent = "\u200b";
   div.appendChild(span);

   document.body.appendChild(div);

   // локальные координаты внутри div (как будто это textarea)
   const spanRect = span.getBoundingClientRect();
   const divRect = div.getBoundingClientRect();

   document.body.removeChild(div);

   return {
      top: spanRect.top - divRect.top,
      left: spanRect.left - divRect.left,
   };
}
