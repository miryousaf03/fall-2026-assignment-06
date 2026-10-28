import { Link, Route, Routes } from 'react-router-dom';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CreateArticlePage from './pages/CreateArticlePage';
import EditArticlePage from './pages/EditArticlePage';

function App() {
  return (
    <>
      <header>
        <Link to="/">Articles</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ArticleListPage />} />
          <Route path="/articles/new" element={<CreateArticlePage />} />
          <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
          <Route path="/articles/:articleId/edit" element={<EditArticlePage />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;