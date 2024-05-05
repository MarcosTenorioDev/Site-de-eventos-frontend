import { ToastContainer } from "react-toastify";
import { useT } from "./assets/i18n";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  /*   const { showToast } = useToastContext();
   */ const t = useT();

  return (
    <div className="App">
      <ToastContainer />
      <h1>{t("application.helloWorld.title")}</h1>
    </div>
  );
};

export default App;
