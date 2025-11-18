import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import App from "./App.jsx";
import "./index.css";
import About from "./About.jsx";

ReactDOM.createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <CustomProvider>
      <Routes>
        <Route index element={<App />} />
        <Route path="about" element={<About />} />
      </Routes>
    </CustomProvider>
  </BrowserRouter>
);
