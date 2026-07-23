/* Lightbox: click any linked gallery/doc image to enlarge it in an overlay.
   The <a href="...jpg"> wrappers stay in the HTML as a no-JS fallback. */
(function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll('a[href]')
  ).filter(function (a) {
    return /\.(jpe?g|png|gif|webp)$/i.test(a.getAttribute('href')) && a.querySelector('img');
  });
  if (!links.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-prev" aria-label="Previous image">&#8249;</button>' +
    '<button class="lb-next" aria-label="Next image">&#8250;</button>' +
    '<figure class="lb-stage"><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(overlay);

  var img = overlay.querySelector('img');
  var cap = overlay.querySelector('figcaption');
  var prevBtn = overlay.querySelector('.lb-prev');
  var nextBtn = overlay.querySelector('.lb-next');
  var current = -1;

  function captionFor(link) {
    var fig = link.closest('figure');
    if (fig) {
      var fc = fig.querySelector('figcaption');
      if (fc) return fc.textContent;
    }
    var shot = link.closest('.shot');
    if (shot) {
      var c = shot.querySelector('.cap');
      if (c) return c.textContent;
    }
    var thumb = link.querySelector('img');
    return thumb ? thumb.alt : '';
  }

  function show(i) {
    current = (i + links.length) % links.length;
    img.src = links[current].href;
    img.alt = links[current].querySelector('img').alt || '';
    cap.textContent = captionFor(links[current]);
    var single = links.length < 2;
    prevBtn.style.display = single ? 'none' : '';
    nextBtn.style.display = single ? 'none' : '';
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    img.src = '';
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
    });
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === img) return;
    if (e.target === prevBtn) { show(current - 1); return; }
    if (e.target === nextBtn) { show(current + 1); return; }
    close();
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
})();
