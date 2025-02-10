# useShorten Hook

A custom React hook that simplifies URL shortening using the TinyURL API. It handles URL validation, API communication, and error handling, making it easy to integrate URL shortening functionality into your React projects.

## 🚀 Features

- **Automatic URL validation** to ensure correct formatting.
- **Error handling** for network issues, invalid URLs, and API errors.
- **Loading state** management for a smooth user experience.
- **Clean and reusable** logic for easy integration.

## 🔧 Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/YussefMo/useShorten.git
```

Navigate to the project directory:

```bash
cd useShorten
```

Then install dependencies Axios (if not already installed):

```bash
npm install axios
```

## 🛠️ Usage

1. **Import the hook** into your React component:

```javascript
import { useShorten } from './useShorten';
```

2. **Use the hook** inside your component:

```javascript
const { shortenedURL, isLoading, errorMessage } = useShorten('https://example.com');
```

3. **Render the output** in your JSX:

```jsx
<div>
  {isLoading && <p>Loading...</p>}
  {errorMessage && <p>Error: {errorMessage}</p>}
  {shortenedURL && (
    <p>
      Original URL: {/* add your state from input handler result */} <br />
      Shortened URL: <a href={shortenedURL.shortenedURL} target="_blank" rel="noopener noreferrer">{shortenedURL.shortenedURL}</a>
    </p>
  )}
</div>
```

**another way to render it with crating array**

```jsx
import React, { useState, useEffect } from 'react';
import { useShorten } from './useShorten';

export default function URLShortener() {
  const [inputURL, setInputURL] = useState('');
  const [urlList, setUrlList] = useState([]);
  const { shortenedURL, isLoading, errorMessage } = useShorten(inputURL);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputURL) {
      setInputURL(inputURL); // Trigger the shortening process
    }
  };

  useEffect(() => {
    if (shortenedURL) {
      setUrlList((prevList) => [...prevList, shortenedURL]);
      setInputURL('');
    }
  }, [shortenedURL]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter URL to shorten" value={inputURL} onChange={(e) => setInputURL(e.target.value)} />
        <button type="submit">Shorten</button>
      </form>

      {isLoading && <p>Loading...</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}

      <ul>
        {urlList.map((urlItem, index) => (
          <li key={index}>
            <p>Original URL: {urlItem.submitURL}</p>
            <p>
              Shortened URL:{' '}
              <a href={urlItem.shortenedURL} target="_blank" rel="noopener noreferrer">
                {urlItem.shortenedURL}
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## ⚙️ Environment Setup

1. Get your **TinyURL API key** from [TinyURL Developer Portal](https://tinyurl.com/developer).
2. Create a `.env` file in your project root and add the following or add add you're own key directly as string:

```
REACT_APP_TINYURL_API_KEY=your_api_key_here
```

## 📝 API Reference

- **Endpoint:** `https://api.tinyurl.com/create`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer YOUR_API_KEY`
  - `Content-Type: application/json`
- **Body Parameters:**
  - `url`: The URL to shorten.