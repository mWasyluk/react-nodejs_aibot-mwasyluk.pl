import { useEffect, useState, useCallback } from 'react';

const useFetch = (initialConfig = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const configString = JSON.stringify(initialConfig);

    const fetchData = useCallback(async (config = {}) => {
        const cf = JSON.parse(configString);
        const { url, method = 'GET', body = null, headers = null } = { ...cf, ...config };
        if (!url) return;

        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    ...headers,
                },
            };

            if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result || `Unknown error occurred while processing the message.`);
            }

            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [configString]);

    useEffect(() => {
        const config = JSON.parse(configString);
        if (config.url) {
            fetchData(config);
        }
    }, [configString, fetchData]);

    return { data, isLoading, error, fetchData };
};

export default useFetch;
