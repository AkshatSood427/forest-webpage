// ── IMAGE POOL ──
const totalImages = 86;
const imagePool = Array.from({ length: totalImages }, (_, i) => `images/gallery/${i + 1}.JPG`);

// shuffle array
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

shuffle(imagePool);

// ── SLIDESHOW ──
function createSlideshow(containerEl, startIndex) {
  let current = startIndex % imagePool.length;

  const img1 = document.createElement('img');
  const img2 = document.createElement('img');

  img1.classList.add('slide-img', 'active');
  img2.classList.add('slide-img');

  img1.src = imagePool[current];
  containerEl.appendChild(img1);
  containerEl.appendChild(img2);

  setInterval(() => {
    current = (current + 1) % imagePool.length;
    const next = img1.classList.contains('active') ? img2 : img1;
    const prev = img1.classList.contains('active') ? img1 : img2;
    next.src = imagePool[current];
    next.onload = () => {
      next.classList.add('active');
      prev.classList.remove('active');
    };
  }, 5000);
}

// initialise all slideshow panels
document.querySelectorAll('.slideshow-panel').forEach((panel, i) => {
  createSlideshow(panel, i * 7);
});

// ── TEAM DATA ──
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKibTTUSsWczy9nZ7RmtSXFHMb6h1AjQOgM8gTgs603dxCLNP7Azsd-AZ5pddK5H0TYegCeGqBNPxK/pub?gid=0&single=true&output=csv';

// scientist stays hardcoded
const scientistData = {
  name: 'Dr. Sanjay Kumar Uniyal',
  role: 'Chief Scientist CSIR-IHBT',
  photo: 'images/team/scientist.jpg',
  bio: 'I am a researcher in love with Himalaya, its natural resources, tradition, people and beauty.',
  background: 'Born and brought up in Dehradun, I did my post-graduation in Botany. Thereafter, I worked for my PhD on the High altitude Forests of Bhagirathi Valley, Uttarkashi, elucidating their structural and functional characteristics along with use patterns.',
  currentWork: 'Subsequently, I moved to CSIR-IHBT as a scientist; here, my work focuses on exploring biodiversity, sampling vegetation, recording traditional knowledge, and maintaining databases',
  funFact: 'My hobbies include wandering, travelling, and camping; music and food attract me.',
  fieldPhoto1: 'images/team/member1a.jpg',
  fieldPhoto2: 'images/team/member1b.jpg',
  fieldPhoto3: 'images/team/member1c.jpg'
}

let memberData = [scientistData];

function parseCSV(text) {
  const rows = [];
  let i = 0;
  const len = text.length;
  let row = [];
  let field = '';
  let inQuotes = false;

  while (i < len) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += char;
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (char === ',') {
      row.push(field.trim());
      field = '';
      i++;
      continue;
    }

    if (char === '\r') {
      i++;
      continue;
    }

    if (char === '\n') {
      row.push(field.trim());
      field = '';
      rows.push(row);
      row = [];
      i++;
      continue;
    }

    field += char;
    i++;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    rows.push(row);
  }

  const headers = rows[0];
  const dataRows = rows.slice(1).filter(r => r.length > 1 || r[0] !== '');

  return dataRows.map(values => {
    const obj = {};
    headers.forEach((h, idx) => obj[h] = values[idx] || '');
    return obj;
  });
}
function renderTeamGrid(members) {
  const grid = document.querySelector('.team-grid');
  grid.innerHTML = '';

  members.forEach(member => {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
      <div class="member-photo"><img src="images/team/${member.Photo}" alt="${member.Name}" /></div>
      <div class="member-info">
        <p class="member-name">${member.Name}</p>
        <p class="member-role">${member.Role}</p>
      </div>
    `;
    grid.appendChild(card);
  });

  // attach click handlers
  grid.querySelectorAll('.member-card').forEach((card, i) => {
    card.addEventListener('click', () => openMemberOverlay(i + 1)); // +1 because index 0 is scientist
  });
}

// fetch team data
fetch(`${SHEET_CSV_URL}&t=${Date.now()}`)
  .then(res => res.text())
  .then(csv => {
    const rows = parseCSV(csv);
    memberData = [scientistData, ...rows.map(r => ({
      name: r.Name,
      role: r.Role,
      bio: r.Bio,
      photo: `images/team/${r.Photo}`,
      background: r.Background,
      currentWork: r.CurrentWork,
      funFact: r.FunFact,
      fieldPhoto1: `images/team/${r.FieldPhoto1}`,
      fieldPhoto2: `images/team/${r.FieldPhoto2}`,
      fieldPhoto3: `images/team/${r.FieldPhoto3}`
    }))];
    renderTeamGrid(rows);
  })
  .catch(err => console.error('Failed to load team data:', err));

// ── MEMBER OVERLAY ──
const memberOverlay = document.getElementById('member-overlay');
const memberOverlayClose = document.getElementById('member-overlay-close');

document.querySelector('.incharge-card').addEventListener('click', () => {
  openMemberOverlay(0);
});

function openMemberOverlay(index) {
  const data = memberData[index];
  document.getElementById('overlay-member-photo').src = data.photo;
  document.getElementById('overlay-member-photo').alt = data.name;
  document.getElementById('overlay-member-name').textContent = data.name;
  document.getElementById('overlay-member-role').textContent = data.role;
  document.getElementById('overlay-member-bio').textContent = data.bio;
  document.getElementById('overlay-member-background').textContent = data.background;
  document.getElementById('overlay-member-current').textContent = data.currentWork;
  document.getElementById('overlay-member-funfact').textContent = data.funFact;
  document.getElementById('overlay-field-1').src = data.fieldPhoto1;
  document.getElementById('overlay-field-2').src = data.fieldPhoto2;
  document.getElementById('overlay-field-3').src = data.fieldPhoto3;
  memberOverlay.classList.add('active');
} 

memberOverlayClose.addEventListener('click', () => memberOverlay.classList.remove('active'));
memberOverlay.addEventListener('click', (e) => {
  if (e.target === memberOverlay) memberOverlay.classList.remove('active');
});

// ── NAVBAR ──
const cover = document.getElementById('cover');
const navbar = document.getElementById('navbar');
const coverBg = document.querySelector('.cover-bg');

// ── SMOOTH SNAP SCROLL ──
const sections = Array.from(document.querySelectorAll('#cover, #about, #research, #team, #publications, #contact'));
let isScrolling = false;

window.addEventListener('wheel', (e) => {
  if (e.target.closest('.team-grid') || e.target.closest('.member-overlay-card') || e.target.closest('.pub-pagination')) {
    return;
  }

  e.preventDefault();
  console.log('wheel fired, isScrolling:', isScrolling, 'sections found:', sections.length);

  if (isScrolling) return;
  if (memberOverlay.classList.contains('active')) return;

  let currentIndex = 0;
  let minDistance = Infinity;
  sections.forEach((s, i) => {
    const dist = Math.abs(s.getBoundingClientRect().top);
    if (dist < minDistance) {
      minDistance = dist;
      currentIndex = i;
    }
  });

  let target = currentIndex;
  if (e.deltaY > 0) target = Math.min(currentIndex + 1, sections.length - 1);
  if (e.deltaY < 0) target = Math.max(currentIndex - 1, 0);

  if (target !== currentIndex) {
    isScrolling = true;
    sections[target].scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      isScrolling = false;
      if (target === 0) {
        navbar.classList.remove('visible');
        coverBg.style.transform = `scale(1.05) translateY(0px)`;
      } else {
        navbar.classList.add('visible');
      }
    }, 900);
  }

}, { passive: false });

document.querySelector('.team-grid').addEventListener('wheel', (e) => {
  const grid = e.currentTarget;
  const atTop = grid.scrollTop === 0;
  const atBottom = grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 1;

  if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
    e.preventDefault(); // block page scroll at edges
  }
  e.stopPropagation(); // never let it bubble to the page snap-scroll
});

// ── PUBLICATIONS ──
const PUBLICATIONS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKibTTUSsWczy9nZ7RmtSXFHMb6h1AjQOgM8gTgs603dxCLNP7Azsd-AZ5pddK5H0TYegCeGqBNPxK/pub?gid=56861099&single=true&output=csv';
const PUBS_PER_PAGE = 5;
let publicationsData = [];
let currentPubPage = 1;

fetch(`${PUBLICATIONS_CSV_URL}&t=${Date.now()}`)
  .then(res => res.text())
  .then(csv => {
    const rows = parseCSV(csv);
    publicationsData = rows.sort((a, b) => b.Year - a.Year); // newest first
    renderPubPage(1);
  })
  .catch(err => console.error('Failed to load publications:', err));

function renderPubPage(page) {
  currentPubPage = page;
  const list = document.getElementById('pub-list');
  list.innerHTML = '';

  const start = (page - 1) * PUBS_PER_PAGE;
  const pageItems = publicationsData.slice(start, start + PUBS_PER_PAGE);

  pageItems.forEach(pub => {
    const item = document.createElement('div');
    item.className = 'pub-item';
    item.innerHTML = `
      <div class="pub-info">
        <p class="pub-title">${pub.Title}</p>
        <p class="pub-authors">${pub.Authors}</p>
        <p class="pub-meta">${pub.Journal} · ${pub.Year}</p>
      </div>
      <a href="${pub.Link}" class="pub-link" target="_blank" title="Read publication">↗</a>
    `;
    list.appendChild(item);
  });

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(publicationsData.length / PUBS_PER_PAGE);
  const nav = document.getElementById('pub-pagination');
  nav.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'pub-page-nav';
  prevBtn.textContent = '← Prev';
  prevBtn.disabled = currentPubPage === 1;
  prevBtn.addEventListener('click', () => renderPubPage(currentPubPage - 1));
  nav.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = 'pub-page-btn' + (i === currentPubPage ? ' active' : '');
    btn.textContent = i;
    btn.addEventListener('click', () => renderPubPage(i));
    nav.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'pub-page-nav';
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPubPage === totalPages;
  nextBtn.addEventListener('click', () => renderPubPage(currentPubPage + 1));
  nav.appendChild(nextBtn);
}