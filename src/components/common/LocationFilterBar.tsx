import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Globe,
  Landmark,
  X,
  Search,
  Check,
  ChevronDown,
  Building2,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import {
  INDIA_LOCATION_DATA,
  INTERNATIONAL_LOCATION_DATA,
  StateRegionItem,
  CityItem
} from '../../data/locationHierarchy';

export interface LocationFilterSelection {
  region: 'ALL' | 'India' | 'International';
  stateId: string | null;
  stateName: string | null;
  cityId: string | null;
  cityName: string | null;
}

interface LocationFilterBarProps {
  selection: LocationFilterSelection;
  onChange: (newSelection: LocationFilterSelection) => void;
  resultCount?: number;
  itemTypeLabel?: string; // e.g. "Residential Properties", "Commercial Spaces", "Rentals", "News Articles"
}

export default function LocationFilterBar({
  selection,
  onChange,
  resultCount,
  itemTypeLabel = 'Listings'
}: LocationFilterBarProps) {
  const [activeRegion, setActiveRegion] = useState<'India' | 'International'>(
    selection.region === 'International' ? 'International' : 'India'
  );
  const [activeStateId, setActiveStateId] = useState<string | null>(selection.stateId);
  const [activeCityId, setActiveCityId] = useState<string | null>(selection.cityId);
  const [showVisualGrid, setShowVisualGrid] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  // Synchronize state when external selection prop changes
  useEffect(() => {
    if (selection.region === 'International' || selection.region === 'India') {
      setActiveRegion(selection.region);
    }
    setActiveStateId(selection.stateId);
    setActiveCityId(selection.cityId);
  }, [selection.region, selection.stateId, selection.cityId]);

  const stateData: StateRegionItem[] =
    activeRegion === 'International' ? INTERNATIONAL_LOCATION_DATA : INDIA_LOCATION_DATA;

  // Find currently active state object
  const currentStateObj = stateData.find((s) => s.id === activeStateId) || null;

  // Available cities for the city dropdown
  const availableCities: CityItem[] = currentStateObj
    ? currentStateObj.cities
    : stateData.flatMap((s) => s.cities);

  // Quick search city list
  const allCitiesInRegion = stateData.flatMap((s) =>
    s.cities.map((c) => ({ ...c, stateName: s.name, stateId: s.id }))
  );

  const searchedCities = citySearch.trim()
    ? allCitiesInRegion.filter(
        (c) =>
          c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
          c.stateName.toLowerCase().includes(citySearch.toLowerCase()) ||
          (c.subtitle && c.subtitle.toLowerCase().includes(citySearch.toLowerCase()))
      )
    : [];

  // Dropdown Handlers
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionVal = e.target.value as 'ALL' | 'India' | 'International';
    if (regionVal === 'ALL') {
      setActiveStateId(null);
      setActiveCityId(null);
      setCitySearch('');
      onChange({
        region: 'ALL',
        stateId: null,
        stateName: null,
        cityId: null,
        cityName: null
      });
    } else {
      setActiveRegion(regionVal);
      setActiveStateId(null);
      setActiveCityId(null);
      setCitySearch('');
      onChange({
        region: regionVal,
        stateId: null,
        stateName: null,
        cityId: null,
        cityName: null
      });
    }
  };

  const handleStateDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateValue = e.target.value;
    setCitySearch('');

    if (!selectedStateValue || selectedStateValue === 'ALL') {
      setActiveStateId(null);
      setActiveCityId(null);
      onChange({
        region: selection.region === 'ALL' ? 'ALL' : activeRegion,
        stateId: null,
        stateName: null,
        cityId: null,
        cityName: null
      });
    } else {
      const foundState = stateData.find((s) => s.id === selectedStateValue);
      if (foundState) {
        setActiveStateId(foundState.id);
        setActiveCityId(null);
        onChange({
          region: activeRegion,
          stateId: foundState.id,
          stateName: foundState.name,
          cityId: null,
          cityName: null
        });
      }
    }
  };

  const handleCityDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityValue = e.target.value;
    setCitySearch('');

    if (!selectedCityValue || selectedCityValue === 'ALL') {
      setActiveCityId(null);
      onChange({
        region: activeRegion,
        stateId: activeStateId,
        stateName: currentStateObj ? currentStateObj.name : null,
        cityId: null,
        cityName: null
      });
    } else {
      // Find the city in state data
      let targetCity: CityItem | undefined;
      let parentState: StateRegionItem | undefined;

      for (const s of stateData) {
        const found = s.cities.find((c) => c.id === selectedCityValue);
        if (found) {
          targetCity = found;
          parentState = s;
          break;
        }
      }

      if (targetCity && parentState) {
        setActiveStateId(parentState.id);
        setActiveCityId(targetCity.id);
        onChange({
          region: activeRegion,
          stateId: parentState.id,
          stateName: parentState.name,
          cityId: targetCity.id,
          cityName: targetCity.name
        });
      }
    }
  };

  const handleClearAll = () => {
    setActiveStateId(null);
    setActiveCityId(null);
    setCitySearch('');
    onChange({
      region: 'ALL',
      stateId: null,
      stateName: null,
      cityId: null,
      cityName: null
    });
  };

  const handleStatePillClick = (state: StateRegionItem) => {
    setActiveStateId(state.id);
    setActiveCityId(null);
    setCitySearch('');
    onChange({
      region: activeRegion,
      stateId: state.id,
      stateName: state.name,
      cityId: null,
      cityName: null
    });
  };

  const handleCityPillClick = (city: CityItem, stateId: string, stateName: string) => {
    setActiveStateId(stateId);
    setActiveCityId(city.id);
    setCitySearch('');
    onChange({
      region: activeRegion,
      stateId: stateId,
      stateName: stateName,
      cityId: city.id,
      cityName: city.name
    });
  };

  const hasActiveFilter =
    selection.region !== 'ALL' || selection.stateId !== null || selection.cityId !== null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/90 overflow-hidden mb-6 transition-all">
      {/* Top Bar: Title, Region Toggle & Reset */}
      <div className="bg-[#18181B] text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#D61F26] text-white rounded-xl shadow-md flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Location Filter
              </h3>
              <span className="bg-red-950/80 text-red-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-red-800/60">
                State & City Dropdown
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Select your preferred State and City from the dropdown lists below to filter {itemTypeLabel.toLowerCase()}.
            </p>
          </div>
        </div>

        {/* Region Toggle Buttons & Clear Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-gray-800/90 p-1 rounded-xl border border-gray-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveRegion('India');
                setActiveStateId(null);
                setActiveCityId(null);
                setCitySearch('');
                onChange({
                  region: 'India',
                  stateId: null,
                  stateName: null,
                  cityId: null,
                  cityName: null
                });
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                selection.region === 'India' || (activeRegion === 'India' && selection.region !== 'International' && selection.region !== 'ALL')
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span className="text-base leading-none">🇮🇳</span>
              <span>India</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRegion('International');
                setActiveStateId(null);
                setActiveCityId(null);
                setCitySearch('');
                onChange({
                  region: 'International',
                  stateId: null,
                  stateName: null,
                  cityId: null,
                  cityName: null
                });
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                selection.region === 'International'
                  ? 'bg-[#D61F26] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>International</span>
            </button>
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-red-400 text-xs font-bold rounded-xl border border-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Reset All Location Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowVisualGrid(!showVisualGrid)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showVisualGrid
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-gray-800 text-gray-400 hover:text-white border-gray-700'
            }`}
            title="Toggle Quick State & City Tags"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Browse Tags</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showVisualGrid ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* DROPDOWN SELECTORS CONTAINER */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-gray-50 to-white space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
          
          {/* 1. Country / Region Dropdown */}
          <div className="lg:col-span-3">
            <label
              htmlFor="location-region-dropdown"
              className="block text-[11.5px] font-extrabold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#D61F26]" />
              <span>1. Region / Country</span>
            </label>
            <div className="relative">
              <select
                id="location-region-dropdown"
                value={selection.region === 'ALL' ? 'ALL' : activeRegion}
                onChange={handleRegionChange}
                className="w-full appearance-none bg-white border-2 border-gray-200 hover:border-gray-400 focus:border-[#D61F26] text-gray-900 text-[13.5px] font-bold px-3.5 py-2.5 rounded-xl shadow-xs focus:outline-none cursor-pointer pr-9"
              >
                <option value="ALL">🌐 All Locations (India & International)</option>
                <option value="India">🇮🇳 India (All 17 States & Metros)</option>
                <option value="International">🌍 International (UAE, UK, USA, Singapore, etc.)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* 2. State Dropdown */}
          <div className="lg:col-span-4">
            <label
              htmlFor="location-state-dropdown"
              className="block text-[11.5px] font-extrabold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1.5"
            >
              <Landmark className="w-3.5 h-3.5 text-[#D61F26]" />
              <span>2. Select State ({stateData.length} available)</span>
            </label>
            <div className="relative">
              <select
                id="location-state-dropdown"
                value={activeStateId || 'ALL'}
                onChange={handleStateDropdownChange}
                className={`w-full appearance-none bg-white border-2 text-[13.5px] font-bold px-3.5 py-2.5 rounded-xl shadow-xs focus:outline-none cursor-pointer pr-9 transition-colors ${
                  activeStateId
                    ? 'border-[#D61F26] text-gray-900 bg-red-50/20'
                    : 'border-gray-200 hover:border-gray-400 text-gray-800'
                }`}
              >
                <option value="ALL">
                  -- All States / Regions in {activeRegion} --
                </option>
                {stateData.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.flag ? `${state.flag} ` : ''}
                    {state.name} ({state.cities.length} {state.cities.length === 1 ? 'City' : 'Cities'})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* 3. City Dropdown */}
          <div className="lg:col-span-5">
            <label
              htmlFor="location-city-dropdown"
              className="block text-[11.5px] font-extrabold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-[#D61F26]" />
              <span>
                3. Select City
                {currentStateObj ? ` in ${currentStateObj.name}` : ` (${availableCities.length} Cities)`}
              </span>
            </label>
            <div className="relative">
              <select
                id="location-city-dropdown"
                value={activeCityId || 'ALL'}
                onChange={handleCityDropdownChange}
                className={`w-full appearance-none bg-white border-2 text-[13.5px] font-bold px-3.5 py-2.5 rounded-xl shadow-xs focus:outline-none cursor-pointer pr-9 transition-colors ${
                  activeCityId
                    ? 'border-[#D61F26] text-gray-900 bg-red-50/30 ring-2 ring-red-500/20'
                    : 'border-gray-200 hover:border-gray-400 text-gray-800'
                }`}
              >
                <option value="ALL">
                  {currentStateObj
                    ? `-- All Cities in ${currentStateObj.name} --`
                    : `-- Select a City (${availableCities.length} Cities) --`}
                </option>

                {currentStateObj ? (
                  // If a specific state is selected, list its cities
                  currentStateObj.cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} {city.subtitle ? `— (${city.subtitle})` : ''}
                    </option>
                  ))
                ) : (
                  // If no state is selected, group cities by state
                  stateData.map((state) => (
                    <optgroup key={state.id} label={`${state.flag || '📍'} ${state.name}`}>
                      {state.cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name} ({state.name})
                        </option>
                      ))}
                    </optgroup>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* ACTIVE FILTER STATUS BAR & BREADCRUMB */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-200/80">
          
          {/* Breadcrumb Path Display */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-bold text-gray-500">Active Location:</span>
            
            {selection.region === 'ALL' && !selection.stateName && !selection.cityName ? (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200">
                🌐 All Locations (Pan India & Global)
              </span>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-gray-900 text-white px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1">
                  {activeRegion === 'International' ? '🌐 International' : '🇮🇳 India'}
                </span>

                {selection.stateName && (
                  <>
                    <span className="text-gray-400 text-xs">/</span>
                    <span className="bg-gray-100 text-gray-800 border border-gray-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <span>{selection.stateName}</span>
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...selection,
                            stateId: null,
                            stateName: null,
                            cityId: null,
                            cityName: null
                          })
                        }
                        className="p-0.5 hover:bg-gray-200 rounded text-gray-500 ml-0.5 cursor-pointer"
                        title="Remove State Filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  </>
                )}

                {selection.cityName && (
                  <>
                    <span className="text-gray-400 text-xs">/</span>
                    <span className="bg-[#D61F26] text-white px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm animate-fade-in">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{selection.cityName}</span>
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...selection,
                            cityId: null,
                            cityName: null
                          })
                        }
                        className="p-0.5 hover:bg-red-700 rounded text-white ml-1 cursor-pointer"
                        title="Remove City Filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Results count pill */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {typeof resultCount === 'number' && (
              <span className="text-xs bg-gray-100 border border-gray-200 text-gray-800 font-extrabold px-3 py-1 rounded-lg shadow-xs">
                Found <strong className="text-[#D61F26]">{resultCount}</strong> {itemTypeLabel}
              </span>
            )}
          </div>

        </div>

        {/* OPTIONAL VISUAL BROWSE SECTION (EXPANDABLE) */}
        {showVisualGrid && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 bg-white p-4 rounded-xl border border-gray-200/90 shadow-inner">
            {/* Quick City Search Box */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder={`Search city or locality in ${activeRegion}...`}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-800 focus:outline-none focus:border-[#D61F26]"
              />
              {citySearch && (
                <button
                  type="button"
                  onClick={() => setCitySearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {citySearch.trim() ? (
              <div>
                <p className="text-[11.5px] font-bold text-gray-600 mb-2">
                  Matching Cities ({searchedCities.length}):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {searchedCities.map((city) => {
                    const isSelected = selection.cityId === city.id;
                    return (
                      <button
                        key={`${city.stateId}-${city.id}`}
                        type="button"
                        onClick={() => handleCityPillClick(city, city.stateId, city.stateName)}
                        className={`p-2.5 rounded-xl text-left border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#D61F26] text-white border-[#D61F26] shadow-sm'
                            : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-400 hover:bg-white'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {city.name}
                          </p>
                          <p className={`text-[10.5px] truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                            {city.stateName} {city.subtitle ? `• ${city.subtitle}` : ''}
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {/* State Tag Pills */}
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-2">
                    Click State Pill to Filter:
                  </p>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {stateData.map((state) => {
                      const isStateActive = currentStateObj?.id === state.id;
                      return (
                        <button
                          key={state.id}
                          type="button"
                          onClick={() => handleStatePillClick(state)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                            isStateActive
                              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {state.flag && <span>{state.flag}</span>}
                          <span>{state.name}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                              isStateActive ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {state.cities.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cities in currently active state */}
                {currentStateObj && (
                  <div className="pt-2">
                    <p className="text-[11.5px] font-bold text-gray-700 mb-2">
                      Cities in <span className="text-[#D61F26]">{currentStateObj.name}</span>:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {currentStateObj.cities.map((city) => {
                        const isCitySelected = selection.cityId === city.id;
                        return (
                          <button
                            key={city.id}
                            type="button"
                            onClick={() =>
                              handleCityPillClick(city, currentStateObj.id, currentStateObj.name)
                            }
                            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                              isCitySelected
                                ? 'bg-[#D61F26] text-white border-[#D61F26] shadow-sm'
                                : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-white'
                            }`}
                          >
                            <span className="text-xs font-bold truncate">{city.name}</span>
                            {isCitySelected ? (
                              <Check className="w-3.5 h-3.5 text-white shrink-0" />
                            ) : (
                              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
