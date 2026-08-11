import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './server/index';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, 'dist');

const PORT = process.env.PORT || 3000;

async function main() {
  const app = await createServer();

  //app.use(sirv(distDir, { extensions: ['html'], single: true }));
//app.use(sirv(distDir, { extensions: ['html'], single: true }));
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
