import "./App.css";
import { ImageProvider } from "./context/ImageContext";
import { LogProvider } from "./context/LogContext";
import MainLayout from "../ui/layout/MainLayout.jsx";

function App() {
  return (
    <div>
      <ImageProvider>
        <LogProvider>
          <MainLayout />
        </LogProvider>
      </ImageProvider>
    </div>
  );
}

export default App;
