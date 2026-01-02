import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './UrlNotFound.css'  

const UrlNotFound = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [displayPath, setDisplayPath] = useState('')
  
  // Typewriter effect for the path
  useEffect(() => {
    let i = 0
    const typeWriter = () => {
      if (i < pathname.length) {
        setDisplayPath(pathname.substring(0, i + 1))
        i++
        setTimeout(typeWriter, 50)
      }
    }
    
    // Start typing after a brief delay
    const timer = setTimeout(() => {
      typeWriter()
    }, 300)
    
    return () => clearTimeout(timer)
  }, [pathname])
  
  const handleGoHome = () => {
    navigate('/')
  }
  
  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">
          <span className="digit digit-4">4</span>
          <span className="digit digit-0">0</span>
          <span className="digit digit-4 digit-last">4</span>
        </div>
        
        <div className="error-title">
          <h1 className="title-main">Page Not Found</h1>
          <p className="title-sub">The page you're looking for doesn't exist or has been moved</p>
        </div>
        
        <div className="error-details">
          <div className="path-display">
            <span className="path-label">Requested URL:</span>
            <code className="path-value">{displayPath}</code>
            <span className="cursor">|</span>
          </div>
          <p className="error-message">
            This might be because of a mistyped URL, an outdated link, or the page has been removed.
          </p>
        </div>
        
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleGoHome}>
            <span className="btn-icon">🏠</span>
            <span>Go to Homepage</span>
          </button>
          <button className="btn btn-secondary" onClick={handleGoBack}>
            <span className="btn-icon">↩️</span>
            <span>Go Back</span>
          </button>
          <button 
            className="btn btn-ghost" 
            onClick={() => window.location.reload()}
          >
            <span className="btn-icon">🔄</span>
            <span>Refresh Page</span>
          </button>
        </div>
        
        <div className="search-suggestions">
          <p className="suggestions-title">What can you do?</p>
          <ul className="suggestions-list">
            <li>Check the URL for any typos</li>
            <li>Use the navigation menu to find what you need</li>
            <li>Go back to the previous page</li>
            <li>Contact support if you believe this is an error</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UrlNotFound