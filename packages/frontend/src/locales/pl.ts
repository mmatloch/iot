import {
    EventMetadataOnMultipleInstances,
    EventMetadataTaskType,
    EventState,
    EventTriggerType,
} from '@definitions/entities/eventTypes';
import { UserRole, UserState } from '@definitions/entities/userTypes';
import { Locale } from '@definitions/localeTypes';

export const PolishLocale: Locale = {
    generic: {
        activate: 'Aktywuj',
        deactivate: 'Dezaktywuj',
        edit: 'Edytuj',
        save: 'Zapisz',
        cancel: 'Anuluj',
        retry: 'Ponów próbę',
        default: 'Domyślne',
        search: {
            filters: 'Filtry',
            filtering: 'Filtrowanie',
            sorting: {
                title: 'Sortowanie',
                oldestFirst: 'Najpierw najstarsze',
                newestFirst: 'Najpierw najnowsze',
                recentlyUpdated: 'Ostatnio aktualizowane',
            },
        },
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
        triggerType: {
            [EventTriggerType.Api]: 'Przez aplikację',
            [EventTriggerType.IncomingDeviceData]: 'Przychodzące dane z urządzenia',
            [EventTriggerType.OutgoingDeviceData]: 'Wychodzące dane do urządzenia',
            [EventTriggerType.Scheduler]: 'Harmonogram',
        },
        metadataOnMultipleInstances: {
            [EventMetadataOnMultipleInstances.Create]: 'Stwórz',
            [EventMetadataOnMultipleInstances.Replace]: 'Zamień',
            [EventMetadataOnMultipleInstances.Skip]: 'Pomiń',
        },
        metadataTaskType: {
            [EventMetadataTaskType.RelativeCron]: 'Relatywny CRON',
            [EventMetadataTaskType.RelativeInterval]: 'Relatywny interwał',
            [EventMetadataTaskType.StaticCron]: 'Statyczny CRON',
            [EventMetadataTaskType.StaticInterval]: 'Statyczny interwał',
        },
        entity: {
            displayName: 'Nazwa',
            triggerType: 'Typ wyzwalacza',
            metadata: {
                retryImmediatelyAfterBoot: 'Ponów próbę natychmiast po uruchomieniu systemu',
                recurring: 'Powtarzający się',
                runAfterEvent: 'Uruchom po zdarzeniu',
                interval: 'Interwał',
                cronExpression: 'Wyrażenie CRON',
                taskType: 'Typ zadania',
                onMultipleInstances: 'Przy wielu instancjach',
            },
        },
        errors: {
            failedToUpdateEvent: 'Nie udało się zaktualizować zdarzenia',
        },
        dates: {
            createdAt: 'Utworzono <strong>{{when}}</strong> przez <strong>{{by}}</strong>',
            updatedAt: 'Zaktualizowano <strong>{{when}}</strong> przez <strong>{{by}}</strong>',
        },
        search: {
            showOnlyActive: 'Pokaż tylko aktywne',
            showOnlyUserCreated: 'Pokaż tylko stworzone przez użytkownika',
        },
    },
};
