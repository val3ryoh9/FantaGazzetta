export const sortArticlesByDate = (articles) =>
  [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
