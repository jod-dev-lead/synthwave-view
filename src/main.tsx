import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize error logging
import("./utils/sentry").catch(() => {
  console.warn("Error logging not available");
});

// Initialize performance monitoring
import("./utils/performance").then(({ performance }) => {
  performance.logWebVitals();
}).catch(() => {
  console.warn("Performance monitoring not available");
});

createRoot(document.getElementById("root")!).render(<App />);
