import { useT } from "./assets/i18n";

const App = () => {
  const t = useT();

  return (
    <div className="App">
      <h1>{t("application.helloWorld.title")}</h1>
    </div>
  );
};

export default App;
