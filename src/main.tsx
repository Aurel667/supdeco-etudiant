// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Suspense, lazy} from "react"
import Loader from './components/loaders/loader.tsx';

const App = lazy(() => import('./App.tsx'));

createRoot(document.getElementById('root')!).render(
  (
  // <StrictMode>
    <Suspense fallback={
      <div className="h-[100vh] w-full flex items-center justify-center">
        <Loader className="w-12 h-12" />
      </div>
    }>
      <App />
    </Suspense>
  // </StrictMode>
  ),
)
