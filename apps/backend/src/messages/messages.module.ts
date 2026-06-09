import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { MessagesGateway } from "./messages.gateway";
import { Message } from "./message.entity";
import { Friendship } from "../friends/friendship.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Message, Friendship])],
    controllers: [MessagesController],
    providers: [MessagesService, MessagesGateway],
})
export class MessagesModule { }
