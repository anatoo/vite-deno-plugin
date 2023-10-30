import { createRoot } from 'react-dom/client';
import App from "./App.tsx";

const root = createRoot(document.getElementById('main')!);
root.render(<App />);
