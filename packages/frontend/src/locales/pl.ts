import { DeviceState } from '@definitions/deviceTypes';
import { EventInstanceState } from '@definitions/entities/eventInstanceTypes';
import {
    EventActionOnInactive,
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
        error: 'Błąd',
        clear: 'Wyszyść',
        create: 'Stwórz',
        statusCode: 'Kod statusu',
        entity: {
            id: 'ID',
            state: 'Stan',
        },
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
            errorOccured: 'Wystąpił błąd',
            unknownErrorOccured: 'Wystąpił nieznany błąd',
        },
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
    bridge: {
        errors: {
            failedToRequestBridge: 'Nie udało się wysłać żądania do mostu',
        },
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
            [EventMetadataOnMultipleInstances.Create]: 'Stwórz nowy',
            [EventMetadataOnMultipleInstances.Replace]: 'Zastąp aktualnie zaplanowany',
            [EventMetadataOnMultipleInstances.Skip]: 'Pomiń planowanie',
        },
        metadataTaskType: {
            [EventMetadataTaskType.RelativeCron]: 'Relatywny CRON',
            [EventMetadataTaskType.RelativeInterval]: 'Relatywny interwał',
            [EventMetadataTaskType.StaticCron]: 'Statyczny CRON',
            [EventMetadataTaskType.StaticInterval]: 'Statyczny interwał',
        },
        onInactive: {
            [EventActionOnInactive.Continue]: 'Kontynuuj',
            [EventActionOnInactive.Error]: 'Zwróć błąd',
            [EventActionOnInactive.Skip]: 'Pomiń',
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
        editor: {
            creator: {
                title: 'Kreator zdarzeń',
            },
            editor: {
                title: 'Edytor zdarzeń',
            },
            basicInformation: {
                title: 'Podstawowe informacje',
            },
            conditionDefinition: {
                title: 'Określenie warunku',
            },
            actionDefinition: {
                title: 'Określenie akcji',
            },
            triggerFilters: {
                title: 'Filtry zdarzenia',
                description: 'Filtry określają w jaki sposób system może znaleźć dane zdarzenie',
                forDevice: 'Dla urządzenia',
            },
            openInEditor: 'Otwórz w edytorze zdarzeń',
            triggerPanel: {
                buttonText: 'Wywołaj zdarzenie',
                runId: 'ID uruchomienia',
                context: {
                    title: 'Kontekst',
                    description:
                        'Dane w formacie JSON z którymi zostanie wywołane zdarzenie np. dane przysłane przez urządzenie',
                },
                options: {
                    title: 'Opcje',
                },
                onInactive: {
                    title: 'Gdy nieaktywne',
                    description: 'Co powinno się stać, gdy to wydarzenie jest nieaktywne',
                },
            },
        },
        scheduler: {
            nextTriggerAt: 'Następne aktywowanie o:',
            intervalDescription: 'Co ile sekund zdarzenie powinno zostać wywołane',
            onMultipleInstancesDescription: 'Co powinno się stać, gdy to wydarzenie zostało już zaplanowane',
        },
        errors: {
            failedToCreateEvent: 'Nie udało się utworzyć zdarzenia',
            failedToUpdateEvent: 'Nie udało się zaktualizować zdarzenia',
            failedToTriggerEvent: 'Nie udało się wywołać zdarzenia',
            failedToParseTriggerContext: 'Nie udało się przetworzyć kontekstu wywołania',
            failedToParseCronExpression: 'Nie udało się przetworzyć wyrażenia CRON',
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
    eventInstances: {
        entity: {
            triggeredBy: 'Wywołany przez',
            performanceMetrics: {
                executionDuration: 'Czas wykonywania',
                steps: 'Kroki',
            },
        },
        state: {
            [EventInstanceState.ConditionNotMet]: 'Niespełniony warunek',
            [EventInstanceState.FailedOnAction]: 'Akcja nie powiodła się',
            [EventInstanceState.FailedOnCondition]: 'Warunek nie powiódł się',
            [EventInstanceState.Success]: 'Sukces',
            [EventInstanceState.UnknownError]: 'Nieznany błąd',
        },
    },
};
