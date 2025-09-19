import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./utils/sentry";
import { performance } from "./utils/performance";

// Initialize performance monitoring
performance.logWebVitals();

createRoot(document.getElementById("root")!).render(<App />);
