import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (cmd: string) => {
    document.execCommand(cmd, false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center gap-0.5 p-1.5 border-b border-border bg-muted/30">
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => exec("bold")}><Bold className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => exec("italic")}><Italic className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => exec("insertUnorderedList")}><List className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => exec("insertOrderedList")}><ListOrdered className="h-3.5 w-3.5" /></Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "min-h-[120px] max-h-[240px] overflow-y-auto p-3 text-sm focus:outline-none",
          !value && "text-muted-foreground"
        )}
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
