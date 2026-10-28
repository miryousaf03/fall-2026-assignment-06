import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError, deleteArticle, getArticle } from '../api';
import type { Article } from '../api';

interface ArticleDetailProps {
  articleId: number;
}

function ArticleDetail({ articleId }: ArticleDetailProps) {
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getArticle(articleId);
        if (!cancelled) {
          setArticle(result);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          if (error instanceof ApiError && error.status === 404) {
            setErrorMessage('Article not found.');
          } else {
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  async function handleDelete() {
    const confirmed = window.confirm('Delete this article and all of its comments?');
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteArticle(articleId);
      navigate('/');
    } catch (error: unknown) {
      setDeleteError(error instanceof Error ? error.message : 'Something went wrong');
      setDeleting(false);
    }
  }

  if (loading) {
    return <p>Loading article…</p>;
  }

  if (errorMessage !== null) {
    return (
      <section>
        <p role="alert">{errorMessage}</p>
        <Link to="/">Back to articles</Link>
      </section>
    );
  }

  if (article === null) {
    return (
      <section>
        <p role="alert">Article not found.</p>
        <Link to="/">Back to articles</Link>
      </section>
    );
  }

  return (
    <section>
      <Link to="/">← Back to articles</Link>

      <h1>{article.title}</h1>
      <p style={{ whiteSpace: 'pre-wrap' }}>{article.contents}</p>

      <div>
        <Link to={`/articles/${article.articleId}/edit`}>Edit</Link>
        <button type="button" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      {deleteError !== null && <p role="alert">Could not delete: {deleteError}</p>}
    </section>
  );
}

function ArticleDetailPage() {
  const { articleId: articleIdParam } = useParams<{ articleId: string }>();
  const articleId = Number(articleIdParam);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    return (
      <section>
        <p role="alert">Article not found.</p>
        <Link to="/">Back to articles</Link>
      </section>
    );
  }

  return <ArticleDetail key={articleId} articleId={articleId} />;
}

export default ArticleDetailPage;
