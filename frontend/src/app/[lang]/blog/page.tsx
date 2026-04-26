'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import '@/styles/blog.css';

export default function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = React.use(params) as any;
  const lang = resolvedParams.lang;
  const { t, i18n } = useTranslation('common');
  const [posts, setPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }

    import('@/lib/api').then(({ blogApi }) => {
      blogApi.getAll().then((res) => {
        setPosts(res.data);
      }).catch(err => console.error('Failed to fetch posts', err));
    });
  }, [lang, i18n]);

  const currentLang = lang || 'en';

  return (
    <div className="blog-page">
      <div className="container">
        <header className="blog-header-premium reveal">
          <span className="text-gradient" style={{ fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem' }}>University Insights</span>
          <h1>News & Research</h1>
          <p>Discover the latest breakthroughs, announcements, and academic stories from across our global community.</p>
        </header>

        <div className="blog-grid-premium">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <article key={post.id} className="blog-card-premium reveal">
                <div className="blog-img-premium">
                   <BookOpen size={64} strokeWidth={1} />
                </div>
                <div className="blog-body-premium">
                  <div className="blog-meta-premium">
                    <span><Calendar size={14} style={{ marginRight: '6px' }} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3>{post[`title_${currentLang}`]}</h3>
                  <p>{post[`content_${currentLang}`]?.substring(0, 140)}...</p>
                  <div className="blog-footer-premium">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>By Academic Faculty</span>
                    <a href={`/blog/${post.id}`} className="read-more-premium">
                      Read Article <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '6rem' }}>
              <p>Curating academic news...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
