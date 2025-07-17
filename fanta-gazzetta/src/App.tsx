import { HomePageComponent } from "./Pages/HomePage/HomePageComponents";
import { RankingComponent } from "./Pages/Ranking/RankingComponent";
import { useNews } from "./News/News";
import { Routes, Route } from "react-router-dom";
import { HOME, RANKING } from "./routes";
import { PageWrapper, StyledAppWrapper } from "./Pages/HomePage/styling";

function App() {
  const news = useNews();

  return (
    <PageWrapper $background="white" $textAlign="initial">
      <StyledAppWrapper>
        <Routes>
          <Route path={HOME} element={<HomePageComponent news={news} />} />
          <Route path={RANKING} element={<RankingComponent news={news} />} />
        </Routes>
      </StyledAppWrapper>
    </PageWrapper>
  );
}

export default App;
