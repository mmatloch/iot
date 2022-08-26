import { createContext } from 'react';

interface Context {
    accessToken?: string;
    login: (accessToken: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<Context | undefined>(undefined);
