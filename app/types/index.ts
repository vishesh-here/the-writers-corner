export enum ExerciseDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum TopicCategory {
  CHARACTER = 'CHARACTER',
  PLOT = 'PLOT',
  WORLDBUILDING = 'WORLDBUILDING',
  TENSION = 'TENSION',
  DIALOGUE = 'DIALOGUE',
  DESCRIPTION = 'DESCRIPTION'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Topic {
  id: string
  title: string
  slug: string
  description: string
  category: TopicCategory
  icon: string
  order: number
  prerequisites: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Exercise {
  id: string
  title: string
  description: string
  content: string
  difficulty: ExerciseDifficulty
  topicId: string
  topic?: Topic
  estimatedMinutes: number
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface UserProgress {
  id: string
  userId: string
  exerciseId: string
  exercise?: Exercise
  completed: boolean
  submission?: string
  feedback?: string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  requirement: number
  type: 'EXERCISES' | 'TOPICS' | 'STREAK' | 'COMMUNITY'
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  achievement?: Achievement
  earnedAt: Date
}

export interface CommunityPost {
  id: string
  userId: string
  user?: User
  title: string
  content: string
  likes: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  postId: string
  userId: string
  user?: User
  content: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface RoadmapNode {
  topicId: string
  topic: Topic
  completed: boolean
  progress: number
  locked: boolean
  exercises: Exercise[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ExerciseFilters {
  topicId?: string
  difficulty?: ExerciseDifficulty
  search?: string
  page?: number
  pageSize?: number
}

export interface ProgressStats {
  totalExercises: number
  completedExercises: number
  completionPercentage: number
  topicsCompleted: number
  currentStreak: number
  longestStreak: number
  achievements: UserAchievement[]
}
