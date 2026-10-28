const API_BASE_URL = 'http://localhost:8080';

export interface Article {
  articleId: number;
  title: string;
  contents: string;
}

export interface ArticleComment {
  commentId: number;
  articleId: number;
  body: string;
}

export interface ArticleInput {
  title: string;
  contents: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }

  // Some endpoints (like DELETE) may return an empty body
  const text = await response.text();
  if (text === '') {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

export function getArticles(titleContains?: string): Promise<Article[]> {
  const query = titleContains ? `?title_contains=${encodeURIComponent(titleContains)}` : '';
  return request<Article[]>(`/articles${query}`);
}

export function getArticle(articleId: number): Promise<Article> {
  return request<Article>(`/articles/${articleId}`);
}

export function createArticle(input: ArticleInput): Promise<Article> {
  return request<Article>('/articles', 'POST', input);
}

export function updateArticle(articleId: number, input: Partial<ArticleInput>): Promise<Article> {
  return request<Article>(`/articles/${articleId}`, 'PUT', input);
}

export function deleteArticle(articleId: number): Promise<void> {
  return request<void>(`/articles/${articleId}`, 'DELETE');
}

export function getComments(articleId: number): Promise<ArticleComment[]> {
  return request<ArticleComment[]>(`/articles/${articleId}/comments`);
}

export function createComment(articleId: number, body: string): Promise<ArticleComment> {
  return request<ArticleComment>(`/articles/${articleId}/comments`, 'POST', { body });
}

export function updateComment(
  articleId: number,
  commentId: number,
  body: string,
): Promise<ArticleComment> {
  return request<ArticleComment>(`/articles/${articleId}/comments/${commentId}`, 'PUT', { body });
}

export function deleteComment(articleId: number, commentId: number): Promise<void> {
  return request<void>(`/articles/${articleId}/comments/${commentId}`, 'DELETE');
}