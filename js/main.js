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
  bio: 'Dr. Sanjay Kumar Uniyal serves as the mentor and guiding force behind the FOREST Lab. Through his leadership, he fosters a collaborative and intellectually stimulating research environment, supporting scholars in developing independent research careers while encouraging interdisciplinary thinking, scientific excellence, and meaningful contributions to environmental sustainability.'
}

let memberData = [scientistData];

function parseCSV(text) {
  const rows = [];
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((h, idx) => row[h] = values[idx] || '');
    rows.push(row);
  }
  return rows;
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
fetch(SHEET_CSV_URL)
  .then(res => res.text())
  .then(csv => {
    const rows = parseCSV(csv);
    memberData = [scientistData, ...rows.map(r => ({
      name: r.Name,
      role: r.Role,
      bio: r.Bio,
      photo: `images/team/${r.Photo}`
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
const sections = Array.from(document.querySelectorAll('#cover, #about, #research, #team, #contact'));
let isScrolling = false;

window.addEventListener('wheel', (e) => {
  e.preventDefault();
  console.log('wheel fired, isScrolling:', isScrolling, 'sections found:', sections.length);


  if (isScrolling) return;
  if (memberOverlay.classList.contains('active')) return;

  // find current section by closest to top
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