import { Module, Global } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PresenceService } from "./presence.service";
import { PresenceGateway } from "./presence.gateway";

@Global()
@Module({
    imports: [JwtModule],
    providers: [PresenceService, PresenceGateway],
    exports: [PresenceService],
})
export class PresenceModule {}
