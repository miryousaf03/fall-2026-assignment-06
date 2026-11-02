import { useState } from 'react';
import type { ArticleComment } from '../api';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: ArticleComment;
  onUpdate: (commentId: number, body: string) => Promise<void>;
}

function CommentItem({ comment, onUpdate }: CommentItemProps) {
  const [editing, setEditing] = useState<boolean>(false);

  async function handleSave(body: string) {
    await onUpdate(comment.commentId, body);
    setEditing(false);
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
      <button type="button" onClick={() => setEditing(true)}>
        Edit
      </button>
    </>
  );
}

export default CommentItem;
