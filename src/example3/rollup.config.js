import json from 'rollup-plugin-json';

export default {
    input: 'src/example3/main.js',
    output: {
        file: 'dist/example3/bundle.js',
        format: 'cjs'
    },
    name: 'example3',
    plugins: [
        json(
            
        )
    ]
}