const toggleTheme = document.getElementById("toggleTheme");
const rootHtml = document.documentElement;
const sectionlink = document.querySelectorAll(".section-link");
const themeIcons = document.querySelectorAll(".theme-icon");

function updateIcons(theme) {
    themeIcons.forEach(icon => {
        const newSrc = icon.getAttribute(`data-src-${theme}`);
        if (newSrc) {
            icon.setAttribute('src', newSrc);
        }
    });
}

function changeTheme() {
    const currentTheme = rootHtml.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    rootHtml.setAttribute("data-theme", newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcons(newTheme);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        rootHtml.setAttribute('data-theme', savedTheme);
    }

    const currentTheme = rootHtml.getAttribute("data-theme");
    updateIcons(currentTheme);
}

toggleTheme.addEventListener("click", changeTheme);

sectionlink.forEach(item => {
    item.addEventListener("click", () => {
        sectionlink.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});

initializeTheme();

// --- i18n Data Fetching & Rendering ---
let currentLang = 'pt-BR'; // Initialize with pt-BR as requested
let portfolioData = null;

async function loadData() {
    try {
        const response = await fetch('./src/data/portfolio.json');
        const data = await response.json();
        portfolioData = data[currentLang];
        renderContent();
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

function renderContent() {
    if (!portfolioData) return;
    
    // Header
    document.getElementById('header-name').textContent = portfolioData.header.name;
    document.getElementById('header-username').textContent = portfolioData.header.username;

    // Nav
    document.getElementById('nav-home').textContent = portfolioData.nav.home;
    document.getElementById('nav-differential').textContent = portfolioData.nav.differential;
    document.getElementById('nav-knowledge').textContent = portfolioData.nav.knowledge;
    document.getElementById('nav-projects').textContent = portfolioData.nav.projects;
    document.getElementById('nav-education').textContent = portfolioData.nav.education;
    document.getElementById('nav-contact').textContent = portfolioData.nav.contact;

    // Home Section
    document.getElementById('home-title').innerHTML = portfolioData.home.title;
    const homeDesc = document.getElementById('home-description');
    homeDesc.innerHTML = '';
    
    const pcImg = document.createElement('img');
    pcImg.className = "big-image paquimeter pc";
    pcImg.src = "./src/img/home/paquimeter-pc.jpg";
    homeDesc.appendChild(pcImg);
    
    const phoneImg = document.createElement('img');
    phoneImg.className = "big-image paquimeter phone";
    phoneImg.src = "./src/img/home/paquimeter-phone.jpg";
    homeDesc.appendChild(phoneImg);

    portfolioData.home.paragraphs.forEach(pText => {
        const p = document.createElement('p');
        p.textContent = pText;
        homeDesc.appendChild(p);
    });

    // Differential Section
    document.getElementById('differential-title').textContent = portfolioData.differential.title;
    const diffDesc = document.getElementById('differential-description');
    diffDesc.innerHTML = '';
    portfolioData.differential.paragraphs.forEach((pText, index) => {
        const p = document.createElement('p');
        p.textContent = pText;
        diffDesc.appendChild(p);
        
        if(index === 1) {
            const img = document.createElement('img');
            img.className = "big-image";
            img.src = "./src/img/differential/product-roadmap.jpg";
            diffDesc.appendChild(img);
        }
    });

    // Knowledge Section
    document.getElementById('knowledge-title').textContent = portfolioData.knowledge.title;
    const knowContainer = document.getElementById('knowledge-container');
    knowContainer.innerHTML = '';
    portfolioData.knowledge.categories.forEach(category => {
        const ul = document.createElement('ul');
        ul.className = category.id;
        const h3 = document.createElement('h3');
        h3.textContent = category.title;
        ul.appendChild(h3);
        
        category.items.forEach(item => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = item.icon;
            const span = document.createElement('span');
            span.textContent = item.text;
            li.appendChild(img);
            li.appendChild(span);
            ul.appendChild(li);
        });
        knowContainer.appendChild(ul);
    });

    // Projects Section
    document.getElementById('projects-title').textContent = portfolioData.projectsSection.title;
    document.getElementById('projects-description').textContent = portfolioData.projectsSection.description;
    const projContainer = document.getElementById('projects-container');
    projContainer.innerHTML = '';
    portfolioData.projects.forEach(project => {
        const article = document.createElement('article');
        article.className = "project";
        
        const h3 = document.createElement('h3');
        h3.textContent = project.name;
        article.appendChild(h3);
        
        const sectionPres = document.createElement('section');
        sectionPres.className = "presentation";
        
        const pcImg = document.createElement('img');
        pcImg.className = "pc-img pc" + (project.name === "Youtube Page Clone" ? " big-image" : "");
        pcImg.src = project.imagePc;
        sectionPres.appendChild(pcImg);
        
        const phoneImgMain = document.createElement('img');
        phoneImgMain.className = "pc-img phone";
        phoneImgMain.src = project.imagePhone;
        sectionPres.appendChild(phoneImgMain);
        
        const divDetails = document.createElement('div');
        const pDesc = document.createElement('p');
        pDesc.textContent = project.description;
        divDetails.appendChild(pDesc);
        
        if (project.features && project.features.length > 0) {
            const sectionDet = document.createElement('section');
            sectionDet.className = "details";
            const ulFeat = document.createElement('ul');
            project.features.forEach(feat => {
                const li = document.createElement('li');
                li.textContent = feat;
                ulFeat.appendChild(li);
            });
            sectionDet.appendChild(ulFeat);
            
            if (project.phoneMockupPc) {
                const phoneImgPc = document.createElement('img');
                phoneImgPc.className = "phone-img pc" + (project.name === "Youtube Page Clone" ? " big-image" : "");
                phoneImgPc.src = project.phoneMockupPc;
                sectionDet.appendChild(phoneImgPc);
            }
            
            if (project.phoneMockupPhone) {
                const phoneImgPhone = document.createElement('img');
                phoneImgPhone.className = "phone-img phone";
                phoneImgPhone.src = project.phoneMockupPhone;
                sectionDet.appendChild(phoneImgPhone);
            }
            divDetails.appendChild(sectionDet);
        }
        
        sectionPres.appendChild(divDetails);
        article.appendChild(sectionPres);
        
        const divButtons = document.createElement('div');
        divButtons.className = "project-buttons";
        
        if (project.demoUrl) {
            const divPreview = document.createElement('div');
            divPreview.className = "preview";
            const aPrev = document.createElement('a');
            aPrev.target = "_blank";
            aPrev.href = project.demoUrl;
            const btnPrev = document.createElement('button');
            btnPrev.className = "preview-button";
            btnPrev.textContent = "Prévia";
            aPrev.appendChild(btnPrev);
            divPreview.appendChild(aPrev);
            divButtons.appendChild(divPreview);
        }
        
        if (project.repository) {
            const divRepo = document.createElement('div');
            divRepo.className = "repository";
            const aRepo = document.createElement('a');
            aRepo.target = "_blank";
            aRepo.href = project.repository;
            const btnRepo = document.createElement('button');
            btnRepo.className = "repository-button";
            btnRepo.textContent = "Repositório";
            aRepo.appendChild(btnRepo);
            divRepo.appendChild(aRepo);
            divButtons.appendChild(divRepo);
        }
        
        article.appendChild(divButtons);
        projContainer.appendChild(article);
    });

    // Education Section
    document.getElementById('education-title').textContent = portfolioData.educationSection.title;
    const eduContainer = document.getElementById('education-container');
    eduContainer.innerHTML = '';
    portfolioData.education.forEach(edu => {
        const article = document.createElement('article');
        article.className = "course";
        
        const h3 = document.createElement('h3');
        h3.textContent = edu.course;
        article.appendChild(h3);
        
        const spanInst = document.createElement('span');
        const strInst = document.createElement('strong');
        strInst.textContent = edu.institution;
        spanInst.appendChild(strInst);
        article.appendChild(spanInst);
        
        const spanPeriod = document.createElement('span');
        spanPeriod.textContent = edu.period;
        article.appendChild(spanPeriod);
        
        eduContainer.appendChild(article);
    });

    // Experience Section
    document.getElementById('experience-title').textContent = portfolioData.experienceSection.title;
    const expContainer = document.getElementById('experience-container');
    expContainer.innerHTML = '';
    portfolioData.experience.forEach(exp => {
        const article = document.createElement('article');
        article.className = "course"; 
        
        const h3 = document.createElement('h3');
        h3.textContent = exp.role + ' - ' + exp.company;
        article.appendChild(h3);
        
        const spanType = document.createElement('span');
        const strType = document.createElement('strong');
        strType.textContent = exp.type;
        spanType.appendChild(strType);
        article.appendChild(spanType);
        
        const spanPeriod = document.createElement('span');
        spanPeriod.textContent = exp.period;
        article.appendChild(spanPeriod);
        
        expContainer.appendChild(article);
    });

    // Contacts Section
    document.getElementById('contacts-title').textContent = portfolioData.contactsSection.title;
    const contContainer = document.getElementById('contacts-container');
    contContainer.innerHTML = '';
    portfolioData.contacts.forEach(contact => {
        const a = document.createElement('a');
        a.href = contact.url;
        
        const img = document.createElement('img');
        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
        img.src = currentTheme === "dark" ? contact.iconDark : contact.iconLight;
        img.className = "theme-icon";
        img.setAttribute('data-src-light', contact.iconLight);
        img.setAttribute('data-src-dark', contact.iconDark);
        
        const span = document.createElement('span');
        span.textContent = contact.text;
        
        a.appendChild(img);
        a.appendChild(span);
        contContainer.appendChild(a);
    });

    // Footer
    document.getElementById('footer-text').textContent = portfolioData.footer;

    // Refresh theme icons now that new ones are in the DOM
    const theme = document.documentElement.getAttribute("data-theme");
    updateIcons(theme);
}

loadData();