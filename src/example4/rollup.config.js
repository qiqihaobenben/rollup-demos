import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/example4/main.js',
    output: {
        file: 'dist/example4/bundle.js',
        format: 'umd',
        name: 'example4'
    },
    plugins: [
        resolve()
    ]
}