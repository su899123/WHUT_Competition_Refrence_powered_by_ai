export interface Competition {
  id: number
  title: string
  level: string
  category: string
  organizer: string
  description: string
  summary: string | null
  registration_start: string | null
  registration_end: string | null
  competition_date: string | null
  eligibility: string
  awards: string
  contact_info: string
  official_url: string
  tags: string
  status: string
  created_at: string
  updated_at: string
}

export interface CompetitionListResponse {
  total: number
  items: Competition[]
}

export interface CompetitionCreate {
  title: string
  level: string
  category: string
  organizer: string
  description: string
  summary?: string
  registration_start: string | null
  registration_end: string | null
  competition_date: string | null
  eligibility: string
  awards: string
  contact_info: string
  official_url: string
  tags: string
}

export interface AISummaryResult {
  summary: string
  title: string
  level: string
  category: string
  organizer: string
  registration_start: string | null
  registration_end: string | null
  competition_date: string | null
  eligibility: string
  awards: string
  contact_info: string
  tags: string
}

export interface StatsOverview {
  total: number
  upcoming_deadline: number
  by_level: { name: string; count: number }[]
  by_category: { name: string; count: number }[]
}
