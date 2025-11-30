import "./App.css";
import { ImageProvider } from "./context/ImageContext";
import { LogProvider } from "./context/LogContext";
import BottomPanel from "./layout/BottomPannel";
import MainLayout from "./layout/MainLayout";

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
