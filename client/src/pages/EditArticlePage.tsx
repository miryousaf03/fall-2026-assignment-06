import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import { ApiError, getArticle, updateArticle } from '../api';
import type { Article, ArticleInput } from '../api';

interface EditArticleProps {
  articleId: number;
}

function EditArticle({ articleId }: EditArticleProps) {
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  async function handleUpdate(values: ArticleInput) {
    await updateArticle(articleId, values);
    navigate(`/articles/${articleId}`);
  }

  if (loading) {
    return <p className="status">Loading article…</p>;
  }

  if (errorMessage !== null || article === null) {
    return (
      <section>
        <p role="alert">{errorMessage ?? 'Article not found.'}</p>
        <Link to="/">Back to articles</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Edit Article</h1>
      <ArticleForm
        initialValues={{ title: article.title, contents: article.contents }}
        submitLabel="Save"
        onSubmit={handleUpdate}
      />
      <Link to={`/articles/${articleId}`}>Cancel</Link>
    </section>
  );
}

function EditArticlePage() {
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

  return <EditArticle key={articleId} articleId={articleId} />;
}

export default EditArticlePage;
