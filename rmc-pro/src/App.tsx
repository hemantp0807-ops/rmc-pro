import AppRoutes from "./routes/AppRoutes";
import ToasterProvider from "./components/ui/ToasterProvider";

function App() {
  return (
    <>
      <ToasterProvider />
      <AppRoutes />
    </>
  );
}

export default App;