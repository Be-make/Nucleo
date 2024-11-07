import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { src, dest, watch, series } from 'gulp';
import * as darkSass from 'sass';
import grulpSass from 'gulp-sass';
import sharp from 'sharp';
import terser from 'gulp-terser';

const sass = grulpSass(darkSass);


export async function imagenes(done) {
    const srcDir = './src/image';
    const buildDir = './build/image';
    const images =  await glob('./src/image/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}

export function js(done) {
    src( 'src/js/app.js' )
        .pipe( terser() )
        .pipe( dest( 'build/js' ) )
        done()
}

export function css(done) {
    src( 'src/scss/app.scss' )
        .pipe( sass({
            outputStyle: 'compressed'
        }).on( 'error', sass.logError ) )
        .pipe( dest('build/css') )
        done()
}

export function dev() {
    watch( 'src/scss/**/*.scss', css )
    watch( 'src/js/**/*.js', js )
    watch( 'src/image/**/*.{png,jpg}', imagenes )
}

export default series( js, css, imagenes, dev );