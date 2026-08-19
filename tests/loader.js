/**
 * DELTA SYNTH — Custom Node.js Module Resolution Loader
 * 
 * Maps 'public/*' and 'backend/*' path aliases and handles '.jsw' files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('public/')) {
    const sub = specifier.slice('public/'.length);
    const hasExt = sub.endsWith('.js') || sub.endsWith('.json');
    const target = path.resolve(process.cwd(), 'src/public', hasExt ? sub : `${sub}.js`);
    return {
      shortCircuit: true,
      url: pathToFileURL(target).href,
      format: 'module'
    };
  }

  if (specifier.startsWith('backend/')) {
    const sub = specifier.slice('backend/'.length);
    const target = path.resolve(process.cwd(), 'src/backend', sub);
    return {
      shortCircuit: true,
      url: pathToFileURL(target).href,
      format: 'module'
    };
  }

  if (specifier.endsWith('.jsw')) {
    let target;
    if (specifier.startsWith('file://')) {
      target = fileURLToPath(specifier);
    } else {
      target = path.isAbsolute(specifier) ? specifier : path.resolve(process.cwd(), specifier);
    }
    return {
      shortCircuit: true,
      url: pathToFileURL(target).href,
      format: 'module'
    };
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.jsw')) {
    const filePath = fileURLToPath(url);
    const source = await fs.promises.readFile(filePath, 'utf8');
    return {
      format: 'module',
      shortCircuit: true,
      source
    };
  }
  return nextLoad(url, context);
}
