const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000; // Default port for local development and Render

// Middleware to parse JSON
app.use(express.json());

// Search and get download link
app.get('/spotify/search=:query', async (req, res) => {
    const query = req.params.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "query" is required' });
    }

    try {
        // Step 1: Search for the song on YouTube
        const searchResponse = await axios.get(`https://hiroshi-rest-api.replit.app/search/youtube?q=${query}`);
        const searchResults = searchResponse.data.results;

        if (!searchResults || searchResults.length === 0) {
            return res.status(404).json({ error: 'No results found' });
        }

        const firstResult = searchResults[0];
        const videoUrl = firstResult.link;

        // Step 2: Get the download link for the first search result
        const downloadResponse = await axios.get(`https://hiroshi-rest-api.replit.app/tools/yt?url=${videoUrl}`);
        const downloadData = downloadResponse.data;

        res.json({
            title: firstResult.title,
            downloadLink: downloadData.mp3,
            thumbnail: firstResult.thumbnail
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch search or download results', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
