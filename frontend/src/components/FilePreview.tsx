'use client';

import React from 'react';
import { FileText, Presentation } from 'lucide-react';

interface FilePreviewProps {
  url: string;
  type: 'pdf' | 'ppt';
  title?: string;
}

export default function FilePreview({ url, type, title }: FilePreviewProps) {
  if (type === 'pdf') {
    return (
      <div className="file-preview pdf-preview">
        <div className="preview-header">
          <FileText size={20} />
          <span>{title || 'PDF Document'}</span>
        </div>
        <iframe
          src={`${url}#toolbar=0`}
          width="100%"
          height="600px"
          style={{ border: 'none', borderRadius: 'var(--radius)' }}
        ></iframe>
      </div>
    );
  }

  if (type === 'ppt') {
    // Using Microsoft Office Online Viewer
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    return (
      <div className="file-preview ppt-preview">
        <div className="preview-header">
          <Presentation size={20} />
          <span>{title || 'PowerPoint Presentation'}</span>
        </div>
        <iframe
          src={officeUrl}
          width="100%"
          height="600px"
          style={{ border: 'none', borderRadius: 'var(--radius)' }}
        ></iframe>
      </div>
    );
  }

  return null;
}
