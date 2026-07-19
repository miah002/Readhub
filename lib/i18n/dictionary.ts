export interface Dictionary {
  nav: {
    home: string; repository: string; profiles: string; content: string
    assessments: string; reports: string; resources: string; dashboard: string
  }
  header: { login: string; logout: string }
  footer: string
  levels: { beginning: string; developing: string; transitioning: string; all: string }
  home: {
    tagline: string; heroTitle: string; heroSub: string; startReading: string; teacherLogin: string
    todaysReading: string; exploreTitle: string; exploreSub: string; howTitle: string; howSub: string
    heroStats: { passages: string; languages: string; gradeLevels: string }
    features: { title: string; desc: string }[]
    steps: { title: string; desc: string }[]
  }
  login: {
    title: string; subtitle: string; emailLabel: string; passwordLabel: string
    loginBtn: string; forgot: string; backHome: string; errorInvalid: string
  }
  dashboard: {
    welcome: string; assignReading: string; readingProgress: string; vsQuarter: string; avgSessions: string
    myLearners: string; viewAll: string; learnersWord: string; passagesWord: string
    stats: {
      materials: { title: string; unit: string }
      learners: { title: string; unit: string }
      week: { title: string; unit: string }
    }
  }
  repository: {
    title: string; subtitle: string; filters: string; gradeLevel: string; readingLevel: string
    competency: string; quarter: string; language: string; assign: string; noResults: string; passagesFound: string
  }
  reader: { assign: string; backToList: string; selectLearners: string; confirmAssign: string; assignedTo: string }
}
