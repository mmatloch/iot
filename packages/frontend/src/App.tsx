import { AuthProvider } from '@contexts/AuthProvider';
import { LocaleProvider } from '@contexts/LocaleProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from './ErrorBoundary';
import Router from './Router';

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
        <ErrorBoundary>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <QueryClientProvider client={queryClient}>
                    <SnackbarProvider maxSnack={5}>
                        <BrowserRouter>
                            <LocaleProvider>
                                <AuthProvider>
                                    <Router />
                                </AuthProvider>
                            </LocaleProvider>
                        </BrowserRouter>
                    </SnackbarProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
