import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const path = 'android/app/src/main/AndroidManifest.xml';
if (!existsSync(path)) {
  console.error('Android project is missing. Run npm run android:init first.');
  process.exit(1);
}
let xml = readFileSync(path, 'utf8');
const permissions = [
  '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
  '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
];
const missing = permissions.filter((line) => !xml.includes(line));
if (missing.length) {
  xml = xml.replace(/(<manifest\b[^>]*>)/, `$1\n    ${missing.join('\n    ')}`);
}
// HTTP is only for local classroom testing, NOT a production setting.
if (!xml.includes('android:usesCleartextTraffic=')) {
  xml = xml.replace(/<application\b/, '<application android:usesCleartextTraffic="true"');
}
writeFileSync(path, xml);
console.log('Location permissions enabled. Local HTTP is enabled for coursework testing only.');
