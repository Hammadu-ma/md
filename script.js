

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
    {
        "id": 1,
        "question": "Which branch of anatomy is the basis for physical examination and part of physical diagnosis?",
        "options": [
            "Surgical anatomy",
            "Surface anatomy",
            "Radiological anatomy",
            "Cadaver anatomy"
        ],
        "answer": 1,
        "correctAnswer": "Surface anatomy",
        "explanation": "Surface anatomy studies external body landmarks, essential for physical examinations and diagnosis.",
        "whyNotOtherOptions": {
            "a": "Surgical anatomy focuses on surgical procedures.",
            "c": "Radiological anatomy uses imaging, not physical exams.",
            "d": "Cadaver anatomy is dissection-based, not clinical."
        },
        "relatedQuestions": ["2"],
        "category": "Anatomy Fundamentals",
        "difficulty": "Medium"
    },
    {
        "id": 2,
        "question": "Which statement is correct about the anatomical position?",
        "options": [
            "Palms of the subject stand erect facing forwards",
            "The upper extremities are placed at the sides",
            "The palms of the hands are turned forward",
            "The head and eyes are facing forwards",
            "None of the above"
        ],
        "answer": 4,
        "correctAnswer": "None of the above",
        "explanation": "The anatomical position includes standing erect, arms at sides, palms forward, and head/eyes facing forward.",
        "whyNotOtherOptions": {
            "a": "Palms don't 'stand erect'; they face forward.",
            "b": "Correct but incomplete alone.",
            "c": "Correct but incomplete alone.",
            "d": "Correct but incomplete alone."
        },
        "relatedQuestions": ["1"],
        "category": "Anatomy Fundamentals",
        "difficulty": "Medium"
    },
    {
        "id": 3,
        "question": "What is the primary neurotransmitter at the neuromuscular junction?",
        "options": [
            "Dopamine",
            "Acetylcholine",
            "Serotonin",
            "GABA"
        ],
        "answer": 1,
        "correctAnswer": "Acetylcholine",
        "explanation": "Acetylcholine is the primary neurotransmitter at the neuromuscular junction, responsible for muscle contraction.",
        "whyNotOtherOptions": {
            "a": "Dopamine is involved in reward and movement.",
            "c": "Serotonin regulates mood and appetite.",
            "d": "GABA is an inhibitory neurotransmitter."
        },
        "relatedQuestions": [],
        "category": "Neuroanatomy",
        "difficulty": "Easy"
    },
    {
        "id": 4,
        "question": "Which of the following is NOT a function of the liver?",
        "options": [
            "Protein synthesis",
            "Bile production",
            "Glycogen storage",
            "Insulin production"
        ],
        "answer": 3,
        "correctAnswer": "Insulin production",
        "explanation": "The liver performs many functions but insulin is produced by the pancreas.",
        "whyNotOtherOptions": {
            "a": "Liver synthesizes plasma proteins.",
            "b": "Liver produces bile for fat digestion.",
            "c": "Liver stores glycogen for energy."
        },
        "relatedQuestions": [],
        "category": "Gastrointestinal System",
        "difficulty": "Easy"
    },
    {
        "id": 5,
        "question": "The right common carotid artery is a branch of:",
        "options": [
            "Ascending aorta",
            "Aortic arch",
            "Brachiocephalic artery",
            "Right subclavian artery"
        ],
        "answer": 2,
        "correctAnswer": "Brachiocephalic artery",
        "explanation": "The right common carotid artery branches from the brachiocephalic artery.",
        "whyNotOtherOptions": {
            "a": "Ascending aorta has coronary arteries.",
            "b": "Aortic arch gives rise to brachiocephalic artery.",
            "d": "Right subclavian is another branch of brachiocephalic."
        },
        "relatedQuestions": [],
        "category": "Cardiovascular System",
        "difficulty": "Hard"
    }
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
function createFAB() {
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = '<i class="fas fa-plus"></i>';
    fab.title = 'Create Custom Question';
    fab.addEventListener('click', showCustomQuestionCreator);
    document.body.appendChild(fab);
}
function initializeNavigation() {
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
           
            switch(index) {
                case 0: // Dashboard
                    currentPage = 'dashboard';
                    showDashboard();
                    break;
                case 1: // My Courses
                    currentPage = 'courses';
                    showCourses();
                    break;
                case 2: // Progress Analytics
                    currentPage = 'analytics';
                    showAnalytics();
                    break;
                case 3: // Bookmarked Questions
                    currentPage = 'bookmarks';
                    showBookmarks();
                    break;
                case 4: // Settings
                    currentPage = 'settings';
                    showSettings();
                    break;
            }
           
            closeSidebar();
        });
    });
}
function showDashboard() {
    hideAllSections();
    document.querySelector('.stats-grid').style.display = 'grid';
    document.querySelector('.analytics-section').style.display = 'block';
    document.querySelector('.search-container').style.display = 'block';
    document.querySelector('.export-section').style.display = 'block';
   
    // Reset page title
    pageTitle.textContent = 'Medical Quiz Dashboard';
    updateDashboardStats();
   
    // Only show all questions if not in search mode
    if (!isSearchActive) {
        questions = allQuestions;
        selectedCategories = [...new Set(questions.map(q => q.category))];
        renderQuizLayout();
    } else {
        // If we're in search mode, show the search results
        performSearch(searchInput.value.trim().toLowerCase());
    }
}
// Load courses and questions from external JSON files
async function loadCourseData() {
    try {
        // Load courses data
        const coursesResponse = await fetch('./courses.json');
        coursesData = await coursesResponse.json();
       
        // Load course questions
        const questionsResponse = await fetch('./course-questions.json');
        courseQuestions = await questionsResponse.json();
       
        console.log('Course data loaded successfully');
    } catch (error) {
        console.error('Error loading course data:', error);
        // Fallback to default data if files don't exist
        coursesData = getDefaultCourses();
        courseQuestions = getDefaultCourseQuestions();
    }
}
// Build global allQuestions by merging all sources without duplicates
function buildAllQuestions() {
    allQuestions = [...quizData];
    Object.values(courseQuestions).flat().forEach(q => {
        if (!allQuestions.some(existing => existing.id === q.id)) {
            allQuestions.push(q);
        }
    });
    customQuestions.forEach(q => {
        if (!allQuestions.some(existing => existing.id === q.id)) {
            allQuestions.push(q);
        }
    });
}
// Update course stats dynamically based on actual questions and user progress
function updateCourseStats() {
    coursesData.forEach(course => {
        const catQs = getQuestionsByCategory(course.category);
        course.totalQuestions = catQs.length;
        course.completedQuestions = catQs.filter(q => userProgress[q.id]?.correct > 0).length; // Completed if correct at least once
        course.progress = course.totalQuestions > 0 ? Math.round((course.completedQuestions / course.totalQuestions) * 100) : 0;
        // completedModules could be derived if needed, but leaving as manual for now
    });
}
// Default fallback data
function getDefaultCourses() {
    return [
    {
        "id": 1,
        "title": "Anatomy Mastery",
        "icon": "fas fa-brain",
        "color": "#6366f1",
        "progress": 75,
        "description": "Build foundational anatomy knowledge through systematic learning",
        "modules": 10,
        "completedModules": 7,
        "totalQuestions": 150,
        "completedQuestions": 112,
        "category": "Anatomy Fundamentals",
        "duration": "8 weeks",
        "level": "Beginner to Intermediate",
        "objectives": [
            "Understand human body structure",
            "Master anatomical terminology",
            "Identify major organs and systems"
        ],
        "chapters": [
            "Chapter 1: Introduction to Anatomy",
            "Chapter 2: Basic Structures",
            "Chapter 3: Organ Systems",
            "Chapter 4: Clinical Applications",
            "Chapter 5: Review and Cases"
        ]
    },
    {
        "id": 2,
        "title": "Physiology Deep Dive",
        "icon": "fas fa-heartbeat",
        "color": "#06b6d4",
        "progress": 45,
        "description": "Understand body systems and functions in depth",
        "modules": 12,
        "completedModules": 5,
        "totalQuestions": 180,
        "completedQuestions": 81,
        "category": "Physiology",
        "duration": "10 weeks",
        "level": "Intermediate",
        "objectives": [
            "Learn cellular physiology",
            "Understand organ system functions",
            "Master homeostatic mechanisms"
        ],
        "chapters": [
            "Chapter 1: Cellular Physiology",
            "Chapter 2: Organ Functions",
            "Chapter 3: Homeostasis",
            "Chapter 4: Advanced Mechanisms",
            "Chapter 5: Integration and Review"
        ]
    },
    {
        "id": 3,
        "title": "Clinical Pathology",
        "icon": "fas fa-virus",
        "color": "#10b981",
        "progress": 30,
        "description": "Study diseases, diagnostics, and pathological processes",
        "modules": 8,
        "completedModules": 2,
        "totalQuestions": 120,
        "completedQuestions": 36,
        "category": "Pathology",
        "duration": "6 weeks",
        "level": "Intermediate to Advanced",
        "objectives": [
            "Understand disease mechanisms",
            "Learn diagnostic techniques",
            "Study common pathologies"
        ],
        "chapters": [
            "Chapter 1: Disease Mechanisms",
            "Chapter 2: Diagnostic Techniques",
            "Chapter 3: Common Pathologies",
            "Chapter 4: Advanced Cases",
            "Chapter 5: Treatment Approaches"
        ]
    }
];
}
function getDefaultCourseQuestions() {
    return {
    "Anatomy Fundamentals": [
        {
            "id": 101,
            "question": "Which bone is commonly known as the collarbone?",
            "options": ["Scapula", "Clavicle", "Humerus", "Sternum"],
            "answer": 1,
            "correctAnswer": "Clavicle",
            "explanation": "The clavicle, also known as the collarbone, is a long bone that serves as a strut between the shoulder blade and the sternum.",
            "whyNotOtherOptions": {
                "a": "Scapula is the shoulder blade",
                "c": "Humerus is the upper arm bone",
                "d": "Sternum is the breastbone"
            },
            "relatedQuestions": ["102"],
            "category": "Anatomy Fundamentals",
            "difficulty": "Easy"
        },
        {
            "id": 102,
            "question": "The mitral valve is located between which two chambers of the heart?",
            "options": [
                "Right atrium and right ventricle",
                "Left atrium and left ventricle",
                "Right ventricle and pulmonary artery",
                "Left ventricle and aorta"
            ],
            "answer": 1,
            "correctAnswer": "Left atrium and left ventricle",
            "explanation": "The mitral valve (bicuspid valve) prevents backflow of blood from the left ventricle to the left atrium.",
            "whyNotOtherOptions": {
                "a": "Tricuspid valve is between right atrium and ventricle",
                "c": "Pulmonary valve is between right ventricle and pulmonary artery",
                "d": "Aortic valve is between left ventricle and aorta"
            },
            "relatedQuestions": ["101"],
            "category": "Anatomy Fundamentals",
            "difficulty": "Medium"
        }
    ],
    "Physiology": [
        {
            "id": 201,
            "question": "Which hormone regulates calcium levels in the blood?",
            "options": ["Insulin", "Thyroxine", "Parathyroid hormone", "Cortisol"],
            "answer": 2,
            "correctAnswer": "Parathyroid hormone",
            "explanation": "Parathyroid hormone (PTH) increases blood calcium levels by stimulating bone resorption and calcium reabsorption in kidneys.",
            "whyNotOtherOptions": {
                "a": "Insulin regulates blood glucose",
                "b": "Thyroxine regulates metabolism",
                "d": "Cortisol is a stress hormone"
            },
            "relatedQuestions": [],
            "category": "Physiology",
            "difficulty": "Medium"
        }
    ]
};
}
function showCourses() {
    hideAllSections();
    pageTitle.textContent = 'My Courses';
   
    quizContainer.innerHTML = `
        <div style="padding: 24px;">
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 80px; color: var(--primary); margin-bottom: 20px; opacity: 0.8;">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h2 style="font-size: 32px; margin-bottom: 16px; color: var(--text-primary); background: linear-gradient(135deg, var(--primary), var(--primary-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;">Learning Pathways</h2>
                <p style="color: var(--text-secondary); margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; font-size: 16px; line-height: 1.6;">
                    Structured learning paths designed to build your medical knowledge systematically. Each course includes modules, quizzes, and progress tracking.
                </p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
                ${coursesData.map(course => createCourseCard(course)).join('')}
            </div>
        </div>
    `;
    quizContainer.classList.remove('hidden');
}
function createCourseCard(course) {
    return `
        <div class="course-card glass-effect" style="cursor: pointer; border-radius: 20px; padding: 24px; border-left: 4px solid ${course.color};" onclick="showCourseDetails(${course.id})">
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
                <button class="course-btn" onclick="event.stopPropagation(); startCourseQuiz(${course.id})" style="flex: 1; background: ${course.color}; color: white; border: none; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fas fa-play" style="margin-right: 6px;"></i>Quiz
                </button>
                <button class="course-btn" onclick="event.stopPropagation(); startCourseExam(${course.id})" style="flex: 1; background: transparent; color: ${course.color}; border: 1.5px solid ${course.color}; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fas fa-file-alt" style="margin-right: 6px;"></i>Exam
                </button>
                <button class="course-btn" onclick="event.stopPropagation(); startCourseLearn(${course.id})" style="flex: 1; background: transparent; color: var(--text-secondary); border: 1.5px solid var(--border); padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fas fa-brain" style="margin-right: 6px;"></i>Learn
                </button>
            </div>
        </div>
    `;
}
function startCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
   
    // Show course overview/modal
    showCourseDetails(courseId);
}
function startCourseQuiz(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
   
    // Get questions for this course category
    const courseQuizQuestions = getQuestionsByCategory(course.category);
   
    if (courseQuizQuestions.length === 0) {
        showNotification(`No questions available for ${course.title} yet.`, 'info');
        return;
    }
   
    // Set up quiz
    questions = courseQuizQuestions;
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length);
    isAnswerChecked = false;
    currentMode = 'quiz';
   
    // Update UI
    modeButtons.forEach(b => b.classList.remove('active'));
    modeButtons[1].classList.add('active');
    pageTitle.textContent = `Quiz - ${course.title}`;
   
    hideAllSections();
    quizContainer.classList.remove('hidden');
    renderQuizLayout();
   
    showNotification(`Starting ${course.title} quiz with ${questions.length} questions`, 'success');
}
function startCourseExam(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    // Get questions for this course
    const courseExamQuestions = getQuestionsByCategory(course.category);
   
    if (courseExamQuestions.length === 0) {
        showNotification(`No questions available for ${course.title} yet.`, 'info');
        return;
    }
    // Set up exam with all original features
    questions = courseExamQuestions;
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length);
    isAnswerChecked = false;
    examSubmitted = false;
    currentMode = 'exam';
    examCheckMode = 'all-at-once'; // Default exam mode
    // Exam timing (2 minutes per question)
    isCountdown = true;
    remainingTime = questions.length * 120;
    // Update UI
    modeButtons.forEach(b => b.classList.remove('active'));
    modeButtons[0].classList.add('active');
    pageTitle.textContent = `Exam - ${course.title}`;
    hideAllSections();
    quizContainer.classList.remove('hidden');
    startTimer();
    renderQuizLayout();
    showNotification(`Starting ${course.title} exam with ${questions.length} questions. Time: ${Math.floor(remainingTime/60)}min`, 'info');
}
function startCourseLearn(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    // Get questions for this course
    const courseLearnQuestions = getQuestionsByCategory(course.category);
   
    if (courseLearnQuestions.length === 0) {
        showNotification(`No questions available for ${course.title} yet.`, 'info');
        return;
    }
    // Set up learn mode
    questions = courseLearnQuestions;
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length);
    isAnswerChecked = false;
    currentMode = 'learn';
    // Update UI
    modeButtons.forEach(b => b.classList.remove('active'));
    modeButtons[2].classList.add('active');
    pageTitle.textContent = `Learn - ${course.title}`;
    hideAllSections();
    quizContainer.classList.remove('hidden');
    renderQuizLayout();
    showNotification(`Starting ${course.title} learning session with ${questions.length} questions`, 'info');
}
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
           
            <div style="margin-bottom: 24px;">
                <h4 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">Chapters</h4>
                <div style="max-height: 200px; overflow-y: auto; display: grid; gap: 8px;">
                    ${course.chapters.map(chapter => `
                        <div onclick="window.location.href='chapter4.html'" style="cursor: pointer; padding: 12px; background: var(--glass); border-radius: 12px; color: var(--text-secondary);">
                            ${chapter}
                        </div>
                    `).join('')}
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
