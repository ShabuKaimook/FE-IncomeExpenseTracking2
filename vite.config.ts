import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: {
		tsconfigPaths: true,
		dedupe: [
			"@tanstack/react-router",
			"@tanstack/router-core",
			"@tanstack/start-client-core",
			"@tanstack/start-server-core",
		],
	},
	plugins: [
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
	server: {
		allowedHosts: ["clapped-unpummelled-penni.ngrok-free.dev"],
		proxy: {
			"/api/v1": {
				target: "http://localhost:3002",
				changeOrigin: true,
			},
		},
	},
});

export default config;
