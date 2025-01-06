import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/randomQuote.css';

const RandomQuote = () => {
    const [quoteIndex, setQuoteIndex] = useState(-1); // -1 to indicate no quote selected initially
    const [usedQuotes, setUsedQuotes] = useState([]); // To track used quotes
    const [quotes, setQuotes] = useState([]);

    // Function to get a new random quote index that hasn't been used before
    const getRandomQuoteIndex = () => {
        if (usedQuotes.length === quotes.length) {
            // All quotes have been shown, reset used quotes array
            setUsedQuotes([]);
        }

        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * quotes.length);
        } while (usedQuotes.includes(newIndex) && quotes.length > 1); // Avoid same quote when quotes length > 1

        setUsedQuotes((prev) => [...prev, newIndex]); // Track used quotes
        return newIndex;
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://103.38.50.152/nodejs/quotes/getquotes');
            // const response = await axios.get('http://localhost:5000/quotes/getquotes');
            setQuotes(response.data);
        } catch (error) {
            console.error("Error occurred in Random Quotes Fetch:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Fetch data once when component mounts

    useEffect(() => {
        if (quotes.length > 0) {
            const newIndex = getRandomQuoteIndex();
            setQuoteIndex(newIndex);
        }
    }, [quotes]); // Set new quoteIndex when quotes data is fetched

    // If quotes haven't been fetched yet, or no quote is selected, return null
    if (quoteIndex === -1 || quotes.length === 0) {
        return null;
    }

    return (
        <div className="random-quote-main" >
           
            <p style={{ fontStyle: 'italic', fontSize: '1.5vw' }}>"{quotes[quoteIndex].quote}"</p>
            <p>- {quotes[quoteIndex].author}</p>
        </div>
    );
};

export default RandomQuote;
