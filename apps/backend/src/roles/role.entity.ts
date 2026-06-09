import {
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
} from "typeorm";
import { Permission } from "../common/entities/permission.entity";
import { User } from "../common/entities/user.entity";

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Permission)
    @JoinTable({
        name: "role_permissions",
        joinColumn: { name: "role_id", referencedColumnName: "id" },
        inverseJoinColumn: {
            name: "permission_id",
            referencedColumnName: "id",
        },
    })
    permissions: Permission[];

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
