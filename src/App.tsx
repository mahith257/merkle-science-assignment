import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/:id" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
