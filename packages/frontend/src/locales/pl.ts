import { EventState } from '@definitions/eventTypes';
import { Locale } from '@definitions/localeTypes';
import { UserRole, UserState } from '@definitions/userTypes';

export const PolishLocale: Locale = {
    generic: {
        activate: 'Aktywuj',
        deactivate: 'Dezaktywuj',
        edit: 'Edytuj',
        save: 'Zapisz',
        cancel: 'Anuluj',
        retry: 'Ponów próbę',
        errors: {
            failedToLoadData: 'Nie udało się załadować danych',
            noInternetConnection: 'Sprawdź połączenie internetowe i spróbuj ponownie',
        },
    },
    i18n: {
        changeLanguage: 'Zmień język',
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
        title: 'Użytkownicy',
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
        errors: {
            failedToLoadUsers: 'Nie udało się załadować użytkowników',
            failedToUpdateUser: 'Nie udało się zaktualizować użytkownika',
        },
    },
    profile: {
        editProfile: 'Edytuj profil',
    },
    events: {
        title: 'Zdarzenia',
        state: {
            [EventState.Active]: 'Aktywny',
            [EventState.Inactive]: 'Nieaktywny',
            [EventState.Completed]: 'Zakończony',
        },
        errors: {
            failedToUpdateEvent: 'Nie udało się zaktualizować zdarzenia',
        },
    },
};
