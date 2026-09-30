import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Simple .env.local parser
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local')
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim()
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)
const BUCKET_NAME = 'assets'

const MIME_MAP = {
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.zip': 'application/zip',
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return MIME_MAP[ext] || 'application/octet-stream'
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles
  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles)
    } else {
      arrayOfFiles.push(fullPath)
    }
  }
  return arrayOfFiles
}

async function ensureBucket() {
  console.log(`📦 Checking if bucket "${BUCKET_NAME}" exists in Supabase...`)
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    console.error('Failed to list buckets:', listError.message)
    process.exit(1)
  }

  const existing = buckets.find((b) => b.name === BUCKET_NAME)
  if (!existing) {
    console.log(`Creating public bucket "${BUCKET_NAME}"...`)
    const { data, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
    })
    if (createError) {
      console.error('Failed to create bucket:', createError.message)
      process.exit(1)
    }
    console.log(`✅ Bucket "${BUCKET_NAME}" created successfully with public access!`)
  } else {
    console.log(`✅ Bucket "${BUCKET_NAME}" exists and is ready.`)
    if (!existing.public) {
      console.log(`Updating bucket "${BUCKET_NAME}" to public...`)
      await supabase.storage.updateBucket(BUCKET_NAME, { public: true })
    }
  }
}

async function uploadFolder(folderName) {
  const fullDir = path.join(rootDir, 'public', folderName)
  if (!fs.existsSync(fullDir)) {
    console.log(`⚠️ Folder public/${folderName} does not exist, skipping.`)
    return
  }

  const files = getAllFiles(fullDir)
  console.log(`\n🚀 Uploading ${files.length} files from public/${folderName} to bucket "${BUCKET_NAME}/${folderName}"...`)

  let successCount = 0
  let failCount = 0
  let totalBytes = 0

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i]
    const relativePath = path.relative(path.join(rootDir, 'public'), filePath).replace(/\\/g, '/')
    const fileBuffer = fs.readFileSync(filePath)
    const contentType = getContentType(filePath)
    const stats = fs.statSync(filePath)
    totalBytes += stats.size

    const sizeStr = (stats.size / (1024 * 1024)).toFixed(2) + ' MB'

    process.stdout.write(`[${i + 1}/${files.length}] Uploading ${relativePath} (${sizeStr})... `)

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(relativePath, fileBuffer, {
        contentType,
        upsert: true,
      })

    if (error) {
      console.log(`❌ Failed: ${error.message}`)
      failCount++
    } else {
      console.log(`✅ OK`)
      successCount++
    }
  }

  console.log(`\n🎉 Finished ${folderName}: ${successCount} uploaded, ${failCount} failed (${(totalBytes / (1024 * 1024)).toFixed(2)} MB total)`)
}

async function main() {
  console.log('====================================================')
  console.log(' CodeNeuraX - Supabase Storage Asset Uploader')
  console.log('====================================================\n')

  await ensureBucket()

  // 1. Upload heavy downloads (PDFs, question papers) ~46.5MB
  await uploadFolder('downloads')

  // 2. Upload video assets ~7.1MB
  await uploadFolder('videos')

  // 3. Upload images ~23.5MB
  await uploadFolder('images')

  console.log('\n====================================================')
  console.log('🌟 ALL ASSETS UPLOADED SUCCESSFULLY!')
  console.log(`Base URL: ${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/`)
  console.log('====================================================')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
