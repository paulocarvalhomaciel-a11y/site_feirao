(function () {
	'use strict';

	// Atualiza o ano no rodapé
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	/* TIMELINE: dados dos acontecimentos (texto curto) */
	const TIMELINE_DATA = {
		'1500': 'Contato inicial europeu que cria o cenário histórico onde, posteriormente, o tráfico e a presença africana moldariam grande parte da cultura popular.',
		'1530': 'Início sistemático do tráfico transatlântico — chegada forçada de milhões de africanos cujas línguas, crenças e costumes alimentaram o folclore e as tradições brasileiras.',
		'1808': 'Períodos de formação dos primeiros terreiros e síncretismos religiosos que dariam origem a manifestações de matriz africana, como o Candomblé e ritualísticas populares.',
		'1888': 'Abolição formal da escravidão — marca o início de novas dinâmicas sociais e culturais para comunidades afro-brasileiras, preservando e reinventando tradições.',
		'1930': 'Popularização do samba e outras expressões urbanas de matriz africana, consolidando-se como eixo central do folclore e da cultura popular.',
		'1960': 'Capoeira, religiosidade, ritmos e práticas tradicionais ganham força como formas de resistência cultural durante transformações urbanas.',
		'1988': 'Constituição e avanços legais que reconhecem direitos e a pluralidade cultural, fortalecendo políticas de preservação do patrimônio afro-brasileiro.',
		'2000': 'Movimentos e políticas de valorização do patrimônio imaterial (festas, terreiros, saberes) e maior presença acadêmica sobre o tema.',
		'2010': 'Ações coletivas e projetos de memória e identidade reforçam a visibilidade do folclore afro‑brasileiro em festivais e meios digitais.',
		'2020': 'Ativismo cultural e plataformas digitais ampliam vozes afro‑brasileiras, protegendo tradições e denunciando apagamentos.',
		'2030': 'Expectativa por políticas de reparação, salvaguarda cultural e investimentos que assegurem a continuidade das tradições afro‑brasileiras.'
	};

	// Timeline: comportamento interativo
	(function initTimeline() {
		const track = document.querySelector('.timeline-track');
		if (!track) return;
		const items = Array.from(track.querySelectorAll('.timeline-item'));
		const panelTitle = document.getElementById('timeline-title');
		const panelDesc = document.getElementById('timeline-desc');
		if (!panelTitle || !panelDesc || items.length === 0) return;

		// centra um item horizontalmente dentro da pista (evita scroll vertical)
		function centerItemHorizontally(item) {
			const left = item.offsetLeft - (track.clientWidth / 2) + (item.clientWidth / 2);
			// limite para 0..maxScroll
			const max = track.scrollWidth - track.clientWidth;
			const target = Math.max(0, Math.min(max, left));
			track.scrollTo({ left: target, behavior: 'smooth' });
		}

		// alinha o topo do <main> logo abaixo da nav (evita que o conteúdo suba demais)
		function alignMainBelowNav() {
			const nav = document.querySelector('nav');
			const mainEl = document.getElementById('main');
			if (!nav || !mainEl) return;
			const targetTop = mainEl.offsetTop - nav.offsetHeight;
			// smooth vertical scroll
			window.scrollTo({ top: targetTop, behavior: 'smooth' });
		}

		function showFor(item) {
			if (!item) return;
			const year = item.getAttribute('data-year');
			const title = item.getAttribute('data-title') || year;
			const desc = TIMELINE_DATA[year] || 'Descrição não disponível.';
			// atualizar painel
			panelTitle.textContent = `${year} — ${title}`;
			panelDesc.textContent = desc;
			// atualizar estado ativo
			items.forEach(i => {
				const pressed = (i === item);
				i.classList.toggle('active', pressed);
				i.setAttribute('aria-pressed', pressed ? 'true' : 'false');
			});
			// garantir visibilidade horizontal sem causar scroll vertical inesperado
			centerItemHorizontally(item);
			// alinhar main abaixo da nav (caso o click/ação tenha deslocado verticalmente)
			alignMainBelowNav();
		}

		// clique
		items.forEach(i => i.addEventListener('click', (e) => {
			// evitar que o foco automática cause scroll vertical
			try { i.focus({ preventScroll: true }); } catch (err) { i.focus(); }
			showFor(i);
		}));

		// teclado (ArrowLeft/Right, Home, End, Enter, Space)
		track.addEventListener('keydown', (e) => {
			const active = document.activeElement;
			const idx = items.indexOf(active);
			if (idx === -1) return;
			if (e.key === 'ArrowRight') { e.preventDefault(); try { items[Math.min(items.length - 1, idx + 1)].focus({ preventScroll: true }); } catch (err) { items[Math.min(items.length - 1, idx + 1)].focus(); } }
			if (e.key === 'ArrowLeft')  { e.preventDefault(); try { items[Math.max(0, idx - 1)].focus({ preventScroll: true }); } catch (err) { items[Math.max(0, idx - 1)].focus(); } }
			if (e.key === 'Home')       { e.preventDefault(); try { items[0].focus({ preventScroll: true }); } catch (err) { items[0].focus(); } }
			if (e.key === 'End')        { e.preventDefault(); try { items[items.length - 1].focus({ preventScroll: true }); } catch (err) { items[items.length - 1].focus(); } }
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				// quando acionado por teclado, garantir que não haja scroll vertical indesejado
				try { document.activeElement.focus({ preventScroll: true }); } catch (err) { /* ignore */ }
				showFor(document.activeElement);
			}
		});

		// opcional: mostrar primeiro item ao carregar
		// showFor(items[0]);
	})();

	// Overlay: alternador de idioma (pt <-> iorubá) automático a cada 3s
	(function initOverlay() {
		const overlay = document.querySelector('.header-overlay');
		if (!overlay) return;
		const pt = overlay.querySelector('.lang-pt');
		const yo = overlay.querySelector('.lang-yo');
		if (!pt || !yo) return;

		// se o usuário prefere reduzir animações, não ativar auto (bom para acessibilidade)
		const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let showing = 0; // 0 = pt, 1 = yo

		function show(index) {
			showing = index;
			if (index === 0) {
				pt.classList.add('visible'); pt.removeAttribute('aria-hidden');
				yo.classList.remove('visible'); yo.setAttribute('aria-hidden', 'true');
			} else {
				yo.classList.add('visible'); yo.removeAttribute('aria-hidden');
				pt.classList.remove('visible'); pt.setAttribute('aria-hidden', 'true');
			}
		}

		// inicializa mostrando português
		show(0);

		// alternância automática a cada 3 segundos (se não houver preferência reduce)
		let timer = null;
		if (!prefersReduced) {
			timer = setInterval(() => show(showing ? 0 : 1), 3000);
		}

		// interações manuais pausam auto
		const pauseAuto = () => { if (timer) { clearInterval(timer); timer = null; } };

		overlay.addEventListener('click', () => { show(showing ? 0 : 1); pauseAuto(); });
		overlay.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				show(showing ? 0 : 1);
				pauseAuto();
			}
		});
		overlay.addEventListener('mouseenter', () => { if (timer) clearInterval(timer); });
		overlay.addEventListener('mouseleave', () => {
			if (!prefersReduced && !timer) {
				timer = setInterval(() => show(showing ? 0 : 1), 3000);
			}
		});
	})();

	// Formulário: validação simples
	(function initForm() {
		const form = document.getElementById('contactForm');
		if (!form) return;
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			const name = (document.getElementById('name') || {}).value || '';
			const email = (document.getElementById('email') || {}).value || '';
			const message = (document.getElementById('message') || {}).value || '';
			if (!name.trim() || !email.trim() || !message.trim()) {
				alert('Por favor, preencha todos os campos.');
				return;
			}
			alert('Obrigado, ' + name.trim() + '! Sua mensagem foi recebida (simulação).');
			this.reset();
		});
	})();
})();
