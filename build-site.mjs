import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(projectRoot, 'site');
const runtimeFiles = ['index.html', 'main-photo.jpg', 'src/styles.css', 'dist/main.js'];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await mkdir(resolve(outputDirectory, 'src'), { recursive: true });
await mkdir(resolve(outputDirectory, 'dist'), { recursive: true });

await Promise.all([
  ...runtimeFiles.map((file) => cp(resolve(projectRoot, file), resolve(outputDirectory, file))),
  cp(
    resolve(projectRoot, 'public/manus-routes.json'),
    resolve(outputDirectory, 'manus-routes.json'),
  ),
]);

console.log(`Static site assembled in ${outputDirectory}`);
