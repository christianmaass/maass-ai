require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAIAPI() {
  console.log('🧪 Testing OpenAI API connection...');

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    console.log('Please add OPENAI_API_KEY to your .env.local file');
    return;
  }

  try {
    console.log('🔑 API Key found, testing connection...');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with a simple JSON object.',
        },
        {
          role: 'user',
          content:
            'Generate a simple test response in JSON format with a "status" field set to "success" and a "message" field with a greeting.',
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content;
    console.log('✅ OpenAI API connection successful!');
    console.log('📝 Test response:', content);

    // Try to parse as JSON
    try {
      const parsed = JSON.parse(content);
      console.log('✅ JSON parsing successful:', parsed);
    } catch (parseError) {
      console.log('⚠️  Response is not valid JSON, but API connection works');
    }
  } catch (error) {
    console.error('❌ OpenAI API test failed:', error.message);

    if (error.status === 401) {
      console.log('🔑 Check your OPENAI_API_KEY - it might be invalid or expired');
    } else if (error.status === 429) {
      console.log('⏰ Rate limit exceeded - try again in a moment');
    } else if (error.status === 500) {
      console.log('🔧 OpenAI server error - try again later');
    }
  }
}

// Run the test
testOpenAIAPI();
