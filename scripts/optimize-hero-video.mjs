import { spawn } from 'node:child_process'
import { join } from 'node:path'
import ffmpeg from '@ffmpeg-installer/ffmpeg'

const publicDir = join(process.cwd(), 'public')

const run = (args) => new Promise((resolve, reject) => {
  const process = spawn(ffmpeg.path, args, { stdio: 'inherit' })
  process.on('error', reject)
  process.on('close', (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg exited with code ${code}`)))
})

await run([
  '-y', '-i', join(publicDir, 'abertura.mp4'),
  '-vf', 'scale=720:-2:force_original_aspect_ratio=decrease',
  '-c:v', 'libvpx-vp9', '-crf', '35', '-b:v', '0', '-deadline', 'good', '-cpu-used', '5', '-an',
  join(publicDir, 'abertura.webm'),
])

await run([
  '-y', '-ss', '00:00:01.2', '-i', join(publicDir, 'abertura.mp4'),
  '-frames:v', '1', '-vf', 'scale=720:-2:force_original_aspect_ratio=decrease',
  '-q:v', '3',
  join(publicDir, 'abertura-poster.webp'),
])
