import { ChatroomCreateInput, ChatMessageCreateInput } from '@prisma/client';

export interface IChatroom extends ChatroomCreateInput {
    id: string;
    user_id?: string;
    influencer_id?: string;
    last_message_id?: string;
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface IChatroomQueryOptions {
    id?: string;
    user_id?: string;
    influencer_id?: string;
    last_message_id?: string;
    [key: string]: any; // String index signature
}

export interface IChatMessage extends ChatMessageCreateInput {
    id: string;
    chatroom_id?: string;
    user_id?: string;
    influencer_id?: string;
    content?: string;
    is_influencer?: boolean;
    is_seen?: boolean;
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface IChatMessageQueryOptions {
    id?: string;
    chatroom_id?: string;
    user_id?: string;
    influencer_id?: string;
    content?: string;
    is_influencer?: boolean;
    is_seen?: boolean;
    [key: string]: any; // String index signature
}
