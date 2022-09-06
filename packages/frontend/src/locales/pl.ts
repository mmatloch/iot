import { DeviceState } from '@definitions/deviceTypes';
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
            failedToUpdateUser: 'Nie udało się zaktualizować użytkownika',
        },
    },
    profile: {
        editProfile: 'Edytuj profil',
    },
    devices: {
        title: 'Urządzenia',
        state: {
            [DeviceState.Active]: 'Aktywne',
            [DeviceState.Inactive]: 'Nieaktywne',
            [DeviceState.Unconfigured]: 'Nieskonfigurowane',
            [DeviceState.Interviewing]: 'Przesłuchiwane',
            [DeviceState.New]: 'Nowe',
            [DeviceState.Error]: 'Błąd',
        },
    },
    configurations: {
        title: 'Konfiguracje',
        entity: {
            data: {
                topicPrefix: 'Prefiks tematu MQTT',
            },
        },
        errors: {
            failedToCreateConfiguration: 'Nie udało się stworzyć konfiguracji',
            failedToUpdateConfiguration: 'Nie udało się zaktualizować konfiguracji',
        },
    },
};
