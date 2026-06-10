"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { X, Send, Sparkles, Clock, Trash2, Link as LinkIcon, Bold, Italic, List } from "lucide-react";
import { toast } from "sonner";

export default function ComposePage() {
  const router = useRouter();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  
  const sendEmail = trpc.mail.sendEmail.useMutation({
    onSuccess: () => {
      toast.success("Email sent");
      router.push("/mail");
    },
    onError: () => {
      toast.error("Failed to send email");
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your message here, or type '/' for snippets...",
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] font-sans text-[15px] text-text-primary',
      },
    },
  });

  const handleSend = () => {
    if (!to || !subject || !editor?.getHTML()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    sendEmail.mutate({
      to,
      subject,
      body: editor.getHTML()
    });
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <h1 className="font-serif text-[18px] font-bold text-text-primary">New Message</h1>
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()} className="text-text-muted hover:text-text-primary">
          <X className="size-4" />
        </Button>
      </div>

      {/* Form Fields */}
      <div className="px-6 py-2 border-b border-border flex items-center">
        <span className="w-12 text-[13px] font-sans text-text-muted font-medium">To:</span>
        <input 
          type="text" 
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none font-sans text-[15px] text-text-primary placeholder:text-text-muted"
          placeholder="rohan@example.com, team@superhuman.com"
        />
      </div>

      <div className="px-6 py-2 border-b border-border flex items-center">
        <span className="w-12 text-[13px] font-sans text-text-muted font-medium">Subject:</span>
        <input 
          type="text" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none font-serif text-[18px] text-text-primary placeholder:text-text-muted font-bold"
          placeholder="What's this about?"
        />
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <EditorContent editor={editor} />
      </div>

      {/* Bottom Toolbar */}
      <div className="p-4 border-t border-border shrink-0 bg-surface flex flex-col gap-4">
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 border-b border-border/50 pb-3">
          <Button variant="ghost" size="icon-sm" onClick={() => editor?.chain().focus().toggleBold().run()} className={`text-text-muted hover:text-text-primary ${editor?.isActive('bold') ? 'bg-surface-elevated text-text-primary' : ''}`}><Bold className="size-4" /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`text-text-muted hover:text-text-primary ${editor?.isActive('italic') ? 'bg-surface-elevated text-text-primary' : ''}`}><Italic className="size-4" /></Button>
          <div className="w-[1px] h-4 bg-border mx-1" />
          <Button variant="ghost" size="icon-sm" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`text-text-muted hover:text-text-primary ${editor?.isActive('bulletList') ? 'bg-surface-elevated text-text-primary' : ''}`}><List className="size-4" /></Button>
          <Button variant="ghost" size="icon-sm" className="text-text-muted hover:text-text-primary"><LinkIcon className="size-4" /></Button>
          <div className="w-[1px] h-4 bg-border mx-1" />
          <Button variant="outline" size="sm" className="h-8 gap-2 border-border text-text-secondary hover:text-text-primary font-sans text-[13px]">
            <Sparkles className="size-3" />
            AI Compose
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={handleSend} className="bg-accent text-[#1C1C1C] hover:bg-accent-hover font-sans font-medium px-6 h-9 gap-2">
              <Send className="size-4" />
              Send
            </Button>
            <Button variant="outline" className="border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated h-9 gap-2 font-sans font-medium">
              <Clock className="size-4" />
              Send Later
            </Button>
          </div>
          
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()} className="text-text-muted hover:text-danger hover:bg-danger/10">
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      
    </div>
  );
}
