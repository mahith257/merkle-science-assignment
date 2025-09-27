import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Layout from "./components/Layout";
import Settings from "./components/Settings";
import Chat from "./components/Chat";
import ApiKeyProvider from "./contexts/ApiKeyContext";

function App() {
  return (
    <ApiKeyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Chat />} />
            <Route path=":id" element={<Chat />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApiKeyProvider>
  );
}

export default App;
