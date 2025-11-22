
import { User } from '../types';

const USERS_KEY = 'splitbill_users';
const SESSION_KEY = 'splitbill_session';

interface StoredUser extends User {
    passwordHash: string;
}

// Simulate network delay for a realistic experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const register = async (name: string, email: string, password: string): Promise<User> => {
    await delay(600);
    const usersJSON = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = usersJSON ? JSON.parse(usersJSON) : [];

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
    }

    const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name,
        email,
        passwordHash: btoa(password), // Simple encoding for client-side demo (not secure for production)
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const userToReturn: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(userToReturn));
    
    return userToReturn;
};

export const login = async (email: string, password: string): Promise<User> => {
    await delay(600);
    const usersJSON = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = usersJSON ? JSON.parse(usersJSON) : [];
    
    // Simple password matching
    const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.passwordHash === btoa(password)
    );

    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const userToReturn: User = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(userToReturn));

    return userToReturn;
};

export const logout = (): void => {
    localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
    try {
        const sessionJson = localStorage.getItem(SESSION_KEY);
        return sessionJson ? JSON.parse(sessionJson) : null;
    } catch {
        return null;
    }
};

export const getToken = (): string | null => {
     const user = getCurrentUser();
     return user ? `mock-token-${user.id}` : null; 
};
