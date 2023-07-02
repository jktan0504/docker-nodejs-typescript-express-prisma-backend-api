import { Telegraf, Context } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';
import { commands } from './commands';
import { openAICreateMessage } from '../common/utils/openai';
import { ChatCompletionRequestMessage } from 'openai/dist/api';

interface QueueTask {
    (): void;
}

class Queue {
    private tasks: QueueTask[] = [];

    add(task: QueueTask) {
        this.tasks.push(task);
    }

    remove() {
        return this.tasks.shift();
    }
}

const queue = new Queue();

export const botCommand = (bot: Telegraf<Context<Update>>) => {
    let allMessages = [];
    let lastUpdateId = 0;

    function getUpdates() {
        queue.add(() =>
            bot.telegram
				.getUpdates(30, 100, lastUpdateId + 1, ['message', 'callback_query'])
                .then((updates) => {
					updates.forEach((update) => {
						if (update.message) {
						  allMessages.push(update.message);
						} else if (update.callback_query?.message) {
						  allMessages.push(update.callback_query.message);
						}
					  });
					  lastUpdateId = updates[updates.length - 1].update_id;
                }),
        );
    }

    // Request updates on interval
    setInterval(() => {
        queue.remove();
        getUpdates();
    }, 1000);

    bot.start(
        async (ctx: Context) =>
            await ctx.replyWithHTML(`<b>Hi!👋</b>
			This chatbot was created to use the CelebAPI, referred to as Celebrity AI Chat, to generate code, write messages, essays, answer questions.
			To get started: <b>just write a message.👇</b>`),
    );

    bot.on(
        'sticker',
        async (ctx: Context) =>
            await ctx.replyWithSticker(
                'CAACAgQAAxkBAAEHUNhjx0E540Wijpp4g_7R2ZJHob70kwACggsAAlbgaFDqQettvqTomC0E',
            ),
    );

    bot.help(async (ctx: Context) => await ctx.reply(commands));

    bot.command('art', async (ctx) => {
        await ctx.replyWithSticker(
            'CAACAgIAAxkBAAEHUN9jx0lrYA4uPImFd3KwMFVmOOATmAAC1BEAA8CgSXknAeKPK_QMLQQ',
        );

        await ctx.reply('In developing');
    });

    bot.on('text', async (ctx: Context) => {
        getUpdates();
        const newMessage = ctx.message;
        const allMessages: (Update.New & Update.NonChannel & Message)[] = [];
        allMessages.push(
            newMessage as Update.New & Update.NonChannel & Message,
        );

        const messagesForOpenAI = allMessages.map((m) => {
            return {
                role: m.from.is_bot ? 'bot' : 'user',
                content: m.text,
            } as ChatCompletionRequestMessage;
        });

        const response = await openAICreateMessage(messagesForOpenAI);

        if (response) {
            await ctx.reply(response.message?.content ?? "I don't know", {
                reply_to_message_id: ctx!.message!.message_id,
            });
        }
    });
};
