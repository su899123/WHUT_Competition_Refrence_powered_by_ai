import axios from 'axios'
import type {
  Competition,
  CompetitionListResponse,
  CompetitionCreate,
  AISummaryResult,
  StatsOverview,
} from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// 竞赛 API
export const competitionApi = {
  list(params: {
    page?: number
    page_size?: number
    keyword?: string
    level?: string
    category?: string
    status?: string
    sort_by?: string
    sort_order?: string
  }) {
    return api.get<CompetitionListResponse>('/competitions', { params })
  },

  getById(id: number) {
    return api.get<Competition>(`/competitions/${id}`)
  },

  create(data: CompetitionCreate) {
    return api.post<Competition>('/competitions', data)
  },

  update(id: number, data: Partial<CompetitionCreate & { status: string }>) {
    return api.put<Competition>(`/competitions/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/competitions/${id}`)
  },

  stats() {
    return api.get<StatsOverview>('/competitions/stats/overview')
  },
}

// AI API
export const aiApi = {
  summarize(description: string) {
    return api.post<AISummaryResult>('/ai/summarize', { description })
  },
  chat(competitionId: number, message: string, enableSearch: boolean = false) {
    return api.post<{ reply: string }>('/ai/chat', {
      competition_id: competitionId,
      message,
      enable_search: enableSearch,
    })
  },
  compare(ids: number[], dimensions: string[]) {
    return api.post<{ result: string }>('/ai/compare', { ids, dimensions })
  },
}

