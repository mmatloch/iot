#!/usr/bin/env node

const { build } = require('esbuild');
const esbuildPluginPino = require('esbuild-plugin-pino');

build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    outdir: './dist',
    external: ['pg-native'],
    plugins: [esbuildPluginPino({ transports: ['pino-pretty', 'pino-roll'] })],
}).catch(() => process.exit(1));
