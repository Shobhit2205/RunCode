import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { CodeProvider } from "./context/CodeContext.tsx";
import SocketProvider from "./context/SocketContext.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SocketProvider>
        <CodeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CodeProvider>
      </SocketProvider>
    </ThemeProvider>
  </StrictMode>,
);
