import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { PermissionAction } from "@chad/types";

@Entity("permissions")
export class Permission {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "enum",
        enum: PermissionAction,
        unique: true,
    })
    action: PermissionAction;
}
