import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'

const production = process.env.ROLLUP_WATCH == null;
const commonPlugins = [
    resolve(),
    commonjs(),
    typescript()
]

const devConfig = () => ({
    input: 'src/main.ts',
    output: {
        name: 'boostWeb',
        file: 'public/index.umd.js',
        format: 'umd'
    },
    plugins: [
        ...commonPlugins,
        serve({
            port: 3000,
            onListening: function (server) {
                const address = server.address()
                const host = address.address === '::' ? 'localhost' : address.address
                const protocol = this.https ? 'https' : 'http'
                console.log(`Server listening at ${protocol}://${host}:${address.port}/`)
            }
        })
    ]
})

const buildConfig = () => ({
    input: 'src/index.ts',
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'es' }
    ],
    plugins: commonPlugins
})

export default [
    production ? buildConfig() : devConfig()
]