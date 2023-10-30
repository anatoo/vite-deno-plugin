import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import App from "./App.tsx";

const root = createRoot(document.getElementById('main')!);
root.render(<App />);
