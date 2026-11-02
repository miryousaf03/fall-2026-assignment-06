import { useState } from 'react';
import type { ArticleComment } from '../api';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: ArticleComment;
  onUpdate: (commentId: number, body: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

function CommentItem({ comment, onUpdate, onDelete }: CommentItemProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleSave(body: string) {
    await onUpdate(comment.commentId, body);
    setEditing(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm('Delete this comment?');
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(comment.commentId);
    } catch (error: unknown) {
      setDeleteError(error instanceof Error ? error.message : 'Something went wrong');
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <CommentForm
        initialBody={comment.body}
        submitLabel="Save"
        onSubmit={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <>
      <p style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</p>
      <button type="button" onClick={() => setEditing(true)} disabled={deleting}>
        Edit
      </button>
      <button type="button" className="danger" onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
      {deleteError !== null && <p role="alert">Could not delete: {deleteError}</p>}
    </>
  );
}

export default CommentItem;
