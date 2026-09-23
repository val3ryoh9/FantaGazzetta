import styled from "styled-components";
import { theme } from "../../../GlobalStyle";

export const TopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const TopCard = styled.article`
  min-width: 0;
  cursor: pointer;
`;

export const TopImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: ${theme.colors.paperDim};
`;

export const TopPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: ${theme.colors.paperDim};
`;

export const TopTitle = styled.h2`
  margin: 10px 0 6px;
  color: ${theme.colors.pitchDark};
  font-family: ${theme.fonts.serif};
  font-size: 22px;
  line-height: 1.15;
`;

export const Meta = styled.div`
  font-size: 13px;
  color: ${theme.colors.inkSoft};
  font-family: ${theme.fonts.ui};
`;

export const Excerpt = styled.div`
  font-size: 17px;
  line-height: 1.55;
  color: ${theme.colors.ink};
  margin-top: 10px;
`;

export const Rule = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.line};
  margin: 34px 0;
`;

export const Row = styled.article`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
  margin-bottom: 30px;
  cursor: pointer;

  @media (max-width: 520px) {
    grid-template-columns: 96px 1fr;
  }
`;

export const Thumb = styled.img`
  width: 100%;
  aspect-ratio: 1 / 0.82;
  object-fit: cover;
  background: ${theme.colors.paperDim};
`;

export const ThumbPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1 / 0.82;
  background: ${theme.colors.paperDim};
`;

export const RowTitle = styled.h2`
  font-size: 19px;
  font-weight: 600;
  line-height: 1.28;
  margin: 0 0 6px;
  color: ${theme.colors.pitchDark};

  @media (max-width: 520px) {
    font-size: 16px;
  }
`;

export const RowExcerpt = styled(Excerpt)`
  font-size: 14.5px;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Actions = styled.div`
  margin-top: 8px;
`;
