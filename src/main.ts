type CopyButton = HTMLButtonElement & { dataset: DOMStringMap & { copy?: string } };

function initMobileNav(): void {
  const toggle = document.getElementById('menuToggle') as HTMLButtonElement | null;
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  const close = () => {
    sidebar.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('nav-open');
  };

  toggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('nav-open', open);
  });

  sidebar.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 720px)').matches) close();
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node) || !sidebar.classList.contains('open')) return;
    if (sidebar.contains(target) || toggle.contains(target)) return;
    close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

function initActiveSection(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.side-link'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('.doc-section[id]'));
  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  const byId = new Map(links.map((link) => [link.getAttribute('href')?.slice(1), link]));
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      links.forEach((link) => link.classList.remove('active'));
      byId.get((visible.target as HTMLElement).id)?.classList.add('active');
    },
    { rootMargin: '-10% 0px -72% 0px', threshold: [0.05, 0.15, 0.35] }
  );

  sections.forEach((section) => observer.observe(section));
}

function initSearch(): void {
  const input = document.getElementById('docSearch') as HTMLInputElement | null;
  const status = document.getElementById('searchStatus');
  const sideNav = document.getElementById('sideNav');
  const searchTrigger = document.getElementById('searchTrigger');
  if (!input || !sideNav) return;

  const links = Array.from(sideNav.querySelectorAll<HTMLAnchorElement>('.side-link'));
  const groupLabels = Array.from(sideNav.querySelectorAll<HTMLElement>('.nav-group-label'));

  const filterNavigation = () => {
    const query = input.value.trim().toLocaleLowerCase();
    const matches: HTMLAnchorElement[] = [];

    links.forEach((link) => {
      const targetId = link.getAttribute('href')?.slice(1);
      const section = targetId ? document.getElementById(targetId) : null;
      const searchableText = `${link.textContent ?? ''} ${section?.textContent ?? ''}`.toLocaleLowerCase();
      const match = !query || searchableText.includes(query);
      link.classList.toggle('hidden', !match);
      link.setAttribute('aria-hidden', String(!match));
      if (match) matches.push(link);
    });

    groupLabels.forEach((label) => {
      let next = label.nextElementSibling;
      let hasVisibleLink = false;
      while (next && !next.classList.contains('nav-group-label')) {
        if (next.matches('.side-link') && !next.classList.contains('hidden')) hasVisibleLink = true;
        next = next.nextElementSibling;
      }
      label.classList.toggle('hidden', Boolean(query) && !hasVisibleLink);
    });

    if (status) {
      status.textContent = !query
        ? ''
        : matches.length
          ? `${matches.length} matching section${matches.length === 1 ? '' : 's'}`
          : `No sections found for “${input.value.trim()}”.`;
    }
    return matches;
  };

  input.addEventListener('input', filterNavigation);
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const firstMatch = filterNavigation()[0];
    if (input.value.trim() && firstMatch) firstMatch.click();
  });

  searchTrigger?.addEventListener('click', () => {
    input.focus();
    input.select();
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement
      && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    const isSearchShortcut = event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k');
    if (!isSearchShortcut || isTyping) return;
    event.preventDefault();
    input.focus();
    input.select();
  });
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function initCopyButtons(): void {
  document.querySelectorAll<CopyButton>('.copy-btn[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy;
      if (!text) return;

      try {
        await copyText(text);
        const previousLabel = button.textContent;
        button.textContent = 'Copied';
        button.classList.add('copied');
        window.setTimeout(() => {
          button.textContent = previousLabel || 'Copy';
          button.classList.remove('copied');
        }, 1400);
      } catch {
        button.textContent = 'Failed';
        window.setTimeout(() => { button.textContent = 'Copy'; }, 1400);
      }
    });
  });
}

function initToolbar(): void {
  const printButton = document.getElementById('printButton');
  printButton?.addEventListener('click', () => window.print());
}

function init(): void {
  initMobileNav();
  initActiveSection();
  initSearch();
  initCopyButtons();
  initToolbar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export {};
