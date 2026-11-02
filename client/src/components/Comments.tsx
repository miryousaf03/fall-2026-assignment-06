import { useEffect, useState } from 'react';
import { createComment, getComments } from '../api';
import type { ArticleComment } from '../api';
import CommentForm from './CommentForm';

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

  async function handleAdd(body: string) {
    const created = await createComment(articleId, body);
    setComments((current) => [...current, created]);
  }

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

      <CommentForm submitLabel="Add comment" onSubmit={handleAdd} resetOnSuccess />
    </section>
  );
}

export default Comments;
