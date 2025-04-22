import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';
import { shortenUrl as apiShortenUrl, getCsrfToken } from './services/api';

// Get environment variables
const COMPANY_DOMAIN = process.env.REACT_APP_COMPANY_DOMAIN || 'http://bonlineco.com/';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [csrfReady, setCsrfReady] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Get CSRF token when component mounts
  useEffect(() => {
    const initCsrf = async () => {
      const success = await getCsrfToken();
      setCsrfReady(success);
    };
    
    initCsrf();
    console.log('App initialized');
  }, []);
  
  // Function to shorten URL
  const shortenUrl = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    setError('');
    setCopied(false);

    try {
      // Call the API service to shorten the URL with CSRF token handling
      const data = await apiShortenUrl(url);
      setShortUrl(data.short_url);
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
      console.error('Error shortening URL:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to copy shortened URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="App">
      <div className="container">
        <h1>QR Code Generator</h1>
        <p className="subtitle">Generate QR codes with shortened URLs using {COMPANY_DOMAIN}</p>
        
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to shorten (e.g., https://example.com)"
            className="url-input"
          />
          <button 
            onClick={shortenUrl} 
            disabled={loading}
            className="shorten-button"
          >
            {loading ? 'Processing...' : 'Shorten & Generate QR'}
          </button>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        {shortUrl && (
          <div className="result-container">
            <div className="qr-container">
              <QRCodeSVG 
                value={shortUrl} 
                size={200} 
                level="H"
                includeMargin={true}
              />
              <button onClick={(e) => {
                e.preventDefault();
                const svg = document.querySelector('.qr-container svg');
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.drawImage(img, 0, 0);
                  const pngFile = canvas.toDataURL('image/png');
                  const downloadLink = document.createElement('a');
                  downloadLink.download = 'qrcode.png';
                  downloadLink.href = pngFile;
                  downloadLink.click();
                };
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
              }} className="download-link">Download QR Code</button>
            </div>
            
            <div className="short-url-container">
              <h3>Your Shortened URL:</h3>
              <div className="short-url-box">
                <span className="short-url">{shortUrl}</span>
                <button 
                  onClick={copyToClipboard} 
                  className="copy-button"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="info">Scan the QR code or share the shortened URL</p>
            </div>
          </div>
        )}
      </div>
      <footer>
        <p>&copy; {new Date().getFullYear()} Bonline Co. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
