const express = require('express');
const cors = require('cors');
const { modelsView, models } = require('./models');

const app = express();
const port = 3001; 

// CORS config
const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200 
};
  
app.use(cors(corsOptions));
app.use(express.json());

// Get all available models
app.get('/models', async (req, res) => {
  try {
    res.json(modelsView);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while preperaing models data.' });
  }
});

// Send prompt to model and return its answer
app.post('/ask', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const model = models.filter(model => model.id === req.body.model?.id)[0];

    if (!model){
      res.status(404).json('Select a valid model and try again.');
      return;
    }

    console.log(prompt)

    const result = await model.sendPrompt(prompt);

    if (!result){
      res.status(406).json('The given message could not be processed by this model.')
      return;
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error occurred while generating an asnwer.');
  }
});

// Start listening for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
