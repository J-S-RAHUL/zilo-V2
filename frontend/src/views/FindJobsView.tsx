import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/JobCard';
import { calculateDistanceKm } from '../utils/distance';
import { POPULAR_LOCATIONS } from '../utils/distance';
import {
  Search,
  MapPin,
  ChevronRight,
  SlidersHorizontal,
  X,
  RotateCcw,
  Briefcase
} from 'lucide-react';

export const FindJobsView: React.FC = () => {
  const {
    jobs,
    currentLocation,
    setCurrentLocation,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setCurrentView
  } = useApp();

  // Filters for jobs
  const [categoryFilter, setCategoryFilter] = useState<string>(selectedCategory || 'all');
  const [locationFilter, setLocationFilter] = useState<string>(currentLocation.name);
  const [minSalary, setMinSalary] = useState<string>('all'); // 'under-500', '500-1000', '1000-2000', '2000+'
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('all'); // 'all', 'daily', 'monthly'
  const [durationFilter, setDurationFilter] = useState<string>('all'); // 'all', '1-3', 'week', 'month'
  const [experienceFilter, setExperienceFilter] = useState<number>(0); // 0, 1, 2, 5
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'all', 'immediate', 'this-week'
  const [sortBy, setSortBy] = useState<'recent' | 'salary' | 'distance'>('recent');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  React.useEffect(() => {
    if (selectedCategory) {
      setCategoryFilter(selectedCategory.toLowerCase());
    }
  }, [selectedCategory]);

  const clearAllFilters = () => {
    setCategoryFilter('all');
    setSelectedCategory(null);
    setMinSalary('all');
    setWorkTypeFilter('all');
    setDurationFilter('all');
    setExperienceFilter(0);
    setDateFilter('all');
    setSearchQuery('');
  };

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) => {
        if (j.status !== 'active') return false;

        // Search text matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            j.jobTitle.toLowerCase().includes(q) ||
            j.requiredWorkerSkill.toLowerCase().includes(q) ||
            j.workLocation.toLowerCase().includes(q) ||
            j.city.toLowerCase().includes(q) ||
            j.employerName.toLowerCase().includes(q) ||
            j.jobDescription.toLowerCase().includes(q);

          if (!matches) return false;
        }

        // Category filter
        if (categoryFilter !== 'all') {
          const cat = categoryFilter.toLowerCase();
          const jobSkill = j.requiredWorkerSkill.toLowerCase();
          if (cat === 'other') {
            const known = ['carpenter', 'electrician', 'plumber', 'plumbing', 'mason', 'painter', 'painting', 'driver', 'driving', 'cleaning', 'cleaner', 'construction'];
            if (known.some((k) => jobSkill.includes(k))) return false;
          } else if (cat === 'plumbing') {
            if (!jobSkill.includes('plumb')) return false;
          } else if (cat === 'painting') {
            if (!jobSkill.includes('paint')) return false;
          } else if (cat === 'driving') {
            if (!jobSkill.includes('driv')) return false;
          } else if (cat === 'cleaning') {
            if (!jobSkill.includes('clean')) return false;
          } else if (!jobSkill.includes(cat)) {
            return false;
          }
        }

        // Salary filter
        const amount = j.salary.amount;
        if (minSalary === 'under-500' && amount >= 500) return false;
        if (minSalary === '500-1000' && (amount < 500 || amount > 1000)) return false;
        if (minSalary === '1000-2000' && (amount < 1000 || amount > 2000)) return false;
        if (minSalary === '2000+' && amount < 2000) return false;

        // Duration filter
        if (durationFilter === '1-3' && !j.workDuration.toLowerCase().includes('day')) return false;
        if (durationFilter === 'month' && !j.workDuration.toLowerCase().includes('month')) return false;

        // Experience filter
        if (experienceFilter > 0 && j.experienceRequiredYears > experienceFilter) {
          return false;
        }

        // Date filter
        if (dateFilter === 'immediate' && !j.workDate.toLowerCase().includes('immediate') && !j.workDate.toLowerCase().includes('today') && !j.workDate.toLowerCase().includes('tomorrow')) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'salary') return b.salary.amount - a.salary.amount;
        if (sortBy === 'distance') {
          const distA = calculateDistanceKm(currentLocation.lat, currentLocation.lng, a.latitude, a.longitude);
          const distB = calculateDistanceKm(currentLocation.lat, currentLocation.lng, b.latitude, b.longitude);
          return distA - distB;
        }
        if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [
    jobs,
    searchQuery,
    categoryFilter,
    minSalary,
    durationFilter,
    experienceFilter,
    dateFilter,
    sortBy,
    currentLocation
  ]);

  // Active chips
  const activeChips = [];
  if (categoryFilter !== 'all') {
    activeChips.push({
      label: categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1),
      onRemove: () => {
        setCategoryFilter('all');
        setSelectedCategory(null);
      }
    });
  }
  if (minSalary !== 'all') {
    let pLabel = '';
    if (minSalary === 'under-500') pLabel = 'Under ₹500';
    else if (minSalary === '500-1000') pLabel = '₹500 - ₹1000';
    else if (minSalary === '1000-2000') pLabel = '₹1000 - ₹2000';
    else if (minSalary === '2000+') pLabel = '₹2000+';
    activeChips.push({
      label: pLabel,
      onRemove: () => setMinSalary('all')
    });
  }
  if (experienceFilter > 0) {
    activeChips.push({
      label: `Max ${experienceFilter} Yrs Exp`,
      onRemove: () => setExperienceFilter(0)
    });
  }
  if (currentLocation.name) {
    activeChips.push({
      label: currentLocation.name,
      onRemove: () => {}
    });
  }

  return (
    <div className="zilo-search-marketplace-page">
      <div className="container">
        {/* Breadcrumb: Home > Find Jobs */}
        <div className="zilo-breadcrumb">
          <button type="button" onClick={() => setCurrentView('home')} className="bc-link">
            Home
          </button>
          <ChevronRight size={14} className="bc-sep" />
          <span className="bc-current">Find Jobs</span>
        </div>

        {/* Mobile filter bar */}
        <div className="mobile-filter-bar">
          <button
            type="button"
            className="mobile-filter-toggle-btn"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <SlidersHorizontal size={16} />
            <span>Filters {activeChips.length > 0 ? `(${activeChips.length})` : ''}</span>
          </button>

          <span className="results-mobile-count">{filteredJobs.length} Openings</span>
        </div>

        {/* Main 2-column layout */}
        <div className="zilo-marketplace-layout">
          {/* Left Sidebar Filters */}
          <aside className={`zilo-filter-sidebar ${showMobileFilter ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
              <h2 className="sidebar-title">Filters</h2>
              <button type="button" className="clear-filters-link" onClick={clearAllFilters}>
                Clear Filters
              </button>
            </div>

            {/* Category */}
            <div className="filter-group">
              <h3 className="filter-group-title">Category</h3>
              <div className="radio-options-list">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'carpenter', label: 'Carpenter' },
                  { id: 'electrician', label: 'Electrician' },
                  { id: 'plumbing', label: 'Plumbing' },
                  { id: 'mason', label: 'Mason' },
                  { id: 'painting', label: 'Painting' },
                  { id: 'driving', label: 'Driving' },
                  { id: 'cleaning', label: 'Cleaning' },
                  { id: 'construction', label: 'Construction' },
                  { id: 'other', label: 'Other' }
                ].map((item) => (
                  <label key={item.id} className="filter-radio-label">
                    <input
                      type="radio"
                      name="job-category"
                      checked={categoryFilter === item.id}
                      onChange={() => {
                        setCategoryFilter(item.id);
                        if (item.id === 'all') setSelectedCategory(null);
                        else setSelectedCategory(item.label);
                      }}
                    />
                    <span className="radio-custom" />
                    <span className="radio-text">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="filter-group">
              <h3 className="filter-group-title">Location</h3>
              <div className="location-select-wrap">
                <MapPin size={16} className="loc-icon" />
                <select
                  className="filter-select"
                  value={currentLocation.name}
                  onChange={(e) => {
                    const found = POPULAR_LOCATIONS.find((l) => l.name === e.target.value);
                    if (found) setCurrentLocation(found);
                  }}
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}, {loc.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary */}
            <div className="filter-group">
              <h3 className="filter-group-title">Salary / Payment</h3>
              <div className="radio-options-list">
                {[
                  { id: 'all', label: 'All Payments' },
                  { id: 'under-500', label: 'Under ₹500' },
                  { id: '500-1000', label: '₹500 - ₹1000' },
                  { id: '1000-2000', label: '₹1000 - ₹2000' },
                  { id: '2000+', label: '₹2000+' }
                ].map((s) => (
                  <label key={s.id} className="filter-radio-label">
                    <input
                      type="radio"
                      name="minSalary"
                      checked={minSalary === s.id}
                      onChange={() => setMinSalary(s.id)}
                    />
                    <span className="radio-custom" />
                    <span className="radio-text">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="filter-group">
              <h3 className="filter-group-title">Duration</h3>
              <div className="radio-options-list">
                {[
                  { id: 'all', label: 'Any Duration' },
                  { id: '1-3', label: 'Short Term (1-3 Days)' },
                  { id: 'month', label: 'Monthly / Full-Time' }
                ].map((d) => (
                  <label key={d.id} className="filter-radio-label">
                    <input
                      type="radio"
                      name="duration"
                      checked={durationFilter === d.id}
                      onChange={() => setDurationFilter(d.id)}
                    />
                    <span className="radio-custom" />
                    <span className="radio-text">{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="filter-group">
              <h3 className="filter-group-title">Experience Required</h3>
              <div className="radio-options-list">
                {[
                  { val: 0, label: 'Any experience' },
                  { val: 1, label: 'Up to 1 year' },
                  { val: 2, label: 'Up to 2 years' },
                  { val: 5, label: 'Up to 5 years' }
                ].map((exp) => (
                  <label key={exp.val} className="filter-radio-label">
                    <input
                      type="radio"
                      name="job-experience"
                      checked={experienceFilter === exp.val}
                      onChange={() => setExperienceFilter(exp.val)}
                    />
                    <span className="radio-custom" />
                    <span className="radio-text">{exp.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="filter-group">
              <h3 className="filter-group-title">Start Date</h3>
              <div className="radio-options-list">
                {[
                  { id: 'all', label: 'Any Start Date' },
                  { id: 'immediate', label: 'Immediate / Urgent' }
                ].map((dt) => (
                  <label key={dt.id} className="filter-radio-label">
                    <input
                      type="radio"
                      name="dateFilter"
                      checked={dateFilter === dt.id}
                      onChange={() => setDateFilter(dt.id)}
                    />
                    <span className="radio-custom" />
                    <span className="radio-text">{dt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="button" className="zilo-btn-clear-filters" onClick={clearAllFilters}>
              <RotateCcw size={14} />
              <span>Clear Filters</span>
            </button>
          </aside>

          {/* Right Results Area */}
          <main className="zilo-results-main">
            <div className="results-top-bar">
              <div className="results-search-wrap">
                <Search size={18} className="results-search-icon" />
                <input
                  type="text"
                  className="results-search-input"
                  placeholder="Search jobs, skills, or employers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="results-location-chip">
                <MapPin size={15} color="#2563eb" />
                <span>{currentLocation.name}</span>
              </div>

              <div className="results-sort-wrap">
                <span className="sort-label">Sort by:</span>
                <select
                  className="results-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="recent">Newly Added</option>
                  <option value="salary">Highest Payment</option>
                  <option value="distance">Nearest</option>
                </select>
              </div>
            </div>

            {/* Active chips */}
            {activeChips.length > 0 && (
              <div className="active-filters-row">
                <span className="active-filters-label">Active Filters:</span>
                <div className="active-chips-list">
                  {activeChips.map((chip, idx) => (
                    <span key={idx} className="active-filter-chip">
                      <span>{chip.label}</span>
                      <button
                        type="button"
                        onClick={chip.onRemove}
                        className="chip-remove-btn"
                        title="Remove filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button type="button" onClick={clearAllFilters} className="clear-all-chips-btn">
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Results Title Heading */}
            <div className="results-title-header">
              <h1 className="results-main-title">Available Jobs</h1>
              <span className="results-counter-pill">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Open
              </span>
            </div>

            {/* Job Cards Grid */}
            {filteredJobs.length === 0 ? (
              <div className="empty-results-box">
                <Briefcase size={48} className="empty-icon" />
                <h3>No Jobs Found</h3>
                <p>Try widening your search terms or clearing some filters.</p>
                <button
                  type="button"
                  className="zilo-btn-cta primary"
                  onClick={clearAllFilters}
                  style={{ marginTop: '1rem' }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="zilo-workers-grid-3">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
