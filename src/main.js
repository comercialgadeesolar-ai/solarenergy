import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import './style.css';
import '../public/floating-menu.css';
import '../public/floating-menu.js';
import { createSolarScene } from './solar-scene.js';

const icons = {
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  diagonal: '<path d="M6 18 18 6M6 6h12v12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
  leaf: '<path d="M20 3c0 10-3 17-10 17a7 7 0 0 1-7-7C3 6 10 3 20 3Z M6 18l8-8"/>',
  mouse: '<rect x="7" y="2" width="10" height="17" rx="5"/><path d="M12 5v4m-3 13 3 2 3-2"/>',
  rotate: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  play: '<path d="m8 4 12 8-12 8Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  panel: '<path d="m6 4-3 13h18L18 4H6Zm2 0-1 13m9-13 1 13M5 10h14M12 17v4m-4 0h8"/>',
  house: '<path d="m3 10 9-7 9 7v10H3V10Zm6 10v-7h6v7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

import template from '../templates/landing.html?raw';
import floatingMenu from '../templates/floating-menu.html?raw';
const root = document.querySelector('#orbita-solar');
const app = root?.querySelector('#app');
if (app && !app.children.length) app.innerHTML = template;
if (!document.querySelector('.orbita-solar-floating')) document.body.insertAdjacentHTML('beforeend', floatingMenu);
window.OrbitaSolarMenu.init();
const $ = selector => root.querySelector(selector);
const $$ = selector => root.querySelectorAll(selector);

const facts = {
  Sol: { type: 'NOSSA ESTRELA', text: 'No coração do nosso sistema, o Sol transforma hidrogênio em energia. Uma pequena parte dessa luz chega à Terra — e pode se transformar na eletricidade que você usa todos os dias.', diameter: '1,39 milhão km', distance: '149,6 milhões km', fact: 'A luz solar chega à Terra em cerca de 8 minutos e 20 segundos.', color: '#ffad46' },
  Mercúrio: { type: 'PLANETA ROCHOSO', text: 'O menor planeta do sistema solar e o mais próximo do Sol. Sua superfície guarda crateras e grandes contrastes de temperatura, com quase nenhuma atmosfera para reter calor.', diameter: '4.879 km', distance: '57,9 milhões km', fact: 'Um ano em Mercúrio dura apenas 88 dias terrestres.', color: '#aaa49a' },
  Vênus: { type: 'PLANETA ROCHOSO', text: 'Envolto em uma atmosfera espessa, Vênus tem um efeito estufa extremo. Apesar de não ser o planeta mais próximo do Sol, é o mais quente do nosso sistema.', diameter: '12.104 km', distance: '108,2 milhões km', fact: 'A temperatura média da superfície é de cerca de 464 °C.', color: '#d9b37e' },
  Terra: { type: 'NOSSO LAR', text: 'Nosso pequeno planeta azul está na região ideal para abrigar água líquida. O Sol sustenta o clima, a fotossíntese e a vida — e oferece uma fonte renovável de eletricidade.', diameter: '12.742 km', distance: '149,6 milhões km', fact: 'A energia fotovoltaica transforma a luz em eletricidade sem combustão.', color: '#6bace6' },
  Marte: { type: 'PLANETA ROCHOSO', text: 'O planeta vermelho tem desertos frios, vulcões gigantes e sinais de água no passado. Painéis solares já ajudaram exploradores robóticos a investigar sua superfície.', diameter: '6.779 km', distance: '227,9 milhões km', fact: 'Marte recebe cerca de 43% da luz solar que chega à Terra.', color: '#d37853' },
  Júpiter: { type: 'GIGANTE GASOSO', text: 'O maior planeta do sistema solar é formado principalmente por hidrogênio e hélio. Suas faixas de nuvens e grandes tempestades criam uma paisagem em constante movimento.', diameter: '139.820 km', distance: '778,6 milhões km', fact: 'A missão Juno usa grandes painéis solares para explorar Júpiter.', color: '#c6aa92' },
  Saturno: { type: 'GIGANTE GASOSO', text: 'Seus anéis são formados por inúmeros fragmentos de gelo e rocha. Saturno é um gigante de baixa densidade e leva quase três décadas para dar uma volta ao redor do Sol.', diameter: '116.460 km', distance: '1,43 bilhão km', fact: 'Um ano em Saturno equivale a aproximadamente 29 anos terrestres.', color: '#d4c6a2' },
  Urano: { type: 'GIGANTE DE GELO', text: 'Com uma atmosfera rica em hidrogênio, hélio e metano, Urano tem uma tonalidade azul-esverdeada. Seu eixo de rotação é tão inclinado que ele parece girar deitado.', diameter: '50.724 km', distance: '2,87 bilhões km', fact: 'A inclinação do seu eixo é de aproximadamente 98 graus.', color: '#83d3da' },
  Netuno: { type: 'GIGANTE DE GELO', text: 'O planeta mais distante do Sol possui ventos muito rápidos e uma atmosfera fria. A luz solar demora mais de quatro horas para alcançar esse mundo azul.', diameter: '49.244 km', distance: '4,50 bilhões km', fact: 'Netuno completa uma órbita em cerca de 165 anos terrestres.', color: '#527bdf' },
};

function showPlanet(name, scroll = false) {
  const fact = facts[name];
  $$('.planet-pill').forEach(el => { el.classList.toggle('selected', el.dataset.planet === name); el.setAttribute('aria-pressed', String(el.dataset.planet === name)); });
  $('#planet-info').innerHTML = `<div class="planet-fact-heading"><span class="fact-orb" style="--planet-color:${fact.color}"></span><div><span class="eyebrow small-eyebrow">${fact.type}</span><h3>${name}</h3></div></div><p class="planet-description">${fact.text}</p><div class="planet-measure"><span>Diâmetro médio</span><strong>${fact.diameter}</strong><span>${name === 'Sol' ? 'Distância até a Terra' : 'Distância média do Sol'}</span><strong>${fact.distance}</strong></div><p class="planet-curiosity">${icon('sun')} ${fact.fact}</p><span class="scale-note">Visualização artística. Tamanhos, distâncias e velocidades fora de escala.</span>`;
  if (scroll) $('.explore-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
showPlanet('Sol');
const scene = createSolarScene($('#solar-canvas'), (name, focused) => showPlanet(name, !focused), ({ earthFocused, zoomPercent }) => {
  const universe = $('#universo');
  universe.classList.toggle('earth-focused', earthFocused);
  $('#earth-zoom-panel').hidden = !earthFocused;
  $('#focus-earth').setAttribute('aria-pressed', String(earthFocused));
  $('#focus-earth').setAttribute('aria-label', earthFocused ? 'Voltar ao sistema solar' : 'Zoom na Terra');
  $('#focus-earth .earth-focus-text').textContent = earthFocused ? 'Voltar ao sistema' : 'Zoom na Terra';
  $('#scene-title').innerHTML = `${earthFocused ? 'PLANETA TERRA' : 'SISTEMA SOLAR'} <span class="tag">3D</span>`;
  $('.scene-hint > span').innerHTML = earthFocused ? 'Arraste para girar a Terra <span class="hint-dot">·</span> Ctrl + scroll para aproximar' : 'Arraste para explorar <span class="hint-dot">·</span> Ctrl + scroll para aproximar';
  $('#solar-canvas').setAttribute('aria-label', earthFocused ? 'Terra em 3D. Arraste para girar ao redor da Terra e ajuste o zoom com o controle deslizante ou os botões.' : 'Sol e oito planetas em 3D. Arraste para girar, use Ctrl e a roda do mouse para aproximar e clique em um planeta.');
  $('#earth-zoom').value = String(zoomPercent);
  $('#earth-zoom').style.setProperty('--range-progress', `${zoomPercent}%`);
  $('#earth-zoom-value').textContent = `${zoomPercent}%`;
});
$$('.planet-pill').forEach(el => el.addEventListener('click', () => { showPlanet(el.dataset.planet); scene.select(el.dataset.planet); }));
$('#toggle-orbit').addEventListener('click', (event) => {
  const paused = scene.toggle();
  const button = event.currentTarget;
  button.innerHTML = icon(paused ? 'play' : 'pause');
  button.setAttribute('aria-label', paused ? 'Retomar órbitas' : 'Pausar órbitas');
  button.setAttribute('aria-pressed', String(paused));
});
$('#zoom-in').addEventListener('click', () => scene.zoom(0.85));
$('#zoom-out').addEventListener('click', () => scene.zoom(1.18));
$('#reset-view').addEventListener('click', () => scene.reset());
$('#focus-earth').addEventListener('click', () => {
  if ($('#focus-earth').getAttribute('aria-pressed') === 'true') {
    scene.reset();
  } else {
    showPlanet('Terra');
    scene.focusEarth();
  }
});
$('#earth-zoom').addEventListener('input', event => scene.setEarthZoom(Number(event.currentTarget.value)));

const menu = $('.mobile-menu');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.innerHTML = icon(open ? 'close' : 'menu');
  $('.nav').classList.toggle('open', open);
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => {
  $$('.nav-link').forEach(el => el.classList.toggle('active', el === link));
  $('.nav').classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menu');
  menu.innerHTML = icon('menu');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') menu.click();
});
const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
function calculate() {
  const bill = Number($('#monthly-bill').value);
  const hours = Number($('#sun-hours').value);
  const requiredKw = bill * 0.8 / (30 * hours * 0.8);
  $('#bill-display').innerHTML = `${money(bill)}<span>/mês</span>`;
  $('#sun-hours-value').textContent = `${hours.toFixed(1).replace('.', ',')} h`;
  $('#annual-savings').textContent = money(bill * 0.8 * 12);
  $('#system-size').textContent = `${requiredKw.toFixed(1).replace('.', ',')} kWp`;
  $('#panel-count').textContent = `${Math.ceil(requiredKw / 0.55)} painéis`;
  for (const input of $$('.calculator input[type="range"]')) input.style.setProperty('--range-progress', `${(Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100}%`);
}
$$('.calculator input[type="range"]').forEach(input => input.addEventListener('input', calculate));
calculate();

$("[data-current-year]").textContent = String(new Date().getFullYear());
