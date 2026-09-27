const DEFAULT_DATA = structuredClone(window.PORTFOLIO_DATA);
const STORAGE_KEY = 'aahil-portfolio-data-v1';
let data = loadData();
let activeFilter = 'All';

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(DEFAULT_DATA);
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function escapeHTML(value = '') {
  return value.replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  const projects = activeFilter === 'All'
    ? data.projects
    : data.projects.filter(p => p.tags.includes(activeFilter));

  grid.innerHTML = projects.map((p, index) => `
    <article class="project-card manga-panel">
      <div class="card-topline">
        <span class="panel-index">P-${String(index + 1).padStart(2, '0')}</span>
        <span class="year-stamp">${escapeHTML(p.year)}</span>
      </div>
      <h3>${escapeHTML(p.title)}</h3>
      <p>${escapeHTML(p.summary)}</p>
      <div class="tag-row">${p.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div>
      ${p.link ? `<a class="card-link" href="${escapeHTML(p.link)}" target="_blank" rel="noreferrer">View Project ↗</a>` : ''}
    </article>
  `).join('');
}

function renderFilters() {
  const wrap = document.getElementById('projectFilters');
  const tags = ['All', ...new Set(data.projects.flatMap(p => p.tags))];
  wrap.innerHTML = tags.map(tag => `<button class="filter-btn ${tag === activeFilter ? 'active' : ''}" data-filter="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`).join('');
  wrap.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    renderFilters();
    renderProjects();
  }));
}

function renderExperience() {
  const list = document.getElementById('experienceList');
  list.innerHTML = data.experience.map((e, index) => `
    <article class="timeline-item">
      <div class="timeline-marker">${String(index + 1).padStart(2, '0')}</div>
      <div class="timeline-card manga-panel">
        <div class="timeline-meta">
          <strong>${escapeHTML(e.organization)}</strong>
          <span>${escapeHTML(e.period)}</span>
        </div>
        <h3>${escapeHTML(e.role)}</h3>
        <p>${escapeHTML(e.description)}</p>
        <div class="tag-row">${e.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div>
      </div>
    </article>
  `).join('');
}

function renderSkills() {
  document.getElementById('skillsCloud').innerHTML = data.skills.map(s => `<span>${escapeHTML(s)}</span>`).join('');
}

function renderContacts() {
  document.getElementById('contactLinks').innerHTML = data.contacts.map(c => `<a href="${escapeHTML(c.url)}" target="_blank" rel="noreferrer">${escapeHTML(c.label)} ↗</a>`).join('');
}

function renderAll() {
  renderFilters();
  renderProjects();
  renderExperience();
  renderSkills();
  renderContacts();
}

renderAll();
document.getElementById('year').textContent = new Date().getFullYear();

const dialog = document.getElementById('editorDialog');
document.getElementById('editBtn').addEventListener('click', () => dialog.showModal());

document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.editor-tab').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === btn.dataset.tab));
}));

const status = msg => document.getElementById('editorStatus').textContent = msg;
const parseTags = value => value.split(',').map(v => v.trim()).filter(Boolean);

document.getElementById('addProjectBtn').addEventListener('click', () => {
  const title = document.getElementById('pTitle').value.trim();
  const year = document.getElementById('pYear').value.trim();
  const summary = document.getElementById('pSummary').value.trim();
  const tags = parseTags(document.getElementById('pTags').value);
  const link = document.getElementById('pLink').value.trim();
  if (!title || !summary) return status('Add at least a project title and summary.');
  data.projects.unshift({ title, year: year || new Date().getFullYear().toString(), summary, tags: tags.length ? tags : ['Project'], link });
  saveData();
  renderAll();
  status('Project added locally. Export the data file when you are ready to publish.');
  ['pTitle','pYear','pSummary','pTags','pLink'].forEach(id => document.getElementById(id).value = '');
});

document.getElementById('addExperienceBtn').addEventListener('click', () => {
  const role = document.getElementById('eRole').value.trim();
  const organization = document.getElementById('eOrg').value.trim();
  const period = document.getElementById('ePeriod').value.trim();
  const description = document.getElementById('eDescription').value.trim();
  const tags = parseTags(document.getElementById('eTags').value);
  if (!role || !organization || !description) return status('Add at least the role, organization, and description.');
  data.experience.unshift({ role, organization, period, description, tags });
  saveData();
  renderAll();
  status('Experience added locally. Export the data file when you are ready to publish.');
  ['eRole','eOrg','ePeriod','eDescription','eTags'].forEach(id => document.getElementById(id).value = '');
});

document.getElementById('downloadDataBtn').addEventListener('click', () => {
  const source = `window.PORTFOLIO_DATA = ${JSON.stringify(data, null, 2)};\n`;
  const blob = new Blob([source], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio-data.js';
  a.click();
  URL.revokeObjectURL(a.href);
  status('Updated portfolio-data.js downloaded. Replace the existing file before redeploying.');
});

document.getElementById('resetDataBtn').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  data = structuredClone(DEFAULT_DATA);
  activeFilter = 'All';
  renderAll();
  status('Local edits reset to the original data file.');
});
