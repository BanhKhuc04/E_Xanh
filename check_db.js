import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const envFile = fs.readFileSync('.env.local', 'utf-8')
const envVars = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('='))
)

const supabaseUrl = envVars['VITE_SUPABASE_URL']?.replace(/['"]/g, '').trim()
const supabaseAnonKey = envVars['VITE_SUPABASE_ANON_KEY']?.replace(/['"]/g, '').trim()

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkColumns() {
  const { data, error } = await supabase.from('posts').select('*').limit(1)
  if (error) {
    console.error('Error fetching:', error)
  } else {
    if (data.length > 0) {
      console.log('Columns in posts:', Object.keys(data[0]).join(', '))
    } else {
      console.log('No posts found to infer columns.')
    }
  }
}

checkColumns()
