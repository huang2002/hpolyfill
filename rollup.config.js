import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/index.js',
    plugins: [
        terser({
            ecma: 5,
            compress: {
                unsafe: true,
                keep_fargs: true
            },
            mangle: true,
            keep_fnames: true,
        })
    ],
    output: {
        file: 'dist/index.js',
        format: 'iife'
    },
};
