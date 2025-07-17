import { NewsType } from "./types";
import { HomeMobileView } from "./HomeMobileView";
import { HomeDesktopView } from "./HomeDesktopView";
import { useRenderView } from "../../utils/useRenderView";

type HomePageComponentProps = {
  news: NewsType[];
};

export const HomePageComponent = ({ news }: HomePageComponentProps) => {
  const isMobile = useRenderView(900);

  return isMobile ? (
    <HomeMobileView news={news} />
  ) : (
    <HomeDesktopView news={news} />
  );
};
