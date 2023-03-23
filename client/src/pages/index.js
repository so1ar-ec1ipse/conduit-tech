import { Routes, Route } from "react-router-dom";
import HomePage from "./home";

export default function MainRouter() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}
