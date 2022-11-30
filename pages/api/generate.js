import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`
write me the lore of the game with the style of GLaDOS from Aperture Science in portal 2 with the title below. Please make sure the lore of the game goes in-depth on the topic and shows that the writer did their research.

Title: 

`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  //prompt #2

  const secondPrompt = 
  `
  Take the table of contents and title of the lore of the game below and generate the game lore written in with style of GLaDOS from Aperture Science in portal 2. Make it feel like a history. Don't just list the points. Go deep into each one. Explain why.

  Title: ${req.body.userInput}

  Table of Contents: ${basePromptOutput.text}

  Blog Post:
  `

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${secondPrompt}`,
    temperature: 0.7,
    max_tokens: 1500,
  });

  // output prompt #2
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;