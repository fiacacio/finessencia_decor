import { readdir } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import sharp from 'sharp'

const publicDir = join(process.cwd(), 'public')
const directories = ['essencias', 'essencias_clique']

const imageFiles = []
for (const directory of directories) {
  const files = await readdir(join(publicDir, directory))
  for (const file of files) {
    if (/\.(png|jpe?g|jfif)$/i.test(file)) imageFiles.push(join(directory, file))
  }
}
imageFiles.push('familia.png')

await Promise.all(imageFiles.map(async (relativePath) => {
  const source = join(publicDir, relativePath)
  const output = join(publicDir, relativePath.replace(/\.[^.]+$/, '.webp'))
  const width = relativePath === 'familia.png' ? 1440 : 800
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(output)
}))

console.log(`Generated ${imageFiles.length} optimized WebP images.`)
