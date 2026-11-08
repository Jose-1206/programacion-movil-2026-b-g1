import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status || 1);
}
if (!existsSync('android')) run('npx', ['cap', 'add', 'android']);
run('node', ['scripts/configure-android.mjs']);
run('npx', ['cap', 'sync', 'android']);
console.log('Native Android project is ready. Launch with: npx cap open android');
