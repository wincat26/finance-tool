import { User } from '../models/User'; // Assuming you will create a User model or interface

declare global {
    namespace Express {
        interface User {
            id: number;
            email: string;
            name: string;
            picture?: string;
            role: string;
        }
    }
}
