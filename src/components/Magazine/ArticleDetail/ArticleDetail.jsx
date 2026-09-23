import React from 'react';
import { fmtDate } from "../../../utils/utils";
import {
  Box,
  CoverImg,
  Inner,
  BackLink,
  Meta,
  Title,
  BodyText,
} from "./styled";

export const ArticleDetail = ({ article, onBack }) => {
  if (!article) return null;
  return (
    <Box>
      {article.image && <CoverImg src={article.image} />}
      <Inner>
        <BackLink onClick={onBack}>&larr; Torna al magazine</BackLink>
        <Meta>di {article.author || 'Admin'} &middot; {fmtDate(article.date)}</Meta>
        <Title>{article.title}</Title>
        <BodyText>{article.body}</BodyText>
      </Inner>
    </Box>
  );
};
