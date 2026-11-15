import { useEffect, useMemo, useState } from 'react';
import { ALL_CARS, UPCOMING_AUCTIONS } from './data/cars';
import type {
  CalculatorPrefill,
  CarListing,
  ExportCountry,
  FilterState,
  PlatformCategory,
  SegmentKey,
} from './types/car';
import { Header, type ActivePage } from './components/Header';
import { HeroSegments } from './components/HeroSegments';
import { ManagerBanner } from './components/ManagerBanner';
import { ExportAndSearch } from './components/ExportAndSearch';
import { FilterPanel } from './components/FilterPanel';
import { CatalogSection } from './components/CatalogSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { CalculatorPage } from './components/CalculatorPage';
import { CarDetailPage } from './components/CarDetailPage';
import { ManagerModal } from './components/ManagerModal';

const INITIAL_FILTERS: FilterState = {
  segment: null,
  country: null,
  platformCategory: 'Наш автопарк',
  subPlatform: '',
  upcomingAuction: '',
  search: '',
  brand: '',
  model: '',
  bodyType: '',
  fuel: '',
  transmission: '',
  drive: '',
  yearFrom: '',
  yearTo: '',
  engineFrom: '',
  engineTo: '',
  priceFrom: '',
  priceTo: '',
  mileageFrom: '',
  mileageTo: '',
  sort: 'default',
};

function getCarIdFromHash(): string | null {
  if (typeof window !== 'undefined' && window.location.hash.startsWith('#/listings/')) {
    const id = window.location.hash.slice('#/listings/'.length).trim();
    return id || null;
  }
  return null;
}

function findCarByHash(): CarListing | null {
  const id = getCarIdFromHash();
  if (!id) return null;
  return ALL_CARS.find((c) => c.id === id) || null;
}

function getPageFromHash(): ActivePage {
  if (typeof window !== 'undefined') {
    if (window.location.hash === '#/calculator') return 'calculator';
    if (window.location.hash === '#/about') return 'about';
    if (findCarByHash()) return 'listing';
  }
  return 'catalog';
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activePage, setActivePage] = useState<ActivePage>(getPageFromHash);
  const [activeNavSection, setActiveNavSection] = useState<
    'catalog' | 'auctions' | 'calculator' | 'about'
  >(() => {
    const initial = getPageFromHash();
    if (initial === 'calculator') return 'calculator';
    if (initial === 'about') return 'about';
    return 'catalog';
  });

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [selectedCar, setSelectedCar] = useState<CarListing | null>(findCarByHash);
  const [calculatorPrefill, setCalculatorPrefill] = useState<CalculatorPrefill | null>(null);

  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [managerInitialTab, setManagerInitialTab] = useState<'text' | 'voice'>('text');
  const [managerPrefillMessage, setManagerPrefillMessage] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const onHashChange = () => {
      const nextCar = findCarByHash();
      const nextPage = getPageFromHash();
      setSelectedCar(nextCar);
      setActivePage(nextPage);
      setActiveNavSection(
        nextPage === 'calculator'
          ? 'calculator'
          : nextPage === 'about'
          ? 'about'
          : 'catalog'
      );
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const selectPlatformCategory = (category: PlatformCategory) => {
    setShowFavoritesOnly(false);
    setFilters((prev) => ({
      ...prev,
      platformCategory: category,
      subPlatform: '',
      upcomingAuction: category === 'Аукционы' ? prev.upcomingAuction : '',
    }));
  };

  const selectUpcomingAuction = (auctionLabel: string) => {
    setShowFavoritesOnly(false);
    setFilters((prev) => {
      const matchedSlot = UPCOMING_AUCTIONS.find((a) => a.label === auctionLabel);
      const keepSub =
        !auctionLabel || !prev.subPlatform || (matchedSlot && matchedSlot.house === prev.subPlatform);
      return {
        ...prev,
        upcomingAuction: auctionLabel,
        subPlatform: keepSub ? prev.subPlatform : '',
      };
    });
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setShowFavoritesOnly(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openManager = (tab: 'text' | 'voice' = 'text', prefill = '') => {
    setManagerInitialTab(tab);
    setManagerPrefillMessage(prefill);
    setManagerModalOpen(true);
  };

  const openCarPage = (car: CarListing) => {
    setSelectedCar(car);
    setActivePage('listing');
    setActiveNavSection('catalog');
    window.location.hash = `#/listings/${car.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (target: 'catalog' | 'auctions' | 'calculator' | 'about') => {
    setActiveNavSection(target);
    if (target === 'calculator') {
      window.location.hash = '#/calculator';
      setActivePage('calculator');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (target === 'about') {
      window.location.hash = '#/about';
      setActivePage('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (
      window.location.hash === '#/calculator' ||
      window.location.hash === '#/about' ||
      window.location.hash.startsWith('#/listings/')
    ) {
      window.location.hash = '#/';
    }
    setActivePage('catalog');

    if (target === 'auctions') {
      selectPlatformCategory('Аукционы');
      setTimeout(() => {
        document.getElementById('filters-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSegment = (segment: SegmentKey | null) => {
    setShowFavoritesOnly(false);
    updateFilter('segment', segment);
    if (segment) {
      setTimeout(() => {
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  };

  const handleSelectCountry = (country: ExportCountry | null) => {
    updateFilter('country', country);
  };

  const segmentCounts = useMemo(() => {
    const counts: Record<SegmentKey, number> = {
      'under-10k': 0,
      'under-15k': 0,
      'under-20k': 0,
      'under-25k': 0,
      premium: 0,
    };
    ALL_CARS.forEach((car) => {
      counts[car.segment] += 1;
    });
    return counts;
  }, []);

  const categoryCounts = useMemo(() => {
    const map: Record<PlatformCategory, number> = {
      'Наш автопарк': 0,
      'Площадки Кореи': 0,
      Аукционы: 0,
    };
    ALL_CARS.forEach((car) => {
      if (filters.country && car.country !== filters.country) return;
      if (filters.segment && car.segment !== filters.segment) return;
      map[car.platformCategory] = (map[car.platformCategory] || 0) + 1;
    });
    return map;
  }, [filters.country, filters.segment]);

  const subPlatformCounts = useMemo(() => {
    const map: Record<string, number> = {};
    ALL_CARS.forEach((car) => {
      if (car.platformCategory !== filters.platformCategory) return;
      if (filters.country && car.country !== filters.country) return;
      if (filters.segment && car.segment !== filters.segment) return;
      map[car.platform] = (map[car.platform] || 0) + 1;
    });
    return map;
  }, [filters.platformCategory, filters.country, filters.segment]);

  const upcomingAuctionCounts = useMemo(() => {
    const map: Record<string, number> = {};
    ALL_CARS.forEach((car) => {
      if (car.platformCategory !== 'Аукционы' || !car.upcomingAuction) return;
      if (filters.country && car.country !== filters.country) return;
      if (filters.segment && car.segment !== filters.segment) return;
      map[car.upcomingAuction] = (map[car.upcomingAuction] || 0) + 1;
    });
    return map;
  }, [filters.country, filters.segment]);

  const filteredCars = useMemo(() => {
    if (!showFavoritesOnly && filters.country && filters.country !== 'Южная Корея') {
      return [];
    }

    const q = filters.search.trim().toLowerCase();
    const yFrom = filters.yearFrom ? Number(filters.yearFrom) : null;
    const yTo = filters.yearTo ? Number(filters.yearTo) : null;
    const eFrom = filters.engineFrom ? Number(filters.engineFrom) * 1000 : null;
    const eTo = filters.engineTo ? Number(filters.engineTo) * 1000 : null;
    const pFrom = filters.priceFrom ? Number(filters.priceFrom) : null;
    const pTo = filters.priceTo ? Number(filters.priceTo) : null;
    const mFrom = filters.mileageFrom ? Number(filters.mileageFrom) : null;
    const mTo = filters.mileageTo ? Number(filters.mileageTo) : null;

    const list = ALL_CARS.filter((car) => {
      if (showFavoritesOnly) {
        if (!favorites.has(car.id)) return false;
      } else {
        if (car.platformCategory !== filters.platformCategory) return false;
        if (filters.subPlatform && car.platform !== filters.subPlatform) return false;
        if (
          filters.platformCategory === 'Аукционы' &&
          filters.upcomingAuction &&
          car.upcomingAuction !== filters.upcomingAuction
        ) {
          return false;
        }
      }

      if (filters.segment && car.segment !== filters.segment) return false;
      if (filters.country && car.country !== filters.country) return false;
      if (filters.brand && car.brand !== filters.brand) return false;
      if (filters.model && car.model !== filters.model) return false;
      if (filters.bodyType && car.bodyType !== filters.bodyType) return false;
      if (filters.fuel && car.fuel !== filters.fuel) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.drive && car.drive !== filters.drive) return false;

      if (yFrom !== null && car.year < yFrom) return false;
      if (yTo !== null && car.year > yTo) return false;
      if (eFrom !== null && car.engineCc < eFrom) return false;
      if (eTo !== null && car.engineCc > eTo) return false;
      if (pFrom !== null && car.priceUsd < pFrom) return false;
      if (pTo !== null && car.priceUsd > pTo) return false;
      if (mFrom !== null && car.mileageKm < mFrom) return false;
      if (mTo !== null && car.mileageKm > mTo) return false;

      if (q) {
        const haystack = [
          car.brand,
          car.model,
          car.trim,
          car.vin,
          car.color,
          car.fuel,
          car.country,
          car.platform,
          ...car.labels,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    if (filters.sort === 'price-asc') {
      return [...list].sort((a, b) => a.priceUsd - b.priceUsd);
    }
    if (filters.sort === 'price-desc') {
      return [...list].sort((a, b) => b.priceUsd - a.priceUsd);
    }
    if (filters.sort === 'year-desc') {
      return [...list].sort((a, b) => b.year - a.year);
    }
    if (filters.sort === 'mileage-asc') {
      return [...list].sort((a, b) => a.mileageKm - b.mileageKm);
    }
    return list;
  }, [filters, showFavoritesOnly, favorites]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.segment) count++;
    if (filters.country) count++;
    if (filters.upcomingAuction) count++;
    if (filters.search.trim()) count++;
    if (filters.brand) count++;
    if (filters.model) count++;
    if (filters.bodyType) count++;
    if (filters.fuel) count++;
    if (filters.transmission) count++;
    if (filters.drive) count++;
    if (filters.yearFrom || filters.yearTo) count++;
    if (filters.engineFrom || filters.engineTo) count++;
    if (filters.priceFrom || filters.priceTo) count++;
    if (filters.mileageFrom || filters.mileageTo) count++;
    if (filters.sort !== 'default') count++;
    return count;
  }, [filters]);

  useEffect(() => {
    if (activePage === 'calculator') {
      setActiveNavSection('calculator');
    } else if (activePage === 'about') {
      setActiveNavSection('about');
    } else if (filters.platformCategory === 'Аукционы') {
      setActiveNavSection('auctions');
    } else if (activeNavSection === 'auctions' || activeNavSection === 'about' || activeNavSection === 'calculator') {
      setActiveNavSection('catalog');
    }
  }, [activePage, filters.platformCategory, activeNavSection]);

  const activePlatformLabel = useMemo(() => {
    if (filters.platformCategory === 'Аукционы' && filters.upcomingAuction) {
      return `Аукционы · ${filters.upcomingAuction}`;
    }
    if (filters.subPlatform) {
      return `${filters.platformCategory} · ${filters.subPlatform}`;
    }
    return filters.platformCategory;
  }, [filters.platformCategory, filters.subPlatform, filters.upcomingAuction]);

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-900 transition-colors duration-200 dark:bg-[#000000] dark:text-slate-100">
      <Header
        activePage={activePage}
        activeNavSection={activeNavSection}
        onNavigate={navigateTo}
        onOpenManager={() => openManager('text')}
        favoritesCount={favorites.size}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => {
          setShowFavoritesOnly((prev) => !prev);
          if (activePage !== 'catalog') navigateTo('catalog');
          setTimeout(() => {
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 60);
        }}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      />

      {activePage === 'calculator' ? (
        <CalculatorPage
          prefill={calculatorPrefill}
          onBackToCatalog={() => navigateTo('catalog')}
          onOrderFromCalculator={(summary) => openManager('text', summary)}
        />
      ) : activePage === 'about' ? (
        <AboutSection
          onOpenManager={() => openManager('text')}
          onOpenCalculator={() => navigateTo('calculator')}
          onBackToCatalog={() => navigateTo('catalog')}
        />
      ) : activePage === 'listing' && selectedCar ? (
        <CarDetailPage
          car={selectedCar}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onBackToCatalog={() => navigateTo('catalog')}
          onSelectCar={openCarPage}
          onOrderCar={(car) =>
            openManager(
              'text',
              `Интересует авто: ${car.brand} ${car.model} (${car.year}), ${car.platform} / ${car.country}, VIN ${car.vin}, цена под ключ $${car.priceUsd.toLocaleString('ru-RU')}.`
            )
          }
          onOpenInCalculator={(prefill) => {
            setCalculatorPrefill(prefill);
            navigateTo('calculator');
          }}
        />
      ) : (
        <main>
          <HeroSegments
            selectedSegment={filters.segment}
            onSelectSegment={handleSelectSegment}
            segmentCounts={segmentCounts}
          />

          <ManagerBanner theme={theme} onOpenManager={(tab) => openManager(tab || 'voice')} />

          <ExportAndSearch
            selectedCountry={filters.country}
            onSelectCountry={handleSelectCountry}
            searchQuery={filters.search}
            onSearchChange={(val) => updateFilter('search', val)}
            totalMatchedCount={filteredCars.length}
          />

          <FilterPanel
            filters={filters}
            onUpdateFilter={updateFilter}
            onSelectPlatformCategory={selectPlatformCategory}
            onSelectUpcomingAuction={selectUpcomingAuction}
            onResetFilters={resetFilters}
            categoryCounts={categoryCounts}
            subPlatformCounts={subPlatformCounts}
            upcomingAuctionCounts={upcomingAuctionCounts}
            activeFilterCount={activeFilterCount}
            matchedCount={filteredCars.length}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            onScrollToCatalog={() =>
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })
            }
          />

          <CatalogSection
            cars={filteredCars}
            totalAvailable={ALL_CARS.length}
            onSelectCar={openCarPage}
            onOpenManager={() => openManager('text')}
            onResetFilters={resetFilters}
            onSelectSouthKorea={() => handleSelectCountry('Южная Корея')}
            selectedCountry={filters.country}
            activePlatformLabel={activePlatformLabel}
            viewMode={viewMode}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
          />
        </main>
      )}

      <Footer onNavigate={navigateTo} />

      <ManagerModal
        isOpen={managerModalOpen}
        initialTab={managerInitialTab}
        prefillMessage={managerPrefillMessage}
        onClose={() => setManagerModalOpen(false)}
      />
    </div>
  );
}
