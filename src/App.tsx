import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/router";
import AutoAuth from "./utils/autoAuth";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <AutoAuth />
    </>
  )
}

export default App
