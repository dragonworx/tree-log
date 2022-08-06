import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';

const { entryPoints, entryPointPaths } = require('./entry-points');
const packageJson = require('../package.json');

const dependencies = Object.keys(packageJson.dependencies || {});
const devDependencies = Object.keys(packageJson.devDependencies || {});
const peerDependencies = Object.keys(packageJson.peerDependencies || {});
const buildDependencies = [
  ...dependencies,
  ...devDependencies,
  ...peerDependencies,
];

const toRelativePath = (id, parentId) => {
  const distRoot = path.resolve(__dirname, '../dist');
  if (path.isAbsolute(id)) {
    return path.relative(distRoot, id);
  }
  return path.relative(distRoot, path.resolve(parentId, '../', id));
};

const isExternal = (id, parentId) => {
  if (buildDependencies.includes(id)) return true;
  const relativePath = toRelativePath(id, parentId);
  return entryPointPaths.includes(relativePath);
};

const prepareBundle = (dirs) => {
  const dir = path.join('./dist', ...dirs);
  return {
    input: `${dir}/index.js`,
    external: isExternal,
    output: {
      file: `${dir}/index.cjs.js`,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      externalLiveBindings: false,
    },
    plugins: [resolve()],
  };
};

export default [
  ...entryPoints.map(prepareBundle),
  {
    input: './dist/index.js',
    external: devDependencies,
    output: [
      {
        name: 'turbo_log',
        file: `./dist/bundle.js`,
        format: 'umd',
        sourcemap: true,
        exports: 'named',
        externalLiveBindings: false,
      },
      {
        name: 'turbo_log',
        file: `./dist/bundle.min.js`,
        format: 'umd',
        sourcemap: true,
        exports: 'named',
        externalLiveBindings: false,
        plugins: [terser()],
      },
    ],
    plugins: [
      replace({
        'process.env': JSON.stringify({}),
        'process.platform': JSON.stringify({}),
      }),
      resolve(),
      commonjs(),
    ],
  },
];
