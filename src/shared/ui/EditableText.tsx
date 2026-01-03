import { useState, useRef, useEffect } from "react";

interface IEditableTextProps {
   value: string;
   onSave: (val: string) => void;
   className?: string;
}

export const EditableText = ({ value, onSave, className }: IEditableTextProps) => {
   const [isEditing, setIsEditing] = useState(false);
   const [text, setText] = useState(value);
   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
      setText(value);
   }, [value]);

   const handleBlur = () => {
      setIsEditing(false);
      if (text !== value) {
         onSave(text);
      }
   };

   return (
      <div
         ref={ref}
         contentEditable={isEditing}
         suppressContentEditableWarning={true}
         onBlur={handleBlur}
         onClick={() => setIsEditing(true)}
         onInput={(e) => setText(e.currentTarget.textContent || "")}
         className={`${className} ${isEditing ? 'border-b' : 'cursor-text'}`}
      >
         {text}
      </div>
   );
};