// City Pass Finder - Vanilla JS Version
// No frameworks, no build step required

// Data
const PASSES = {
    citypass: {
        name: 'New York CityPASS',
        price: 138,
        attractions: ['Empire State Building', 'American Museum of Natural History', 'Met Museum', 'Statue of Liberty', '9/11 Memorial', 'Guggenheim'],
        savings: 'Save up to 40%',
        validDays: 9
    },
    sightseeing: {
        name: 'Sightseeing Pass',
        price: 129,
        attractions: ['Empire State Building', 'Top of the Rock', 'MoMA', 'Circle Line Cruise', 'Madame Tussauds'],
        savings: 'Save up to 50%',
        validDays: 30
    },
    explorer: {
        name: 'New York Explorer Pass',
        price: 94,
        attractions: ['Choose 3-10 attractions', 'Flexible options'],
        savings: 'Save up to 35%',
        validDays: 60
    }
};

const ATTRACTIONS = [
    { id: 'esb', name: 'Empire State Building', price: 44, category: 'views', icon: '🏙️' },
    { id: 'totr', name: 'Top of the Rock', price: 42, category: 'views', icon: '🌆' },
    { id: 'sol', name: 'Statue of Liberty', price: 24, category: 'landmarks', icon: '🗽' },
    { id: 'met', name: 'The Met Museum', price: 30, category: 'museums', icon: '🎨' },
    { id: 'moma', name: 'MoMA', price: 25, category: 'museums', icon: '🖼️' },
    { id: 'amnh', name: 'Natural History Museum', price: 28, category: 'museums', icon: '🦕' },
    { id: '911', name: '9/11 Memorial & Museum', price: 33, category: 'landmarks', icon: '🕊️' },
    { id: 'intrepid', name: 'Intrepid Museum', price: 36, category: 'museums', icon: '🚢' },
    { id: 'brooklyn', name: 'Brooklyn Bridge', price: 0, category: 'landmarks', icon: '🌉' },
    { id: 'central', name: 'Central Park', price: 0, category: 'landmarks', icon: '🌳' }
];

// State
const state = {
    mode: 'choose', // 'choose', 'quiz', 'detailed', 'results'
    quizStep: 0,
    selections: {
        days: null,
        interests: [],
        attractions: []
    }
};

// Helper functions
function calculateTotalPrice() {
    return state.selections.attractions.reduce((sum, id) => {
        const attr = ATTRACTIONS.find(a => a.id === id);
        return sum + (attr?.price || 0);
    }, 0);
}

function recommendPass() {
    const numAttractions = state.selections.attractions.length;
    const hasMuseums = state.selections.interests.includes('museums');
    const hasViews = state.selections.interests.includes('views');
    
    if (numAttractions <= 3) return 'explorer';
    if (state.selections.days && state.selections.days <= 3) return 'citypass';
    if (hasMuseums && hasViews) return 'sightseeing';
    return 'citypass';
}

function resetState() {
    state.mode = 'choose';
    state.quizStep = 0;
    state.selections = {
        days: null,
        interests: [],
        attractions: []
    };
}

// Render functions
function render() {
    const app = document.getElementById('app');
    
    if (state.mode === 'choose') {
        app.innerHTML = renderChooseMode();
    } else if (state.mode === 'quiz') {
        app.innerHTML = renderQuizMode();
    } else if (state.mode === 'detailed') {
        app.innerHTML = renderDetailedMode();
    } else if (state.mode === 'results') {
        app.innerHTML = renderResults();
    }
    
    attachEventListeners();
    setTimeout(() => animateIn(), 10);
}

function renderChooseMode() {
    return `
        <div class="container">
            <div class="content-wrapper fade-in">
                <div class="text-center mb-large">
                    <h1 class="title">Find Your Perfect NYC Pass</h1>
                    <p class="subtitle">Save up to 50% on top NYC attractions</p>
                </div>

                <div class="grid-2">
                    <button class="card hover-card" data-action="start-quiz">
                        <div class="icon-large">🎯</div>
                        <h2 class="card-title">Quick Quiz</h2>
                        <p class="card-desc">Answer 3 quick questions and we'll recommend the best pass</p>
                        <div class="card-cta">Takes 30 seconds →</div>
                    </button>

                    <button class="card hover-card" data-action="start-detailed">
                        <div class="icon-large">🎨</div>
                        <h2 class="card-title">Pick Attractions</h2>
                        <p class="card-desc">Select exactly what you want to see and we'll calculate savings</p>
                        <div class="card-cta">I know what I want →</div>
                    </button>
                </div>

                <div class="text-center mt-medium footer-text">
                    Free tool by Khonsu • No email required
                </div>
            </div>
        </div>
    `;
}

function renderQuizMode() {
    const progress = ((state.quizStep + 1) / 3) * 100;
    
    let stepContent = '';
    
    if (state.quizStep === 0) {
        stepContent = `
            <h2 class="question-title">How many days are you visiting NYC?</h2>
            <div class="grid-2">
                ${[
                    { days: 2, label: '1-2 days', subtitle: 'Quick trip' },
                    { days: 3, label: '3-4 days', subtitle: 'Long weekend' },
                    { days: 5, label: '5-7 days', subtitle: 'Full week' },
                    { days: 8, label: '8+ days', subtitle: 'Extended stay' }
                ].map(opt => `
                    <button class="option-card hover-card" data-action="select-days" data-days="${opt.days}">
                        <div class="option-label">${opt.label}</div>
                        <div class="option-subtitle">${opt.subtitle}</div>
                    </button>
                `).join('')}
            </div>
        `;
    } else if (state.quizStep === 1) {
        const interests = [
            { id: 'views', icon: '🏙️', label: 'Skyline Views', desc: 'Empire State, Top of the Rock' },
            { id: 'museums', icon: '🎨', label: 'Museums & Art', desc: 'The Met, MoMA, Natural History' },
            { id: 'landmarks', icon: '🗽', label: 'Iconic Landmarks', desc: 'Statue of Liberty, 9/11 Memorial' },
            { id: 'family', icon: '👨‍👩‍👧‍👦', label: 'Family Activities', desc: 'Kid-friendly attractions' }
        ];
        
        stepContent = `
            <h2 class="question-title">What interests you most?</h2>
            <p class="question-subtitle">Select all that apply</p>
            <div class="interest-list">
                ${interests.map(int => {
                    const selected = state.selections.interests.includes(int.id);
                    return `
                        <button class="interest-card hover-card ${selected ? 'selected' : ''}" 
                                data-action="toggle-interest" 
                                data-interest="${int.id}">
                            <div class="interest-icon">${int.icon}</div>
                            <div class="interest-content">
                                <div class="interest-label">${int.label}</div>
                                <div class="interest-desc">${int.desc}</div>
                            </div>
                            ${selected ? '<div class="checkmark">✓</div>' : ''}
                        </button>
                    `;
                }).join('')}
            </div>
            <button class="btn-primary" 
                    data-action="continue-quiz" 
                    ${state.selections.interests.length === 0 ? 'disabled' : ''}>
                Continue
            </button>
        `;
    } else if (state.quizStep === 2) {
        stepContent = `
            <h2 class="question-title">What's your budget style?</h2>
            <p class="question-subtitle">This helps us recommend the right pass</p>
            <div class="budget-list">
                ${[
                    { id: 'budget', icon: '💰', label: 'Budget-Conscious', desc: 'Maximum savings is my priority' },
                    { id: 'balanced', icon: '⚖️', label: 'Balanced', desc: 'Good value with flexibility' },
                    { id: 'premium', icon: '✨', label: 'Premium Experience', desc: 'See everything, skip lines' }
                ].map(opt => `
                    <button class="budget-card hover-card" data-action="finish-quiz" data-budget="${opt.id}">
                        <div class="budget-icon">${opt.icon}</div>
                        <div>
                            <div class="budget-label">${opt.label}</div>
                            <div class="budget-desc">${opt.desc}</div>
                        </div>
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    return `
        <div class="container">
            <div class="content-wrapper-narrow fade-in">
                <div class="progress-section">
                    <div class="progress-header">
                        <span>Question ${state.quizStep + 1} of 3</span>
                        <button class="link-button" data-action="reset">Start over</button>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="quiz-card">
                    ${stepContent}
                </div>
            </div>
        </div>
    `;
}

function renderDetailedMode() {
    const totalPrice = calculateTotalPrice();
    const selectedCount = state.selections.attractions.length;
    
    return `
        <div class="container container-full">
            <div class="content-wrapper-wide fade-in">
                <div class="text-center mb-medium">
                    <h1 class="page-title">Select Your Attractions</h1>
                    <p class="page-subtitle">Pick what you want to see and we'll show you the best pass</p>
                    <button class="link-button" data-action="reset">← Start over</button>
                </div>

                ${selectedCount > 0 ? `
                    <div class="savings-counter">
                        <div class="savings-count">${selectedCount} attractions selected</div>
                        <div class="savings-price">$${totalPrice}</div>
                        <div class="savings-label">Total if purchased separately</div>
                    </div>
                ` : ''}

                <div class="attractions-grid">
                    ${ATTRACTIONS.map(attr => {
                        const selected = state.selections.attractions.includes(attr.id);
                        return `
                            <button class="attraction-card hover-card ${selected ? 'selected' : ''}" 
                                    data-action="toggle-attraction" 
                                    data-id="${attr.id}">
                                <div class="attraction-icon">${attr.icon}</div>
                                <div class="attraction-name">${attr.name}</div>
                                <div class="attraction-price">$${attr.price || 'Free'}</div>
                                ${selected ? '<div class="selected-badge">✓ Selected</div>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>

                ${selectedCount > 0 ? `
                    <div class="text-center mt-medium">
                        <button class="btn-large" data-action="show-results">
                            Show Me the Best Pass →
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderResults() {
    const passKey = recommendPass();
    const pass = PASSES[passKey];
    const totalPrice = calculateTotalPrice();
    const savings = totalPrice - pass.price;
    
    return `
        <div class="container container-full">
            <div class="content-wrapper-wide fade-in">
                <div class="text-center mb-large">
                    <div class="icon-huge">🎉</div>
                    <h1 class="results-title">We Recommend</h1>
                </div>

                <div class="results-card">
                    <div class="results-header">
                        <div>
                            <h2 class="pass-name">${pass.name}</h2>
                            <div class="pass-savings">${pass.savings}</div>
                        </div>
                        <div class="results-price">
                            <div class="price-amount">$${pass.price}</div>
                            <div class="price-label">per person</div>
                        </div>
                    </div>

                    ${savings > 0 ? `
                        <div class="savings-highlight">
                            <div class="savings-content">
                                <div class="savings-icon">💰</div>
                                <div>
                                    <div class="savings-title">You'll save $${savings}</div>
                                    <div class="savings-subtitle">vs. buying tickets separately</div>
                                </div>
                            </div>
                            <div class="price-comparison">
                                <div class="price-old">$${totalPrice}</div>
                                <div class="price-new">$${pass.price}</div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="pass-inclusions">
                        <div class="inclusions-label">What's included:</div>
                        <div class="inclusions-grid">
                            ${pass.attractions.map(attr => `
                                <div class="inclusion-item">
                                    <span class="inclusion-check">✓</span>
                                    ${attr}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="pass-validity">
                        Valid for ${pass.validDays} days from first use
                    </div>
                </div>

                <div class="cta-card">
                    <h3 class="cta-title">Want a Custom Day-by-Day Plan?</h3>
                    <p class="cta-text">
                        Our NYC locals will design your perfect itinerary using this pass - 
                        maximizing your time and hitting all your must-sees.
                    </p>
                    <button class="btn-cta">
                        Get Your Custom NYC Guide →
                    </button>
                    <div class="cta-footer">
                        From $49 • Created by real NYC locals
                    </div>
                </div>

                <div class="text-center mt-medium">
                    <button class="link-button" data-action="reset">← Start over</button>
                </div>
            </div>
        </div>
    `;
}

// Event handling
function attachEventListeners() {
    document.querySelectorAll('[data-action]').forEach(el => {
        el.addEventListener('click', handleAction);
    });
}

function handleAction(e) {
    const action = e.currentTarget.dataset.action;
    
    switch(action) {
        case 'start-quiz':
            state.mode = 'quiz';
            state.quizStep = 0;
            render();
            break;
            
        case 'start-detailed':
            state.mode = 'detailed';
            render();
            break;
            
        case 'reset':
            resetState();
            render();
            break;
            
        case 'select-days':
            state.selections.days = parseInt(e.currentTarget.dataset.days);
            state.quizStep = 1;
            render();
            break;
            
        case 'toggle-interest':
            const interest = e.currentTarget.dataset.interest;
            const idx = state.selections.interests.indexOf(interest);
            if (idx > -1) {
                state.selections.interests.splice(idx, 1);
            } else {
                state.selections.interests.push(interest);
            }
            render();
            break;
            
        case 'continue-quiz':
            state.quizStep = 2;
            render();
            break;
            
        case 'finish-quiz':
            // Auto-select attractions based on interests
            const autoAttractions = ATTRACTIONS
                .filter(a => state.selections.interests.includes(a.category))
                .slice(0, 5)
                .map(a => a.id);
            state.selections.attractions = autoAttractions;
            state.mode = 'results';
            render();
            break;
            
        case 'toggle-attraction':
            const attrId = e.currentTarget.dataset.id;
            const attrIdx = state.selections.attractions.indexOf(attrId);
            if (attrIdx > -1) {
                state.selections.attractions.splice(attrIdx, 1);
            } else {
                state.selections.attractions.push(attrId);
            }
            render();
            break;
            
        case 'show-results':
            state.mode = 'results';
            render();
            break;
    }
}

// Animation helper
function animateIn() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    render();
});
