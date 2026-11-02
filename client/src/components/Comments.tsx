import { useEffect, useState } from 'react';
import { getComments } from '../api';
import type { ArticleComment } from '../api';

interface CommentsProps {
  articleId: number;
}

function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getComments(articleId);
        if (!cancelled) {
          setComments(result);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
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

  return (
    <section>
      <h2>Comments</h2>

      {loading && <p>Loading comments…</p>}

      {errorMessage !== null && <p role="alert">Could not load comments: {errorMessage}</p>}

      {!loading && errorMessage === null && comments.length === 0 && <p>No comments yet.</p>}

      <ul>
        {comments.map((comment) => (
          <li key={comment.commentId}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Comments;
