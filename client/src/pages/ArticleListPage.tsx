import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api';
import type { Article } from '../api';

const PREVIEW_LENGTH = 120;

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const result = await getArticles(searchTerm.trim());
        if (!cancelled) {
          setArticles(result);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setArticles([]);
          setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const hasSearch = searchTerm.trim() !== '';

  return (
    <section>
      <h1>Articles</h1>

      <div>
        <input
          type="search"
          placeholder="Search by title..."
          aria-label="Search articles by title"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <Link to="/articles/new">Create Article</Link>
      </div>

      {loading && <p>Loading articles…</p>}

      {errorMessage !== null && <p role="alert">Could not load articles: {errorMessage}</p>}

      {!loading && errorMessage === null && articles.length === 0 && (
        <p>{hasSearch ? `No articles match "${searchTerm.trim()}".` : 'No articles yet.'}</p>
      )}

      <ul>
        {articles.map((article) => (
          <li key={article.articleId}>
            <h2>{article.title}</h2>
            <p>{truncate(article.contents, PREVIEW_LENGTH)}</p>
            <Link to={`/articles/${article.articleId}`}>Read more</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ArticleListPage;
