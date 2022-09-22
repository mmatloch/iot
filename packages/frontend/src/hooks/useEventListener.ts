import { useEffect, useRef } from 'react';

type Handler<TEventName extends keyof WindowEventMap> = (e: WindowEventMap[TEventName]) => void;

// Hook
export function useEventListener<TEventName extends keyof WindowEventMap>(
    eventName: TEventName,
    handler: Handler<TEventName>,
) {
    // Create a ref that stores handler
    const savedHandler = useRef<Handler<TEventName>>();

    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const eventListener: Handler<TEventName> = (event) => savedHandler.current?.(event);

        window.addEventListener(eventName, eventListener);

        return () => {
            window.removeEventListener(eventName, eventListener);
        };
    }, [eventName]);
}
