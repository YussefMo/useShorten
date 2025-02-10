# **useShorten Hook**  

The `useShorten` hook is a custom React hook designed to handle URL shortening using the **TinyURL API**. It performs URL validation, manages API requests, handles errors, and returns the shortened URL in a clean, reusable way.

---

## **Features**  
- **URL Validation:** Ensures only valid URLs are processed.  
- **API Integration:** Shortens URLs using the TinyURL API.  
- **Error Handling:** Provides clear feedback for network and API errors.  
- **Loading State:** Displays loading status during API requests.  
- **Reusable Hook:** Easily integrates into any React component.

---

## **Installation**  

1. **Add the hook to your project:**  
   Copy the `useShorten.js` file into your React project.

2. **Install Axios (if not already installed):**  
   ```bash
   npm install axios
   ```

3. **Add your TinyURL API Key:**  
   - Create a `.env` file in your project root.  
   - Add the following line:  
     ```env
     REACT_APP_TINYURL_API_KEY=your_api_key_here
     ```

---

## **Usage**  

### **Importing the Hook**  
```javascript
import { useShorten } from './useShorten';
```

### **Using the Hook in a Component**  
```javascript
import React, { useState } from 'react';
import { useShorten } from './useShorten';

export default function URLShortener() {
    const [inputURL, setInputURL] = useState('');
    const { shortenedURL, isLoading, errorMessage } = useShorten(inputURL);

    const handleSubmit = (e) => {
        e.preventDefault();
        setInputURL(e.target.url.value);
    };

    return (
        <div>
            <h1>URL Shortener</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="url" placeholder="Enter URL" />
                <button type="submit">Shorten</button>
            </form>

            {isLoading && <p>Loading...</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {shortenedURL && <p>Shortened URL: <a href={shortenedURL.shortenedURL} target="_blank" rel="noopener noreferrer">{shortenedURL.shortenedURL}</a></p>}
        </div>
    );
}
```

---

## **Hook API**  

### **`useShorten(submitURL)`**  

#### **Parameters**  
- `submitURL` **(string)** – The URL to be shortened.

#### **Returns**  
An object containing the following properties:

| Property        | Type     | Description |
|-----------------|----------|-------------|
| `shortenedURL`  | `object \| null` | The shortened URL object `{ submitURL, shortenedURL }`. |
| `isLoading`     | `boolean` | Indicates if the request is in progress. |
| `errorMessage`  | `string`  | Contains an error message if an issue occurs. |

---

## **Hook Implementation**  

```javascript
import { useEffect, useState } from "react";
import axios from 'axios';

export function useShorten(submitURL) {
    const [shortenedURL, setShortenedURL] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (!submitURL || !isValidURL(submitURL)) {
                setErrorMessage('Please enter a valid URL.');
                return;
            }

            setIsLoading(true);
            setErrorMessage('');

            const API_KEY = process.env.REACT_APP_TINYURL_API_KEY;

            try {
                const response = await axios.post(
                    'https://api.tinyurl.com/create',
                    { url: submitURL },
                    {
                        headers: {
                            'Authorization': `Bearer ${API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setShortenedURL({ submitURL, shortenedURL: response.data.data.tiny_url });
            } catch (error) {
                if (error.request) {
                    setErrorMessage('Network Error: You are offline or the server is unreachable.');
                } else if (error.response) {
                    setErrorMessage(`HTTP Error: ${error.response.status} - ${error.response.data.message}`);
                } else {
                    setErrorMessage(`An error occurred: ${error.message}`);
                }
            } finally {
                setIsLoading(false);
            }
        }

        if (submitURL && isValidURL(submitURL)) {
            fetchData();
        }

        return () => {
            setShortenedURL(null);
            setIsLoading(false);
            setErrorMessage('');
        };
    }, [submitURL]);

    return { shortenedURL, isLoading, errorMessage };
}
```

---

## **Error Handling**  
The hook handles different types of errors:  
- **Network Errors:** Displayed when the user is offline or the server is unreachable.  
- **API Errors:** Returns HTTP status codes and error messages for API-specific issues.  
- **Unexpected Errors:** Captures other exceptions (e.g., response parsing errors).
#   t e s t y r k n o  
 