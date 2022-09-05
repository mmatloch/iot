import { createContext } from 'react';

interface Context {
    accessToken?: string;
    isAdmin: boolean;
    login: (accessToken: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<Context | undefined>(undefined);
