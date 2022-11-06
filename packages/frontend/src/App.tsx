import { AuthProvider } from '@contexts/AuthProvider';
import { LocaleProvider } from '@contexts/LocaleProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
    );
}

export default App;
