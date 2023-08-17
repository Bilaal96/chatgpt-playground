import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('ai-prompt')?.toString();
    console.log({ formData, prompt });

    // VALIDATE/SERIALIZE INPUT HERE - Zod or other package

    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return NextResponse.json({ result: chatCompletion.data.choices });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error?.response) {
      console.error(error.response.status, error.response.data);
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return NextResponse.json(
        { error: { message: 'An error occurred during your request.' } },
        { status: 500 }
      );
    }
  }
}
