import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/example5/main.js',
    output: {
        file: 'dist/example5/bundle.js',
        format: 'cjs'
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true
        }),
        commonjs()
    ]
}