import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ArticleInput } from '../api';

interface ArticleFormProps {
  initialValues?: ArticleInput;
  submitLabel: string;
  onSubmit: (values: ArticleInput) => Promise<void>;
}

function ArticleForm({ initialValues, submitLabel, onSubmit }: ArticleFormProps) {
  const [title, setTitle] = useState<string>(initialValues?.title ?? '');
  const [contents, setContents] = useState<string>(initialValues?.contents ?? '');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContents = contents.trim();
    if (trimmedTitle === '' || trimmedContents === '') {
      setValidationMessage('Both title and contents are required.');
      return;
    }

    setValidationMessage(null);
    setSubmitError(null);
    setSubmitting(true);
    try {
      await onSubmit({ title: trimmedTitle, contents: trimmedContents });
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="article-title">Title</label>
        <input
          id="article-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="article-contents">Contents</label>
        <textarea
          id="article-contents"
          rows={8}
          value={contents}
          onChange={(event) => setContents(event.target.value)}
        />
      </div>

      {validationMessage !== null && <p role="alert">{validationMessage}</p>}
      {submitError !== null && <p role="alert">Could not save: {submitError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

export default ArticleForm;
