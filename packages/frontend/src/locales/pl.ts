import { Locale } from '@definitions/localeTypes';
import { UserRole, UserState } from '@definitions/userTypes';

export const PolishLocale: Locale = {
    generic: {
        activate: 'Aktywuj',
        deactivate: 'Dezaktywuj',
        edit: 'Edytuj',
        save: 'Zapisz',
        cancel: 'Anuluj',
    },
    auth: {
        signIn: {
            title: 'Zaloguj się',
        },
        logout: 'Wyloguj',
        errors: {
            userInactive: 'Twoje konto jest obecnie nieaktywne',
        },
    },
    users: {
        role: {
            [UserRole.Admin]: 'Admin',
            [UserRole.User]: 'Użytkownik',
        },
        state: {
            [UserState.Active]: 'Aktywny',
            [UserState.Inactive]: 'Nieaktywny',
            [UserState.PendingApproval]: 'Oczekuje na zatwierdzenie',
        },
        entity: {
            email: 'Email',
            name: 'Nazwa',
            firstName: 'Imię',
            lastName: 'Nazwisko',
            role: 'Rola',
        },
        management: {
            title: 'Zarządzanie użytkownikami',
        },
        errors: {
            failedToLoadUsers: 'Nie udało się załadować użytkowników',
            failedToUpdateUser: 'Nie udało się zaktualizować użytkownika',
        },
    },
};
