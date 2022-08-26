import { AuthProvider } from '@contexts/AuthProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppRoute } from './constants';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import AuthRedirectGoogle from './pages/AuthRedirectGoogle';
import AuthSignIn from './pages/AuthSignIn';
import Home from './pages/Home';

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
                        <AuthProvider>
                            <Routes>
                                <Route index element={<ProtectedRoute element={<Home />} />} />
                                <Route path={AppRoute.Auth.SignIn} element={<AuthSignIn />} />
                                <Route path={AppRoute.Auth.Redirect.Google} element={<AuthRedirectGoogle />} />
                            </Routes>
                        </AuthProvider>
                    </BrowserRouter>
                </SnackbarProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
