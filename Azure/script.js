// Fetch data from JSON file
async function loadSecurityControls() {
    try {
        const response = await fetch('data/controls.json');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error loading security controls:', error);
        return null;
    }
}

// Create cloud background with animated cloud divs
function createClouds() {
    const cloudBg = document.getElementById('cloudBackground');
    for (let i = 0; i < 20; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        // Random size between 50px and 250px wide
        const size = Math.random() * 200 + 50;
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`;
        
        // Random position within viewport
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.top = `${Math.random() * 100}%`;
        
        // Random opacity between 0.3 and 0.8
        cloud.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Random animation duration from 60 to 120 seconds
        const duration = Math.random() * 60 + 60;
        cloud.style.animationDuration = `${duration}s`;
        
        cloudBg.appendChild(cloud);
    }
}

// Generate tabs from categories data
function generateTabs(categories) {
    const tabsContainer = document.getElementById('tabsContainer');
    tabsContainer.innerHTML = '';
    
    categories.forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.setAttribute('data-tab', category.id);
        tab.textContent = category.name;
        tabsContainer.appendChild(tab);
    });
    
    // Set first tab active
    if (categories.length > 0) {
        tabsContainer.firstChild.classList.add('active');
    }
}

// Generate content for categories and controls
function generateContent(categories) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '';
    
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.id = category.id;
        
        const heading = document.createElement('h2');
        heading.textContent = category.name;
        categoryDiv.appendChild(heading);
        
        const subtitle = document.createElement('p');
        subtitle.textContent = category.description;
        categoryDiv.appendChild(subtitle);
        
        category.domains.forEach(domain => {
            const domainDiv = document.createElement('div');
            domainDiv.className = 'security-domain';
            
            const domainHeading = document.createElement('h3');
            
            // Add icon if available
            if (domain.icon) {
                const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                iconSvg.setAttribute('fill', 'none');
                iconSvg.setAttribute('viewBox', '0 0 24 24');
                iconSvg.setAttribute('stroke', 'currentColor');
                iconSvg.setAttribute('width', '24');
                iconSvg.setAttribute('height', '24');
                iconSvg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${domain.icon}" />`;
                domainHeading.appendChild(iconSvg);
            }
            
            domainHeading.appendChild(document.createTextNode(domain.name));
            domainDiv.appendChild(domainHeading);
            
            const controlsGrid = document.createElement('div');
            controlsGrid.className = 'controls-grid';
            
            domain.controls.forEach(control => {
                const controlCard = document.createElement('div');
                controlCard.className = 'control-card';
                
                const controlHeading = document.createElement('h4');
                controlHeading.textContent = control.name;
                controlCard.appendChild(controlHeading);
                
                const controlList = document.createElement('ul');
                control.items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    controlList.appendChild(li);
                });
                controlCard.appendChild(controlList);
                
                if (control.maturity && control.maturity.length > 0) {
                    const maturityDiv = document.createElement('div');
                    maturityDiv.className = 'maturity-level';
                    
                    control.maturity.forEach(level => {
                        const span = document.createElement('span');
                        span.className = `maturity-${level.toLowerCase()}`;
                        span.textContent = level;
                        maturityDiv.appendChild(span);
                    });
                    
                    controlCard.appendChild(maturityDiv);
                }
                
                controlsGrid.appendChild(controlCard);
            });
            
            domainDiv.appendChild(controlsGrid);
            categoryDiv.appendChild(domainDiv);
        });
        
        contentArea.appendChild(categoryDiv);
    });
    
    // Set first category active
    if (categories.length > 0) {
        document.getElementById(categories[0].id).classList.add('active');
    }
}

// Initialize tabs with click event to show active category
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const selectedId = tab.getAttribute('data-tab');
            document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
            const categoryEl = document.getElementById(selectedId);
            if (categoryEl) categoryEl.classList.add('active');
        });
    });
}

// Initialize search to filter control cards by text content
function initSearch() {
    document.getElementById('searchBox').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Show all if less than 3 characters
        if (searchTerm.length < 3) {
            document.querySelectorAll('.control-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }
        
        document.querySelectorAll('.control-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

// Main initialization on DOM loaded
async function init() {
    createClouds();
    
    const securityData = await loadSecurityControls();
    if (securityData && securityData.categories) {
        generateTabs(securityData.categories);
        generateContent(securityData.categories);
        initTabs();
        initSearch();
    } else {
        console.error('No categories data available');
    }
}

document.addEventListener('DOMContentLoaded', init);
