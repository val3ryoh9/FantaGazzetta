import React from 'react';
import styled from 'styled-components';
import { fmtDate } from '../../utils';
import { theme } from '../../GlobalStyle'

const Box = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.line};
  border-top: 3px solid ${theme.colors.gold};
  padding-bottom: 30px;
  margin-bottom: 20px;
`;
const CoverImg = styled.img`
  width: 100%;
  max-height: 420px;
  object-fit: cover;
`;
const Inner = styled.div`
  padding: 24px 28px 0;
`;
const BackLink = styled.a`
  font-size: 13px;
  color: ${theme.colors.pitch};
  font-weight: 600;
  font-family: ${theme.fonts.ui};
  display: inline-block;
  margin-bottom: 14px;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;
const Meta = styled.div`
  font-size: 13px;
  color: ${theme.colors.inkSoft};
  font-family: ${theme.fonts.ui};
`;
const Title = styled.h1`
  font-size: 30px;
  margin: 4px 0 10px;
  color: ${theme.colors.pitchDark};
  font-family: ${theme.fonts.serif};
`;
const BodyText = styled.div`
  font-size: 17px;
  line-height: 1.7;
  margin-top: 16px;
  white-space: pre-wrap;
`;

export default function ArticleDetail({ article, onBack }) {
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
}
