import { Request, Response } from 'express';
import axios from 'axios';
// import { Provider } from "./provider-knex-model";
import { Chatroom } from '../chatroom-module/chatroom-prisma-model';
import { ChatMessage } from '../chat-message-module/chat-message-prisma-model';
import {
    IChatroom,
    IChatroomQueryOptions,
    IChatMessage,
    IChatMessageQueryOptions,
    IPaginateParams,
    IApiHandlerResponse,
} from '../common/interfaces';
import { getS3Object } from '../common/utils/s3-client';
import { genId } from '../common/prisma.module';
import { DataBaseTables } from '../common/enums';

import * as dotenv from 'dotenv';
import { openAICreateMessage } from '../common/utils/openai';
import { ChatCompletionRequestMessage } from 'openai/dist/api';
import { OpenAIModels, OpenAIRoles } from '../common/enums/openai-role-enums';
import logger from '../common/utils/logger';

dotenv.config({});

const TABLE_NAME = DataBaseTables.CHATROOMS_TABLE.toUpperCase();

export const createChatroom = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IChatroom;
        const existing = await Chatroom.isExisting(
            data.user_id!,
            data.influencer_id!,
        );
        if (existing) {
            return {
                statusCode: 422,
                error: 'Chatroom already exists!',
                message: `RESPONSE_CREATE_${TABLE_NAME}_422`,
            };
        }

        data.id = genId();
        const newData = await Chatroom.create(data);
        if (newData) {
            return {
                statusCode: 201,
                data: newData,
                message: `RESPONSE_CREATE_${TABLE_NAME}_201`,
            };
        }
        return {
            statusCode: 400,
            error: 'created data failed',
            message: `RESPONSE_CREATE_${TABLE_NAME}_400`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_CREATE_${TABLE_NAME}_400`,
        };
    }
};

export const getByUserId = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        // User id
        const { userId } = request.params;
        if (!userId) {
            return {
                statusCode: 404,
                error: 'user id not found',
                message: `RESPONSE_GET_USER_ID_404`,
            };
        }

        // handle pagination
        const { per_page, current_page } =
            request.query as unknown as IPaginateParams;

        if (per_page && current_page) {
            const { data: data, meta: meta } = await Chatroom.getByUserId(
                {
                    per_page,
                    current_page,
                },
                userId,
            );

            if (!data) {
                return {
                    statusCode: 400,
                    error: 'data not found',
                    message: `RESPONSE_GET_${TABLE_NAME}_400`,
                };
            }

            return {
                statusCode: 200,
                data,
                meta,
                message: `RESPONSE_GET_${TABLE_NAME}_200`,
            };
        } else {
            // handle get all ( not recommended )
            const data = await Chatroom.getAllByUserId(userId);
            return {
                statusCode: 200,
                data,
                message: `RESPONSE_GET_${TABLE_NAME}_200`,
            };
        }
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 404,
            error: JSON.stringify(e),
            message: `RESPONSE_GET_${TABLE_NAME}_404`,
        };
    }
};

export const getAllMessageByChatRoomId = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        // Chatroom id
        const { chatroomId } = request.params;
        if (!chatroomId) {
            return {
                statusCode: 404,
                error: 'chatroom id not found',
                message: `RESPONSE_GET_CHATROOM_ID_404`,
            };
        }

        // handle pagination
        const { per_page, current_page } =
            request.query as unknown as IPaginateParams;

        if (per_page && current_page) {
            const { data: data, meta: meta } =
                await ChatMessage.getByChatRoomId(
                    {
                        per_page,
                        current_page,
                    },
                    chatroomId,
                );

            if (!data) {
                return {
                    statusCode: 400,
                    error: 'data not found',
                    message: `RESPONSE_GET_CHAT_MESSAGE_400`,
                };
            }

            return {
                statusCode: 200,
                data,
                meta,
                message: `RESPONSE_GET_CHAT_MESSAGE_200`,
            };
        } else {
            // handle get all ( not recommended )
            const data = await ChatMessage.getAllByChatRoomId(chatroomId);
            return {
                statusCode: 200,
                data,
                message: `RESPONSE_GET_CHAT_MESSAGE_200`,
            };
        }
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 404,
            error: JSON.stringify(e),
            message: `RESPONSE_GET_CHAT_MESSAGE_404`,
        };
    }
};

export const sendMessageThruAPI = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IChatMessage;
        const result = await sendMessageThruData(data);
        if (result) {
            return {
                statusCode: 201,
                data: result,
                message: `RESPONSE_CREATE_MESSAGE_201`,
            };
        }
        return {
            statusCode: 400,
            error: 'created data failed',
            message: `RESPONSE_CREATE_MESSAGE_400`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_CREATE_MESSAGE_400`,
        };
    }
};

export const sendMessageThruData = async (data: IChatMessage) => {
    try {
        data.id = genId();
        const newData = await ChatMessage.create(data);
        if (newData) {
            const updateData = {
                id: data.chatroom_id!,
                last_message_id: data.id,
            };

            await Chatroom.update(data.chatroom_id!, updateData);

            return newData;
        }
        return null;
    } catch (e) {
        logger.error(e);
        return null;
    }
};

export const sendMessageGetOpenAiMessage = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IChatMessage;
        const result = await getMessageFromOpenAI(
            data.chatroom_id!,
            data.influencer_id!,
            data.content!,
        );
        if (result) {
            return {
                statusCode: 201,
                data: result,
                message: `RESPONSE_CREATE_MESSAGE_201`,
            };
        }
        return {
            statusCode: 400,
            error: 'created data failed',
            message: `RESPONSE_CREATE_MESSAGE_400`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_CREATE_MESSAGE_400`,
        };
    }
};

export const sendAllPreviousMsgForOpenAI = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IChatMessage;
        const createdMessage = await sendMessageThruData(data);

        if (createdMessage) {
            const result = await getMessageFromOpenAI(
                createdMessage.chatroom_id!,
                createdMessage.influencer_id!,
                null,
            );
            if (result) {
                return {
                    statusCode: 201,
                    data: {
                        result,
                    },
                    message: `RESPONSE_CREATE_MESSAGE_201`,
                };
            }
        }

        return {
            statusCode: 400,
            error: 'created message failed failed',
            message: `RESPONSE_CREATE_MESSAGE_400`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_CREATE_MESSAGE_400`,
        };
    }
};

export const getMessageFromOpenAI = async (
    chatroom_id: string,
    influencer_id: string,
    data: string | null,
) => {
    try {
        const allPrevMessages = await ChatMessage.getAllByChatRoomIdForOpenAI(
            chatroom_id,
        );
        const allPrevOpenAIMsg: ChatCompletionRequestMessage[] = [];
        allPrevMessages.forEach((msg) => {
            const singleMsg: ChatCompletionRequestMessage = {
                role: msg.is_influencer
                    ? OpenAIRoles.ASSISTANT
                    : OpenAIRoles.USER,
                content: msg.content ?? '',
            };
            allPrevOpenAIMsg.push(singleMsg);
        });

        // If previous saved message, don need to add into
        if (data != null) {
            const newMsg: ChatCompletionRequestMessage = {
                role: OpenAIRoles.USER,
                content: data,
            };
            allPrevOpenAIMsg.push(newMsg);
        }

        const response = await openAICreateMessage(allPrevOpenAIMsg);
        if (response) {
            const newMessage: IChatMessage = {
                id: genId(),
                chatroom_id,
                influencer_id,
                is_influencer: true,
                content: response.message?.content,
            };
            await sendMessageThruData(newMessage);

            return response.message?.content;
        }
        return null;
    } catch (e: any) {
        logger.error(e.request.data.error);
        return null;
    }
};

// Sample of directly using axios to call OpenAI API
export const askFromOpenAI = async (data: string) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                prompt: data,
                temperature: 0.5,
                max_tokens: 10,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                model: OpenAIModels.TEXT_DAVINCI_003,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            },
        );
        if (response) {
            return response.data.choices[0].text;
        }
        return null;
    } catch (e) {
        logger.error(e);
        return null;
    }
};
