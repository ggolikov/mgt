import { defineConfig } from 'vite';

export default defineConfig({
	root: './demo',
	build: {
		outDir: '../dist',
		emptyOutDir: true
	},
	server: {
		port: 9000,
		host: 'localhost',
		open: '/'
	}
});

