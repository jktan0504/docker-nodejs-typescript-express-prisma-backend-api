import { ChatCompletionRequestMessage } from 'openai/dist/api';
import openAI from '../../../configs/openai';
import { OpenAIModels } from '../enums/openai-role-enums';

export const openAICreateMessage = async (
    messages: ChatCompletionRequestMessage[],
) => {
    try {
        const completion = await openAI.createChatCompletion({
            model: OpenAIModels.GPT_3_5_TURBO,
            messages,
            temperature: 0.5,
            max_tokens: 2300,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        return completion.data.choices[0];
    } catch (err: any) {
        console.log(err.message);
        console.log(err.request);
        console.log(err.request.data);
        console.log(err.request.data.error);
        console.log(err.request.data.error.messaqe);
        console.log(err);
    }
};
