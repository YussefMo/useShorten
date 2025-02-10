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
            // eslint-disable-next-line no-unused-vars
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
                    {
                        url: submitURL
                    },
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
        // Clean up on unmount
        return () => {
            setShortenedURL(null);
            setIsLoading(false);
            setErrorMessage('');
        };
    }, [submitURL]);

    return { shortenedURL, isLoading, errorMessage };
}
