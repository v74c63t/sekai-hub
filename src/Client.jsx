import { createClient } from '@supabase/supabase-js'
const URL = import.meta.env.VITE_APP_URL
const API_KEY = import.meta.env.VITE_APP_API_KEY

export const supabase = createClient(URL, API_KEY);