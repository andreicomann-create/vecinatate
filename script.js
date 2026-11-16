/* =========================================================
   Vecinătate — logică
   Datele sunt păstrate local, în browser (localStorage).
   ========================================================= */

"use strict";

/* ---------- Constante ---------- */
const ORA = 3600e3;
const ZI = 24 * ORA;
const PUNCTE_PE_INSCRIERE = 10;

const ICON = {
  varstnici: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  scoli: '<path d="M3 6.5 12 3l9 3.5-9 3.5z"/><path d="M7 8.5V14c0 1.5 2.2 3 5 3s5-1.5 5-3V8.5"/><path d="M21 6.5V12"/>',
  mediu: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19 13 11"/>',
  animale: '<circle cx="7" cy="9" r="1.8"/><circle cx="11" cy="5.8" r="1.8"/><circle cx="15.5" cy="6.5" r="1.8"/><circle cx="18" cy="10.5" r="1.8"/><path d="M8.5 15.5c0-2.2 1.8-4 4-4s4.5 2 4.5 4.2c0 1.8-1.4 2.8-3 2.8-1 0-1.5-.5-2.3-.5s-1.2.5-2.2.5c-1.6 0-1-.8-1-3z"/>',
  altele: '<path d="M12 3.5 14.4 9l5.6.5-4.3 3.7 1.3 5.6L12 15.9l-5 2.9 1.3-5.6L4 9.5 9.6 9z"/>',
  loc: '<path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  timp: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  salveaza: '<path d="M6 4h12v16l-6-4-6 4z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  stea: '<path d="M12 3.5 14.4 9l5.6.5-4.3 3.7 1.3 5.6L12 15.9l-5 2.9 1.3-5.6L4 9.5 9.6 9z"/>',
  pas: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  steag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
};

const svg = (nume, clasa = "") => `<svg viewBox="0 0 24 24" class="${clasa}" aria-hidden="true">${ICON[nume]}</svg>`;

const CATEGORII = {
  varstnici: "Vârstnici",
  scoli: "Educație",
  mediu: "Mediu",
  animale: "Animale",
  altele: "Altele",
};

const NIVELURI = [
  { prag: 0, nume: "Începător" },
  { prag: 10, nume: "Contributor" },
  { prag: 30, nume: "Vecin de încredere" },
  { prag: 60, nume: "Voluntar dedicat" },
  { prag: 100, nume: "Pilon al comunității" },
];

const NUME_VECINI = [
  "Andreea Marin", "Radu Popa", "Ioana Constantin", "Dan Stoica", "Maria Ene", "Vlad Dumitru",
  "Ana Georgescu", "Mihai Radu", "Cristina Ilie", "Alex Barbu", "Elena Tudor", "Sorin Lazăr",
  "Bianca Neagu", "Tudor Matei", "Irina Dobre", "Paul Nistor", "Raluca Preda", "George Toma",
];

const VECINI_CLASAMENT = [
  { nume: "Andreea Marin", cartier: "Titan", puncte: 140 },
  { nume: "Radu Popa", cartier: "Militari", puncte: 110 },
  { nume: "Ioana Constantin", cartier: "Drumul Taberei", puncte: 90 },
  { nume: "Dan Stoica", cartier: "Berceni", puncte: 70 },
  { nume: "Maria Ene", cartier: "Colentina", puncte: 50 },
  { nume: "Vlad Dumitru", cartier: "Tineretului", puncte: 30 },
];

/* ---------- Date inițiale ---------- */
const zi = (n) => new Date(Date.now() + n * ZI).toISOString().slice(0, 10);

const cereriInitiale = [
  { id: 1, titlu: "Cumpărături pentru dna Elena", descriere: "Doamna Elena, 82 de ani, locuiește singură la etajul 4 fără lift. Are nevoie de ajutor cu cumpărăturile săptămânale de la piața din apropiere. Lista e scurtă, iar banii îi oferă dânsa.", categorie: "varstnici", cartier: "Titan", ore: 1, data: zi(1), necesari: 1, inscrisi: 0, urgent: true, organizator: "Elena Popescu", competente: ["Răbdare", "Disponibilitate dimineața"], creat: Date.now() - ORA },
  { id: 2, titlu: "Vopsirea gardului Școlii nr. 12", descriere: "Gardul școlii are aproape 40 de metri și nu a mai fost vopsit de zece ani. Vopseaua, pensulele și mănușile sunt asigurate de comitetul de părinți. Avem nevoie doar de oameni și de bună dispoziție.", categorie: "scoli", cartier: "Militari", ore: 2.5, data: zi(5), necesari: 8, inscrisi: 3, urgent: false, organizator: "Comitetul de părinți Școala 12", competente: ["Haine de lucru"], creat: Date.now() - ZI },
  { id: 3, titlu: "Ecologizare în Parcul Tineretului", descriere: "Strângem deșeurile de pe malul lacului și din zona de picnic. Sacii, mănușile și apa sunt oferite de organizatori. Întâlnirea are loc la intrarea dinspre metrou.", categorie: "mediu", cartier: "Tineretului", ore: 2.5, data: zi(6), necesari: 15, inscrisi: 9, urgent: false, organizator: "Asociația Verde Urban", competente: [], creat: Date.now() - 2 * ZI },
  { id: 4, titlu: "Plimbări pentru câinii din adăpost", descriere: "Adăpostul îngrijește 40 de câini cu doar doi angajați. Căutăm voluntari care să-i scoată la plimbare în weekend. Prima dată primești o scurtă instruire.", categorie: "animale", cartier: "Berceni", ore: 1, data: zi(2), necesari: 5, inscrisi: 1, urgent: true, organizator: "Adăpostul Speranța", competente: ["Fără teamă de câini"], creat: Date.now() - 5 * ORA },
  { id: 5, titlu: "Pregătire la matematică", descriere: "Un elev de clasa a VIII-a se pregătește pentru Evaluarea Națională. Ar avea nevoie de două ședințe pe săptămână, la biblioteca de cartier sau online.", categorie: "scoli", cartier: "Drumul Taberei", ore: 1, data: zi(3), necesari: 1, inscrisi: 0, urgent: false, organizator: "Familia Ionescu", competente: ["Matematică gimnaziu"], creat: Date.now() - 20 * 60e3 },
  { id: 6, titlu: "Ajutor la mutare", descriere: "Domnul Ion se mută într-un apartament la etajul 1, la două străzi distanță. Are nevoie de ajutor la transportul a câtorva piese de mobilier și cutii.", categorie: "varstnici", cartier: "Colentina", ore: 2.5, data: zi(4), necesari: 3, inscrisi: 2, urgent: false, organizator: "Ion Vasilescu", competente: ["Forță fizică", "Permis auto (opțional)"], creat: Date.now() - 7 * ORA },
  { id: 7, titlu: "Strângere de haine pentru iarnă", descriere: "Sortăm hainele donate de vecini și le împachetăm pentru familiile din centrul de zi. Activitatea are loc în sala asociației.", categorie: "altele", cartier: "Pantelimon", ore: 2.5, data: zi(7), necesari: 6, inscrisi: 6, urgent: false, organizator: "Centrul de zi Lumina", competente: [], creat: Date.now() - 3 * ZI },
  { id: 8, titlu: "Plantare de arbori pe Bd. Iuliu Maniu", descriere: "Primăria a aprobat plantarea a 50 de tei pe zona verde dintre blocuri. Uneltele și puieții sunt asigurați. Avem nevoie de mâini harnice.", categorie: "mediu", cartier: "Militari", ore: 6, data: zi(9), necesari: 20, inscrisi: 7, urgent: false, organizator: "Asociația Verde Urban", competente: ["Încălțăminte comodă"], creat: Date.now() - 10 * ORA },
];

/* ---------- Stocare ---------- */
const PREFIX = "vecinatate_v2_";

function incarca(cheie, implicit) {
  try {
    const valoare = localStorage.getItem(PREFIX + cheie);
    return valoare ? JSON.parse(valoare) : implicit;
  } catch {
    return implicit;
  }
}

function salveaza(cheie, valoare) {
  try {
    localStorage.setItem(PREFIX + cheie, JSON.stringify(valoare));
  } catch {
    /* stocarea nu e disponibilă; aplicația merge în continuare în memorie */
  }
}

const stare = {
  cereri: incarca("cereri", cereriInitiale),
  puncte: incarca("puncte", 0),
  inscrieri: incarca("inscrieri", []),
  salvate: incarca("salvate", []),
  publicate: incarca("publicate", 0),
  istoric: incarca("istoric", []),
  tema: incarca("tema", null),
  filtre: { categorie: "toate", termen: "", sortare: "recente", urgente: false, salvate: false },
};

function salveazaTot() {
  salveaza("cereri", stare.cereri);
  salveaza("puncte", stare.puncte);
  salveaza("inscrieri", stare.inscrieri);
  salveaza("salvate", stare.salvate);
  salveaza("publicate", stare.publicate);
  salveaza("istoric", stare.istoric);
}

/* ---------- Utilitare ---------- */
const $ = (id) => document.getElementById(id);

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : String(text);
  return div.innerHTML;
}

function initiale(nume) {
  return nume.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

function nuanta(text) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

function avatar(nume, clasa = "") {
  return `<span class="avatar ${clasa}" style="--h:${nuanta(nume)}" title="${escapeHtml(nume)}">${escapeHtml(initiale(nume))}</span>`;
}

function timpRelativ(ts) {
  const minute = Math.floor((Date.now() - ts) / 60000);
  if (minute < 1) return "chiar acum";
  if (minute < 60) return `acum ${minute} min`;
  const ore = Math.floor(minute / 60);
  if (ore < 24) return `acum ${ore} ${ore === 1 ? "oră" : "ore"}`;
  const zile = Math.floor(ore / 24);
  return zile === 1 ? "ieri" : `acum ${zile} zile`;
}

function formatData(iso, lung = false) {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ro-RO", lung
    ? { weekday: "long", day: "numeric", month: "long" }
    : { weekday: "short", day: "numeric", month: "short" });
}

function formatDurata(ore) {
  if (ore < 1) return "30 min";
  if (ore === 1) return "1 oră";
  if (ore <= 3) return "2–3 ore";
  return "O zi";
}

function formatOre(ore) {
  return Number.isInteger(ore) ? String(ore) : ore.toFixed(1).replace(".", ",");
}

function nivelCurent(puncte) {
  let index = 0;
  NIVELURI.forEach((n, i) => { if (puncte >= n.prag) index = i; });
  return { ...NIVELURI[index], urmator: NIVELURI[index + 1] || null };
}

function voluntariPentru(c) {
  // nume deterministe pentru voluntarii „altora”, plus „Tu” dacă ești înscris
  const eu = stare.inscrieri.includes(c.id);
  const altii = c.inscrisi - (eu ? 1 : 0);
  const nume = [];
  for (let i = 0; i < altii; i++) nume.push(NUME_VECINI[(c.id * 7 + i * 5) % NUME_VECINI.length]);
  if (eu) nume.unshift("Tu");
  return nume;
}

function notifica(mesaj) {
  const toast = $("toast");
  toast.textContent = mesaj;
  toast.classList.add("vizibil");
  clearTimeout(notifica.timer);
  notifica.timer = setTimeout(() => toast.classList.remove("vizibil"), 3200);
}

function adaugaIstoric(text, categorie) {
  stare.istoric.unshift({ text, categorie, ts: Date.now() });
  stare.istoric = stare.istoric.slice(0, 30);
}

/* ---------- Insigne ---------- */
function categoriiInscrise() {
  return stare.inscrieri
    .map((id) => stare.cereri.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => c.categorie);
}

const INSIGNE = [
  { nume: "Primul pas", cat: "altele", icon: "pas", test: () => stare.inscrieri.length >= 1 },
  { nume: "Sprijin pentru seniori", cat: "varstnici", icon: "varstnici", test: () => categoriiInscrise().includes("varstnici") },
  { nume: "Mentor", cat: "scoli", icon: "scoli", test: () => categoriiInscrise().includes("scoli") },
  { nume: "Prieten al naturii", cat: "mediu", icon: "mediu", test: () => categoriiInscrise().includes("mediu") },
  { nume: "Prieten blănos", cat: "animale", icon: "animale", test: () => categoriiInscrise().includes("animale") },
  { nume: "Organizator", cat: "altele", icon: "steag", test: () => stare.publicate >= 1 },
  { nume: "Constant", cat: "mediu", icon: "stea", test: () => stare.inscrieri.length >= 5 },
  { nume: "Explorator", cat: "scoli", icon: "loc", test: () => new Set(categoriiInscrise()).size >= 4 },
];

const insigneDeblocate = () => INSIGNE.filter((i) => i.test()).map((i) => i.nume);

/* ---------- Filtrare și sortare ---------- */
function cereriVizibile() {
  const { categorie, termen, sortare, urgente, salvate } = stare.filtre;
  const t = termen.trim().toLowerCase();

  const lista = stare.cereri.filter((c) => {
    if (categorie !== "toate" && c.categorie !== categorie) return false;
    if (urgente && !(c.urgent && c.inscrisi < c.necesari)) return false;
    if (salvate && !stare.salvate.includes(c.id)) return false;
    if (!t) return true;
    return [c.titlu, c.cartier, c.organizator, ...(c.competente || [])].some((x) => x.toLowerCase().includes(t));
  });

  const complet = (c) => (c.inscrisi >= c.necesari ? 1 : 0);
  const comparatori = {
    recente: (a, b) => b.creat - a.creat,
    urgente: (a, b) => (b.urgent - a.urgent) || (b.creat - a.creat),
    aproape: (a, b) => (b.inscrisi / b.necesari) - (a.inscrisi / a.necesari),
    data: (a, b) => a.data.localeCompare(b.data),
  };

  return lista.sort((a, b) => complet(a) - complet(b) || comparatori[sortare](a, b));
}

/* ---------- Randare: filtre ---------- */
function randeazaFiltre() {
  const numar = (cat) => stare.cereri.filter((c) => (cat === "toate" || c.categorie === cat) && c.inscrisi < c.necesari).length;
  const optiuni = [["toate", "Toate"], ...Object.entries(CATEGORII)];

  $("filtre").innerHTML = optiuni.map(([cheie, nume]) => `
    <button type="button" class="filtru ${cheie !== "toate" ? "cat-" + cheie : ""} ${stare.filtre.categorie === cheie ? "activ" : ""}" data-cat="${cheie}">
      ${cheie !== "toate" ? '<span class="filtru-punct" aria-hidden="true"></span>' : ""}
      ${nume}
      <span class="filtru-numar">${numar(cheie)}</span>
    </button>`).join("");
}

/* ---------- Randare: carduri ---------- */
function cardHtml(c, index) {
  const complet = c.inscrisi >= c.necesari;
  const inscris = stare.inscrieri.includes(c.id);
  const salvat = stare.salvate.includes(c.id);
  const procent = Math.min(100, (c.inscrisi / c.necesari) * 100);
  const voluntari = voluntariPentru(c);
  const libere = Math.max(0, c.necesari - c.inscrisi);

  const avatareHtml = voluntari.slice(0, 4).map((n) => avatar(n, n === "Tu" ? "avatar-tu" : "")).join("")
    + (voluntari.length > 4 ? `<span class="avatar avatar-gol">+${voluntari.length - 4}</span>` : "")
    + (voluntari.length === 0 ? '<span class="avatar avatar-gol">?</span>' : "");

  let buton;
  if (inscris) buton = `<button type="button" class="btn stare-inscris" data-act="detalii">✓ Ești înscris</button>`;
  else if (complet) buton = `<button type="button" class="btn stare-complet" disabled>Echipă completă</button>`;
  else buton = `<button type="button" class="btn btn-secundar btn-ofer" data-act="inscrie">Mă ofer să ajut</button>`;

  return `
    <article class="card cat-${c.categorie} ${complet ? "completa" : ""}" data-id="${c.id}" style="animation-delay:${Math.min(index, 8) * 45}ms">
      <div class="card-banda">
        ${c.urgent && !complet ? '<span class="insigna-urgent">Urgent</span>' : ""}
        <span class="card-icon">${svg(c.categorie)}</span>
        <button type="button" class="btn-salveaza ${salvat ? "activ" : ""}" data-act="salveaza" aria-pressed="${salvat}" aria-label="${salvat ? "Elimină din salvate" : "Salvează cererea"}">${svg("salveaza")}</button>
      </div>
      <div class="card-corp">
        <div class="card-sus">
          <span class="categorie">${CATEGORII[c.categorie]}</span>
          <span class="timp">${timpRelativ(c.creat)}</span>
        </div>
        <h3 class="card-titlu" data-act="detalii" tabindex="0">${escapeHtml(c.titlu)}</h3>
        <p class="card-descriere">${escapeHtml(c.descriere)}</p>
        <div class="meta">
          <span>${svg("loc")}${escapeHtml(c.cartier)}</span>
          <span>${svg("calendar")}${formatData(c.data)}</span>
          <span>${svg("timp")}${formatDurata(c.ore)}</span>
        </div>
        <div class="card-voluntari">
          <div class="avatare-stiva">${avatareHtml}</div>
          <div class="progres-zona">
            <div class="progres-text">
              <span>${complet ? "Echipă completă" : `${libere} ${libere === 1 ? "loc liber" : "locuri libere"}`}</span>
              <span><strong>${c.inscrisi}</strong>/${c.necesari}</span>
            </div>
            <div class="progres" role="progressbar" aria-valuemin="0" aria-valuemax="${c.necesari}" aria-valuenow="${c.inscrisi}"><div style="width:${procent}%"></div></div>
          </div>
        </div>
        <div class="card-actiuni">
          <button type="button" class="btn btn-text" data-act="detalii">Detalii</button>
          ${buton}
        </div>
      </div>
    </article>`;
}

function randeazaLista() {
  const vizibile = cereriVizibile();
  $("lista").innerHTML = vizibile.map(cardHtml).join("");
  $("gol").classList.toggle("hidden", vizibile.length > 0);

  const total = stare.cereri.length;
  $("rezultate").textContent = vizibile.length === total
    ? `Se afișează toate cele ${total} cereri`
    : `Se afișează ${vizibile.length} din ${total} cereri`;
}

/* ---------- Randare: cifre ---------- */
function calculeazaCifre() {
  const active = stare.cereri.filter((c) => c.inscrisi < c.necesari).length;
  const voluntari = stare.cereri.reduce((s, c) => s + c.inscrisi, 0);
  const ore = Math.round(stare.cereri.reduce((s, c) => s + c.inscrisi * c.ore, 0));
  const cartiere = new Set(stare.cereri.map((c) => c.cartier.trim().toLowerCase())).size;
  return { active, voluntari, ore, cartiere };
}

let cifreAnimate = false;

function animeazaNumar(el, tinta) {
  const start = performance.now();
  const durata = 1200;
  const pas = (acum) => {
    const p = Math.min(1, (acum - start) / durata);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(tinta * ease).toLocaleString("ro-RO");
    if (p < 1) requestAnimationFrame(pas);
  };
  requestAnimationFrame(pas);
}

function randeazaCifre() {
  const c = calculeazaCifre();
  const valori = { "stat-total": c.active, "stat-voluntari": c.voluntari, "stat-ore": c.ore, "stat-cartiere": c.cartiere };
  Object.entries(valori).forEach(([id, v]) => {
    const el = $(id);
    el.dataset.tinta = v;
    if (cifreAnimate) el.textContent = v.toLocaleString("ro-RO");
  });
  $("erou-activ").textContent = c.active;

  const n = nivelCurent(stare.puncte);
  $("puncte").textContent = stare.puncte;
  $("insigna").textContent = n.nume;
}

function pornesteAnimatieCifre() {
  const banda = document.querySelector(".banda-cifre");
  const ruleaza = () => {
    if (cifreAnimate) return;
    cifreAnimate = true;
    document.querySelectorAll("[data-numar]").forEach((el) => animeazaNumar(el, Number(el.dataset.tinta || 0)));
  };
  if (!("IntersectionObserver" in window)) return ruleaza();
  const obs = new IntersectionObserver((intrari) => {
    if (intrari.some((i) => i.isIntersecting)) { ruleaza(); obs.disconnect(); }
  }, { threshold: 0.4 });
  obs.observe(banda);
}

/* ---------- Randare: clasament ---------- */
function randeazaClasament() {
  const toti = [...VECINI_CLASAMENT, { nume: "Tu", cartier: "Cartierul tău", puncte: stare.puncte, eu: true }]
    .sort((a, b) => b.puncte - a.puncte || (a.eu ? 1 : -1));

  $("clasament").innerHTML = toti.slice(0, 7).map((v, i) => `
    <li class="${v.eu ? "eu" : ""}">
      <span class="loc">${i + 1}</span>
      ${avatar(v.nume, v.eu ? "avatar-tu" : "")}
      <span class="clasament-nume"><strong>${escapeHtml(v.eu ? "Tu" : v.nume)}</strong><span>${escapeHtml(v.cartier)}</span></span>
      <span class="clasament-puncte">${v.puncte} <span>pct.</span></span>
    </li>`).join("");
}

/* ---------- Randare: profil ---------- */
function randeazaProfil() {
  const n = nivelCurent(stare.puncte);
  const deblocate = insigneDeblocate();
  const oreOferite = stare.inscrieri
    .map((id) => stare.cereri.find((c) => c.id === id))
    .filter(Boolean)
    .reduce((s, c) => s + c.ore, 0);

  let progresNivel = 100;
  let textNivel = "Ai atins nivelul maxim. Mulțumim!";
  if (n.urmator) {
    progresNivel = ((stare.puncte - n.prag) / (n.urmator.prag - n.prag)) * 100;
    textNivel = `${n.urmator.prag - stare.puncte} puncte până la „${n.urmator.nume}”`;
  }

  $("profil-continut").innerHTML = `
    <div class="profil-card">
      <span class="avatar avatar-mare avatar-tu">Tu</span>
      <div>
        <h3>${n.nume}</h3>
        <p>${stare.puncte} puncte · ${deblocate.length} din ${INSIGNE.length} insigne</p>
      </div>
    </div>

    <div class="nivel">
      <div class="progres-text"><span>${textNivel}</span><span><strong>${Math.round(progresNivel)}%</strong></span></div>
      <div class="progres"><div style="width:${progresNivel}%"></div></div>
    </div>

    <div class="mini-cifre">
      <div class="mini-cifra"><strong>${stare.inscrieri.length}</strong><span>înscrieri</span></div>
      <div class="mini-cifra"><strong>${formatOre(oreOferite)}</strong><span>ore oferite</span></div>
      <div class="mini-cifra"><strong>${stare.publicate}</strong><span>cereri publicate</span></div>
    </div>

    <h4 class="detalii-subtitlu">Insigne</h4>
    <div class="insigne">
      ${INSIGNE.map((i) => `
        <div class="insigna cat-${i.cat} ${deblocate.includes(i.nume) ? "" : "blocata"}" title="${deblocate.includes(i.nume) ? "Deblocată" : "Încă blocată"}">
          <span class="insigna-icon">${svg(i.icon)}</span>
          ${i.nume}
        </div>`).join("")}
    </div>

    <h4 class="detalii-subtitlu">Activitate recentă</h4>
    ${stare.istoric.length ? `
      <ul class="istoric">
        ${stare.istoric.slice(0, 8).map((a) => `
          <li class="cat-${a.categorie || "altele"}">${escapeHtml(a.text)}<span>${timpRelativ(a.ts)}</span></li>`).join("")}
      </ul>` : '<p class="istoric-gol">Încă nu ai nicio activitate. Alege o cerere și fă primul pas.</p>'}

    <div class="sertar-jos">
      <button type="button" class="btn btn-pericol" id="reseteaza-date">Șterge datele salvate</button>
    </div>`;
}

/* ---------- Randare: detalii ---------- */
let idDetalii = null;

function randeazaDetalii(id) {
  const c = stare.cereri.find((x) => x.id === id);
  if (!c) return;
  idDetalii = id;

  const complet = c.inscrisi >= c.necesari;
  const inscris = stare.inscrieri.includes(c.id);
  const salvat = stare.salvate.includes(c.id);
  const voluntari = voluntariPentru(c);
  const libere = Math.max(0, c.necesari - c.inscrisi);
  const procent = Math.min(100, (c.inscrisi / c.necesari) * 100);

  let actiunePrincipala;
  if (inscris) actiunePrincipala = `<button type="button" class="btn btn-pericol" data-act="retrage">Retrage-te</button>`;
  else if (complet) actiunePrincipala = `<button type="button" class="btn stare-complet" disabled>Echipă completă</button>`;
  else actiunePrincipala = `<button type="button" class="btn btn-principal" data-act="inscrie">Mă ofer să ajut</button>`;

  $("detalii-continut").innerHTML = `
    <div class="detalii cat-${c.categorie}">
      <div class="detalii-banda">
        <button type="button" class="btn-inchide" data-act="inchide" aria-label="Închide">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        <div class="detalii-eticheta">
          ${svg(c.categorie, "icon-cat")}
          <span class="categorie">${CATEGORII[c.categorie]}</span>
          ${c.urgent && !complet ? '<span class="insigna-urgent">Urgent</span>' : ""}
        </div>
        <h2>${escapeHtml(c.titlu)}</h2>
        <div class="organizator">
          ${avatar(c.organizator, "avatar-mic")}
          <span>Publicată de <strong>${escapeHtml(c.organizator)}</strong> · ${timpRelativ(c.creat)}</span>
        </div>
      </div>

      <div class="detalii-corp">
        <p class="detalii-descriere">${escapeHtml(c.descriere)}</p>

        <div class="info-grila">
          <div class="info"><span>Data</span><strong>${formatData(c.data)}</strong></div>
          <div class="info"><span>Durată</span><strong>${formatDurata(c.ore)}</strong></div>
          <div class="info"><span>Cartier</span><strong>${escapeHtml(c.cartier)}</strong></div>
          <div class="info"><span>Locuri</span><strong>${libere} libere</strong></div>
        </div>

        ${c.competente && c.competente.length ? `
          <h4 class="detalii-subtitlu">Ce ar fi util</h4>
          <div class="etichete">${c.competente.map((x) => `<span class="eticheta">${escapeHtml(x)}</span>`).join("")}</div>` : ""}

        <h4 class="detalii-subtitlu">Echipa (${c.inscrisi} din ${c.necesari})</h4>
        <div class="progres"><div style="width:${procent}%"></div></div>
        <div class="lista-voluntari" style="margin-top:1rem">
          ${voluntari.map((n) => `<span class="voluntar">${avatar(n, n === "Tu" ? "avatar-tu" : "")}${escapeHtml(n)}</span>`).join("")}
          ${libere > 0 ? `<span class="locuri-libere">${voluntari.length ? "și " : ""}${libere} ${libere === 1 ? "loc așteaptă" : "locuri așteaptă"} un voluntar</span>` : ""}
        </div>
      </div>

      <div class="detalii-actiuni">
        <button type="button" class="btn btn-text" data-act="salveaza">${svg("salveaza")}${salvat ? "Salvată" : "Salvează"}</button>
        <button type="button" class="btn btn-text" data-act="copiaza">${svg("link")}Copiază linkul</button>
        <span class="spatiu"></span>
        ${actiunePrincipala}
      </div>
    </div>`;
}

function deschideDetalii(id) {
  randeazaDetalii(id);
  const modal = $("modal-detalii");
  if (!modal.open) modal.showModal();
  history.replaceState(null, "", `#cerere-${id}`);
}

function inchideDetalii() {
  $("modal-detalii").close();
}

$("modal-detalii").addEventListener("close", () => {
  idDetalii = null;
  if (location.hash.startsWith("#cerere-")) history.replaceState(null, "", location.pathname + location.search);
});

/* ---------- Randare generală ---------- */
function randeazaTot() {
  randeazaFiltre();
  randeazaLista();
  randeazaCifre();
  randeazaClasament();
  if ($("sertar").classList.contains("deschis")) randeazaProfil();
  if (idDetalii != null) randeazaDetalii(idDetalii);
}

/* ---------- Acțiuni ---------- */
function inscrie(id) {
  const c = stare.cereri.find((x) => x.id === id);
  if (!c || stare.inscrieri.includes(id) || c.inscrisi >= c.necesari) return;

  const nivelVechi = nivelCurent(stare.puncte).nume;
  const insigneVechi = insigneDeblocate();

  c.inscrisi += 1;
  stare.inscrieri.push(id);
  stare.puncte += PUNCTE_PE_INSCRIERE;
  adaugaIstoric(`Te-ai înscris la „${c.titlu}”`, c.categorie);

  const nivelNou = nivelCurent(stare.puncte).nume;
  const insigneNoi = insigneDeblocate().filter((i) => !insigneVechi.includes(i));

  salveazaTot();
  randeazaTot();

  if (insigneNoi.length) notifica(`Insignă nouă deblocată: „${insigneNoi[0]}”`);
  else if (nivelNou !== nivelVechi) notifica(`Ai ajuns la nivelul „${nivelNou}”. Mulțumim!`);
  else notifica(`Te-ai înscris. ${c.organizator} va lua legătura cu tine.`);
}

function retrage(id) {
  const c = stare.cereri.find((x) => x.id === id);
  if (!c || !stare.inscrieri.includes(id)) return;

  c.inscrisi = Math.max(0, c.inscrisi - 1);
  stare.inscrieri = stare.inscrieri.filter((x) => x !== id);
  stare.puncte = Math.max(0, stare.puncte - PUNCTE_PE_INSCRIERE);
  adaugaIstoric(`Te-ai retras de la „${c.titlu}”`, c.categorie);

  salveazaTot();
  randeazaTot();
  notifica("Te-ai retras. Locul tău e din nou disponibil.");
}

function comutaSalvare(id) {
  const c = stare.cereri.find((x) => x.id === id);
  if (!c) return;
  const salvat = stare.salvate.includes(id);
  stare.salvate = salvat ? stare.salvate.filter((x) => x !== id) : [...stare.salvate, id];
  salveaza("salvate", stare.salvate);
  randeazaTot();
  notifica(salvat ? "Cererea a fost eliminată din salvate." : "Cererea a fost salvată.");
}

async function copiazaLink(id) {
  const url = `${location.href.split("#")[0]}#cerere-${id}`;
  try {
    await navigator.clipboard.writeText(url);
    notifica("Linkul a fost copiat.");
  } catch {
    notifica("Nu am putut copia linkul automat.");
  }
}

/* ---------- Evenimente: listă ---------- */
$("lista").addEventListener("click", (e) => {
  const tinta = e.target.closest("[data-act]");
  const card = e.target.closest(".card");
  if (!tinta || !card) return;
  const id = Number(card.dataset.id);
  const act = tinta.dataset.act;

  if (act === "inscrie") inscrie(id);
  else if (act === "salveaza") comutaSalvare(id);
  else if (act === "detalii") deschideDetalii(id);
});

$("lista").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches(".card-titlu")) {
    deschideDetalii(Number(e.target.closest(".card").dataset.id));
  }
});

$("modal-detalii").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) return inchideDetalii(); // click pe fundal
  const tinta = e.target.closest("[data-act]");
  if (!tinta || idDetalii == null) return;
  const act = tinta.dataset.act;
  if (act === "inchide") inchideDetalii();
  else if (act === "inscrie") inscrie(idDetalii);
  else if (act === "retrage") retrage(idDetalii);
  else if (act === "salveaza") comutaSalvare(idDetalii);
  else if (act === "copiaza") copiazaLink(idDetalii);
});

/* ---------- Evenimente: filtre ---------- */
$("filtre").addEventListener("click", (e) => {
  const filtru = e.target.closest(".filtru");
  if (!filtru) return;
  stare.filtre.categorie = filtru.dataset.cat;
  randeazaFiltre();
  randeazaLista();
});

let intarziere;
$("cautare").addEventListener("input", (e) => {
  clearTimeout(intarziere);
  intarziere = setTimeout(() => {
    stare.filtre.termen = e.target.value;
    randeazaLista();
  }, 150);
});

$("sortare").addEventListener("change", (e) => {
  stare.filtre.sortare = e.target.value;
  randeazaLista();
});

function legaComutator(id, cheie) {
  $(id).addEventListener("click", () => {
    stare.filtre[cheie] = !stare.filtre[cheie];
    $(id).setAttribute("aria-pressed", stare.filtre[cheie]);
    randeazaLista();
  });
}
legaComutator("doar-urgente", "urgente");
legaComutator("doar-salvate", "salvate");

$("reseteaza-filtre").addEventListener("click", () => {
  stare.filtre = { categorie: "toate", termen: "", sortare: "recente", urgente: false, salvate: false };
  $("cautare").value = "";
  $("sortare").value = "recente";
  $("doar-urgente").setAttribute("aria-pressed", "false");
  $("doar-salvate").setAttribute("aria-pressed", "false");
  randeazaFiltre();
  randeazaLista();
});

/* ---------- Formular cerere nouă ---------- */
const form = $("form-cerere");
const modal = $("modal");

$("alegeri-categorie").innerHTML = Object.entries(CATEGORII).map(([cheie, nume], i) => `
  <div class="alegere-cat cat-${cheie}">
    <input type="radio" name="categorie" id="cat-${cheie}" value="${cheie}" ${i === 0 ? "checked" : ""}>
    <label for="cat-${cheie}">${svg(cheie, "icon-cat")}${nume}</label>
  </div>`).join("");

$("deschide-form").addEventListener("click", () => {
  $("camp-data").min = zi(0);
  $("camp-data").value = zi(1);
  modal.showModal();
  form.querySelector("input[name=titlu]").focus();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.closest("[data-inchide]")) {
    form.reset();
    modal.close();
  }
});

form.descriere.addEventListener("input", () => {
  $("contor-descriere").textContent = `${form.descriere.value.length} / 400`;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const competente = String(d.get("competente") || "")
    .split(",").map((x) => x.trim()).filter(Boolean).slice(0, 6);

  const cerere = {
    id: Date.now(),
    titlu: d.get("titlu").trim(),
    descriere: d.get("descriere").trim(),
    categorie: d.get("categorie"),
    cartier: d.get("cartier").trim(),
    data: d.get("data") || zi(1),
    ore: Number(d.get("ore")) || 1,
    necesari: Math.min(50, Math.max(1, Number(d.get("necesari")) || 1)),
    inscrisi: 0,
    urgent: d.get("urgent") === "on",
    organizator: d.get("organizator").trim(),
    competente,
    creat: Date.now(),
  };

  stare.cereri.unshift(cerere);
  stare.publicate += 1;
  adaugaIstoric(`Ai publicat cererea „${cerere.titlu}”`, cerere.categorie);
  salveazaTot();

  form.reset();
  $("contor-descriere").textContent = "0 / 400";
  modal.close();

  // resetează filtrele ca noua cerere să fie vizibilă
  $("reseteaza-filtre").click();
  randeazaTot();
  notifica("Cererea a fost publicată.");
  $("cereri").scrollIntoView({ behavior: "smooth" });
});

/* ---------- Sertar profil ---------- */
function deschideProfil() {
  randeazaProfil();
  const sup = $("suprapunere");
  sup.hidden = false;
  requestAnimationFrame(() => sup.classList.add("vizibil"));
  $("sertar").classList.add("deschis");
  $("sertar").setAttribute("aria-hidden", "false");
  $("inchide-profil").focus();
}

function inchideProfil() {
  const sup = $("suprapunere");
  sup.classList.remove("vizibil");
  $("sertar").classList.remove("deschis");
  $("sertar").setAttribute("aria-hidden", "true");
  setTimeout(() => { sup.hidden = true; }, 260);
}

$("deschide-profil").addEventListener("click", deschideProfil);
$("inchide-profil").addEventListener("click", inchideProfil);
$("suprapunere").addEventListener("click", inchideProfil);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("sertar").classList.contains("deschis")) inchideProfil();
});

$("profil-continut").addEventListener("click", (e) => {
  if (e.target.id !== "reseteaza-date") return;
  if (!confirm("Sigur vrei să ștergi toate datele salvate în acest browser?")) return;
  try {
    Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k));
  } catch { /* ignoră */ }
  location.reload();
});

/* ---------- Temă ---------- */
function aplicaTema(tema) {
  document.documentElement.dataset.tema = tema;
}

const temaInitiala = stare.tema
  || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "intunecat" : "luminos");
aplicaTema(temaInitiala);

$("comuta-tema").addEventListener("click", () => {
  const noua = document.documentElement.dataset.tema === "intunecat" ? "luminos" : "intunecat";
  aplicaTema(noua);
  salveaza("tema", noua);
});

/* ---------- Quiz ---------- */
const INTREBARI = [
  {
    text: "Ce înseamnă, de fapt, voluntariatul?",
    variante: [
      "O muncă plătită cu jumătate de normă",
      "O activitate făcută din proprie inițiativă, fără plată, în folosul altora",
      "O practică obligatorie pentru elevi",
    ],
    corect: 1,
  },
  {
    text: "O vecină în vârstă îți cere ajutor la cumpărături. Care e cel mai corect mod de a o ajuta?",
    variante: [
      "Îi ceri cardul și PIN-ul, ca să meargă mai repede",
      "Cumperi ce crezi tu că îi trebuie",
      "Faceți lista împreună, iei banii de la ea și îi aduci bonul și restul",
    ],
    corect: 2,
  },
  {
    text: "Te-ai înscris la o acțiune, dar nu mai poți ajunge. Ce faci?",
    variante: [
      "Te retragi din timp, ca locul tău să poată fi ocupat de altcineva",
      "Nu spui nimic, oricum mai vin și alții",
      "Trimiți un prieten în locul tău, fără să anunți organizatorul",
    ],
    corect: 0,
  },
  {
    text: "La o acțiune de ecologizare în parc, ce echipament îți trebuie de obicei?",
    variante: [
      "Nimic, gunoiul se strânge cu mâna goală",
      "Mănuși și saci, pe care de regulă îi oferă organizatorii",
      "Echipament profesional, cumpărat pe banii tăi",
    ],
    corect: 1,
  },
  {
    text: "Vrei să ajuți la un adăpost de animale, dar n-ai mai făcut asta. Care e primul pas potrivit?",
    variante: [
      "Iei acasă trei câini chiar din prima zi",
      "Duci mâncare de acasă și le-o dai fără să întrebi pe nimeni",
      "Te înscrii la plimbări și participi la instruirea de început",
    ],
    corect: 2,
  },
];

const quiz = { index: 0, scor: 0, raspuns: false };

const butonStart = $("start");
const butonUrmator = $("urmatoarea");
const butonReia = $("reia");
const zonaScor = $("scor");
const zonaIntrebare = $("intrebare");
const zonaRaspunsuri = $("raspunsuri");
const zonaMesaj = $("mesaj");

function actualizeazaProgresQuiz() {
  const total = INTREBARI.length;
  $("progres-quiz").textContent = `Întrebarea ${Math.min(quiz.index + 1, total)} din ${total}`;
  $("bara-quiz").style.width = `${(quiz.index / total) * 100}%`;
  zonaScor.textContent = "Scor: " + quiz.scor;
}

function afiseazaIntrebare() {
  const intrebare = INTREBARI[quiz.index];
  quiz.raspuns = false;
  zonaIntrebare.textContent = intrebare.text;
  zonaMesaj.textContent = "";
  zonaMesaj.className = "";
  zonaRaspunsuri.innerHTML = "";
  butonUrmator.hidden = true;

  intrebare.variante.forEach((varianta, i) => {
    const buton = document.createElement("button");
    buton.type = "button";
    buton.innerHTML = `<span class="litera">${"ABC"[i]}</span>`;
    buton.append(varianta);
    buton.addEventListener("click", () => verifica(i));
    zonaRaspunsuri.appendChild(buton);
  });
  actualizeazaProgresQuiz();
}

function verifica(alegere) {
  if (quiz.raspuns) return; // la o întrebare se poate răspunde o singură dată
  quiz.raspuns = true;

  const intrebare = INTREBARI[quiz.index];
  const butoane = zonaRaspunsuri.querySelectorAll("button");
  butoane.forEach((b) => { b.disabled = true; });
  butoane[intrebare.corect].classList.add("corect");

  if (alegere === intrebare.corect) {
    quiz.scor += 10;
    zonaMesaj.textContent = "Corect! +10 puncte";
    zonaMesaj.className = "bine";
  } else {
    butoane[alegere].classList.add("gresit");
    zonaMesaj.textContent = "Nu chiar. Răspunsul corect era: " + intrebare.variante[intrebare.corect];
    zonaMesaj.className = "rau";
  }

  zonaScor.textContent = "Scor: " + quiz.scor;
  butonUrmator.textContent = quiz.index === INTREBARI.length - 1 ? "Vezi rezultatul" : "Următoarea întrebare";
  butonUrmator.hidden = false;
}

function afiseazaFinal() {
  const maxim = INTREBARI.length * 10;
  let verdict = "Mai citește o dată sfaturile și încearcă din nou.";
  if (quiz.scor === maxim) verdict = "Excelent! Ești gata pentru prima ta acțiune de voluntariat.";
  else if (quiz.scor >= maxim * 0.6) verdict = "Foarte bine! Mai ai doar câteva detalii de aflat.";

  $("progres-quiz").textContent = "Gata!";
  $("bara-quiz").style.width = "100%";
  zonaIntrebare.textContent = "";
  zonaRaspunsuri.innerHTML = `<div class="quiz-final"><strong>${quiz.scor} / ${maxim}</strong>puncte</div>`;
  zonaMesaj.textContent = verdict;
  zonaMesaj.className = quiz.scor >= maxim * 0.6 ? "bine" : "";
  butonUrmator.hidden = true;
  butonReia.hidden = false;
}

butonStart.addEventListener("click", () => {
  butonStart.hidden = true;
  quiz.index = 0;
  quiz.scor = 0;
  afiseazaIntrebare();
});

butonUrmator.addEventListener("click", () => {
  quiz.index += 1;
  if (quiz.index < INTREBARI.length) afiseazaIntrebare();
  else afiseazaFinal();
});

butonReia.addEventListener("click", () => {
  butonReia.hidden = true;
  quiz.index = 0;
  quiz.scor = 0;
  afiseazaIntrebare();
});

/* ---------- Newsletter ---------- */
$("form-newsletter").addEventListener("submit", (e) => {
  e.preventDefault();
  const camp = $("email-newsletter");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(camp.value.trim());
  camp.classList.toggle("eroare", !valid);
  if (!valid) {
    notifica("Introdu o adresă de e-mail validă.");
    camp.focus();
    return;
  }
  camp.value = "";
  notifica("Te-ai abonat. Primul e-mail sosește luni.");
});

/* ---------- Pornire ---------- */
randeazaTot();
pornesteAnimatieCifre();

const potrivire = location.hash.match(/^#cerere-(\d+)$/);
if (potrivire && stare.cereri.some((c) => c.id === Number(potrivire[1]))) {
  deschideDetalii(Number(potrivire[1]));
}
