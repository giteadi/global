import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/store'
import './index.css'
import App from './App.jsx'

// Lazy load Buddha background image
const loadBuddhaBackground = () => {
  const img = new Image()
  img.onload = () => {
    document.body.classList.add('lazy-loaded')
  }
  img.src = '/src/assets/buddha-image.jpg'
}

// Initialize lazy loading
loadBuddhaBackground()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
