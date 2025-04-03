import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
import { SWRConfig } from "swr";
import localStorageProvider from "./lib/local-storage-provider";
import { Toaster } from "./Components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <SWRConfig value={{ provider: localStorageProvider }}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </SWRConfig>
    </AuthContextProvider>
  </StrictMode>
);
