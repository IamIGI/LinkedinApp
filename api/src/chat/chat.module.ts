import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { ConversationService } from './services/conversation.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './models/conversation.entity';
import { MessageEntity } from './models/message.entity';
import { ActiveConversationEntity } from './models/active-conversation.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ConversationEntity,
      ActiveConversationEntity,
      MessageEntity,
    ]),
  ],
  providers: [ChatGateway, ConversationService],
})
export class ChatModule {}
