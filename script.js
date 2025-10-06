// Anti-copy, anti-inspect measures
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.shiftKey && e.keyCode === 74) || (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
    }
});

// Enhanced quiz data with more questions
const quizData = [
    // ... your existing quizData array (keep as is)
];

// Core application variables
const overlay = document.getElementById('overlay');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const categoriesGrid = document.getElementById('categoriesGrid');
const themeToggle = document.getElementById('themeToggle');
const quizContainer = document.getElementById('quizContainer');
const resultsScreen = document.getElementById('resultsScreen');
const pageTitle = document.getElementById('pageTitle');
const modeButtons = document.querySelectorAll('.mode-btn');
const correctAnswersEl = document.getElementById('correctAnswers');
const timeSpentEl = document.getElementById('timeSpent');
const masteryLevelEl = document.getElementById('masteryLevel');
const streakCountEl = document.getElementById('streakCount');
const searchInput = document.getElementById('searchInput');
const exportProgressBtn = document.getElementById('exportProgress');
const createCustomQuizBtn = document.getElementById('createCustomQuizBtn');
const customQuizModal = document.getElementById('customQuizModal');
const cancelCustomQuizBtn = document.getElementById('cancelCustomQuiz');
const createCustomQuizBtnModal = document.getElementById('createCustomQuiz');
const weakAreasCountEl = document.getElementById('weakAreasCount');
const avgTimePerQuestionEl = document.getElementById('avgTimePerQuestion');
const improvementRateEl = document.getElementById('improvementRate');

// Navigation elements
const navItems = document.querySelectorAll('.nav-item');

// Application state
let currentMode = 'exam';
let selectedCategories = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let questions = [];
let incorrectQuestions = [];
let isAnswerChecked = false;
let bookmarkedQuestions = new Set();
let userProgress = {};
let userStats = {
    totalQuestions: 0,
    correctAnswers: 0,
    timeSpent: 0,
    masteryLevel: 0,
    streak: 0,
    lastActive: null,
    weeklyProgress: []
};
let timerInterval = null;
let startTime = null;
let remainingTime = 0;
let isCountdown = false;
let examCheckMode = 'immediate';
let examSubmitted = false;
let questionTimers = [];
let searchResults = [];
let isSearchActive = false;
let currentPage = 'dashboard';
let customQuestions = [];

// COURSE MANAGEMENT SYSTEM
let coursesData = [];
let courseQuestions = {};
let allQuestions = []; // Global all questions

// Core application functions
async function init() {
    await loadCourseData();
    buildAllQuestions();
    updateCourseStats();
    initializeCategories();
    initializeEventListeners();
    initializeNavigation();
    loadUserData();
    updateDashboardStats();
    updateAnalytics();
    showDashboard();
    createFAB();
    updateCustomQuizModalHTML();
}

// ENHANCED COURSE CARD WITH SCROLLABLE CHAPTERS
function createCourseCard(course) {
    return `
        <div class="course-card glass-effect" style="cursor: pointer; border-radius: 20px; padding: 24px; border-left: 4px solid ${course.color};">
            <div class="course-header" style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
                <div class="course-icon" style="width: 50px; height: 50px; border-radius: 12px; background: ${course.color}20; color: ${course.color}; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
                    <i class="${course.icon}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0;">${course.title}</h3>
                        <div style="display: flex; gap: 8px;">
                            <span style="font-size: 11px; color: ${course.color}; background: ${course.color}15; padding: 4px 8px; border-radius: 12px; font-weight: 600;">${course.level}</span>
                            <span style="font-size: 11px; color: var(--text-tertiary); background: var(--glass); padding: 4px 8px; border-radius: 12px; font-weight: 500;">${course.duration}</span>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.5; margin: 0;">${course.description}</p>
                </div>
            </div>
            
            <!-- SCROLLABLE CHAPTERS SECTION -->
            <div class="chapters-section" style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 14px; color: var(--text-secondary); font-weight: 600;">Chapters</span>
                    <span style="font-size: 12px; color: var(--text-tertiary);">${course.chapters ? course.chapters.length : 0} chapters</span>
                </div>
                <div class="chapters-scroll-container" style="max-height: 120px; overflow-y: auto; border-radius: 12px; background: var(--glass); padding: 8px;">
                    <div class="chapters-grid" style="display: grid; gap: 6px;">
                        ${course.chapters ? course.chapters.map((chapter, index) => `
                            <div class="chapter-item" 
                                 onclick="navigateToChapter('${course.title}', ${index + 1}, '${chapter}')"
                                 style="cursor: pointer; padding: 10px 12px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--border); transition: all 0.3s ease;"
                                 onmouseover="this.style.background='${course.color}15'; this.style.borderColor='${course.color}50';"
                                 onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='var(--border)';">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 24px; height: 24px; border-radius: 6px; background: ${course.color}20; color: ${course.color}; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700;">
                                        ${index + 1}
                                    </div>
                                    <span style="font-size: 12px; color: var(--text-primary); font-weight: 500; line-height: 1.3;">${chapter}</span>
                                </div>
                            </div>
                        `).join('') : `
                            <div style="text-align: center; padding: 16px; color: var(--text-tertiary); font-size: 12px;">
                                No chapters available yet
                            </div>
                        `}
                    </div>
                </div>
            </div>
            
            <div class="course-progress" style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 14px; color: var(--text-secondary); font-weight: 600;">Progress</span>
                    <span style="font-size: 14px; color: ${course.color}; font-weight: 700;">${course.progress}%</span>
                </div>
                <div class="progress-bar" style="height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
                    <div class="progress-fill" style="height: 100%; background: ${course.color}; border-radius: 3px; width: ${course.progress}%; transition: width 0.5s ease;"></div>
                </div>
            </div>
            
            <div class="course-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                <div style="text-align: center; padding: 12px; background: var(--glass); border-radius: 12px;">
                    <div style="font-size: 18px; font-weight: 700; color: ${course.color}; margin-bottom: 4px;">${course.completedModules}/${course.modules}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">Modules</div>
                </div>
                <div style="text-align: center; padding: 12px; background: var(--glass); border-radius: 12px;">
                    <div style="font-size: 18px; font-weight: 700; color: ${course.color}; margin-bottom: 4px;">${course.completedQuestions}/${course.totalQuestions}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">Questions</div>
                </div>
            </div>
            
            <div class="course-actions" style="display: flex; gap: 8px;">
                <button class="course-btn" onclick="startCourseQuiz(${course.id})" style="flex: 1; background: ${course.color}; color: white; border: none; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fas fa-play" style="margin-right: 6px;"></i>Quiz
                </button>
                <button class="course-btn" onclick="startCourseExam(${course.id})" style="flex: 1; background: transparent; color: ${course.color}; border: 1.5px solid ${course.color}; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fas fa-file-alt" style="margin-right: 6px;"></i>Exam
                </button>
                <button class="course-btn" onclick="startCourseLearn(${course.id})" style="flex: 1; background: transparent; color: var(--text-secondary); border: 1.5px solid var(--border); padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fas fa-brain" style="margin-right: 6px;"></i>Learn
                </button>
            </div>
        </div>
    `;
}

// NEW FUNCTION: Navigate to chapter page
function navigateToChapter(courseTitle, chapterNumber, chapterTitle) {
    // Create a URL-friendly slug for the course
    const courseSlug = courseTitle.toLowerCase().replace(/\s+/g, '-');
    
    // You can customize this URL structure based on your needs
    const chapterUrl = `chapter${chapterNumber}.html?course=${courseSlug}&chapter=${chapterNumber}`;
    
    // Show loading notification
    showNotification(`Loading ${chapterTitle}...`, 'info');
    
    // Redirect to chapter page after a short delay
    setTimeout(() => {
        window.location.href = chapterUrl;
    }, 800);
}

// ENHANCED COURSE DETAILS MODAL WITH CHAPTERS
function showCourseDetails(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    const modal = document.createElement('div');
    modal.className = 'custom-quiz-modal active';
    modal.innerHTML = `
        <div class="custom-quiz-content glass-effect" style="max-width: 700px; border-radius: 24px;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 24px;">
                <h3 style="font-size: 24px; font-weight: 700; color: var(--text-primary);">${course.title}</h3>
                <button class="action-btn" onclick="this.closest('.custom-quiz-modal').remove()" style="background: rgba(239, 68, 68, 0.1); color: var(--error);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding: 24px; background: var(--glass); border-radius: 20px;">
                <div class="course-icon" style="width: 80px; height: 80px; border-radius: 16px; background: ${course.color}20; color: ${course.color}; display: flex; align-items: center; justify-content: center; font-size: 32px;">
                    <i class="${course.icon}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 18px; color: var(--text-secondary); margin-bottom: 8px;">${course.description}</div>
                    <div style="display: flex; gap: 16px; font-size: 14px; color: var(--text-tertiary); flex-wrap: wrap;">
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                        <span><i class="fas fa-layer-group"></i> ${course.level}</span>
                        <span><i class="fas fa-book"></i> ${course.modules} modules</span>
                        <span><i class="fas fa-question-circle"></i> ${course.totalQuestions} questions</span>
                    </div>
                </div>
            </div>
            
            ${course.objectives ? `
            <div style="margin-bottom: 24px;">
                <h4 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">Learning Objectives</h4>
                <div style="display: grid; gap: 8px;">
                    ${course.objectives.map(obj => `
                        <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--glass); border-radius: 12px;">
                            <i class="fas fa-check" style="color: ${course.color}; font-size: 12px;"></i>
                            <span style="color: var(--text-secondary); font-size: 14px;">${obj}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- ENHANCED CHAPTERS SECTION IN MODAL -->
            <div style="margin-bottom: 24px;">
                <h4 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">Course Chapters</h4>
                <div style="max-height: 300px; overflow-y: auto; display: grid; gap: 8px; padding-right: 8px;">
                    ${course.chapters ? course.chapters.map((chapter, index) => `
                        <div onclick="navigateToChapter('${course.title}', ${index + 1}, '${chapter}')" 
                             style="cursor: pointer; padding: 16px; background: var(--glass); border-radius: 12px; border: 1px solid var(--border); transition: all 0.3s ease; display: flex; align-items: center; gap: 12px;"
                             onmouseover="this.style.background='${course.color}15'; this.style.borderColor='${course.color}50'; this.style.transform='translateX(4px)';"
                             onmouseout="this.style.background='var(--glass)'; this.style.borderColor='var(--border)'; this.style.transform='translateX(0)';">
                            <div style="width: 32px; height: 32px; border-radius: 8px; background: ${course.color}20; color: ${course.color}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0;">
                                ${index + 1}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${chapter}</div>
                                <div style="font-size: 12px; color: var(--text-tertiary);">Click to open chapter</div>
                            </div>
                            <i class="fas fa-arrow-right" style="color: ${course.color}; font-size: 14px;"></i>
                        </div>
                    `).join('') : `
                        <div style="text-align: center; padding: 40px; color: var(--text-tertiary);">
                            <i class="fas fa-book" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
                            <div>No chapters available yet</div>
                        </div>
                    `}
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                <div style="text-align: center; padding: 20px; background: var(--glass); border-radius: 16px;">
                    <div style="font-size: 28px; font-weight: 700; color: ${course.color}; margin-bottom: 8px;">${course.completedModules}/${course.modules}</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Modules Completed</div>
                </div>
                <div style="text-align: center; padding: 20px; background: var(--glass); border-radius: 16px;">
                    <div style="font-size: 28px; font-weight: 700; color: ${course.color}; margin-bottom: 8px;">${course.completedQuestions}/${course.totalQuestions}</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Questions Answered</div>
                </div>
            </div>
            
            <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 16px; color: var(--text-secondary); font-weight: 600;">Overall Progress</span>
                    <span style="font-size: 16px; color: ${course.color}; font-weight: 700;">${course.progress}%</span>
                </div>
                <div class="progress-bar" style="height: 10px; background: var(--border); border-radius: 5px; overflow: hidden;">
                    <div class="progress-fill" style="height: 100%; background: ${course.color}; border-radius: 5px; width: ${course.progress}%;"></div>
                </div>
            </div>
            
            <div class="custom-quiz-actions" style="display: flex; gap: 12px; justify-content: space-between;">
                <div style="display: flex; gap: 12px;">
                    <button class="quiz-btn" onclick="this.closest('.custom-quiz-modal').remove()" style="background: var(--secondary); color: white;">
                        Close
                    </button>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="quiz-btn" onclick="startCourseLearn(${course.id}); this.closest('.custom-quiz-modal').remove()" style="background: transparent; color: var(--text-secondary); border: 1.5px solid var(--border);">
                        <i class="fas fa-brain"></i> Learn
                    </button>
                    <button class="quiz-btn check-btn" onclick="startCourseQuiz(${course.id}); this.closest('.custom-quiz-modal').remove()">
                        <i class="fas fa-play"></i> Quiz
                    </button>
                    <button class="quiz-btn next-btn" onclick="startCourseExam(${course.id}); this.closest('.custom-quiz-modal').remove()">
                        <i class="fas fa-file-alt"></i> Exam
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ENHANCED CSS FOR SCROLLABLE CHAPTERS
const enhancedCourseCardCSS = `
    .course-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid var(--glass-border);
    }
    .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 30px rgba(99, 102, 241, 0.1);
        border-color: var(--primary-light);
    }
    .course-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    
    /* Scrollbar styling for chapters */
    .chapters-scroll-container::-webkit-scrollbar {
        width: 6px;
    }
    .chapters-scroll-container::-webkit-scrollbar-track {
        background: var(--border);
        border-radius: 3px;
    }
    .chapters-scroll-container::-webkit-scrollbar-thumb {
        background: var(--text-tertiary);
        border-radius: 3px;
    }
    .chapters-scroll-container::-webkit-scrollbar-thumb:hover {
        background: var(--text-secondary);
    }
    
    /* Touch-friendly chapter items */
    .chapter-item {
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        touch-action: manipulation;
    }
    .chapter-item:active {
        transform: scale(0.98);
    }
    
    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .chapters-scroll-container {
            max-height: 100px;
        }
        .chapter-item {
            padding: 8px 10px;
        }
    }
`;

// Inject enhanced CSS
const enhancedCourseStyle = document.createElement('style');
enhancedCourseStyle.textContent = enhancedCourseCardCSS;
document.head.appendChild(enhancedCourseStyle);
// HELPER FUNCTION TO GET QUESTIONS BY CATEGORY
function getQuestionsByCategory(category) {
    return allQuestions.filter(q => q.category === category);
}
const courseCardCSS = `
    .course-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid var(--glass-border);
    }
    .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 30px rgba(99, 102, 241, 0.1);
        border-color: var(--primary-light);
    }
    .course-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
`;
const courseStyle = document.createElement('style');
courseStyle.textContent = courseCardCSS;
document.head.appendChild(courseStyle);
function showAnalytics() {
    hideAllSections();
    document.querySelector('.stats-grid').style.display = 'grid';
    document.querySelector('.analytics-section').style.display = 'block';
    document.querySelector('.export-section').style.display = 'block';
    pageTitle.textContent = 'Progress Analytics';
    updateAnalytics();
   
    quizContainer.innerHTML = `
        <div style="padding: 24px;">
            <div class="analytics-section glass-effect" style="border-radius: 24px; padding: 32px;">
                <h3 class="analytics-title" style="font-size: 24px; margin-bottom: 8px;">Performance Insights</h3>
                <p style="color: var(--text-secondary); margin-bottom: 32px;">Detailed analytics to optimize your learning journey</p>
                <div class="analytics-grid">
                    <div class="analytics-card glass-effect" style="border-radius: 20px; padding: 24px;">
                        <div class="analytics-value" style="font-size: 32px; color: var(--primary);">${weakAreasCountEl.textContent}</div>
                        <div class="analytics-label">Areas Needing Focus</div>
                    </div>
                    <div class="analytics-card glass-effect" style="border-radius: 20px; padding: 24px;">
                        <div class="analytics-value" style="font-size: 32px; color: #06b6d4;">${avgTimePerQuestionEl.textContent}</div>
                        <div class="analytics-label">Average Response Time</div>
                    </div>
                    <div class="analytics-card glass-effect" style="border-radius: 20px; padding: 24px;">
                        <div class="analytics-value" style="font-size: 32px; color: #10b981;">${improvementRateEl.textContent}</div>
                        <div class="analytics-label">Weekly Progress Rate</div>
                    </div>
                </div>
            </div>
           
            <div class="glass-effect" style="border-radius: 24px; padding: 32px; margin-top: 24px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 24px; color: var(--text-primary);">📊 Learning Recommendations</h3>
                <div style="display: grid; gap: 16px;">
                    ${createRecommendation('Focus on Weak Areas', 'fas fa-bullseye', 'var(--primary)', 'Spend 60% of study time on topics below 70% mastery')}
                    ${createRecommendation('Consistent Practice', 'fas fa-chart-line', '#10b981', `Maintain your ${userStats.streak}-day streak for optimal retention`)}
                    ${createRecommendation('Active Recall', 'fas fa-brain', '#8b5cf6', 'Use spaced repetition for better long-term memory')}
                    ${createRecommendation('Mixed Practice', 'fas fa-random', '#f59e0b', 'Combine different topics in single study sessions')}
                </div>
            </div>
            <div class="glass-effect" style="border-radius: 24px; padding: 32px; margin-top: 24px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 24px; color: var(--text-primary);">🎯 Study Plan</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    ${createStudyPlanItem('Daily Goal', '50 questions', 'fas fa-calendar-day', '#6366f1')}
                    ${createStudyPlanItem('Weekly Target', '5 hours', 'fas fa-chart-bar', '#06b6d4')}
                    ${createStudyPlanItem('Mastery Goal', '85% overall', 'fas fa-trophy', '#f59e0b')}
                    ${createStudyPlanItem('Weak Topics', '2 sessions/week', 'fas fa-exclamation-triangle', '#ef4444')}
                </div>
            </div>
        </div>
    `;
    quizContainer.classList.remove('hidden');
}
function createRecommendation(title, icon, color, description) {
    return `
        <div style="display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 16px; border-left: 4px solid ${color};">
            <i class="${icon}" style="color: ${color}; font-size: 24px;"></i>
            <div>
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${title}</div>
                <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">${description}</div>
            </div>
        </div>
    `;
}
function createStudyPlanItem(title, value, icon, color) {
    return `
        <div style="text-align: center; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 16px;">
            <i class="${icon}" style="color: ${color}; font-size: 32px; margin-bottom: 12px;"></i>
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">${title}</div>
            <div style="font-size: 18px; color: ${color}; font-weight: 700;">${value}</div>
        </div>
    `;
}
function showBookmarks() {
    const bookmarkedQuestionsList = allQuestions.filter(q => bookmarkedQuestions.has(q.id));
    hideAllSections();
    pageTitle.textContent = 'Bookmarked Questions';
   
    if (bookmarkedQuestionsList.length === 0) {
        quizContainer.innerHTML = `
            <div style="text-align: center; padding: 80px 20px;">
                <div style="font-size: 96px; color: var(--text-tertiary); margin-bottom: 24px; opacity: 0.5;">
                    <i class="far fa-bookmark"></i>
                </div>
                <h2 style="font-size: 32px; margin-bottom: 16px; color: var(--text-primary);">No Bookmarked Questions Yet</h2>
                <p style="color: var(--text-secondary); margin-bottom: 40px; max-width: 400px; margin-left: auto; margin-right: auto; font-size: 16px; line-height: 1.6;">
                    Click the bookmark icon on any question to save it here for quick review. This is perfect for difficult concepts or important topics you want to revisit.
                </p>
                <button class="quiz-btn" onclick="showDashboard(); navItems[0].click()" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 16px 32px; border-radius: 16px;">
                    <i class="fas fa-arrow-left"></i>
                    Explore Questions
                </button>
            </div>
        `;
    } else {
        quizContainer.innerHTML = `
            <div style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <div>
                        <h2 style="font-size: 28px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
                            ${bookmarkedQuestionsList.length} Saved Question${bookmarkedQuestionsList.length !== 1 ? 's' : ''}
                        </h2>
                        <p style="color: var(--text-secondary);">Your personal collection of important questions</p>
                    </div>
                    <button class="quiz-btn" onclick="startBookmarksQuiz()" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 16px 24px; border-radius: 16px;">
                        <i class="fas fa-play"></i>
                        Practice Bookmarks
                    </button>
                </div>
                <div style="display: grid; gap: 20px;">
                    ${bookmarkedQuestionsList.map(question => `
                        <div class="question-card glass-effect" style="cursor: pointer; border-radius: 20px; padding: 24px;" onclick="jumpToBookmarkQuestion(${question.id})">
                            <div class="question-header">
                                <div class="question-meta">
                                    <div class="question-number" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark));">Q${question.id}</div>
                                    <div class="question-category glass-effect">${question.category}</div>
                                    <div class="question-difficulty" style="background: ${getDifficultyColor(question.difficulty)};">
                                        ${question.difficulty}
                                    </div>
                                    ${question.custom ? '<div class="question-category glass-effect" style="background: #10b98120; color: #10b981;">Custom</div>' : ''}
                                </div>
                                <div class="question-actions">
                                    <button class="action-btn bookmark-btn" onclick="event.stopPropagation(); toggleBookmark(${question.id}); showBookmarks();" aria-label="Remove Bookmark" style="background: rgba(239, 68, 68, 0.1); color: var(--error);">
                                        <i class="fas fa-bookmark"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="question-text" style="font-size: 16px; line-height: 1.6;">${question.question}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    quizContainer.classList.remove('hidden');
}
// Add this function to handle clicking on individual bookmark questions
function jumpToBookmarkQuestion(questionId) {
    const bookmarkedQuestionsList = allQuestions.filter(q => bookmarkedQuestions.has(q.id));
   
    // Start a quiz with just this one question
    questions = [bookmarkedQuestionsList.find(q => q.id === questionId)];
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length);
    isAnswerChecked = false;
    currentMode = 'quiz';
   
    // Update mode buttons
    modeButtons.forEach(b => b.classList.remove('active'));
    modeButtons[1].classList.add('active'); // Quiz mode
   
    pageTitle.textContent = 'Quiz Mode - Bookmarked Question';
   
    hideAllSections();
    quizContainer.classList.remove('hidden');
    renderQuizLayout();
}
function showSettings() {
    hideAllSections();
    pageTitle.textContent = 'Settings & Preferences';
   
    quizContainer.innerHTML = `
        <div style="padding: 24px; max-width: 800px; margin: 0 auto;">
            <div class="settings-panel" style="padding: 32px; margin-bottom: 24px;">
                <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">🎨 Appearance</h3>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">Customize the look and feel of your study environment</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div>
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 12px; font-weight: 600;">Theme</label>
                        <div class="mode-selector glass-effect" style="padding: 8px; border-radius: 16px;">
                            <button class="mode-btn ${document.body.classList.contains('dark-mode') ? '' : 'active'}" onclick="setTheme('light')" style="border-radius: 12px; padding: 12px 16px;">
                                <i class="fas fa-sun"></i>
                                Light Mode
                            </button>
                            <button class="mode-btn ${document.body.classList.contains('dark-mode') ? 'active' : ''}" onclick="setTheme('dark')" style="border-radius: 12px; padding: 12px 16px;">
                                <i class="fas fa-moon"></i>
                                Dark Mode
                            </button>
                        </div>
                    </div>
                    <div>
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 12px; font-weight: 600;">Animation</label>
                        <div class="mode-selector glass-effect" style="padding: 8px; border-radius: 16px;">
                            <button class="mode-btn active" style="border-radius: 12px; padding: 12px 16px;">
                                <i class="fas fa-bolt"></i>
                                Smooth
                            </button>
                            <button class="mode-btn" style="border-radius: 12px; padding: 12px 16px;">
                                <i class="fas fa-minus"></i>
                                Minimal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="settings-panel" style="padding: 32px; margin-bottom: 24px;">
                <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">⚡ Study Preferences</h3>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">Optimize your learning experience</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div>
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 12px; font-weight: 600;">Default Mode</label>
                        <div class="mode-selector glass-effect" style="padding: 8px; border-radius: 16px;">
                            <button class="mode-btn ${currentMode === 'quiz' ? 'active' : ''}" onclick="setDefaultMode('quiz')" style="border-radius: 12px; padding: 12px 16px;">
                                <i class="fas fa-tasks"></i>
                                Quiz
                            </button>
                            <button class="mode-btn ${currentMode === 'exam' ? 'active' : ''}" onclick="setDefaultMode('exam')" style="border-radius: 12px; padding: 12px 16px;">
                                <i class="fas fa-file-alt"></i>
                                Exam
                            </button>
                        </div>
                    </div>
                    <div>
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 12px; font-weight: 600;">Questions Per Session</label>
                        <select class="modern-dropdown" style="width: 100%;" onchange="setQuestionsPerSession(this.value)">
                            <option value="10">10 Questions</option>
                            <option value="25" selected>25 Questions</option>
                            <option value="50">50 Questions</option>
                            <option value="100">100 Questions</option>
                            <option value="0">All Questions</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="settings-panel" style="padding: 32px; margin-bottom: 24px;">
                <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">📊 Data & Progress</h3>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">Manage your learning data</p>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <button class="quiz-btn" onclick="exportProgress()" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 16px 24px; border-radius: 16px; justify-content: start;">
                        <i class="fas fa-download" style="margin-right: 12px;"></i>
                        Export Progress Data
                    </button>
                    <button class="quiz-btn" onclick="showCustomQuestionCreator()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 24px; border-radius: 16px; justify-content: start;">
                        <i class="fas fa-plus" style="margin-right: 12px;"></i>
                        Create Custom Question
                    </button>
                    <button class="quiz-btn" onclick="resetProgress()" style="background: linear-gradient(135deg, var(--error), #dc2626); color: white; padding: 16px 24px; border-radius: 16px; justify-content: start;">
                        <i class="fas fa-trash" style="margin-right: 12px;"></i>
                        Reset All Progress
                    </button>
                </div>
            </div>
            <div class="settings-panel" style="padding: 32px;">
                <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">ℹ️ About MediQuiz Pro</h3>
                <div style="color: var(--text-secondary); line-height: 1.7;">
                    <p>MediQuiz Pro is an advanced medical education platform designed to help medical students and professionals enhance their knowledge through interactive quizzes and detailed analytics.</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px;">
                        <div>
                            <strong style="color: var(--text-primary);">Version</strong>
                            <div>2.1.0</div>
                        </div>
                        <div>
                            <strong style="color: var(--text-primary);">Questions</strong>
                            <div>${allQuestions.length} total</div>
                        </div>
                        <div>
                            <strong style="color: var(--text-primary);">Last Updated</strong>
                            <div>${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    quizContainer.classList.remove('hidden');
}
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-moon';
    }
    showNotification(`Theme set to ${theme} mode`, 'success');
}
function setDefaultMode(mode) {
    currentMode = mode;
    modeButtons.forEach(b => b.classList.remove('active'));
    modeButtons[mode === 'quiz' ? 1 : 0].classList.add('active');
    showNotification(`Default mode set to ${mode}`, 'success');
}
function setQuestionsPerSession(count) {
    showNotification(`Questions per session set to ${count === '0' ? 'all' : count}`, 'info');
}
function showCustomQuestionCreator() {
    const modal = document.createElement('div');
    modal.className = 'custom-quiz-modal active';
    modal.innerHTML = `
        <div class="custom-quiz-content glass-effect" style="max-width: 600px; border-radius: 24px;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 24px;">
                <h3 style="font-size: 24px; font-weight: 700; color: var(--text-primary);">Create Custom Question</h3>
                <button class="action-btn" onclick="closeCustomQuestionModal()" style="background: rgba(239, 68, 68, 0.1); color: var(--error);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
           
            <div class="custom-question-creator">
                <div style="display: grid; gap: 20px;">
                    <div>
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600;">Question Text</label>
                        <textarea id="customQuestionText" placeholder="Enter your question here..." style="width: 100%; padding: 16px; border: 2px solid var(--border); border-radius: 16px; background: var(--surface); color: var(--text-primary); font-size: 14px; resize: vertical; min-height: 80px;"></textarea>
                    </div>
                   
                    <div>
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600;">Category</label>
                        <select id="customQuestionCategory" class="modern-dropdown" style="width: 100%;">
                            <option value="Custom Anatomy">Custom Anatomy</option>
                            <option value="Custom Physiology">Custom Physiology</option>
                            <option value="Custom Pathology">Custom Pathology</option>
                            <option value="Custom Pharmacology">Custom Pharmacology</option>
                            <option value="General Medicine">General Medicine</option>
                        </select>
                    </div>
                   
                    <div>
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600;">Difficulty</label>
                        <div class="mode-selector glass-effect" style="padding: 8px; border-radius: 16px;">
                            <button type="button" class="mode-btn difficulty-btn active" data-difficulty="Easy" style="border-radius: 12px; padding: 12px 16px;">
                                Easy
                            </button>
                            <button type="button" class="mode-btn difficulty-btn" data-difficulty="Medium" style="border-radius: 12px; padding: 12px 16px;">
                                Medium
                            </button>
                            <button type="button" class="mode-btn difficulty-btn" data-difficulty="Hard" style="border-radius: 12px; padding: 12px 16px;">
                                Hard
                            </button>
                        </div>
                    </div>
                   
                    <div>
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 12px; font-weight: 600;">Options</label>
                        <div style="display: grid; gap: 12px;">
                            ${['A', 'B', 'C', 'D'].map(letter => `
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--surface); display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--text-secondary); flex-shrink: 0;">${letter}</div>
                                    <input type="text" id="customOption${letter}" placeholder="Option ${letter}" style="flex: 1; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; background: var(--surface); color: var(--text-primary);">
                                    <input type="radio" name="correctAnswer" value="${letter}" id="correct${letter}" style="transform: scale(1.2);">
                                    <label for="correct${letter}" style="color: var(--text-secondary); font-weight: 600;">Correct</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                   
                    <div>
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600;">Explanation</label>
                        <textarea id="customExplanation" placeholder="Explain why the correct answer is right..." style="width: 100%; padding: 16px; border: 2px solid var(--border); border-radius: 16px; background: var(--surface); color: var(--text-primary); font-size: 14px; resize: vertical; min-height: 60px;"></textarea>
                    </div>
                </div>
               
                <div class="custom-quiz-actions" style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px;">
                    <button class="quiz-btn" onclick="closeCustomQuestionModal()" style="background: var(--secondary); color: white; padding: 12px 24px; border-radius: 12px;">
                        Cancel
                    </button>
                    <button class="quiz-btn check-btn" onclick="saveCustomQuestion()" style="padding: 12px 24px; border-radius: 12px;">
                        <i class="fas fa-save"></i>
                        Save Question
                    </button>
                </div>
            </div>
        </div>
    `;
   
    document.body.appendChild(modal);
   
    // Add difficulty button handlers
    modal.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
function closeCustomQuestionModal() {
    const modal = document.querySelector('.custom-quiz-modal');
    if (modal) {
        modal.remove();
    }
}
function saveCustomQuestion() {
    const questionText = document.getElementById('customQuestionText').value;
    const category = document.getElementById('customQuestionCategory').value;
    const difficulty = document.querySelector('.difficulty-btn.active').dataset.difficulty;
    const explanation = document.getElementById('customExplanation').value;
   
    // Get options
    const options = [];
    for (let letter of ['A', 'B', 'C', 'D']) {
        const optionText = document.getElementById(`customOption${letter}`).value;
        if (optionText.trim()) {
            options.push(optionText);
        }
    }
   
    // Get correct answer
    const correctAnswerRadio = document.querySelector('input[name="correctAnswer"]:checked');
    if (!correctAnswerRadio) {
        showNotification('Please select the correct answer', 'error');
        return;
    }
   
    const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(correctAnswerRadio.value);
   
    if (!questionText.trim() || options.length < 2) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
   
    // Generate a unique ID for the custom question
    const maxId = Math.max(
        ...allQuestions.map(q => q.id),
        0
    );
   
    const newQuestion = {
        id: maxId + 1,
        question: questionText,
        options: options,
        answer: correctAnswerIndex,
        correctAnswer: options[correctAnswerIndex],
        explanation: explanation || 'No explanation provided.',
        whyNotOtherOptions: {},
        relatedQuestions: [],
        category: category,
        difficulty: difficulty,
        custom: true
    };
   
    customQuestions.push(newQuestion);
    allQuestions.push(newQuestion); // Add to global allQuestions
    saveUserData();
    updateCourseStats(); // Update course stats after adding custom question
   
    closeCustomQuestionModal();
    showNotification('Custom question created successfully!', 'success');
   
    // Refresh the current view and categories
    initializeCategories();
    if (currentPage === 'dashboard') {
        showDashboard();
    } else if (currentPage === 'bookmarks') {
        showBookmarks();
    }
}

function hideAllSections() {
    quizContainer.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    document.querySelector('.stats-grid').style.display = 'none';
    document.querySelector('.analytics-section').style.display = 'none';
    document.querySelector('.export-section').style.display = 'none';
    // Note: search-container is NOT hidden here - we want it always visible during search
}
function startCourse(courseName) {
    showNotification(`Starting ${courseName} course...`, 'info');
    // Filter questions by course/category and start quiz
    const courseQuestions = getQuestionsByCategory(courseName);
   
    if (courseQuestions.length === 0) {
        showNotification('No questions available for this course yet', 'info');
        return;
    }
   
    questions = courseQuestions;
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length);
    isAnswerChecked = false;
    currentMode = 'quiz';
    modeButtons.forEach(b => b.classList.remove('active'));
    modeButtons[1].classList.add('active');
    pageTitle.textContent = `Quiz Mode - ${courseName}`;
   
    hideAllSections();
    renderQuizLayout();
}
// FIXED BOOKMARK PRACTICE FUNCTION
function startBookmarksQuiz() {
    const bookmarkedQuestionsList = allQuestions.filter(q => bookmarkedQuestions.has(q.id));
   
    if (bookmarkedQuestionsList.length === 0) {
        showNotification('No bookmarked questions to practice!', 'error');
        return;
    }
   
    questions = bookmarkedQuestionsList;
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length);
    isAnswerChecked = false;
    currentMode = 'quiz';
   
    // Update mode buttons
    modeButtons.forEach(b => b.classList.remove('active'));
    modeButtons[1].classList.add('active'); // Quiz mode
   
    pageTitle.textContent = 'Quiz Mode - Bookmarked Questions';
   
    hideAllSections();
    quizContainer.classList.remove('hidden');
    renderQuizLayout();
   
    showNotification(`Starting practice with ${questions.length} bookmarked questions`, 'success');
}
function resetProgress() {
    if (confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
        userProgress = {};
        userStats = {
            totalQuestions: 0,
            correctAnswers: 0,
            timeSpent: 0,
            masteryLevel: 0,
            streak: 0,
            lastActive: new Date().toISOString(),
            weeklyProgress: []
        };
        bookmarkedQuestions = new Set();
        customQuestions = [];
        saveUserData();
        buildAllQuestions(); // Rebuild allQuestions without customs
        updateCourseStats();
        updateDashboardStats();
        updateAnalytics();
        showNotification('All progress has been reset', 'success');
        showDashboard();
    }
}
function initializeEventListeners() {
    menuToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);
    themeToggle.addEventListener('click', toggleTheme);
   
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            pageTitle.textContent = `${btn.dataset.mode.charAt(0).toUpperCase() + btn.dataset.mode.slice(1)} Mode`;
            startQuiz();
        });
    });
   
    initializeEnhancedFeatures();
}
function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    mainContent.classList.toggle('sidebar-open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}
function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    mainContent.classList.remove('sidebar-open');
    document.body.style.overflow = '';
}
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}
function initializeEnhancedFeatures() {
    initializeSearch();
    initializeKeyboardNavigation();
    enhanceAccessibility();
   
    exportProgressBtn.addEventListener('click', exportProgress);
    createCustomQuizBtn.addEventListener('click', () => {
        customQuizModal.classList.add('active');
       
        // Reset selections and set default state
        document.querySelectorAll('.custom-quiz-option').forEach(option => {
            option.classList.remove('selected');
        });
        // Auto-select "All Categories" by default
        document.querySelector('.custom-quiz-option[data-category="all"]').classList.add('selected');
    });
   
    cancelCustomQuizBtn.addEventListener('click', () => {
        customQuizModal.classList.remove('active');
    });
   
    createCustomQuizBtnModal.addEventListener('click', () => {
        const selectedOptions = document.querySelectorAll('.custom-quiz-option.selected');
        const options = {
            categories: [],
            difficulty: null,
            bookmarkedOnly: false
        };
       
        if (selectedOptions.length === 0) {
            showNotification('Please select at least one option for your custom quiz', 'error');
            return;
        }
       
        selectedOptions.forEach(option => {
            const category = option.dataset.category;
           
            if (category === 'all') {
                // Use all available categories
                options.categories = [...new Set(allQuestions.map(q => q.category))];
            } else if (category === 'easy' || category === 'medium' || category === 'hard') {
                options.difficulty = category;
            } else if (category === 'bookmarked') {
                options.bookmarkedOnly = true;
            }
        });
       
        createCustomQuiz(options);
    });
   
    // Add selection toggling for custom quiz options with logic
    document.addEventListener('click', (e) => {
        if (e.target.closest('.custom-quiz-option')) {
            const option = e.target.closest('.custom-quiz-option');
            const category = option.dataset.category;
           
            // Toggle selection
            option.classList.toggle('selected');
           
            // Handle "All Categories" logic
            if (category === 'all') {
                if (option.classList.contains('selected')) {
                    // If "All Categories" is selected, deselect other options
                    document.querySelectorAll('.custom-quiz-option:not([data-category="all"])').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                }
            } else {
                // If any other option is selected, deselect "All Categories"
                document.querySelector('.custom-quiz-option[data-category="all"]').classList.remove('selected');
            }
        }
    });
   
    // Ensure search works when clicking dashboard
    navItems[0].addEventListener('click', () => {
        if (searchInput.value.trim().length > 0) {
            // If there's a search query, maintain search state
            isSearchActive = true;
        }
    });
}
function createCustomQuiz(options) {
    console.log('Creating custom quiz with options:', options);
   
    let filteredQuestions = allQuestions;
   
    // Filter by categories
    if (options.categories && options.categories.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => options.categories.includes(q.category));
        console.log('After category filter:', filteredQuestions.length);
    }
   
    // Filter by difficulty
    if (options.difficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty.toLowerCase() === options.difficulty);
        console.log('After difficulty filter:', filteredQuestions.length);
    }
   
    // Filter by bookmarked
    if (options.bookmarkedOnly) {
        filteredQuestions = filteredQuestions.filter(q => bookmarkedQuestions.has(q.id));
        console.log('After bookmark filter:', filteredQuestions.length);
    }
   
    if (filteredQuestions.length === 0) {
        showNotification('No questions match your criteria. Try different options.', 'error');
        return;
    }
   
    // Shuffle and limit questions if needed (you can add a question count option later)
    filteredQuestions = shuffleArray(filteredQuestions);
   
    questions = filteredQuestions;
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length);
    isAnswerChecked = false;
    examSubmitted = false;
    currentMode = 'quiz';
   
    // Update mode buttons
    modeButtons.forEach(b => b.classList.remove('active'));
    modeButtons[1].classList.add('active'); // Quiz mode
   
    // Generate descriptive title
    let quizTitle = 'Custom Quiz';
    if (options.difficulty) {
        quizTitle += ` - ${options.difficulty.charAt(0).toUpperCase() + options.difficulty.slice(1)}`;
    }
    if (options.bookmarkedOnly) {
        quizTitle += ' - Bookmarked';
    }
    quizTitle += ` (${questions.length} questions)`;
   
    pageTitle.textContent = quizTitle;
   
    hideAllSections();
    quizContainer.classList.remove('hidden');
    customQuizModal.classList.remove('active');
   
    renderQuizLayout();
    showNotification(`Custom quiz created with ${questions.length} questions!`, 'success');
}
// FIXED SEARCH FUNCTIONALITY
function initializeSearch() {
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
           
            // Clear previous search state when input is empty
            if (query.length === 0) {
                document.body.classList.remove('search-blur-active');
                isSearchActive = false;
                if (currentPage === 'dashboard') {
                    showDashboard();
                }
                return;
            }
           
            // Add blur effect when searching
            document.body.classList.add('search-blur-active');
           
            if (query.length < 2) {
                isSearchActive = false;
                return;
            }
           
            isSearchActive = true;
            performSearch(query);
        });
       
        // Add clear search functionality
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                clearSearch();
            }
        });
    }
}
function performSearch(query) {
    searchResults = allQuestions.filter(q =>
        q.question.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query) ||
        (q.explanation && q.explanation.toLowerCase().includes(query)) ||
        q.options.some(opt => opt.toLowerCase().includes(query))
    );
   
    console.log('Search query:', query, 'Results:', searchResults.length); // Debug log
   
    if (searchResults.length > 0) {
        // Show search results in quiz layout
        questions = searchResults;
        currentQuestionIndex = 0;
        userAnswers = new Array(questions.length);
        isAnswerChecked = false;
       
        hideAllSections();
        quizContainer.classList.remove('hidden');
        renderQuizLayout();
       
        // Update page title to show search context
        pageTitle.textContent = `Search: "${query}" (${searchResults.length} results)`;
       
        // Highlight search terms
        setTimeout(() => {
            highlightSearchTerms(query);
        }, 100);
    } else {
        // Show no results message
        showSearchNoResults(query);
    }
}
function showSearchNoResults(query) {
    hideAllSections();
    quizContainer.innerHTML = `
        <div class="no-questions" style="text-align: center; padding: 80px 20px;">
            <div style="font-size: 64px; color: var(--text-tertiary); margin-bottom: 24px; opacity: 0.5;">
                <i class="fas fa-search"></i>
            </div>
            <h2 style="font-size: 28px; margin-bottom: 16px; color: var(--text-primary);">No Results Found</h2>
            <p style="color: var(--text-secondary); margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto;">
                No questions match your search for "<strong style="color: var(--primary);">${query}</strong>". Try different keywords or browse categories.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button class="quiz-btn" onclick="clearSearch()" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 12px 24px; border-radius: 12px;">
                    <i class="fas fa-times"></i>
                    Clear Search
                </button>
                <button class="quiz-btn" onclick="toggleSidebar()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; border-radius: 12px;">
                    <i class="fas fa-folder-open"></i>
                    Browse Categories
                </button>
            </div>
        </div>
    `;
    quizContainer.classList.remove('hidden');
    pageTitle.textContent = `Search: "${query}" (0 results)`;
}
function clearSearch() {
    searchInput.value = '';
    document.body.classList.remove('search-blur-active');
    isSearchActive = false;
    showDashboard();
}
function highlightSearchTerms(query) {
    const questionTexts = document.querySelectorAll('.question-text');
    const optionTexts = document.querySelectorAll('.option-text');
    const categoryElements = document.querySelectorAll('.question-category');
   
    const highlightText = (element) => {
        const originalText = element.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        const highlighted = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');
        element.innerHTML = highlighted;
    };
   
    questionTexts.forEach(highlightText);
    optionTexts.forEach(highlightText);
    categoryElements.forEach(highlightText);
}
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
       
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                e.preventDefault();
                navigateOptions(e.key === 'ArrowDown' ? 1 : -1);
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                if (document.activeElement.classList.contains('option')) {
                    document.activeElement.click();
                }
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                e.preventDefault();
                const index = parseInt(e.key) - 1;
                const options = document.querySelectorAll('.option:not(.disabled)');
                if (options[index]) {
                    options[index].click();
                }
                break;
            case 'Escape':
                if (document.querySelector('.custom-quiz-modal')) {
                    document.querySelector('.custom-quiz-modal').remove();
                }
                break;
        }
    });
}
function navigateOptions(direction) {
    const options = document.querySelectorAll('.option:not(.disabled)');
    const currentIndex = Array.from(options).findIndex(opt => opt === document.activeElement);
    let nextIndex = currentIndex + direction;
   
    if (nextIndex < 0) nextIndex = options.length - 1;
    if (nextIndex >= options.length) nextIndex = 0;
   
    options[nextIndex].focus();
}
function enhanceAccessibility() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('option')) {
            const options = e.target.parentElement.querySelectorAll('.option');
            options.forEach((opt, index) => {
                opt.setAttribute('aria-checked', opt.classList.contains('selected') ? 'true' : 'false');
                opt.setAttribute('role', 'radio');
                opt.setAttribute('tabindex', '0');
            });
        }
    });
}
function loadUserData() {
    const savedProgress = localStorage.getItem('mediQuizProgress');
    const savedStats = localStorage.getItem('mediQuizStats');
    const savedBookmarks = localStorage.getItem('mediQuizBookmarks');
    const savedCustomQuestions = localStorage.getItem('mediQuizCustomQuestions');
   
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    }
    if (savedStats) {
        userStats = JSON.parse(savedStats);
        const today = new Date().toDateString();
        const lastActive = new Date(userStats.lastActive).toDateString();
        if (lastActive !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastActive === yesterday.toDateString()) {
                userStats.streak++;
            } else {
                userStats.streak = 1;
            }
        }
    }
    if (savedBookmarks) {
        bookmarkedQuestions = new Set(JSON.parse(savedBookmarks));
    }
    if (savedCustomQuestions) {
        customQuestions = JSON.parse(savedCustomQuestions);
    }
   
    userStats.lastActive = new Date().toISOString();
    buildAllQuestions(); // Rebuild with loaded customs
    updateCourseStats();
    saveUserData();
}
function saveUserData() {
    localStorage.setItem('mediQuizProgress', JSON.stringify(userProgress));
    localStorage.setItem('mediQuizStats', JSON.stringify(userStats));
    localStorage.setItem('mediQuizBookmarks', JSON.stringify(Array.from(bookmarkedQuestions)));
    localStorage.setItem('mediQuizCustomQuestions', JSON.stringify(customQuestions));
}
function updateDashboardStats() {
    correctAnswersEl.textContent = userStats.correctAnswers;
    timeSpentEl.textContent = `${Math.floor(userStats.timeSpent / 60)}h ${userStats.timeSpent % 60}m`;
    masteryLevelEl.textContent = `${userStats.masteryLevel}%`;
    streakCountEl.textContent = userStats.streak;
}
function updateAnalytics() {
    const weakAreas = Object.entries(userProgress)
        .filter(([_, data]) => data.attempts > 0 && (data.correct / data.attempts) < 0.6)
        .map(([id, _]) => allQuestions.find(q => q.id == id)?.category)
        .reduce((acc, category) => {
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
       
    weakAreasCountEl.textContent = Object.keys(weakAreas).length;
   
    const totalTime = userStats.timeSpent * 60;
    const avgTime = userStats.totalQuestions > 0 ? Math.round(totalTime / userStats.totalQuestions) : 0;
    avgTimePerQuestionEl.textContent = `${avgTime}s`;
   
    if (userStats.weeklyProgress.length > 1) {
        const latest = userStats.weeklyProgress[userStats.weeklyProgress.length - 1];
        const previous = userStats.weeklyProgress[userStats.weeklyProgress.length - 2];
        const improvement = ((latest - previous) / previous) * 100;
        improvementRateEl.textContent = `${Math.round(improvement)}%`;
    } else {
        improvementRateEl.textContent = "0%";
    }
}
function exportProgress() {
    const data = {
        progress: userProgress,
        stats: userStats,
        bookmarks: Array.from(bookmarkedQuestions),
        customQuestions: customQuestions,
        exportDate: new Date().toISOString(),
        analytics: generateStudyReport()
    };
   
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediquiz-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
   
    showNotification('Progress data exported successfully!', 'success');
}
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
function generateStudyReport() {
    const weakAreas = Object.entries(userProgress)
        .filter(([_, data]) => data.attempts > 0 && (data.correct / data.attempts) < 0.6)
        .map(([id, _]) => {
            const question = allQuestions.find(q => q.id == id);
            return {
                questionId: id,
                category: question?.category,
                difficulty: question?.difficulty,
                performance: userProgress[id].correct / userProgress[id].attempts
            };
        });
       
    const strongAreas = Object.entries(userProgress)
        .filter(([_, data]) => data.attempts > 0 && (data.correct / data.attempts) >= 0.8)
        .map(([id, _]) => {
            const question = allQuestions.find(q => q.id == id);
            return {
                questionId: id,
                category: question?.category,
                difficulty: question?.difficulty,
                performance: userProgress[id].correct / userProgress[id].attempts
            };
        });
       
    return {
        weakAreas,
        strongAreas,
        totalMastered: Object.values(userProgress).filter(p => p.correct >= 3).length,
        totalQuestions: allQuestions.length,
        masteryPercentage: calculateMasteryLevel(),
        generatedAt: new Date().toISOString()
    };
}
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
   
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
   
    const icons = {
        'info': 'fas fa-info-circle',
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-triangle',
        'warning': 'fas fa-exclamation-circle'
    };
   
    notification.innerHTML = `
        <i class="${icons[type] || 'fas fa-info-circle'}"></i>
        <span>${message}</span>
    `;
   
    document.body.appendChild(notification);
   
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
   
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}
function initializeCategories() {
    const categories = [...new Set(allQuestions.map(q => q.category))];
    const categoryIcons = {
        "Anatomy Fundamentals": "fas fa-brain",
        "Neuroanatomy": "fas fa-brain",
        "Gastrointestinal System": "fas fa-stomach",
        "Cardiovascular System": "fas fa-heart",
        "Custom Anatomy": "fas fa-user-md",
        "Custom Physiology": "fas fa-heartbeat",
        "Custom Pathology": "fas fa-virus",
        "Custom Pharmacology": "fas fa-pills",
        "General Medicine": "fas fa-stethoscope"
    };
   
    const categoryColors = {
        "Anatomy Fundamentals": "#6366f1",
        "Neuroanatomy": "#06b6d4",
        "Gastrointestinal System": "#10b981",
        "Cardiovascular System": "#ef4444",
        "Custom Anatomy": "#8b5cf6",
        "Custom Physiology": "#f59e0b",
        "Custom Pathology": "#ec4899",
        "Custom Pharmacology": "#84cc16",
        "General Medicine": "#64748b"
    };
    categoriesGrid.innerHTML = '';
    categories.forEach(category => {
        const categoryQuestions = getQuestionsByCategory(category);
        const mastered = categoryQuestions.filter(q =>
            userProgress[q.id] && userProgress[q.id].correct >= 3
        ).length;
        const progress = categoryQuestions.length > 0 ?
            Math.round((mastered / categoryQuestions.length) * 100) : 0;
           
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card active glass-effect';
        categoryCard.dataset.category = category;
        categoryCard.style.borderLeft = `4px solid ${categoryColors[category] || '#6366f1'}`;
        categoryCard.innerHTML = `
            <div class="category-header">
                <div class="category-icon" style="background: ${categoryColors[category] || '#6366f1'}20; color: ${categoryColors[category] || '#6366f1'}">
                    <i class="${categoryIcons[category] || 'fas fa-question'}"></i>
                </div>
                <div class="category-name">${category}</div>
                ${category.includes('Custom') ? '<div style="font-size: 10px; color: var(--primary); background: var(--primary-light); padding: 2px 6px; border-radius: 8px;">Custom</div>' : ''}
            </div>
            <div class="category-stats">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%; background: ${categoryColors[category] || '#6366f1'}"></div>
                </div>
                <div class="progress-text">${progress}%</div>
            </div>
            <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px;">
                ${categoryQuestions.length} question${categoryQuestions.length !== 1 ? 's' : ''}
                ${categoryQuestions.filter(q => q.custom).length > 0 ? ` · ${categoryQuestions.filter(q => q.custom).length} custom` : ''}
            </div>
        `;
       
        if (categoryQuestions.length > 1) {
            const dropdown = document.createElement('div');
            dropdown.className = 'modern-dropdown';
            dropdown.innerHTML = `
                <select onchange="jumpToQuestion(this.value)">
                    <option value="">Jump to Question...</option>
                    ${categoryQuestions.sort((a, b) => a.id - b.id).map(q =>
                        `<option value="question-${q.id}">Q${q.id}: ${q.question.substring(0, 50)}${q.question.length > 50 ? '...' : ''}${q.custom ? ' ★' : ''}</option>`
                    ).join('')}
                </select>
            `;
            categoryCard.appendChild(dropdown);
        }
       
        categoryCard.addEventListener('click', (e) => {
            if (!e.target.closest('.modern-dropdown') && !e.target.closest('select')) {
                toggleCategory(categoryCard);
                const firstQ = categoryQuestions.sort((a, b) => a.id - b.id)[0];
                if (firstQ) {
                    jumpToQuestion(`question-${firstQ.id}`);
                }
            }
        });
       
        categoriesGrid.appendChild(categoryCard);
    });
   
    selectedCategories = [...categories];
}
function toggleCategory(categoryCard) {
    const category = categoryCard.dataset.category;
    if (categoryCard.classList.contains('active')) {
        categoryCard.classList.remove('active');
        selectedCategories = selectedCategories.filter(c => c !== category);
    } else {
        categoryCard.classList.add('active');
        selectedCategories.push(category);
    }
    startQuiz();
    closeSidebar();
}
function startQuiz() {
    if (currentPage !== 'dashboard') return;
   
    quizContainer.style.opacity = '0';
    setTimeout(() => {
        questions = selectedCategories.length > 0 ?
            allQuestions.filter(q => selectedCategories.includes(q.category)) :
            allQuestions;
           
        if (questions.length === 0) {
            showNoQuestionsMessage();
            return;
        }
        if (currentMode === 'learn' && incorrectQuestions.length > 0) {
            questions = allQuestions.filter(q => incorrectQuestions.includes(q.id));
        }
        if (questions.length === 0) {
            showNoQuestionsMessage();
            return;
        }
        questions.sort((a, b) => a.id - b.id);
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = new Array(questions.length);
        isAnswerChecked = false;
        examSubmitted = false;
        quizContainer.classList.remove('hidden');
        resultsScreen.classList.add('hidden');
        questionTimers = new Array(questions.length).fill(0);
        if (currentMode === 'exam') {
            isCountdown = true;
            remainingTime = 120 * questions.length;
        } else {
            isCountdown = false;
        }
        startTimer();
        renderQuizLayout();
        quizContainer.style.opacity = '1';
    }, 300);
}
function showNoQuestionsMessage() {
    let message = '';
    if (isSearchActive) {
        message = 'No questions match your search criteria. Try different keywords.';
    } else if (selectedCategories.length === 0) {
        message = 'No categories selected. Please select categories from the sidebar.';
    } else {
        message = 'No questions available for the selected categories.';
    }
   
    quizContainer.innerHTML = `
        <div class="no-questions" style="text-align: center; padding: 80px 20px;">
            <div style="font-size: 64px; color: var(--text-tertiary); margin-bottom: 24px; opacity: 0.5;">
                <i class="fas fa-inbox"></i>
            </div>
            <h2 style="font-size: 28px; margin-bottom: 16px; color: var(--text-primary);">No Questions Available</h2>
            <p style="color: var(--text-secondary); margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto;">
                ${message}
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button class="quiz-btn" onclick="toggleSidebar()" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 12px 24px; border-radius: 12px;">
                    <i class="fas fa-folder-open"></i>
                    Select Categories
                </button>
                <button class="quiz-btn" onclick="showCustomQuestionCreator()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; border-radius: 12px;">
                    <i class="fas fa-plus"></i>
                    Create Question
                </button>
                ${isSearchActive ? `
                    <button class="quiz-btn" onclick="clearSearch()" style="background: linear-gradient(135deg, var(--secondary), #4b5563); color: white; padding: 12px 24px; border-radius: 12px;">
                        <i class="fas fa-times"></i>
                        Clear Search
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    resultsScreen.classList.add('hidden');
    stopTimer();
    quizContainer.style.opacity = '1';
}
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = new Date();
    timerInterval = setInterval(() => {
        if (isCountdown) {
            remainingTime--;
            if (remainingTime <= 0) {
                remainingTime = 0;
                clearInterval(timerInterval);
                if (currentMode === 'exam' && !examSubmitted) {
                    showNotification('Time up! Submitting exam.', 'error');
                    submitExam();
                }
            }
            updateTimerDisplay(formatTime(remainingTime), 'timerDisplay', true);
        } else {
            questionTimers[currentQuestionIndex]++;
            updateTimerDisplay(formatTime(questionTimers[currentQuestionIndex]), 'timerDisplay', false);
        }
    }, 1000);
}
function formatTime(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}
function updateTimerDisplay(time, id, isCountdown = false) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = `Time: ${time}`;
        if (isCountdown) {
            el.classList.remove('timer-warning', 'timer-error');
            if (remainingTime <= 30) {
                el.classList.add('timer-error');
            } else if (remainingTime <= 60) {
                el.classList.add('timer-warning');
            }
        }
    }
}
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        if (startTime) {
            const endTime = new Date();
            const timeSpent = Math.floor((endTime - startTime) / 1000 / 60);
            userStats.timeSpent += timeSpent;
            userStats.lastActive = new Date().toISOString();
            saveUserData();
            updateDashboardStats();
        }
    }
}
function renderQuizLayout() {
    if (questions.length === 0) {
        showNoQuestionsMessage();
        return;
    }
   
    if (currentMode === 'exam') {
        renderExamLayout();
    } else {
        renderSingleQuestionLayout();
    }
}
function renderExamLayout() {
    const isImmediateMode = examCheckMode === 'immediate';
    quizContainer.innerHTML = `
        <div class="exam-header" style="margin-bottom: 24px; padding: 20px; background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
                        Exam Mode: ${questions.length} Questions
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 14px;">
                        ${isImmediateMode ?
                          'Immediate Check - See explanations as you answer' :
                          'All-in-One Check - Check all answers at the end'}
                    </p>
                </div>
                <div class="exam-mode-toggle" style="display: flex; gap: 8px; background: var(--glass); padding: 4px; border-radius: var(--radius);">
                    <button class="mode-toggle-btn ${isImmediateMode ? 'active' : ''}" data-mode="immediate" style="padding: 8px 16px; border: none; border-radius: 6px; background: ${isImmediateMode ? 'var(--primary)' : 'transparent'}; color: ${isImmediateMode ? 'white' : 'var(--text-secondary)'}; cursor: pointer; font-size: 12px; font-weight: 500;" aria-label="Immediate Check Mode">
                        Immediate Check
                    </button>
                    <button class="mode-toggle-btn ${!isImmediateMode ? 'active' : ''}" data-mode="all-at-once" style="padding: 8px 16px; border: none; border-radius: 6px; background: ${!isImmediateMode ? 'var(--primary)' : 'transparent'}; color: ${!isImmediateMode ? 'white' : 'var(--text-secondary)'}; cursor: pointer; font-size: 12px; font-weight: 500;" aria-label="All-at-Once Check Mode">
                        Check All
                    </button>
                </div>
            </div>
            <div class="progress-info" style="display: flex; align-items: center; gap: 16px;">
                <span style="font-size: 14px; color: var(--text-secondary);" id="answeredCount">0/${questions.length} answered</span>
                <div class="progress-bar" style="flex: 1; height: 6px;">
                    <div class="progress-fill" id="examProgressFill" style="width: 0%"></div>
                </div>
                <span id="timerDisplay" style="font-size: 14px; color: var(--text-secondary);">Time: ${formatTime(remainingTime)}</span>
                ${examSubmitted ? `<span style="color: var(--success); font-weight: 600; font-size: 14px;">Submitted!</span>` : ''}
            </div>
        </div>
        <div class="exam-mode-layout">
            ${questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.answer;
                const showExplanationButton = examSubmitted || (isImmediateMode && userAnswer !== undefined);
                return `
                    <div class="question-card fade-in" data-question-index="${index}" id="question-${question.id}">
                        <div class="question-header">
                            <div class="question-meta">
                                <div class="question-number">Q${question.id}</div>
                                <div class="question-category">${question.category}</div>
                                <div class="question-difficulty" style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${getDifficultyColor(question.difficulty)}; color: white;">
                                    ${question.difficulty}
                                </div>
                                ${userAnswer !== undefined ? `
                                    <div class="answer-status ${isCorrect ? 'correct' : 'incorrect'}" style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${isCorrect ? 'var(--success)' : 'var(--error)'}; color: white;">
                                        ${isCorrect ? 'Correct' : 'Incorrect'}
                                    </div>
                                ` : ''}
                            </div>
                            <div class="question-actions">
                                <button class="action-btn bookmark-btn" data-question-id="${question.id}" aria-label="Bookmark Question">
                                    <i class="${bookmarkedQuestions.has(question.id) ? 'fas' : 'far'} fa-bookmark"></i>
                                </button>
                            </div>
                        </div>
                        <div class="question-text">${question.question}</div>
                        <div class="options-grid">
                            ${question.options.map((option, optIndex) => {
                                const isSelected = userAnswer === optIndex;
                                const isCorrectOption = optIndex === question.answer;
                                let optionClass = 'option';
                                if (userAnswer !== undefined) {
                                    if (isCorrectOption) {
                                        optionClass += ' correct';
                                    } else if (isSelected && !isCorrectOption) {
                                        optionClass += ' incorrect';
                                    }
                                    optionClass += ' disabled';
                                } else if (isSelected) {
                                    optionClass += ' selected';
                                }
                                return `
                                    <div class="${optionClass}" data-option-index="${optIndex}" role="button" aria-label="Option ${String.fromCharCode(65 + optIndex)}">
                                        <div class="option-letter">${String.fromCharCode(65 + optIndex)}</div>
                                        <div class="option-text">${option}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        ${showExplanationButton ? `
                            <div class="explanation-section">
                                <details open>
                                    <summary><i class="fas fa-info-circle"></i> Correct Answer</summary>
                                    <div class="explanation-content correct-answer">
                                        <strong>Answer: ${String.fromCharCode(65 + question.answer)}. ${question.correctAnswer}</strong>
                                    </div>
                                </details>
                                ${userAnswer !== undefined && userAnswer !== question.answer ? `
                                    <details>
                                        <summary><i class="fas fa-exclamation-circle"></i> Why Not Your Answer?</summary>
                                        <div class="explanation-content why-not-section">
                                            <strong>Why not ${String.fromCharCode(65 + userAnswer)}?</strong>
                                            <p>${question.whyNotOtherOptions[String.fromCharCode(97 + userAnswer)]}</p>
                                        </div>
                                    </details>
                                ` : ''}
                                <details>
                                    <summary><i class="fas fa-book"></i> Detailed Explanation</summary>
                                    <div class="explanation-content">${question.explanation}</div>
                                </details>
                                <details>
                                    <summary><i class="fas fa-link"></i> Related Questions</summary>
                                    <div class="explanation-content related-questions">
                                        <div class="related-questions-list">
                                            ${question.relatedQuestions.map(q => {
                                                const qId = q.match(/\d+/)[0];
                                                return `<span class="related-question-tag" onclick="jumpToQuestion('question-${qId}')" role="button" aria-label="Jump to Question ${qId}">Q${qId}</span>`;
                                            }).join('')}
                                        </div>
                                    </div>
                                </details>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
            <div class="quiz-controls">
                <div style="display: flex; gap: 12px;">
                    ${examCheckMode === 'all-at-once' && !examSubmitted ? `
                        <button class="quiz-btn check-btn" id="checkAllBtn" ${userAnswers.filter(a => a !== undefined).length === 0 ? 'disabled' : ''} aria-label="Check All Answers">
                            <i class="fas fa-check-double"></i>
                            Check All Answers
                        </button>
                    ` : ''}
                </div>
                <button class="quiz-btn submit-btn" id="examSubmitBtn" ${examSubmitted ? 'disabled' : ''} aria-label="Submit Exam">
                    <i class="fas fa-paper-plane"></i>
                    ${examSubmitted ? 'Exam Submitted' : `Submit Exam (${questions.length} questions)`}
                </button>
            </div>
        </div>
    `;
    initializeExamModeEvents();
    updateExamSubmitButton();
}
function renderSingleQuestionLayout() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    const question = questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];
    const isCorrect = userAnswer === question.answer;
    quizContainer.innerHTML = `
        <div class="question-card fade-in" data-question-index="${currentQuestionIndex}">
            <div class="question-header">
                <div class="question-meta">
                    <div class="question-number">Q${question.id}</div>
                    <div class="question-category">${question.category}</div>
                    <div class="question-difficulty" style="background: ${getDifficultyColor(question.difficulty)};">
                        ${question.difficulty}
                    </div>
                    ${userAnswer !== undefined ? `
                        <div class="answer-status ${isCorrect ? 'correct' : 'incorrect'}" style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${isCorrect ? 'var(--success)' : 'var(--error)'}; color: white;">
                            ${isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                    ` : ''}
                </div>
                <div class="question-actions">
                    <button class="action-btn bookmark-btn" data-question-id="${question.id}" aria-label="Bookmark Question">
                        <i class="${bookmarkedQuestions.has(question.id) ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                </div>
            </div>
            <div class="question-text">${question.question}</div>
            <div class="options-grid">
                ${question.options.map((option, index) => {
                    const isSelected = userAnswer === index;
                    const isCorrectOption = index === question.answer;
                    let optionClass = 'option';
                    if (isAnswerChecked) {
                        if (isCorrectOption) {
                            optionClass += ' correct';
                        } else if (isSelected && !isCorrectOption) {
                            optionClass += ' incorrect';
                        }
                        optionClass += ' disabled';
                    } else if (isSelected) {
                        optionClass += ' selected';
                    }
                    return `
                        <div class="${optionClass}" data-option-index="${index}" role="button" aria-label="Option ${String.fromCharCode(65 + index)}">
                            <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                            <div class="option-text">${option}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            ${isAnswerChecked ? `
                <div class="explanation-section">
                    <details open>
                        <summary><i class="fas fa-info-circle"></i> Correct Answer</summary>
                        <div class="explanation-content correct-answer">
                            <strong>Answer: ${String.fromCharCode(65 + question.answer)}. ${question.correctAnswer}</strong>
                        </div>
                    </details>
                    ${userAnswer !== undefined && userAnswer !== question.answer ? `
                        <details>
                            <summary><i class="fas fa-exclamation-circle"></i> Why Not Your Answer?</summary>
                            <div class="explanation-content why-not-section">
                                <strong>Why not ${String.fromCharCode(65 + userAnswer)}?</strong>
                                <p>${question.whyNotOtherOptions[String.fromCharCode(97 + userAnswer)]}</p>
                            </div>
                        </details>
                    ` : ''}
                    <details>
                        <summary><i class="fas fa-book"></i> Detailed Explanation</summary>
                        <div class="explanation-content">${question.explanation}</div>
                    </details>
                    <details>
                        <summary><i class="fas fa-link"></i> Related Questions</summary>
                        <div class="explanation-content related-questions">
                            <div class="related-questions-list">
                                ${question.relatedQuestions.map(q => {
                                    const qId = q.match(/\d+/)[0];
                                    return `<span class="related-question-tag" onclick="jumpToQuestion('question-${qId}')" role="button" aria-label="Jump to Question ${qId}">Q${qId}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    </details>
                </div>
            ` : ''}
            <div class="quiz-controls">
                <div style="display: flex; gap: 12px;">
                    <button class="quiz-btn check-btn" id="checkAnswerBtn" ${userAnswer === undefined ? 'disabled' : ''} aria-label="Check Answer">
                        <i class="fas fa-check"></i>
                        Check Answer
                    </button>
                    ${currentMode === 'learn' && incorrectQuestions.length > 0 ? `
                        <button class="quiz-btn" id="incorrectOnlyBtn" aria-label="Show Incorrect Only">
                            <i class="fas fa-filter"></i>
                            Incorrect Only
                        </button>
                    ` : ''}
                </div>
                <button class="quiz-btn next-btn" id="nextQuestionBtn" ${!isAnswerChecked ? 'disabled' : ''} aria-label="Next Question">
                    <i class="fas fa-arrow-right"></i>
                    ${currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
                </button>
            </div>
        </div>
    `;
    initializeQuizEvents();
    updateTimerDisplay(formatTime(isCountdown ? remainingTime : questionTimers[currentQuestionIndex]), 'timerDisplay', isCountdown);
}
function initializeQuizEvents() {
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const incorrectOnlyBtn = document.getElementById('incorrectOnlyBtn');
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const options = document.querySelectorAll('.option:not(.disabled)');
   
    options.forEach(option => {
        option.addEventListener('click', () => {
            if (!isAnswerChecked) {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                userAnswers[currentQuestionIndex] = parseInt(option.dataset.optionIndex);
                if (checkAnswerBtn) checkAnswerBtn.disabled = false;
                updateExamSubmitButton();
            }
        });
    });
   
    if (checkAnswerBtn) {
        checkAnswerBtn.addEventListener('click', () => {
            checkAnswer();
            renderQuizLayout();
        });
    }
   
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            isAnswerChecked = false;
            renderQuizLayout();
        });
    }
   
    if (incorrectOnlyBtn) {
        incorrectOnlyBtn.addEventListener('click', () => {
            questions = allQuestions.filter(q => incorrectQuestions.includes(q.id));
            currentQuestionIndex = 0;
            userAnswers = new Array(questions.length);
            isAnswerChecked = false;
            renderQuizLayout();
        });
    }
   
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            const questionId = parseInt(bookmarkBtn.dataset.questionId);
            toggleBookmark(questionId);
            bookmarkBtn.querySelector('i').className = bookmarkedQuestions.has(questionId) ? 'fas fa-bookmark' : 'far fa-bookmark';
        });
    }
}
function initializeExamModeEvents() {
    const options = document.querySelectorAll('.option:not(.disabled)');
    const checkAllBtn = document.getElementById('checkAllBtn');
    const submitBtn = document.getElementById('examSubmitBtn');
    const modeToggleButtons = document.querySelectorAll('.mode-toggle-btn');
   
    options.forEach(option => {
        option.addEventListener('click', () => {
            const questionIndex = parseInt(option.closest('.question-card').dataset.questionIndex);
            const prevSelected = option.closest('.options-grid').querySelector('.selected');
            if (prevSelected) prevSelected.classList.remove('selected');
            option.classList.add('selected');
            userAnswers[questionIndex] = parseInt(option.dataset.optionIndex);
            updateExamProgress();
            updateExamSubmitButton();
            if (examCheckMode === 'immediate') {
                checkAnswer(questionIndex);
                renderQuizLayout();
            }
        });
    });
   
    if (checkAllBtn) {
        checkAllBtn.addEventListener('click', () => {
            userAnswers.forEach((answer, index) => {
                if (answer !== undefined) {
                    checkAnswer(index);
                }
            });
            renderQuizLayout();
        });
    }
   
    if (submitBtn) {
        submitBtn.addEventListener('click', submitExam);
    }
   
    modeToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeToggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            examCheckMode = btn.dataset.mode;
            renderQuizLayout();
        });
    });
   
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const questionId = parseInt(btn.dataset.questionId);
            toggleBookmark(questionId);
            btn.querySelector('i').className = bookmarkedQuestions.has(questionId) ? 'fas fa-bookmark' : 'far fa-bookmark';
        });
    });
}
function updateExamProgress() {
    const answered = userAnswers.filter(a => a !== undefined).length;
    const progressPercent = (answered / questions.length) * 100;
    const answeredCount = document.getElementById('answeredCount');
    const progressFill = document.getElementById('examProgressFill');
    if (answeredCount) {
        answeredCount.textContent = `${answered}/${questions.length} answered`;
    }
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
}
function updateExamSubmitButton() {
    const submitBtn = document.getElementById('examSubmitBtn');
    if (submitBtn) {
        const allAnswered = userAnswers.every(a => a !== undefined);
        submitBtn.disabled = !allAnswered || examSubmitted;
        submitBtn.innerHTML = examSubmitted ?
            '<i class="fas fa-paper-plane"></i> Exam Submitted' :
            `<i class="fas fa-paper-plane"></i> Submit Exam (${questions.length} questions)`;
    }
}
function checkAnswer(questionIndex = currentQuestionIndex) {
    const question = questions[questionIndex];
    const userAnswer = userAnswers[questionIndex];
    isAnswerChecked = true;
    if (userAnswer === question.answer) {
        score++;
        userStats.correctAnswers++;
        if (!userProgress[question.id]) userProgress[question.id] = { correct: 0, attempts: 0 };
        userProgress[question.id].correct++;
        userProgress[question.id].attempts++;
        incorrectQuestions = incorrectQuestions.filter(id => id !== question.id);
    } else {
        if (!incorrectQuestions.includes(question.id)) {
            incorrectQuestions.push(question.id);
        }
        if (!userProgress[question.id]) userProgress[question.id] = { correct: 0, attempts: 0 };
        userProgress[question.id].attempts++;
    }
    userStats.totalQuestions++;
    userStats.masteryLevel = calculateMasteryLevel();
    updateCourseStats(); // Update course stats after answer
    saveUserData();
    updateDashboardStats();
}
function submitExam() {
    examSubmitted = true;
    if (examCheckMode === 'all-at-once') {
        userAnswers.forEach((answer, index) => {
            if (answer !== undefined) {
                checkAnswer(index);
            }
        });
    }
    stopTimer();
    showResults();
}
function calculateMasteryLevel() {
    const masteredQuestions = Object.values(userProgress).filter(p => p.correct >= 3).length;
    return allQuestions.length > 0 ? Math.round((masteredQuestions / allQuestions.length) * 100) : 0;
}
function showResults() {
    stopTimer();
    quizContainer.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
   
    let restartText = 'Restart Quiz';
    if (currentPage === 'bookmarks') {
        restartText = 'Practice Again';
    }
   
    resultsScreen.innerHTML = `
        <div class="results-card fade-in">
            <div class="results-header">
                <h2 class="results-title">${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Results</h2>
                <p class="score-text">You completed ${questions.length} question${questions.length !== 1 ? 's' : ''}</p>
            </div>
            <div class="score-display">${percentage}%</div>
            <div class="score-text">Score: ${score} out of ${questions.length} correct</div>
            <div class="results-details">
                ${questions.map((q, index) => {
                    const isCorrect = userAnswers[index] === q.answer;
                    return `
                        <div class="result-item">
                            <div class="result-question">Q${q.id}: ${q.question}</div>
                            <div class="result-status ${isCorrect ? 'result-correct' : 'result-incorrect'}">
                                ${isCorrect ? 'Correct' : 'Incorrect'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button class="restart-btn" id="restartQuiz" aria-label="Restart Quiz" style="margin: 0;">
                    <i class="fas fa-redo"></i>
                    ${restartText}
                </button>
                ${currentPage === 'bookmarks' ? `
                    <button class="quiz-btn" onclick="showBookmarks()" style="background: linear-gradient(135deg, var(--secondary), #4b5563); color: white; padding: 16px 24px; border-radius: var(--radius);">
                        <i class="fas fa-bookmark"></i>
                        Back to Bookmarks
                    </button>
                ` : ''}
            </div>
        </div>
    `;
   
    document.getElementById('restartQuiz').addEventListener('click', () => {
        if (currentPage === 'bookmarks') {
            startBookmarksQuiz();
        } else {
            startQuiz();
        }
    });
}
function toggleBookmark(questionId) {
    if (bookmarkedQuestions.has(questionId)) {
        bookmarkedQuestions.delete(questionId);
        showNotification('Question removed from bookmarks', 'info');
    } else {
        bookmarkedQuestions.add(questionId);
        showNotification('Question bookmarked', 'success');
    }
    saveUserData();
   
    // If we're on the bookmarks page, refresh it
    if (currentPage === 'bookmarks') {
        showBookmarks();
    }
}
function getDifficultyColor(difficulty) {
    switch (difficulty.toLowerCase()) {
        case 'easy': return '#10b981';
        case 'medium': return '#f59e0b';
        case 'hard': return '#ef4444';
        default: return '#64748b';
    }
}
function jumpToQuestion(questionId) {
    const questionIndex = questions.findIndex(q => `question-${q.id}` === questionId);
    if (questionIndex !== -1) {
        if (currentMode === 'exam') {
            const element = document.getElementById(questionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            currentQuestionIndex = questionIndex;
            isAnswerChecked = false;
            renderQuizLayout();
        }
    } else {
        // If question not in current quiz, start a new quiz with that question's category
        const question = allQuestions.find(q => `question-${q.id}` === questionId);
        if (question) {
            selectedCategories = [question.category];
            startQuiz();
            setTimeout(() => {
                const element = document.getElementById(questionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        }
    }
}
// Initialize the application
init();
