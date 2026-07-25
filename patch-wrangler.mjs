import { readFileSync, writeFileSync } from 'fs';

const path = './dist/server/wrangler.json';
const config = JSON.parse(readFileSync(path, 'utf8'));

// Remove ASSETS binding — reserved in Pages
delete config.assets;

// Remove main — not allowed alongside pages_build_output_dir
delete config.main;

// Remove rules — not supported in Pages
delete config.rules;

// Remove SESSION KV binding — no ID, causes error
config.kv_namespaces = config.kv_namespaces?.filter(
  kv => kv.binding !== 'SESSION'
) ?? [];

// Remove SESSION from previews too
if (config.previews?.kv_namespaces) {
  config.previews.kv_namespaces = config.previews.kv_namespaces.filter(
    kv => kv.binding !== 'SESSION'
  );
}

writeFileSync(path, JSON.stringify(config, null, 2));
console.log('✓ Patched dist/server/wrangler.json');