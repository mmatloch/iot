import react from '@vitejs/plugin-react';
import { HmrOptions, defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const hmrConfig: HmrOptions = {
    port: 8080,
    path: 'hmr',
};

if (process.env.GITPOD_WORKSPACE_URL) {
    hmrConfig.protocol = 'wss';
    hmrConfig.clientPort = 443;
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        host: true,
        port: 3000,
        hmr: hmrConfig,
    },
});
