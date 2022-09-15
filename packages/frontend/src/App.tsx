import { AuthProvider } from '@contexts/AuthProvider';
import { LocaleProvider } from '@contexts/LocaleProvider';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppRoute } from './constants';
import AuthRedirectGoogle from './pages/AuthRedirectGoogle';
import AuthSignIn from './pages/AuthSignIn';
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
                                    <Route path={AppRoute.Events} element={<ProtectedRoute element={<Events />} />} />
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
