import { useEffect, useState } from "react";
import axios from 'axios';

/**
 * Custom hook to shorten URLs using the TinyURL API.
 * 
 * @param {string} submitURL - The URL to be shortened.
 * @returns {object} - Returns shortened URL, loading state, and error message.
 */
export function useShorten(submitURL) {
    // ----- State Management -----
    // State to store the shortened URL result
    const [shortenedURL, setShortenedURL] = useState(null);
    
    // State to indicate if the API request is in progress
    const [isLoading, setIsLoading] = useState(false);
    
    // State to capture any error messages during validation or API requests
    const [errorMessage, setErrorMessage] = useState('');

    // ----- URL Validation Function -----
    /**
     * Checks if the provided URL is valid.
     * 
     * @param {string} url - The URL to validate.
     * @returns {boolean} - Returns true if the URL is valid, false otherwise.
     */
    function isValidURL(url) {
        try {
            new URL(url);  // Tries to create a new URL object; throws error if invalid
            return true;
        } catch (_) {
            return false;
        }
    }

    // ----- Effect Hook for API Request -----
    useEffect(() => {
        /**
         * Fetches shortened URL from TinyURL API.
         */
        async function fetchData() {
            // Validate the URL before making the API request
            if (!submitURL || !isValidURL(submitURL)) {
                setErrorMessage('Please enter a valid URL.');
                return;
            }

            setIsLoading(true);   // Set loading state to true before making API call
            setErrorMessage('');  // Clear any previous errors

            const API_KEY = process.env.REACT_APP_TINYURL_API_KEY;  // API key from environment variables

            try {
                // ----- API Request -----
                const response = await axios.post(
                    'https://api.tinyurl.com/create',  // API endpoint
                    { url: submitURL },               // Request body with the URL to shorten
                    {
                        headers: {
                            'Authorization': `Bearer ${API_KEY}`,  // Authorization header with API key
                            'Content-Type': 'application/json'     // Specify request content type
                        }
                    }
                );

                // Set the shortened URL in the state on successful response
                setShortenedURL({ submitURL, shortenedURL: response.data.data.tiny_url });
            } catch (error) {
                // ----- Error Handling -----
                if (error.request) {
                    setErrorMessage('Network Error: You are offline or the server is unreachable.');
                } else if (error.response) {
                    setErrorMessage(`HTTP Error: ${error.response.status} - ${error.response.data.message}`);
                } else {
                    setErrorMessage(`An error occurred: ${error.message}`);
                }
            } finally {
                setIsLoading(false);  // Reset loading state after API call completes
            }
        }

        // Trigger API call if submitURL is provided and valid
        if (submitURL && isValidURL(submitURL)) {
            fetchData();
        }

        // ----- Cleanup Function -----
        // Resets state when the component unmounts or submitURL changes
        return () => {
            setShortenedURL(null);
            setIsLoading(false);
            setErrorMessage('');
        };
    }, [submitURL]);  // Dependency array ensures effect runs when submitURL changes

    // ----- Return Hook Values -----
    return { shortenedURL, isLoading, errorMessage };
}
