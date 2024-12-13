import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import EditorScreen from "./pages/EditorScreen";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorScreen />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
