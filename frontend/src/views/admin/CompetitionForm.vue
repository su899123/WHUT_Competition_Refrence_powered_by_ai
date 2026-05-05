<template>
  <div class="admin-form">
    <t-card :bordered="false" :title="isEdit ? '编辑竞赛' : '新建竞赛'">
      <!-- AI 智能解析 -->
      <t-card
        :bordered="true"
        title="🤖 AI 智能解析"
        header-bordered
        class="ai-card"
      >
        <p class="ai-desc">粘贴竞赛通知原文，AI 将自动提取结构化信息并生成摘要</p>
        <t-textarea
          v-model="rawDescription"
          placeholder="在此粘贴竞赛通知的完整文本..."
          :autosize="{ minRows: 4, maxRows: 8 }"
        />
        <t-button
          theme="primary"
          variant="outline"
          :loading="aiLoading"
          @click="aiParse"
          class="ai-btn"
        >
          <t-icon name="lightbulb" /> AI 解析
        </t-button>
      </t-card>

      <!-- 基本信息 -->
      <t-card :bordered="true" title="基本信息" header-bordered class="form-section">
        <t-form
          ref="formRef"
          :data="form"
          :rules="rules"
          label-width="100px"
          @submit="onSubmit"
        >
          <t-form-item label="竞赛名称" name="title">
            <t-input v-model="form.title" placeholder="请输入竞赛名称" />
          </t-form-item>

          <t-row :gutter="16">
            <t-col :span="6">
              <t-form-item label="级别" name="level">
                <t-select v-model="form.level">
                  <t-option value="A1" label="A1" />
                  <t-option value="A2" label="A2" />
                  <t-option value="A3" label="A3" />
                  <t-option value="B1" label="B1" />
                  <t-option value="B2" label="B2" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="类别" name="category">
                <t-select v-model="form.category">
                  <t-option value="理工科" label="理工科" />
                  <t-option value="文科" label="文科" />
                  <t-option value="商科" label="商科" />
                  <t-option value="医学" label="医学" />
                  <t-option value="艺术" label="艺术" />
                  <t-option value="综合" label="综合" />
                  <t-option value="其他" label="其他" />
                </t-select>
              </t-form-item>
            </t-col>
          </t-row>

          <t-form-item label="主办单位">
            <t-input v-model="form.organizer" placeholder="主办单位" />
          </t-form-item>

          <t-form-item label="竞赛描述" name="description">
            <t-textarea
              v-model="form.description"
              placeholder="竞赛详细描述..."
              :autosize="{ minRows: 4, maxRows: 10 }"
            />
          </t-form-item>

          <t-form-item label="AI 摘要">
            <t-textarea
              v-model="form.aiSummary"
              placeholder="AI 生成的摘要（可手动修改）"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </t-form-item>
        </t-form>
      </t-card>

      <!-- 时间信息 -->
      <t-card :bordered="true" title="📅 时间信息" header-bordered class="form-section">
        <t-form label-width="100px">
          <t-row :gutter="16">
            <t-col :span="4">
              <t-form-item label="报名开始">
                <t-date-picker v-model="form.registration_start" clearable />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="报名截止">
                <t-date-picker v-model="form.registration_end" clearable />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="比赛日期">
                <t-date-picker v-model="form.competition_date" clearable />
              </t-form-item>
            </t-col>
          </t-row>
        </t-form>
      </t-card>

      <!-- 其他信息 -->
      <t-card :bordered="true" title="📋 其他信息" header-bordered class="form-section">
        <t-form label-width="100px">
          <t-form-item label="参赛资格">
            <t-textarea v-model="form.eligibility" placeholder="参赛资格要求" :autosize="{ minRows: 2, maxRows: 4 }" />
          </t-form-item>
          <t-form-item label="奖项设置">
            <t-textarea v-model="form.awards" placeholder="奖项设置" :autosize="{ minRows: 2, maxRows: 4 }" />
          </t-form-item>
          <t-form-item label="联系方式">
            <t-input v-model="form.contact_info" placeholder="联系方式" />
          </t-form-item>
          <t-form-item label="官方链接">
            <t-input v-model="form.official_url" placeholder="https://..." />
          </t-form-item>
          <t-form-item label="标签">
            <t-input v-model="form.tags" placeholder="多个标签用逗号分隔，如：创业,互联网+,校赛" />
          </t-form-item>
        </t-form>
      </t-card>

      <!-- 提交 -->
      <div class="form-actions">
        <t-button variant="outline" @click="$router.push('/admin')">取消</t-button>
        <t-button theme="primary" :loading="submitting" @click="onSubmit">
          {{ isEdit ? '保存修改' : '创建竞赛' }}
        </t-button>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { competitionApi, aiApi } from '@/api'
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  level: 'B1',
  category: '综合',
  organizer: '',
  description: '',
  aiSummary: '',
  registration_start: '',
  registration_end: '',
  competition_date: '',
  eligibility: '',
  awards: '',
  contact_info: '',
  official_url: '',
  tags: '',
})

const rules = {
  title: [{ required: true, message: '请输入竞赛名称', type: 'error' }],
}

const rawDescription = ref('')
const aiLoading = ref(false)
const submitting = ref(false)

async function aiParse() {
  if (!rawDescription.value.trim()) {
    MessagePlugin.warning('请先粘贴竞赛通知文本')
    return
  }
  aiLoading.value = true
  try {
    const { data } = await aiApi.summarize(rawDescription.value)
    form.title = data.title || form.title
    form.level = data.level || form.level
    form.category = data.category || form.category
    form.organizer = data.organizer || form.organizer
    form.aiSummary = data.summary || ''
    form.eligibility = data.eligibility || ''
    form.awards = data.awards || ''
    form.contact_info = data.contact_info || ''
    form.tags = data.tags || ''
    if (data.registration_start) form.registration_start = data.registration_start
    if (data.registration_end) form.registration_end = data.registration_end
    if (data.competition_date) form.competition_date = data.competition_date
    form.description = rawDescription.value
    MessagePlugin.success('AI 解析完成！请核对并修改结果')
  } catch (e: any) {
    MessagePlugin.error('AI 解析失败：' + (e?.response?.data?.detail || e.message))
  } finally {
    aiLoading.value = false
  }
}

async function onSubmit() {
  if (!form.title.trim()) {
    MessagePlugin.warning('请输入竞赛名称')
    return
  }
  submitting.value = true
  try {
    const payload = {
      title: form.title,
      level: form.level,
      category: form.category,
      organizer: form.organizer,
      description: form.description,
      summary: form.aiSummary,
      registration_start: form.registration_start || null,
      registration_end: form.registration_end || null,
      competition_date: form.competition_date || null,
      eligibility: form.eligibility,
      awards: form.awards,
      contact_info: form.contact_info,
      official_url: form.official_url,
      tags: form.tags,
    }
    if (isEdit.value) {
      await competitionApi.update(Number(route.params.id), payload as any)
      MessagePlugin.success('修改成功')
    } else {
      await competitionApi.create(payload as any)
      MessagePlugin.success('创建成功')
    }
    router.push('/admin')
  } catch (e: any) {
    MessagePlugin.error('操作失败：' + (e?.response?.data?.detail || e.message))
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await competitionApi.getById(Number(route.params.id))
      form.title = data.title
      form.level = data.level
      form.category = data.category
      form.organizer = data.organizer
      form.description = data.description
      form.aiSummary = data.summary
      form.registration_start = data.registration_start || ''
      form.registration_end = data.registration_end || ''
      form.competition_date = data.competition_date || ''
      form.eligibility = data.eligibility
      form.awards = data.awards
      form.contact_info = data.contact_info
      form.official_url = data.official_url
      form.tags = data.tags
    } catch (e) {
      MessagePlugin.error('加载竞赛信息失败')
    }
  }
})
</script>

<style scoped>
.admin-form {
  max-width: 100%;
}

.ai-card {
  margin-bottom: 20px;
  background: #fafbfc;
}

.ai-desc {
  color: #888;
  font-size: 13px;
  margin-bottom: 12px;
}

.ai-btn {
  margin-top: 12px;
}

.form-section {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}
</style>
