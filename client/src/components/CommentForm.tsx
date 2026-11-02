import { useId, useState } from 'react';
import type { FormEvent } from 'react';

interface CommentFormProps {
  initialBody?: string;
  submitLabel: string;
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
  resetOnSuccess?: boolean;
}

function CommentForm({
  initialBody = '',
  submitLabel,
  onSubmit,
  onCancel,
  resetOnSuccess = false,
}: CommentFormProps) {
  const textareaId = useId();
  const [body, setBody] = useState<string>(initialBody);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedBody = body.trim();
    if (trimmedBody === '') {
      setValidationMessage('Comment cannot be empty.');
      return;
    }

    setValidationMessage(null);
    setSubmitError(null);
    setSubmitting(true);
    try {
      await onSubmit(trimmedBody);
      if (resetOnSuccess) {
        setBody('');
      }
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={textareaId}>Comment</label>
      <textarea
        id={textareaId}
        rows={3}
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />

      {validationMessage !== null && <p role="alert">{validationMessage}</p>}
      {submitError !== null && <p role="alert">Could not save: {submitError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
      {onCancel !== undefined && (
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default CommentForm;
