import React from "react";
import { Empty } from "antd";
import { fmtDate } from "../../../utils/utils";
import {
  TopGrid,
  TopCard,
  TopImage,
  TopPlaceholder,
  TopTitle,
  Meta,
  Rule,
  Row,
  Thumb,
  ThumbPlaceholder,
  RowTitle,
  RowExcerpt,
  Actions,
} from "./styled";
import { sortArticlesByDate } from "./utils";
import { DeleteButton } from "./DeleteButton";

export const ArticleList = ({
  articles,
  onSelect,
  onDelete,
  canManage,
}) => {
  if (!articles.length) {
    return (
      <Empty
        description='Nessun articolo ancora. Usa "Scrivi un articolo" per pubblicare il primo.'
        style={{ padding: "40px 20px", border: "1px dashed #ccc" }}
      />
    );
  }

  const sorted = sortArticlesByDate(articles);
  const topArticles = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div>
      <TopGrid>
        {topArticles.map((article) => (
          <TopCard key={article.id} onClick={() => onSelect(article.id)}>
            {article.image ? (
              <TopImage src={article.image} />
            ) : (
              <TopPlaceholder />
            )}
            <TopTitle>{article.title}</TopTitle>
            <Meta>
              di {article.author || "Admin"} &middot; {fmtDate(article.date)}
            </Meta>
            <RowExcerpt>{article.excerpt}</RowExcerpt>
            {canManage && (
              <Actions>
                <DeleteButton onConfirm={() => onDelete(article.id)} />
              </Actions>
            )}
          </TopCard>
        ))}
      </TopGrid>

      {rest.length > 0 && <Rule />}

      {rest.map((a, i) => (
        <React.Fragment key={a.id}>
          <Row onClick={() => onSelect(a.id)}>
            {a.image ? <Thumb src={a.image} /> : <ThumbPlaceholder />}
            <div>
              <RowTitle>{a.title}</RowTitle>
              <Meta>
                di {a.author || "Admin"} &middot; {fmtDate(a.date)}
              </Meta>
              <RowExcerpt>{a.excerpt}</RowExcerpt>
              {canManage && (
                <Actions>
                  <DeleteButton onConfirm={() => onDelete(a.id)} />
                </Actions>
              )}
            </div>
          </Row>
          {i < rest.length - 1 && <Rule />}
        </React.Fragment>
      ))}
    </div>
  );
};
