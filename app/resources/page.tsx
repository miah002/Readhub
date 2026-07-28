import { ResourcesView } from '@/components/resources-view'
import { createClient } from '@/lib/supabase/server'
import { uploadResource } from '@/lib/supabase/actions'
import type { Resource } from '@/lib/types'

export default async function ResourcesPage() {
  const supabase = createClient()

  const { data: resources } = await supabase
    .from('resources')
    .select('id, title, description, tag, file_path, file_url, uploaded_by, created_at')
    .order('created_at', { ascending: false })

  return <ResourcesView resources={(resources ?? []) as Resource[]} onUpload={uploadResource} />
}
