'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import FilePreview from '@/components/FilePreview';
import '@/styles/blog.css';

export default function BlogPostPage({ params }: { params: Promise<{ id: string, lang: string }> }) {
  const resolvedParams = React.use(params) as any;
  const { id, lang } = resolvedParams;
  const { t } = useTranslation('common');

  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    import('@/lib/api').then(({ blogApi }) => {
      blogApi.getById(id)
        .then((res) => {
          setPost(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch post', err);
          setLoading(false);
        });
    });
  }, [id]);

  if (loading) return <div className="container">Loading post...</div>;
  if (!post) return <div className="container">Post not found.</div>;

  const currentLang = lang || 'en';

  return (
    <div className="blog-post container">
      <article className="post-content">
        <header className="post-header">
          <span className="blog-date">{new Date(post.createdAt).toLocaleDateString()}</span>
          <h1>{post[`title_${currentLang}`]}</h1>
          <p className="author">By {post.Author?.name || 'Faculty'}</p>
        </header>
        
        <div className="post-body">
          <p>{post[`content_${currentLang}`]}</p>
        </div>

        {post.Files && post.Files.length > 0 && (
          <section className="post-materials">
            <h3>Course Materials</h3>
            <div className="previews">
              {post.Files.map((file: any) => (
                <FilePreview key={file.id} type={file.type as any} url={file.url} title={file.title} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
