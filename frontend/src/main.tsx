import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { loadCatalogue } from './lib/catalogue'

const root = ReactDOM.createRoot(document.getElementById('root')!)

function render() {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

// Fetch the catalogue before the first render. Components read the data as
// plain module values, so it has to be in place by the time they mount; doing
// it here keeps all of them unchanged. loadCatalogue never rejects — it falls
// back to the bundled copy — so the shop always renders.
loadCatalogue().then(source => {
  if (source === 'bundled') {
    console.info('[catalogue] backend unavailable; showing the bundled catalogue')
  }
  render()
})
