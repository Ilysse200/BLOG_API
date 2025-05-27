//Database configuration
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { log } from "console";
import { Blog } from '../entities/Blog';



export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1234',
    database: 'users',
    entities: [User, Blog],
    logging: true,
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
    synchronize: true, // Temporarily only!
})

export const InitializeDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully!!');

    } catch (error) {
        console.log('Error connecting to the database', error);
        throw error;

    }

}