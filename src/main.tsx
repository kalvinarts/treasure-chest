import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MainStoreProvider } from './Components/Providers/MainStoreProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(  
    <MainStoreProvider>
      <App />
    </MainStoreProvider>
)
