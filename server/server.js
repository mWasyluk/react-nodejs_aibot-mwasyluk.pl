const express = require('express');
const cors = require('cors');
const { models, actions } = require('./models');

const app = express();
const port = process.env.AIBOT_API_PORT; 

// CORS config
const corsOptions = {
    origin: process.env.AIBOT_APP_URL, 
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(express.json());

const router = express.Router();

// Get all available models
router.get('/models', async (req, res) => {
  try {
    res.json(models);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while preperaing models data.' });
  }
});

// Send prompt to model and return its answer
router.post('/ask', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log(models);
    console.log(req.body);
    const model = models.filter(model => model.id === req.body.model?.id)[0];

    if (!model){
      res.status(404).json('Select a valid model and try again.');
      return;
    }

    
    const result = await model.sendPrompt(prompt);
    
    if (!result){
      res.status(406).json('The given message could not be processed by this model.')
      return;
    }
    
    console.log(result);

    res.json(result);
  } catch (error) {
    if (error.status === 429 ){
      const timeout = error.errorDetails.filter(ed => ed.retryDelay)[0]?.retryDelay
      res.status(429).json(`Please wait ${timeout} to send another message.`)
      return;
    } 
    
    console.error(error.status);
    res.status(500).json('Server error occurred while generating an asnwer.');
  }
});

router.post('/stream', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const model = models.find(m => m.id === req.body.model?.id);

    if (!model) {
      res.writeHead(400, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      });
      res.write(`data: ${JSON.stringify({ type: "error", delta: "", full: "Invalid model", done: true })}\n\n`);
      return;
    }

    // SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });

    const stream = model.sendPromptStream(prompt);

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  } catch (err) {
    const errorEvent = {
      type: "error",
      delta: "",
      full: err.message || "Unknown server error",
      done: true
    };

    res.write(`event: error\ndata: ${JSON.stringify(errorEvent)}\n\n`);
    res.end();
  }
});

// Start listening for requests on /api/*
app.use('/api', router);
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  console.log(await actions.riddle)
});
