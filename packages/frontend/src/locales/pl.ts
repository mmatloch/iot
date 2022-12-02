import { DevicePowerSource, DeviceProtocol, DeviceState, DeviceType } from '@definitions/entities/deviceTypes';
import { EventInstanceState } from '@definitions/entities/eventInstanceTypes';
import { EventSchedulerTaskState } from '@definitions/entities/eventSchedulerTypes';
import {
    EventActionOnInactive,
    EventMetadataOnMultipleInstances,
    EventMetadataTaskType,
    EventState,
    EventTriggerType,
} from '@definitions/entities/eventTypes';
import { UserRole, UserState } from '@definitions/entities/userTypes';
import type { Locale } from '@definitions/localeTypes';

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
        allow: 'Pozwól',
        optional: 'Opcjonalne',
        statusCode: 'Kod statusu',
        showDetails: 'Pokaż szczegóły',
        dates: {
            createdAtAndBy: 'Utworzono <strong>{{when}}</strong> przez <strong>{{by}}</strong>',
            updatedAtAndBy: 'Zaktualizowano <strong>{{when}}</strong> przez <strong>{{by}}</strong>',
            createdAt: 'Utworzono <strong>{{when}}</strong>',
            updatedAt: 'Zaktualizowano <strong>{{when}}</strong>',
        },
        entity: {
            id: 'ID',
            state: 'Stan',
        },
        search: {
            filters: 'Filtry',
            filtering: {
                title: 'Filtrowanie',
                showOnlyActive: 'Pokaż tylko aktywne',
                filterByEvent: 'Filtruj po zdarzeniu',
                filterByDevice: 'Filtruj po urządzeniu',
            },
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
            permissionDenied: 'Brak uprawnień',
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
        search: {
            inputLabel: 'Szukaj użytkowników',
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
            [DeviceState.Interviewing]: 'Przesłuchiwane',
            [DeviceState.New]: 'Nowe',
            [DeviceState.Error]: 'Błąd',
        },
        type: {
            [DeviceType.Coordinator]: 'Koordynator',
            [DeviceType.EndDevice]: 'Urządzenie końcowe',
            [DeviceType.Router]: 'Router',
            [DeviceType.Unknown]: 'Nieznany typ urządzenia',
            [DeviceType.Virtual]: 'Urządzenie wirtualne',
        },
        powerSource: {
            [DevicePowerSource.Battery]: 'Baterie',
            [DevicePowerSource.Dc]: 'Prąd stały',
            [DevicePowerSource.EmergencyMains]: 'Sieć awaryjna',
            [DevicePowerSource.MainsSinglePhase]: 'Sieć jednofazowa',
            [DevicePowerSource.MainsThreePhase]: 'Sieć trójfazowa',
            [DevicePowerSource.Unknown]: 'Nieznane źródło zasilania',
            [DevicePowerSource.Virtual]: 'Urządzenie wirtualne',
        },
        protocol: {
            [DeviceProtocol.Zigbee]: 'Zigbee',
            [DeviceProtocol.Virtual]: 'Urządzenie wirtualne',
        },
        entity: {
            displayName: 'Nazwa',
            description: 'Opis',
            ieeeAddress: 'Adres IEEE',
        },
        deactivatedBy: {
            bridge: 'Dezaktywowane przez most <strong>{{name}}</strong>',
            user: 'Dezaktywowane przez <strong>{{name}}</strong>',
        },
        creator: {
            title: 'Kreator urządzeń',
            selectProtocolStep: {
                title: 'Wybierz protokół urządzenia',
                description: 'Protokół określa sposób komunikacji z urządzeniem',
            },
            bridgeSetupStep: {
                title: 'Skonfiguruj most',
            },
            allowToJoin: {
                title: 'Zezwól urządzeniom na dołączenie do sieci',
                description: 'Aby urządzenia mogły dołączyć do sieci należy im na to zezwolić',
                prompt: {
                    title: 'Czy chcesz zezwolić urządzeniom na dołączanie?',
                    helper: 'Ta opcja wyłączy się sama po 5 minutach',
                },
            },
            addDevice: {
                title: 'Dodaj urządzenie',
                lookingForDevices: 'Szukanie urządzeń',
            },
            deviceSetup: {
                title: 'Skonfiguruj urządzenie',
                deviceAdded: 'Urządzenie dodane pomyślnie!',
                goToDeviceConfiguration: 'Przejdź do konfiguracji urządzenia',
            },
        },
        search: {
            inputLabel: 'Szukaj urządzeń',
        },
        errors: {
            failedToUpdateDevice: 'Nie udało się zaktualizować urządzenia',
        },
    },
    configurations: {
        title: 'Konfiguracje',
        entity: {
            data: {
                topicPrefix: 'Prefiks tematu MQTT',
            },
        },
        zigbee: {
            mqttTopicsAndMessages: 'Tematy i wiadomości MQTT',
        },
        errors: {
            failedToCreateConfiguration: 'Nie udało się stworzyć konfiguracji',
            failedToUpdateConfiguration: 'Nie udało się zaktualizować konfiguracji',
            noPermissionToCreateConfiguration:
                'Nie masz uprawnień do stworzenia konfiguracji - <strong>skontaktuj się z administratorem</strong>',
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
        errors: {
            failedToCreateEvent: 'Nie udało się utworzyć zdarzenia',
            failedToUpdateEvent: 'Nie udało się zaktualizować zdarzenia',
            failedToTriggerEvent: 'Nie udało się wywołać zdarzenia',
            failedToParseTriggerContext: 'Nie udało się przetworzyć kontekstu wywołania',
            failedToParseCronExpression: 'Nie udało się przetworzyć wyrażenia CRON',
        },
        search: {
            showOnlyUserCreated: 'Pokaż tylko stworzone przez użytkownika',
            inputLabel: 'Szukaj zdarzeń',
        },
    },
    eventInstances: {
        title: 'Instancje zdarzeń',
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
    eventScheduler: {
        title: 'Harmonogram zdarzeń',
        state: {
            [EventSchedulerTaskState.Queued]: 'Zakolejkowane',
            [EventSchedulerTaskState.Running]: 'Uruchomione',
        },
        nextTriggerAt: 'Następne aktywowanie o:',
        nextTrigger: 'Następne aktywowanie',
        intervalDescription: 'Co ile sekund zdarzenie powinno zostać wywołane',
        onMultipleInstancesDescription: 'Co powinno się stać, gdy to wydarzenie zostało już zaplanowane',
        errors: {
            failedToDeleteTask: 'Nie udało się anulować zaplanowanego zadania',
        },
    },
};
