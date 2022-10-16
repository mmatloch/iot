import { useEventListener } from '@hooks/useEventListener';
import MonacoEditor, { BeforeMount, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { useSnackbar } from 'notistack';
import babylon from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import { forwardRef, useMemo } from 'react';
import libEs5 from 'typescript/lib/lib.es5.d.ts?raw';

import libSdk from '../../definitions/eventSdk.d.ts?raw';

interface Props {
    defaultValue?: string;
    value?: string;
    onMount?: () => void;
    onChange?: (value: string | undefined) => void;
    onSave?: (value: string) => void;
    formatOnSave?: boolean;
    language: string;
}

export type EditorRef = editor.IStandaloneCodeEditor;

const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
    minimap: {
        enabled: false,
    },
};

const Editor = forwardRef<EditorRef, Props>(
    ({ defaultValue, formatOnSave, onSave, onMount, onChange, language, value }, editorRef) => {
        const { enqueueSnackbar } = useSnackbar();

        useEventListener('keydown', (e) => {
            if (!onSave) {
                return;
            }

            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();

                const ref = getRef();

                if (ref) {
                    const value = ref.getValue();
                    const position = ref.getPosition();
                    const formattedValue = format(value);

                    ref.setValue(formattedValue);

                    if (position) {
                        ref.setPosition(position);
                    }
                    onSave(formattedValue);
                }
            }
        });

        const getRef = () => {
            if (typeof editorRef === 'function') {
                return;
            }

            return editorRef?.current;
        };

        const beforeMount: BeforeMount = (monaco) => {
            const javascript = monaco.languages.typescript.javascriptDefaults;

            javascript.setCompilerOptions({
                noLib: true,
                allowNonTsExtensions: true,
            });
            javascript.addExtraLib(libEs5);
            javascript.addExtraLib(libSdk);
        };

        const handleMount: OnMount = (editor) => {
            if (!editorRef) {
                return;
            }

            if (typeof editorRef === 'function') {
                editorRef(editor);
                return;
            }

            editorRef.current = editor;

            onMount?.();
        };

        const format = (value: string) => {
            if (formatOnSave) {
                try {
                    return prettier.format(value, {
                        parser: 'babel',
                        plugins: [babylon],
                    });
                } catch (e) {
                    enqueueSnackbar(`Failed to format`, {
                        variant: 'error',
                    });
                }
            }

            return value;
        };

        const path = useMemo(() => {
            switch (language) {
                case 'javascript':
                    return 'index.js';
                case 'json':
                    return 'index.json';
                default:
                    throw new Error(`Unsupported language '${language}'`);
            }
        }, [language]);

        return (
            <MonacoEditor
                defaultLanguage={language}
                path={path}
                defaultValue={defaultValue}
                value={value}
                theme="vs-dark"
                beforeMount={beforeMount}
                onMount={handleMount}
                options={EDITOR_OPTIONS}
                onChange={onChange}
            />
        );
    },
);

export default Editor;
