import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openAI = new OpenAIApi(configuration);

export default openAI;

export interface IMessageCreator {
    openai: OpenAIApi;
    message: string;
}
