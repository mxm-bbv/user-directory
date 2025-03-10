import { defineConfig } from "vite";
import {fileURLToPath, URL} from 'node:url'

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        port: 3000,
        host: '0.0.0.0',
    }
});
