import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { AuthProvider } from './context/AuthContext.jsx'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe ('pk_test_51PlY9x03XmDnrXNwsS0JDjPMUEfAJDvEA1ekHo5CYlDgjLh9AB2a1ZAvrDe4wsJIiPeDBlCafhQ1Grvh5lcoC3RE00LBQviUkC')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <AuthProvider>
     <Elements stripe={stripePromise}>
    <App />
    </Elements>
    </AuthProvider>
  </React.StrictMode>,
)
