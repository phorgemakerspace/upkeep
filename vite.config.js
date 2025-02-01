import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
	// Set environment variable based on build mode
	process.env.NODE_ENV = command === 'build' ? 'production' : 'development';
	// process.env.DOCKER = command === 'build' ? true : false;

	return {
		plugins: [sveltekit()],
		server: {
			port: 5173,
			host: true // Needed for Docker
		}
	};
});