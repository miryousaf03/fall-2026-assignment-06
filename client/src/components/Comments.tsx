import { useEffect, useState } from 'react';
import { ApiError, createComment, deleteComment, getComments, updateComment } from '../api';
import type { ArticleComment } from '../api';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

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

  async function handleUpdate(commentId: number, body: string) {
    await updateComment(articleId, commentId, body);
    setComments((current) =>
      current.map((comment) => (comment.commentId === commentId ? { ...comment, body } : comment)),
    );
  }

  async function handleDelete(commentId: number) {
    try {
      await deleteComment(articleId, commentId);
    } catch (error: unknown) {
      // A 404 means it's already gone (for example, deleted in another tab),
      // so we still remove it from the list. Anything else is a real failure.
      if (!(error instanceof ApiError && error.status === 404)) {
        throw error;
      }
    }
    setComments((current) => current.filter((comment) => comment.commentId !== commentId));
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
            <CommentItem comment={comment} onUpdate={handleUpdate} onDelete={handleDelete} />
          </li>
        ))}
      </ul>

      <CommentForm submitLabel="Add comment" onSubmit={handleAdd} resetOnSuccess />
    </section>
  );
}

export default Comments;
