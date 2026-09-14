import React from "react";
import styled from "styled-components";
import { Button, Popconfirm, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { fmtDate } from "../../utils";

const HeroCard = styled.article`
  margin-bottom: 8px;
  cursor: pointer;
`;
const HeroImg = styled.img`
  width: 100%;
  aspect-ratio: 16 / 8.2;
  object-fit: cover;
  background: ${({ theme }) => theme.colors.paperDim};
`;
const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 700;
  font-size: 34px;
  line-height: 1.14;
  margin: 16px 0 8px;
  color: ${({ theme }) => theme.colors.pitchDark};
  letter-spacing: -0.2px;
`;
const Meta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.inkSoft};
  font-family: ${({ theme }) => theme.fonts.ui};
`;
const Excerpt = styled.div`
  font-size: 17px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.ink};
  margin-top: 10px;
`;
const Rule = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
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
  background: ${({ theme }) => theme.colors.paperDim};
`;
const ThumbPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1 / 0.82;
  background: ${({ theme }) => theme.colors.paperDim};
`;
const RowTitle = styled.h2`
  font-size: 19px;
  font-weight: 600;
  line-height: 1.28;
  margin: 0 0 6px;
  color: ${({ theme }) => theme.colors.pitchDark};

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
  const [hero, ...rest] = sorted;

  return (
    <div>
      <HeroCard onClick={() => onSelect(hero.id)}>
        {hero.image && <HeroImg src={hero.image} />}
        <HeroTitle>{hero.title}</HeroTitle>
        <Meta>
          di {hero.author || "Admin"} &middot; {fmtDate(hero.date)}
        </Meta>
        <Excerpt>{hero.excerpt}</Excerpt>
        {canManage && (
          <Actions>
            <DeleteButton onConfirm={() => onDelete(hero.id)} />
          </Actions>
        )}
      </HeroCard>

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
