import { AuthProvider } from '@contexts/AuthProvider';
import { LocaleProvider } from '@contexts/LocaleProvider';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';
import { loader } from '@monaco-editor/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppRoute } from './constants';
import AuthRedirectGoogle from './pages/AuthRedirectGoogle';
import AuthSignIn from './pages/AuthSignIn';
import EventCreator from './pages/EventCreator';
import EventEditor from './pages/EventEditor';
import Events from './pages/Events';
import Home from './pages/Home';
import Users from './pages/Users';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider maxSnack={5}>
                    <BrowserRouter>
                        <LocaleProvider>
                            <AuthProvider>
                                <Routes>
                                    <Route index element={<ProtectedRoute element={<Home />} />} />
                                    <Route path={AppRoute.Auth.SignIn} element={<AuthSignIn />} />
                                    <Route path={AppRoute.Auth.Redirect.Google} element={<AuthRedirectGoogle />} />
                                    <Route path={AppRoute.Users} element={<ProtectedRoute element={<Users />} />} />
                                    <Route
                                        path={AppRoute.Events.Root}
                                        element={<ProtectedRoute element={<Events />} />}
                                    />
                                    <Route
                                        path={AppRoute.Events.Creator}
                                        element={<ProtectedRoute element={<EventCreator />} />}
                                    />
                                    <Route
                                        path={AppRoute.Events.Editor}
                                        element={<ProtectedRoute element={<EventEditor />} />}
                                    />
                                </Routes>
                            </AuthProvider>
                        </LocaleProvider>
                    </BrowserRouter>
                </SnackbarProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
