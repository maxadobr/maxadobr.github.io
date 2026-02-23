const toggleTheme = document.getElementById("toggleTheme");
const rootHtml = document.documentElement;
const sectionlink = document.querySelectorAll(".section-link");

function changeTheme() {
    const currentTheme = rootHtml.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    rootHtml.setAttribute("data-theme", newTheme);
    sessionStorage.setItem('theme', newTheme);
}

function initializeTheme() {
    const sessionTheme = sessionStorage.getItem('theme');

    if (sessionTheme) {
        rootHtml.setAttribute('data-theme', sessionTheme);
    } else {
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        rootHtml.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }
}

toggleTheme.addEventListener("click", changeTheme);

sectionlink.forEach(item => {
    item.addEventListener("click", () => {
        // smooth scroll handled by HTML, but we could add custom logic here if needed
    });
});

// Setup Intersection Observer for nav highlighting
const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -10% 0px',
    threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
};

const visibleSections = {};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        if (entry.isIntersecting) {
            visibleSections[id] = entry.intersectionRatio;
        } else {
            delete visibleSections[id];
        }
    });

    let maxRatio = 0;
    let activeId = null;

    for (const [id, ratio] of Object.entries(visibleSections)) {
        if (ratio > maxRatio) {
            maxRatio = ratio;
            activeId = id;
        }
    }

    if (activeId) {
        document.querySelectorAll('.bottom-nav__item').forEach(navItem => {
            navItem.classList.remove('active');
        });

        const activeNav = document.querySelector(`.bottom-nav__item[data-target="${activeId}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
    }
}, observerOptions);

function observeSections() {
    document.querySelectorAll('.section-block').forEach(section => {
        navObserver.observe(section);
    });
}

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
    const linkedinContact = portfolioData.contacts.find(c => c.lucide === 'linkedin');
    if (linkedinContact) {
        const handleLink = document.querySelector('.site-header__profile-handle');
        if (handleLink) {
            handleLink.href = linkedinContact.url;
            handleLink.target = "_blank";
        }
    }

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
    pcImg.className = "home-section__image pc";
    pcImg.src = "./src/img/home/paquimeter-pc.jpg";
    homeDesc.appendChild(pcImg);

    const phoneImg = document.createElement('img');
    phoneImg.className = "home-section__image phone";
    phoneImg.src = "./src/img/home/paquimeter-phone.jpg";
    homeDesc.appendChild(phoneImg);

    portfolioData.home.paragraphs.forEach(pText => {
        const p = document.createElement('p');
        p.className = 'section-block__text';
        p.textContent = pText;
        homeDesc.appendChild(p);
    });

    // Differential Section
    document.getElementById('differential-title').textContent = portfolioData.differential.title;
    const diffDesc = document.getElementById('differential-description');
    diffDesc.innerHTML = '';
    portfolioData.differential.paragraphs.forEach((pText, index) => {
        const p = document.createElement('p');
        p.className = 'section-block__text';
        p.textContent = pText;
        diffDesc.appendChild(p);

        if (index === 1) {
            const img = document.createElement('img');
            img.className = "differential-section__image";
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
        const safeId = category.id || `know-${Math.random().toString(36).substr(2, 5)}`;
        ul.id = safeId;
        ul.className = "list-section__group " + (category.id || '');
        const h3 = document.createElement('h3');
        h3.textContent = category.title;
        ul.appendChild(h3);

        // Add to sub-nav
        const subNavNode = document.getElementById('subnav-s3');
        if (subNavNode) {
            const subLink = document.createElement('a');
            subLink.href = `#${safeId}`;
            subLink.className = "sub-nav__link";
            subLink.textContent = category.title;
            subNavNode.appendChild(subLink);
        }

        category.items.forEach(item => {
            const li = document.createElement('li');
            li.className = "list-section__item";
            const img = document.createElement('img');
            img.src = item.icon;
            img.className = "list-section__icon";
            const span = document.createElement('span');
            span.className = "list-section__text";
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

    const subNavS4 = document.getElementById('subnav-s4');
    if (subNavS4) subNavS4.innerHTML = '';

    portfolioData.projects.forEach(project => {
        const article = document.createElement('article');
        article.className = "project";
        const safeId = `proj-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        article.id = safeId;

        const h3 = document.createElement('h3');
        h3.textContent = project.name;
        article.appendChild(h3);

        if (subNavS4) {
            const subLink = document.createElement('a');
            subLink.href = `#${safeId}`;
            subLink.className = "sub-nav__link";
            subLink.textContent = project.name;
            subNavS4.appendChild(subLink);
        }

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

        if ((project.features && project.features.length > 0) || (project.technologies && project.technologies.length > 0)) {
            const sectionDet = document.createElement('section');
            sectionDet.className = "details";

            if (project.technologies && project.technologies.length > 0) {
                const ulTech = document.createElement('ul');
                ulTech.className = "tech-list";
                project.technologies.forEach(tech => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>></strong> ${tech}`;
                    ulTech.appendChild(li);
                });
                sectionDet.appendChild(ulTech);
            }

            if (project.features && project.features.length > 0 && project.technologies && project.technologies.length > 0) {
                const divider = document.createElement('div');
                divider.className = "project__list-divider";
                sectionDet.appendChild(divider);
            }

            if (project.features && project.features.length > 0) {
                const ulFeat = document.createElement('ul');
                ulFeat.className = "feat-list";
                project.features.forEach(feat => {
                    const li = document.createElement('li');
                    li.textContent = feat;
                    ulFeat.appendChild(li);
                });
                sectionDet.appendChild(ulFeat);
            }

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

    const subNavS5 = document.getElementById('subnav-s5');
    if (subNavS5) subNavS5.innerHTML = '';

    portfolioData.education.forEach(edu => {
        const ul = document.createElement('ul');
        ul.className = "list-section__group";
        const safeId = `edu-${edu.course.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        ul.id = safeId;

        const h3 = document.createElement('h3');
        h3.textContent = edu.course;
        ul.appendChild(h3);

        if (subNavS5) {
            const subLink = document.createElement('a');
            subLink.href = `#${safeId}`;
            subLink.className = "sub-nav__link";
            subLink.textContent = edu.course;
            subNavS5.appendChild(subLink);
        }

        const liInst = document.createElement('li');
        liInst.className = "list-section__item";
        const iInst = document.createElement('i');
        iInst.setAttribute('data-lucide', 'building');
        iInst.className = "theme-icon list-section__icon";
        const spanInst = document.createElement('span');
        spanInst.className = "list-section__text";
        spanInst.textContent = edu.institution;
        liInst.appendChild(iInst);
        liInst.appendChild(spanInst);
        ul.appendChild(liInst);

        const liPeriod = document.createElement('li');
        liPeriod.className = "list-section__item";
        const iPeriod = document.createElement('i');
        iPeriod.setAttribute('data-lucide', 'calendar');
        iPeriod.className = "theme-icon list-section__icon";
        const spanPeriod = document.createElement('span');
        spanPeriod.className = "list-section__text";
        spanPeriod.textContent = edu.period;
        liPeriod.appendChild(iPeriod);
        liPeriod.appendChild(spanPeriod);
        ul.appendChild(liPeriod);

        eduContainer.appendChild(ul);
    });

    // Experience Section
    document.getElementById('experience-title').textContent = portfolioData.experienceSection.title;
    const expContainer = document.getElementById('experience-container');
    expContainer.innerHTML = '';

    const subNavExp = document.getElementById('subnav-s-exp');
    if (subNavExp) subNavExp.innerHTML = '';

    portfolioData.experience.forEach(exp => {
        const ul = document.createElement('ul');
        ul.className = "list-section__group";
        const safeId = `exp-${exp.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        ul.id = safeId;

        const h3 = document.createElement('h3');
        h3.textContent = exp.role + ' - ' + exp.company;
        ul.appendChild(h3);

        if (subNavExp) {
            const subLink = document.createElement('a');
            subLink.href = `#${safeId}`;
            subLink.className = "sub-nav__link";
            subLink.textContent = exp.company;
            subNavExp.appendChild(subLink);
        }

        const liType = document.createElement('li');
        liType.className = "list-section__item";
        const iType = document.createElement('i');
        iType.setAttribute('data-lucide', 'briefcase');
        iType.className = "theme-icon list-section__icon";
        const spanType = document.createElement('span');
        spanType.className = "list-section__text";
        spanType.textContent = exp.type;
        liType.appendChild(iType);
        liType.appendChild(spanType);
        ul.appendChild(liType);

        const liPeriod = document.createElement('li');
        liPeriod.className = "list-section__item";
        const iPeriod = document.createElement('i');
        iPeriod.setAttribute('data-lucide', 'calendar');
        iPeriod.className = "theme-icon list-section__icon";
        const spanPeriod = document.createElement('span');
        spanPeriod.className = "list-section__text";
        spanPeriod.textContent = exp.period;
        liPeriod.appendChild(iPeriod);
        liPeriod.appendChild(spanPeriod);
        ul.appendChild(liPeriod);

        if (exp.responsibilities) {
            exp.responsibilities.forEach(resp => {
                const liResp = document.createElement('li');
                liResp.className = "list-section__item";
                const iResp = document.createElement('i');
                iResp.setAttribute('data-lucide', 'arrow-right');
                iResp.className = "theme-icon list-section__icon";
                const spanResp = document.createElement('span');
                spanResp.className = "list-section__text";
                spanResp.textContent = resp;
                liResp.appendChild(iResp);
                liResp.appendChild(spanResp);
                ul.appendChild(liResp);
            });
        }

        expContainer.appendChild(ul);
    });

    // Contacts Section
    document.getElementById('contacts-title').textContent = portfolioData.contactsSection.title;
    const contContainer = document.getElementById('contacts-container');
    contContainer.innerHTML = '';
    portfolioData.contacts.forEach(contact => {
        const a = document.createElement('a');
        a.href = contact.url;
        a.className = "contact-card__link";

        const i = document.createElement('i');
        i.setAttribute('data-lucide', contact.lucide);
        i.className = "theme-icon contact-card__icon";

        const span = document.createElement('span');
        span.className = "contact-card__text";
        span.textContent = contact.text;

        a.appendChild(i);
        a.appendChild(span);
        contContainer.appendChild(a);
    });

    // Footer
    document.getElementById('footer-text').textContent = portfolioData.footer;

    // Refresh theme icons now that new ones are in the DOM
    lucide.createIcons();

    // Once content is rendered, initialize the observer
    observeSections();
}

loadData();