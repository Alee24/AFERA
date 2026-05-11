'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-[150px] w-full bg-gray-100 animate-pulse rounded-2xl" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, className }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-gray-50 dark:bg-slate-800 rounded-2xl overflow-hidden border-none"
      />
      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border: none !important;
          background: rgba(0,0,0,0.02);
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
          border-radius: 16px 16px 0 0;
          padding: 8px 12px;
        }
        .rich-text-editor .ql-container {
          border: none !important;
          min-height: 150px;
          font-family: inherit;
          font-size: 14px;
        }
        .rich-text-editor .ql-editor {
          min-height: 150px;
          padding: 16px 20px;
        }
        .dark .rich-text-editor .ql-toolbar {
          background: rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        .dark .rich-text-editor .ql-stroke {
          stroke: #94a3b8 !important;
        }
        .dark .rich-text-editor .ql-fill {
          fill: #94a3b8 !important;
        }
        .dark .rich-text-editor .ql-picker {
          color: #94a3b8 !important;
        }
        .dark .rich-text-editor .ql-editor.ql-blank::before {
          color: #64748b !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
