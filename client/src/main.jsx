import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/store'
import './index.css'
import App from './App.jsx'

// Lazy load Buddha background image using Intersection Observer
const initBuddhaBackground = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = new Image()
        img.onload = () => {
          document.body.classList.add('lazy-loaded')
        }
        img.src = '/src/assets/buddha-image.jpg'
        observer.disconnect() // Stop observing once loaded
      }
    })
  })

  // Observe the entire document body
  observer.observe(document.body)

  // Also load after a short delay as fallback
  setTimeout(() => {
    if (!document.body.classList.contains('lazy-loaded')) {
      const img = new Image()
      img.onload = () => {
        document.body.classList.add('lazy-loaded')
      }
      img.src = '/src/assets/buddha-image.jpg'
    }
  }, 2000)
}

// Initialize lazy loading
initBuddhaBackground()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
