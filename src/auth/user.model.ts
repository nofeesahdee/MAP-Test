import { Optional } from 'sequelize';
import {
    AutoIncrement,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

interface UserAttributes {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    hash: string;
}

@Table({
    tableName: 'user',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class User extends Model<
    UserAttributes,
    Optional<UserAttributes, 'id'>
> {
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    first_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    last_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    hash: string;
}