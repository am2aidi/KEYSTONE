document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. LIGHT / DARK THEME SYNCHRONIZATION
  if (window.applyKeystoneTheme) {
    const savedTheme = localStorage.getItem('keystone-theme') || 'dark';
    window.applyKeystoneTheme(savedTheme);
  }

  // Mobile Dashboard Sidebar Drawer Toggle
  const mobileDashSidebarBtn = document.getElementById('toggleDashSidebar');
  const dashSidebar = document.getElementById('dashSidebar');
  const closeDashSidebarBtn = document.getElementById('closeDashSidebar');

  if (mobileDashSidebarBtn && dashSidebar) {
    mobileDashSidebarBtn.addEventListener('click', () => {
      dashSidebar.classList.remove('-translate-x-full');
      dashSidebar.classList.add('translate-x-0');
    });

    if (closeDashSidebarBtn) {
      closeDashSidebarBtn.addEventListener('click', () => {
        dashSidebar.classList.add('-translate-x-full');
        dashSidebar.classList.remove('translate-x-0');
      });
    }
  }

  // SAMPLE DATA STORAGE
  const sampleQuotes = [
    { id: '#KEY-801', client: 'Jean-Paul Habimana', phone: '+250 788 123 456', service: 'Architectural & Turnkey Villa', location: 'Gacuriro, Kigali', scale: '350 m²', range: '$160K - $190K', status: 'Review' },
    { id: '#KEY-802', client: 'Kigali Heights Corp', phone: '+250 783 999 111', service: 'Structural & MEP Engineering', location: 'Kimihurura, Kigali', scale: '1,200 m²', range: '$400K - $480K', status: 'Approved' },
    { id: '#KEY-803', client: 'Claire Mukamana', phone: '+250 785 444 321', service: 'Land Survey & Topo Mapping', location: 'Bugesera', scale: '800 m²', range: '$12K - $15K', status: 'Scheduled' },
    { id: '#KEY-804', client: 'Musanze Eco-Resort', phone: '+250 782 111 222', service: 'Structural Retrofitting', location: 'Musanze', scale: '600 m²', range: '$85K - $105K', status: 'BOQ Sent' }
  ];

  let sampleProjects = JSON.parse(localStorage.getItem('keystone-projects')) || [
    { title: 'Nyarutarama Eco Villa', location: 'Nyarutarama, Kigali', progress: 75, status: 'Active Build', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
    { title: 'Kimihurura Heights Plaza', location: 'Kimihurura, Kigali', progress: 50, status: 'MEP Installation', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
    { title: 'Gacuriro Vision Smart Home', location: 'Gacuriro, Kigali', progress: 90, status: 'Final Finishing', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' }
  ];

  // 2. TAB NAVIGATION LOGIC
  const tabBtns = document.querySelectorAll('.dash-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const dashTabTitle = document.getElementById('dashTabTitle');

  const titleMap = {
    overviewTab: 'Engineering Overview & Analytics',
    quotesTab: 'Client Quote Pipeline Manager',
    projectsTab: 'Kigali Sites & Construction Projects',
    bannersTab: 'Website Banner & Announcement CMS',
    equipmentTab: 'Equipment & Heavy Machinery Fleet Inventory',
    socialTab: 'Social Media Channels & Direct Contact Hub',
    surveysTab: 'Land & Topographical Survey Schedule',
    messagesTab: 'Client Messages Inbox'
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.dataset.tab;
      if (!targetTab) return;

      tabBtns.forEach(b => {
        b.classList.remove('bg-gold-500', 'text-navy-950', 'font-bold', 'shadow-lg');
        b.classList.add('text-slate-300', 'hover:bg-navy-800');
      });

      btn.classList.add('bg-gold-500', 'text-navy-950', 'font-bold', 'shadow-lg');
      btn.classList.remove('text-slate-300');

      tabPanels.forEach(panel => {
        if (panel.id === targetTab) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });

      if (dashTabTitle && titleMap[targetTab]) {
        dashTabTitle.textContent = titleMap[targetTab];
      }
    });
  });

  // 3. POPULATE QUOTE TABLES
  function renderQuoteTables(filterText = '', filterStatus = 'all') {
    const overviewBody = document.getElementById('overviewTableBody');
    const fullBody = document.getElementById('quotesFullTableBody');

    const filtered = sampleQuotes.filter(q => {
      const matchText = q.client.toLowerCase().includes(filterText.toLowerCase()) || q.location.toLowerCase().includes(filterText.toLowerCase());
      const matchStatus = filterStatus === 'all' || q.status.toLowerCase().includes(filterStatus.toLowerCase());
      return matchText && matchStatus;
    });

    if (overviewBody) {
      overviewBody.innerHTML = sampleQuotes.slice(0, 4).map(q => `
        <tr class="hover:bg-navy-800/50 transition-colors">
          <td class="p-3 font-semibold text-white">${q.client}</td>
          <td class="p-3">${q.service}</td>
          <td class="p-3 text-slate-400">${q.location}</td>
          <td class="p-3 text-gold-400 font-bold">${q.range}</td>
          <td class="p-3"><span class="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">${q.status}</span></td>
          <td class="p-3">
            <button class="px-2.5 py-1 bg-gold-500 text-navy-950 font-bold rounded-lg text-[10px] hover:bg-gold-400">Review</button>
          </td>
        </tr>
      `).join('');
    }

    if (fullBody) {
      fullBody.innerHTML = filtered.map(q => `
        <tr class="hover:bg-navy-800/50 transition-colors">
          <td class="p-3 font-mono text-gold-400">${q.id}</td>
          <td class="p-3 font-bold text-white">${q.client}</td>
          <td class="p-3 text-slate-300">${q.phone}</td>
          <td class="p-3">${q.service}</td>
          <td class="p-3">${q.scale}</td>
          <td class="p-3 text-gold-400 font-bold">${q.range}</td>
          <td class="p-3"><span class="px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px]">${q.status}</span></td>
          <td class="p-3">
            <button class="px-3 py-1 bg-navy-700 text-white font-bold rounded-lg text-[10px] hover:bg-navy-600">Action</button>
          </td>
        </tr>
      `).join('');
    }
  }

  renderQuoteTables();

  const quoteSearchInput = document.getElementById('quoteSearchInput');
  if (quoteSearchInput) {
    quoteSearchInput.addEventListener('input', (e) => {
      renderQuoteTables(e.target.value);
    });
  }

  const quoteStatusBtns = document.querySelectorAll('.quote-status-filter-btn');
  quoteStatusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quoteStatusBtns.forEach(b => {
        b.classList.remove('bg-gold-500', 'text-navy-950');
        b.classList.add('bg-navy-800', 'text-slate-300');
      });
      btn.classList.add('bg-gold-500', 'text-navy-950');
      btn.classList.remove('bg-navy-800', 'text-slate-300');
      renderQuoteTables('', btn.dataset.status);
    });
  });

  // 4. POPULATE KIGALI PROJECTS GRID
  function renderProjectsGrid() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.innerHTML = sampleProjects.map((p) => `
      <div class="glass-card rounded-2xl overflow-hidden border border-navy-700 group hover:border-gold-500/40 transition-all">
        <div class="relative h-44 overflow-hidden">
          <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-gold-500 text-navy-950 text-[10px] font-bold">${p.status}</span>
        </div>
        <div class="p-5">
          <h4 class="font-heading font-bold text-white text-base mb-1">${p.title}</h4>
          <p class="text-xs text-slate-400 mb-4">${p.location}</p>
          
          <div class="w-full bg-navy-950 h-2 rounded-full overflow-hidden mb-2 border border-navy-700">
            <div class="bg-gradient-to-r from-gold-500 to-amber-500 h-full transition-all duration-500" style="width: ${p.progress}%"></div>
          </div>
          <div class="flex justify-between text-[11px] text-slate-400">
            <span>Progress Scale</span>
            <span class="text-gold-400 font-bold">${p.progress}%</span>
          </div>
        </div>
      </div>
    `).join('');

    const sitesCount = document.getElementById('statSitesCount');
    if (sitesCount) sitesCount.textContent = sampleProjects.length;
  }

  renderProjectsGrid();

  // 5. NEW KIGALI PROJECT MODAL LOGIC
  const openProjBtns = [document.getElementById('openNewProjectModal'), document.getElementById('openNewProjectModal2')];
  const closeProjBtn = document.getElementById('closeProjectModal');
  const projModal = document.getElementById('newProjectModal');
  const newProjForm = document.getElementById('newProjectForm');

  openProjBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (projModal) projModal.classList.remove('hidden');
      });
    }
  });

  if (closeProjBtn && projModal) {
    closeProjBtn.addEventListener('click', () => projModal.classList.add('hidden'));
  }

  if (newProjForm) {
    newProjForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('projTitle').value;
      const location = document.getElementById('projLocation').value;
      const progress = document.getElementById('projProgress').value || 25;
      const img = document.getElementById('projImage').value || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';

      sampleProjects.unshift({ title, location, progress, status: 'Active Build', img });
      localStorage.setItem('keystone-projects', JSON.stringify(sampleProjects));
      renderProjectsGrid();

      if (projModal) projModal.classList.add('hidden');
      newProjForm.reset();
    });
  }

  // 6. CHART.JS VISUAL ANALYTICS INITIALIZATION
  if (window.Chart) {
    const ctxPipeline = document.getElementById('pipelineChart');
    if (ctxPipeline) {
      new Chart(ctxPipeline, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [{
            label: 'Inquiries Volume ($K USD)',
            data: [220, 380, 510, 680, 920, 1450],
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94A3B8' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94A3B8' } }
          }
        }
      });
    }

    const ctxCategory = document.getElementById('categoryChart');
    if (ctxCategory) {
      new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
          labels: ['Residential Villas', 'Commercial Plazas', 'Structural Retrofit', 'Land Surveys'],
          datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: ['#D4AF37', '#3B82F6', '#10B981', '#8B5CF6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94A3B8', font: { size: 10 } } }
          }
        }
      });
    }
  }
});
