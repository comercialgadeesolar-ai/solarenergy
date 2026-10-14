(function () {
  function init() {
    const menu = document.querySelector('.orbita-solar-floating');
    if (!menu || menu.dataset.initialized) return;
    menu.dataset.initialized = 'true';
    const links = Array.from(menu.querySelectorAll('a[data-section]'));
    const targets = links.map(link => {
      const url = new URL(link.href, location.href);
      const isLocal = url.origin === location.origin && url.pathname === location.pathname && url.search === location.search;
      return { link, element: isLocal ? document.getElementById(link.dataset.section) : null };
    }).filter(target => target.element);
    function update() {
      let active = null;
      let closest = -Infinity;
      for (const target of targets) {
        const top = target.element.getBoundingClientRect().top;
        const intro = document.getElementById('inicio');
        if (target.link.dataset.section === 'universo' && intro && intro.getBoundingClientRect().top >= 0 && !(location.hash === '#universo' && top <= 80)) continue;
        if (top <= innerHeight * .4 && top > closest) {
          active = target.link;
          closest = top;
        }
      }
      if (!active && targets.length) active = targets[0].link;
      links.forEach(link => {
        if (link === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    let pending = false;
    window.addEventListener('scroll', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false;update(); });
    }, { passive:true });
    window.addEventListener('resize', update);
    window.addEventListener('hashchange', update);
    update();
  }
  window.OrbitaSolarMenu = { init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
