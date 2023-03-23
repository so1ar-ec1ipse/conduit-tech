import "./App.css";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./pages";

function App() {
  return (
    <div>
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
