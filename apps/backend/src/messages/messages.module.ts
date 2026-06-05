import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { MessagesGateway } from "./messages.gateway";
import { Message } from "../common/entities/message.entity";
import { Friendship } from "../common/entities/friendship.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Message, Friendship])],
    controllers: [MessagesController],
    providers: [MessagesService, MessagesGateway],
})
export class MessagesModule { }
