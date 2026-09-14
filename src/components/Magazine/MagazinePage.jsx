import React, { useState } from "react";
import ArticleComposer from "./ArticleComposer";
import ArticleList from "./ArticleList";
import ArticleDetail from "./ArticleDetail";

export default function MagazinePage({ articles, onSaveArticles, canManage }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = (id) => {
    onSaveArticles(articles.filter((a) => a.id !== id));
  };

  const selectedArticle = articles.find((a) => a.id === selectedId) || null;

  return (
    <div>
      {canManage && (
        <ArticleComposer articles={articles} onSaveArticles={onSaveArticles} />
      )}

      {selectedArticle ? (
        <ArticleDetail
          article={selectedArticle}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <ArticleList
          articles={articles}
          onSelect={setSelectedId}
          onDelete={handleDelete}
          canManage={canManage}
        />
      )}
    </div>
  );
}
