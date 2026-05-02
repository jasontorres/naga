import type { Locale } from './i18n';

type TranslationMap = Record<string, string>;

const en: TranslationMap = {
  // Topbar
  'topbar.title': 'Annual Investment Program — Fiscal Year 2026',
  'topbar.badge': 'Transparency',
  'topbar.about': 'About',
  'topbar.contact': 'Contact',

  // Nav
  'nav.home': 'Home',
  'nav.overview': 'Overview',

  // Page Hero
  'hero.2028cluster': '2028 Finish-Line Cluster',
  'hero.sector': 'Sector',
  'hero.total': 'Total',
  'hero.paps': 'PAPs',
  'hero.offices': 'Offices',
  'hero.sectorBlurb': (0 as unknown) as string, // dynamic — skip

  // Band: Headline
  'headline.eyebrow': 'Headline',
  'headline.title': 'Where ₱2.85 billion goes in 2026',
  'headline.sub': 'All amounts in Philippine pesos, millions',

  // Band: Filters
  'filters.eyebrow': 'Filters',
  'filters.title': 'Filter Projects',
  'filters.clickToFilter': 'Click to filter the data below',
  'filters.viewing': 'Viewing',
  'filters.useFilters': '— use filters to narrow further',
  'filters.search': 'Search',
  'filters.searchPlaceholder': 'Search projects, offices…',
  'filters.sector': 'Sector',
  'filters.fundingSource': 'Funding Source',
  'filters.subcategory': 'Subcategory',
  'filters.finishLine': '2028 Finish-Line Cluster',
  'filters.options': 'Options',
  'filters.climateOnly': 'Climate projects only',
  'filters.hideFlagged': 'Hide flagged items',
  'filters.more': 'More filters',
  'filters.fewer': 'Fewer filters',
  'filters.active': 'active',
  'filters.showingAll': 'Showing all',
  'filters.projects': 'projects',
  'filters.of': 'of',
  'filters.clearAll': 'clear all',

  // Breadcrumb labels
  'crumb.sector': 'Sector',
  'crumb.office': 'Office',
  'crumb.source': 'Source',
  'crumb.cluster': 'Cluster',
  'crumb.climateOnly': 'Climate projects only',
  'crumb.flaggedShown': 'Flagged items shown',

  // Band: Sectors
  'sectors.eyebrow': 'Sectors',
  'sectors.title': 'Sector mix and Finish-Line themes',
  'sectors.sub': 'Click a sector or cluster to jump to its page',
  'sectors.overview': 'Sector overview',
  'sectors.clickFilter': 'click a row to filter',
  'sectors.clickSector': 'click a row to open the sector page',
  'sectors.amounts': 'amounts ₱ millions',
  'sectors.ps': 'PS — Personnel Services',
  'sectors.mooe': 'MOOE — Maintenance & Other Operating',
  'sectors.co': 'CO — Capital Outlay',
  'sectors.chartExcludes': 'chart excludes 22 flagged outliers',
  'sectors.excluding': 'excluding 22 flagged rows',

  // Band: Finish-Line
  'fl.clusters': 'Finish-Line clusters',
  'fl.naga2028': '2028 Naga',
  'fl.across': 'across',
  'fl.clustersWord': 'clusters',

  // Band: Offices
  'offices.eyebrow': 'Offices',
  'offices.title': 'Office deep-dive',
  'offices.sectorTitle': 'Offices in this sector',
  'offices.clusterTitle': 'Programs aligned to this cluster',
  'offices.sub': 'Click a tile to drill down · click a crumb to zoom out',
  'offices.allSectors': 'All sectors',

  // Band: Line items
  'items.eyebrow': 'Line items',
  'items.title': 'PAP register',
  'items.sub': 'Sortable · climate-tagged rows marked · flagged rows highlighted',
  'items.page': 'page',
  'items.ofPages': 'of',
  'items.amountsIn': 'amounts in ₱ millions',
  'items.searchPlaceholder': 'Search description, code, office…',
  'items.export': 'Export CSV',
  'items.code': 'Code',
  'items.description': 'Description',
  'items.office': 'Office',
  'items.funding': 'Funding',
  'items.total': 'Total',
  'items.climate': 'Climate',
  'items.finishLine': 'Finish-Line',
  'items.mainstreaming': 'Mainstreaming',
  'items.first': '« First',
  'items.prev': '‹ Prev',
  'items.next': 'Next ›',
  'items.last': 'Last »',
  'items.noRows': 'No rows match the current filters',
  'items.noRowsSub': 'Try loosening a filter to see PAP line items.',
  'items.climateTagged': 'climate',

  // Band: Strategic overlays
  'overlays.eyebrow': 'Band E',
  'overlays.title': 'Strategic overlays',
  'overlays.sub': 'Finish-Line · Mainstreaming · Schedule',
  'overlays.finishLineSpend': '2028 Finish-Line spend',
  'overlays.perCluster': '₱M per cluster',
  'overlays.mainstreaming': 'Mainstreaming coverage',
  'overlays.devPlanSector': 'development plan × sector',
  'overlays.schedule': 'Schedule · PAPs active by quarter',
  'overlays.scheduleHint': 'start_date → end_date · counts overlap each quarter',
  'overlays.cityTotal': 'City-wide total',

  // Band A: Hero KPI
  'kpi.totalAIP': 'Total AIP 2026 · ₱ millions',
  'kpi.reported': 'Reported',
  'kpi.exOutliers': 'Ex-outliers',
  'kpi.programs': 'programs, projects & activities',
  'kpi.filteredView': '· filtered view',
  'kpi.splitShown': '· split shown ex-outliers',
  'kpi.climateSpend': 'Climate-tagged spend',
  'kpi.adaptation': 'Adaptation',
  'kpi.mitigation': 'Mitigation',
  'kpi.officesSectors': 'Implementing offices · sectors',
  'kpi.offices': 'offices',
  'kpi.sectors': 'sectors',
  'kpi.classified': 'Classified across 4 sector lenses and 7 Finish-Line clusters.',
  'kpi.dataIntegrity': 'Data integrity',
  'kpi.rowsClean': 'Rows clean',
  'kpi.flagged': 'Flagged (unit check)',
  'kpi.missingFunding': 'Missing funding',
  'kpi.lastUpdated': 'Last updated',
  'kpi.billion': 'billion',
  'kpi.million': 'million',

  // Banner
  'banner.outlierWarning': 'Reported total includes 22 flagged OSCA rows',
  'banner.outlierDetail': 'that appear to have been entered in raw pesos instead of millions.',
  'banner.toggleClean': 'Toggle',
  'banner.cleanTotal': 'to view the clean total of',
  'banner.acrossPaps': 'across 1,194 PAPs.',

  // Landing page
  'landing.issueLine.vol': 'VOL. XXVI · ISSUE 01',
  'landing.issueLine.date': 'FISCAL YEAR 2026',
  'landing.issueLine.cost': 'OPEN CIVIC BRIEFING',
  'landing.headline': 'A city',
  'landing.headlineBuilding': 'building toward',
  'landing.headline2028': '2028.',
  'landing.deck1': "Naga City's Annual Investment Program for 2026 commits",
  'landing.deck2': 'across',
  'landing.deck3': '— submitted by',
  'landing.deck4': ', mapped across four sector lenses, and aligned to seven 2028 Finish-Line clusters that the administration has pledged to deliver by the end of its term.',
  'landing.byline': 'An editorial dashboard by the Office of the City Mayor · Budget and Management. Every figure below links to the underlying line items.',
  'landing.totalAIP': 'Total 2026 AIP',
  'landing.totalAIPSub': 'Reported, before data-quality review',
  'landing.programsCount': 'Programs, projects, activities',
  'landing.submitted': 'Submitted Nov 2025',
  'landing.officesCount': 'Implementing offices',
  'landing.acrossFour': 'Across four sector mandates',
  'landing.scroll': 'Scroll',

  // Landing: Climate feature
  'landing.climateEyebrow': 'The climate line item',
  'landing.climateTitle1': 'Two percent',
  'landing.climateTitle2': 'of the budget',
  'landing.climateTitle3': '— and the',
  'landing.climateTitle4': 'entire case',
  'landing.climateTitle5': 'for resilience.',
  'landing.climateCopy1': 'Climate-tagged spending reaches',
  'landing.climateCopy1b': 'in 2026 — roughly',
  'landing.climateCopy1c': 'of a ₱2.85 billion budget. Modest on paper; consequential in practice.',
  'landing.climateCopy2': 'The two categories tell different stories. Adaptation — drainage, evacuation, early warning — absorbs most of the envelope. Mitigation — solar streetlights, waste-to-energy pilots, active-transport corridors — is smaller, and grows slowly. Both are underwritten almost entirely by the General Fund, which means council politics, not donor cycles, decide the pace.',
  'landing.climateCopy3': 'For a city that sits between two river systems and under a typhoon corridor, this line is less an expense than an insurance premium on the rest of the budget.',
  'landing.seeClimate': 'See every climate-tagged line →',
  'landing.climateSpend': 'Climate-tagged spend',
  'landing.adaptMitig': 'Adaptation + mitigation combined',
  'landing.capitalOutlay': 'Capital outlay',
  'landing.hardInfra': 'The hard infrastructure spine',

  // Landing: Clusters
  'landing.clustersEyebrow': 'Eight promises · 2028 Finish-Line',
  'landing.clustersTitle1': 'Where the money is',
  'landing.clustersTitle2': 'supposed',
  'landing.clustersTitle3': 'to land.',
  'landing.clustersLede': 'The Finish-Line framework organizes the 2028 administration commitments into eight clusters. Each spread below pulls its own 2026 envelope, its own PAP count, and the offices advancing it.',
  'landing.clusterOf': 'Cluster',
  'landing.of8': 'of 8',
  'landing.envelope2026': '2026 envelope',
  'landing.climateTagged': 'Climate-tagged',
  'landing.readCluster': 'Read the cluster page →',

  // Landing: Dig in
  'landing.diginEyebrow': 'The long view',
  'landing.diginTitle1': 'Every',
  'landing.diginTitle2': 'peso.',
  'landing.diginTitle3': 'Every',
  'landing.diginTitle4': 'office.',
  'landing.diginTitle5': 'Every',
  'landing.diginTitle6': 'line.',
  'landing.diginCopy': 'The landing page is editorial. The Data tab is operational — a full filterable registry of every PAP, with exports, climate flags, funding sources, and the 22 rows where the source spreadsheet reported outlier values we still need to reconcile.',
  'landing.openDashboard': 'Open the full dashboard →',
  'landing.browseCluster': 'Browse by cluster',

  // Landing: Footer
  'footer.published': 'Published',
  'footer.publishedVal': 'Naga City Office of the Mayor · Nov 2025',
  'footer.dataSource': 'Data source',
  'footer.dataSourceVal': 'AIP FY2026 submission · 1,216 rows × 23 columns',
  'footer.notes': 'Notes',
  'footer.notesVal': '22 OSCA rows flagged · 299 PAPs unspecified funding',

  // Dashboard footer
  'dash.aboutTitle': 'About this dashboard',
  'dash.aboutText': "Naga City's 2026 Annual Investment Program — ₱2.85 billion across 1,200+ programs, projects and activities submitted by 94 implementing offices. Classified across four sector lenses and seven 2028 Finish-Line clusters.",
  'dash.dataNotesTitle': 'Data notes',
  'dash.dataNotesText': 'All amounts in ₱ millions. 22 OSCA rows flagged as raw-peso outliers. 299 PAPs have no recorded funding source — shown as "Unspecified", never dropped. CSV export reflects current filter state.',
  'dash.schemaTitle': 'Schema',
  'dash.generated': 'generated',

  // Language selector
  'lang.en': 'EN',
  'lang.bik': 'BIK',
  'lang.english': 'English',
  'lang.bikol': 'Bikolano',

  // Loading
  'loading.paps': 'Loading 1,216 PAPs…',
  'loading.error': 'Could not load data',

  // Tweaks
  'tweaks.title': 'Tweaks',
  'tweaks.ariaLabel': 'Tweaks',
  'tweaks.accentPalette': 'Accent palette',
  'tweaks.warmIndigo': 'Warm Indigo',
  'tweaks.monsoonTeal': 'Monsoon Teal',
  'tweaks.bicolSunrise': 'Bicol Sunrise',
  'tweaks.density': 'Density',
  'tweaks.comfortable': 'Comfortable',
  'tweaks.compact': 'Compact',

  // Charts
  'charts.allSectors': 'All sectors',
  'charts.areaBudget': 'budget',
  'charts.colorFunding': 'dominant funding',
  'charts.climateTagged': 'climate-tagged',
};

const bik: TranslationMap = {
  // Topbar
  'topbar.title': 'Annual Investment Program — Taon Pisal 2026',
  'topbar.badge': 'Transparency',
  'topbar.about': 'Manungod',
  'topbar.contact': 'Kontak',

  // Nav
  'nav.home': 'Pangenotan',
  'nav.overview': 'Pananaw',

  // Page Hero
  'hero.2028cluster': '2028 Finish-Line Cluster',
  'hero.sector': 'Sektor',
  'hero.total': 'Kanoran',
  'hero.paps': 'PAPs',
  'hero.offices': 'Opisina',

  // Band: Headline
  'headline.eyebrow': 'Balangkas',
  'headline.title': 'Saindaw an ₱2.85 bilyon sa 2026',
  'headline.sub': 'Mga halaga sa Philippine pesos, milyon',

  // Band: Filters
  'filters.eyebrow': 'Sala',
  'filters.title': 'Salason an mga Proyekto',
  'filters.clickToFilter': 'I-klik tanganing salason an datos sa babâ',
  'filters.viewing': 'Pigbabantayan',
  'filters.useFilters': '— gumamit nin sala tanganing pahalipot',
  'filters.search': 'Panbasik',
  'filters.searchPlaceholder': 'Panbasik: mga proyekto, opisina…',
  'filters.sector': 'Sektor',
  'filters.fundingSource': 'Gikan nin Pondo',
  'filters.subcategory': 'Subkategorya',
  'filters.finishLine': '2028 Finish-Line Cluster',
  'filters.options': 'Mga Pagpilian',
  'filters.climateOnly': 'Mga proyekto kan klima sana',
  'filters.hideFlagged': 'Itago an mga na-flag',
  'filters.more': 'Dakolang sala',
  'filters.fewer': 'Maniid na sala',
  'filters.active': 'aktibo',
  'filters.showingAll': 'Pigpapahiling an gabos',
  'filters.projects': 'mga proyekto',
  'filters.of': 'sa',
  'filters.clearAll': 'puraon gabos',

  // Breadcrumb labels
  'crumb.sector': 'Sektor',
  'crumb.office': 'Opisina',
  'crumb.source': 'Gikan',
  'crumb.cluster': 'Cluster',
  'crumb.climateOnly': 'Mga proyekto kan klima sana',
  'crumb.flaggedShown': 'Mga na-flag pigpapahiling',

  // Band: Sectors
  'sectors.eyebrow': 'Mga Sektor',
  'sectors.title': 'Sektor mix asin mga Finish-Line tema',
  'sectors.sub': 'I-klik an sarong sektor o cluster tanganing magduman sa saiyang pahina',
  'sectors.overview': 'Pananaw nin mga Sektor',
  'sectors.clickFilter': 'i-klik an sarong hilera tanganing salason',
  'sectors.clickSector': 'i-klik an sarong hilera tanganing bukasan an pahina nin sektor',
  'sectors.amounts': 'mga halaga ₱ milyon',
  'sectors.ps': 'PS — Personal na Serbisyo',
  'sectors.mooe': 'MOOE — Pagmantener asin iba pang Operasyon',
  'sectors.co': 'CO — Capital Outlay',
  'sectors.chartExcludes': 'iskema daa nakaka-exclude kan 22 na-flag na outlier',
  'sectors.excluding': 'daa 22 na-flag na hilera an pigbabaan',

  // Band: Finish-Line
  'fl.clusters': 'Finish-Line clusters',
  'fl.naga2028': '2028 Naga',
  'fl.across': 'sa haros',
  'fl.clustersWord': 'mga cluster',

  // Band: Offices
  'offices.eyebrow': 'Mga Opisina',
  'offices.title': 'Dakulang pagsusuri kan mga Opisina',
  'offices.sectorTitle': 'Mga opisina sa ngosing sektor',
  'offices.clusterTitle': 'Mga programa nakasugpon sa ngosing cluster',
  'offices.sub': 'I-klik an tile tanganing magduman · i-klik an crumb tanganing magbalik',
  'offices.allSectors': 'Gabos na sektor',

  // Band: Line items
  'items.eyebrow': 'Linya nin mga bagay',
  'items.title': 'Rehistro nin PAP',
  'items.sub': 'Mababago · mga klima-tagged na hilera pigmarkahan · mga na-flag na hilera pig-highlight',
  'items.page': 'pahina',
  'items.ofPages': 'sa',
  'items.amountsIn': 'mga halaga sa ₱ milyon',
  'items.searchPlaceholder': 'Panbasik: deskripsyon, kodigo, opisina…',
  'items.export': 'I-export an CSV',
  'items.code': 'Kodigo',
  'items.description': 'Deskripsyon',
  'items.office': 'Opisina',
  'items.funding': 'Pondo',
  'items.total': 'Kanoran',
  'items.climate': 'Klima',
  'items.finishLine': 'Finish-Line',
  'items.mainstreaming': 'Mainstreaming',
  'items.first': '« Enot',
  'items.prev': '‹ Syante',
  'items.next': 'Sunod ›',
  'items.last': 'Huring »',
  'items.noRows': 'Mayong hilera an nakapatan sa ngosing sala',
  'items.noRowsSub': 'Subagan an pagpaluyang sala tanganing mahiling an mga linya nin PAP.',
  'items.climateTagged': 'klima',

  // Band: Strategic overlays
  'overlays.eyebrow': 'Band E',
  'overlays.title': 'Mga estratehikong overlay',
  'overlays.sub': 'Finish-Line · Mainstreaming · Iskedyul',
  'overlays.finishLineSpend': '2028 Finish-Line gastuson',
  'overlays.perCluster': '₱M kada cluster',
  'overlays.mainstreaming': 'Mainstreaming coverage',
  'overlays.devPlanSector': 'plan nin pagpatrastig × sektor',
  'overlays.schedule': 'Iskedyul · PAPs aktibo kada kwarter',
  'overlays.scheduleHint': 'start_date → end_date · mga bilang nag-iiba sa kada kwarter',
  'overlays.cityTotal': 'Kanoran kan syudad',

  // Band A: Hero KPI
  'kpi.totalAIP': 'Kanoran nin AIP 2026 · ₱ milyon',
  'kpi.reported': 'Naireport',
  'kpi.exOutliers': 'Daanan-Outlier',
  'kpi.programs': 'mga programa, proyekto asin aktibidad',
  'kpi.filteredView': '· pig-filter na pananaw',
  'kpi.splitShown': '· split pigpapahiling ex-outlier',
  'kpi.climateSpend': 'Klima-tagged na gastuson',
  'kpi.adaptation': 'Pag-akomodar',
  'kpi.mitigation': 'Pag-amiyon',
  'kpi.officesSectors': 'Mga nag-implementar na opisina · mga sektor',
  'kpi.offices': 'mga opisina',
  'kpi.sectors': 'mga sektor',
  'kpi.classified': 'Naklasipikar sa 4 na lente nin sektor asin 7 na Finish-Line cluster.',
  'kpi.dataIntegrity': 'Pagkakaintegridad nin datos',
  'kpi.rowsClean': 'Malinis na mga hilera',
  'kpi.flagged': 'Na-flag (unit check)',
  'kpi.missingFunding': 'Mayong pondo',
  'kpi.lastUpdated': 'Huring in-update',
  'kpi.billion': 'bilyon',
  'kpi.million': 'milyon',

  // Banner
  'banner.outlierWarning': 'An naireport na total kabali an 22 na-flag na OSCA hilera',
  'banner.outlierDetail': 'na garo piggamit sa pusog na pesos imbes na milyon.',
  'banner.toggleClean': 'I-toggle',
  'banner.cleanTotal': 'tanganing mahiling an malinis na total na',
  'banner.acrossPaps': 'sa 1,194 na PAPs.',

  // Landing page
  'landing.issueLine.vol': 'VOL. XXVI · ISYU 01',
  'landing.issueLine.date': 'TAON PISAL 2026',
  'landing.issueLine.cost': 'BUKAS NA CIVIC BRIEFING',
  'landing.headline': 'Sarong syudad',
  'landing.headlineBuilding': 'na minapatrastig pasiring sa',
  'landing.headline2028': '2028.',
  'landing.deck1': "An Annual Investment Program kan Syudad nin Naga para sa 2026 minatubod",
  'landing.deck2': 'sa haros',
  'landing.deck3': '— pigsSubmit nin',
  'landing.deck4': ', namapa sa apat na lente nin sektor, asin nakasugpon sa pito na 2028 Finish-Line cluster na an administrasyon na nangako ireber sa katapusan kan saiyang termino.',
  'landing.byline': 'Sarong editorial dashboard kan Opisina kan Alkalde kan Syudad · Budget asin Management. Kada numero sa babâ nakasugpon sa mga nasa irarom na linya.',
  'landing.totalAIP': 'Kanoran nin AIP 2026',
  'landing.totalAIPSub': 'Naireport, bago an pag-usisa sa kalidad nin datos',
  'landing.programsCount': 'Mga programa, proyekto, aktibidad',
  'landing.submitted': 'NagsSubmit Nob 2025',
  'landing.officesCount': 'Mga nag-implementar na opisina',
  'landing.acrossFour': 'Sa apat na mandato nin sektor',
  'landing.scroll': 'I-Scroll',

  // Landing: Climate feature
  'landing.climateEyebrow': 'An linya nin klima',
  'landing.climateTitle1': 'Duwang porsyento',
  'landing.climateTitle2': 'kan budget',
  'landing.climateTitle3': '— asin an',
  'landing.climateTitle4': 'enterong kaso',
  'landing.climateTitle5': 'para sa resilience.',
  'landing.climateCopy1': 'An klima-tagged na gastuson nakakabot sa',
  'landing.climateCopy1b': 'sa 2026 — haros',
  'landing.climateCopy1c': 'sa ₱2.85 bilyon na budget. Modesto sa papel; Importante sa praktika.',
  'landing.climateCopy2': 'An duwang kategorya nagsasaysay nin manlain-lain na istorya. Adaptation — drainage, evacuation, amayan na patal — nag-aabsorb sa pinakadakulang parte kan sobre. Mitigation — solar streetlights, mga pilotong waste-to-energy, aktibong-transporte na mga corridor — mas sadit, asin magliyang marhay. An duwa pinopondohan haros na enteron kan General Fund, na boot sabihon an pulitika kan konseho, daa an donor cycles, an nagdedesisyon kan rikas.',
  'landing.climateCopy3': 'Para sa sarong syudad na nakatuktok sa pag-ultanan kan duwang sistemang salog asin sa irarom nin typhoon corridor, ining linya mas habo gastos kisa insurance premium sa ibang kabtang kan budget.',
  'landing.seeClimate': 'Hilingon an lambang klima-tagged na linya →',
  'landing.climateSpend': 'Klima-tagged na gastuson',
  'landing.adaptMitig': 'Adaptation + mitigation pinagsararo',
  'landing.capitalOutlay': 'Capital outlay',
  'landing.hardInfra': 'An matagas na pundo nin infraestructura',

  // Landing: Clusters
  'landing.clustersEyebrow': 'Walong pangako · 2028 Finish-Line',
  'landing.clustersTitle1': 'Sain an kwarta',
  'landing.clustersTitle2': 'dapat',
  'landing.clustersTitle3': 'magduman.',
  'landing.clustersLede': 'An Finish-Line framework minapalaman an 2028 pangako nin administrasyon sa walong cluster. Kada spread sa babâ nag-iibot kan saiyang sadiring 2026 sobre, saiyang sadiring bilang nin PAP, asin an mga opisina na mina-advance saiya.',
  'landing.clusterOf': 'Cluster',
  'landing.of8': 'sa 8',
  'landing.envelope2026': '2026 sobre',
  'landing.climateTagged': 'Klima-tagged',
  'landing.readCluster': 'Basahon an pahina nin cluster →',

  // Landing: Dig in
  'landing.diginEyebrow': 'An halawig na pananaw',
  'landing.diginTitle1': 'Kada',
  'landing.diginTitle2': 'peso.',
  'landing.diginTitle3': 'Kada',
  'landing.diginTitle4': 'opisina.',
  'landing.diginTitle5': 'Kada',
  'landing.diginTitle6': 'linya.',
  'landing.diginCopy': 'An landing page editorial. An Data tab operasyonal — sarong bilog na filterable na rehistro nin lambang PAP, may mga export, klima flags, mga source nin pondo, asin an 22 na hilera kun saen an source spreadsheet naireport na outlier na mga valor na kaipuhan pa nato irekonkilar.',
  'landing.openDashboard': 'Bukasan an bilog na dashboard →',
  'landing.browseCluster': 'Mag-browse base sa cluster',

  // Landing: Footer
  'footer.published': 'Naipublikar',
  'footer.publishedVal': 'Syudad nin Naga Opisina kan Alkalde · Nob 2025',
  'footer.dataSource': 'Gikan nin datos',
  'footer.dataSourceVal': 'AIP FY2026 submission · 1,216 na hilera × 23 na kolum',
  'footer.notes': 'Mga Nota',
  'footer.notesVal': '22 OSCA na hilera na-flag · 299 PAPs daang pondo',

  // Dashboard footer
  'dash.aboutTitle': 'Manungod sa dashboard',
  'dash.aboutText': "An 2026 Annual Investment Program kan Syudad nin Naga — ₱2.85 bilyon sa haros 1,200+ na mga programa, proyekto asin aktibidad pigsSubmit nin 94 na nag-implementar na opisina. Naklasipikar sa apat na lente nin sektor asin pito na 2028 Finish-Line cluster.",
  'dash.dataNotesTitle': 'Mga Nota nin datos',
  'dash.dataNotesText': 'Gabos na halaga sa ₱ milyon. 22 OSCA na hilera na-flag bilang raw-peso outlier. 299 PAPs mayo nin naitala na source nin pondo — pigpapahiling bilang "Daang Pondo", daa pinababaan. An CSV export nagpapahiling sa ngosing estado nin filter.',
  'dash.schemaTitle': 'Schema',
  'dash.generated': 'ginibo',

  // Language selector
  'lang.en': 'EN',
  'lang.bik': 'BIK',
  'lang.english': 'English',
  'lang.bikol': 'Bikolano',

  // Loading
  'loading.paps': 'Minakarga an 1,216 na PAPs…',
  'loading.error': 'Daa makarga an datos',

  // Tweaks
  'tweaks.title': 'Mga Ayus',
  'tweaks.ariaLabel': 'Mga Ayus',
  'tweaks.accentPalette': 'Palette nin accent',
  'tweaks.warmIndigo': 'Mainit na Indigo',
  'tweaks.monsoonTeal': 'Monsoon Teal',
  'tweaks.bicolSunrise': 'Bicol Sunrise',
  'tweaks.density': 'Densidad',
  'tweaks.comfortable': 'Marhay na pahingalo',
  'tweaks.compact': 'Pigkompak',

  // Charts
  'charts.allSectors': 'Gabos na sektor',
  'charts.areaBudget': 'budget',
  'charts.colorFunding': 'dominanteng pondo',
  'charts.climateTagged': 'klima-tagged',
};

export const translations: Record<Locale, TranslationMap> = { en, bik };
