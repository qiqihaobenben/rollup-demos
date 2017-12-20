import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/example6/main.js',
    output: {
        file: 'dist/example6/bundle.js',
        format: 'umd',
        name: 'example6'
    },
    plugins: [
        resolve()
    ],
    external: ['lodash']
}