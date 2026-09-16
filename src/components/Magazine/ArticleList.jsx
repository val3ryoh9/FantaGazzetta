import React from "react";
import styled from "styled-components";
import { Button, Popconfirm, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { fmtDate } from "../../utils";
import { theme } from '../../GlobalStyle'

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
const TopCard = styled.article`
  min-width: 0;
  cursor: pointer;
`;
const TopImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: ${theme.colors.paperDim};
`;
const TopPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: ${theme.colors.paperDim};
`;
const TopTitle = styled.h2`
  margin: 10px 0 6px;
  color: ${theme.colors.pitchDark};
  font-family: ${theme.fonts.serif};
  font-size: 22px;
  line-height: 1.15;
`;
const Meta = styled.div`
  font-size: 13px;
  color: ${theme.colors.inkSoft};
  font-family: ${theme.fonts.ui};
`;
const Excerpt = styled.div`
  font-size: 17px;
  line-height: 1.55;
  color: ${theme.colors.ink};
  margin-top: 10px;
`;
const Rule = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.line};
  margin: 34px 0;
`;
const Row = styled.article`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
  margin-bottom: 30px;
  cursor: pointer;

  @media (max-width: 520px) {
    grid-template-columns: 96px 1fr;
  }
`;
const Thumb = styled.img`
  width: 100%;
  aspect-ratio: 1 / 0.82;
  object-fit: cover;
  background: ${theme.colors.paperDim};
`;
const ThumbPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1 / 0.82;
  background: ${theme.colors.paperDim};
`;
const RowTitle = styled.h2`
  font-size: 19px;
  font-weight: 600;
  line-height: 1.28;
  margin: 0 0 6px;
  color: ${theme.colors.pitchDark};

  @media (max-width: 520px) {
    font-size: 16px;
  }
`;
const RowExcerpt = styled(Excerpt)`
  font-size: 14.5px;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const Actions = styled.div`
  margin-top: 8px;
`;

function DeleteButton({ onConfirm }) {
  return (
    <Popconfirm
      title="Eliminare questo articolo?"
      okText="Elimina"
      cancelText="Annulla"
      onConfirm={onConfirm}
    >
      <Button
        size="small"
        danger
        type="text"
        icon={<DeleteOutlined />}
        onClick={(e) => e.stopPropagation()}
      >
        Elimina
      </Button>
    </Popconfirm>
  );
}

export default function ArticleList({
  articles,
  onSelect,
  onDelete,
  canManage,
}) {
  if (!articles.length) {
    return (
      <Empty
        description='Nessun articolo ancora. Usa "Scrivi un articolo" per pubblicare il primo.'
        style={{ padding: "40px 20px", border: "1px dashed #ccc" }}
      />
    );
  }

  const sorted = [...articles].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
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
}
