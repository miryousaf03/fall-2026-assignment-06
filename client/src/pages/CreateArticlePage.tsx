import { useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import { createArticle } from '../api';
import type { ArticleInput } from '../api';

function CreateArticlePage() {
  const navigate = useNavigate();

  async function handleCreate(values: ArticleInput) {
    const article = await createArticle(values);
    navigate(`/articles/${article.articleId}`);
  }

  return (
    <section>
      <h1>Create Article</h1>
      <ArticleForm submitLabel="Create" onSubmit={handleCreate} />
    </section>
  );
}

export default CreateArticlePage;
