import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/router";
import AutoAuth from "./utils/autoAuth";
import useAuthStore from "./stores/auth.store";
import Loader from "./components/loaders/loader";

function App() {
  const {user} = useAuthStore()
  return (
    <>
      {user?.id ? (
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      ) : (
        <div className="h-[100vh] w-full flex items-center justify-center">
          <Loader className="w-12 h-12" />
        </div>
      )}
      <AutoAuth />
    </>
  )
}

export default App
