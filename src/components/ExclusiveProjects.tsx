import { useState, useMemo } from 'react';
import { Project, Property } from '../types';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Heart,
  Star,
  Camera,
  Play,
  Video,
} from 'lucide-react';

interface ExclusiveProjectsProps {
  projects: Project[];
  properties?: Property[];
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
  onSelectProject: (project: Project, initialTab?: 'photos' | 'video') => void;
  onSelectProperty?: (property: Property, initialTab?: 'photos' | 'video') => void;
  onViewAllProjects: (type?: string) => void;
}

function convertPropertyToProject(prop: Property, targetSection?: string): Project {
  const isCommercial =
    prop.displaySections?.includes('COMMERCIAL') ||
    prop.projectType === 'COMMERCIAL' ||
    prop.listingType === 'COMMERCIAL' ||
    prop.propertyType === 'OFFICE' ||
    prop.propertyType === 'RETAIL' ||
    prop.propertyType === 'WAREHOUSE';

  let pType: Project['projectType'] = 'RESIDENTIAL';
  if (
    targetSection === 'EXCLUSIVE' ||
    prop.displaySections?.includes('EXCLUSIVE') ||
    prop.isExclusive ||
    prop.projectType === 'EXCLUSIVE'
  ) {
    pType = 'EXCLUSIVE';
  } else if (targetSection === 'COMMERCIAL' || isCommercial) {
    pType = 'COMMERCIAL';
  }

  const configs: string[] = [];
  if (prop.configuration) {
    configs.push(prop.configuration);
  } else if (prop.bedrooms) {
    configs.push(`${prop.bedrooms} BHK ${prop.propertyType}`);
  } else {
    configs.push(`${prop.area} ${prop.areaUnit || 'sq.ft'} ${prop.propertyType}`);
  }
  if (prop.area) {
    configs.push(`${prop.area} ${prop.areaUnit || 'sq.ft'}`);
  }

  return {
    id: prop.id,
    title: prop.title,
    slug: prop.slug || prop.id,
    description: prop.description,
    builder: prop.builder || prop.agencyName || prop.contactName || 'The Mars TV Exclusive',
    price: prop.price,
    priceLabel: prop.priceLabel || (prop.price ? `₹${(prop.price / 100000).toFixed(2)} Lac` : 'Price on Request'),
    location: prop.location,
    city: prop.city || 'Indore',
    projectType: pType,
    status: prop.status || 'ACTIVE',
    possession:
      prop.possessionDate ||
      (prop.possessionStatus === 'READY_TO_MOVE'
        ? 'Ready to Move'
        : prop.possessionStatus === 'UNDER_CONSTRUCTION'
        ? 'Under Construction'
        : 'Immediate'),
    reraNumber: prop.reraNumber,
    configurations: configs.length ? configs : ['Verified Unit', `${prop.area} sq.ft`],
    amenities: prop.amenities?.length ? prop.amenities : ['24/7 Security', 'Power Backup', 'Prime Location'],
    image:
      prop.images?.[0]?.url ||
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    images: prop.images && prop.images.length > 0 ? prop.images : undefined,
    videoUrl: prop.videoUrl || prop.youtubeUrl,
    youtubeUrl: prop.youtubeUrl || prop.videoUrl,
    isExclusive: Boolean(
      prop.displaySections?.includes('EXCLUSIVE') || prop.isExclusive || prop.isFeatured
    ),
    isFeatured: Boolean(prop.displaySections?.includes('FEATURED') || prop.isFeatured),
    createdAt: prop.createdAt || new Date().toISOString(),
  };
}

export default function ExclusiveProjects({
  projects,
  properties = [],
  wishlist = [],
  onToggleWishlist,
  onSelectProject,
  onSelectProperty,
  onViewAllProjects,
}: ExclusiveProjectsProps) {
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'FEATURED' | 'EXCLUSIVE' | 'COMMERCIAL' | 'RESIDENTIAL'
  >('ALL');

  const [featuredTypeFilter, setFeaturedTypeFilter] = useState<
    'ALL' | 'APARTMENT' | 'VILLA' | 'COMMERCIAL'
  >('ALL');

  // 1. Featured Projects list: strictly uses displaySections if set, else fallback to isFeatured
  const featuredProjectsList = useMemo(() => {
    const matchedProps = (properties || [])
      .filter((p) => {
        const isActive = p.status === 'ACTIVE' || (!p.status && p.isFeatured);
        if (!isActive) return false;
        if (p.displaySections && p.displaySections.length > 0) {
          return p.displaySections.includes('FEATURED');
        }
        return Boolean(p.isFeatured);
      })
      .map((p) => convertPropertyToProject(p, 'FEATURED'));

    const existingIds = new Set(matchedProps.map((p) => p.id));
    const matchedProjects = (projects || []).filter(
      (p) => Boolean(p.isFeatured) && !existingIds.has(p.id)
    );

    return [...matchedProps, ...matchedProjects];
  }, [properties, projects]);

  // Sub-filter for Featured Projects
  const filteredFeaturedProjects = useMemo(() => {
    if (featuredTypeFilter === 'ALL') return featuredProjectsList;
    if (featuredTypeFilter === 'COMMERCIAL') {
      return featuredProjectsList.filter(
        (p) =>
          p.projectType === 'COMMERCIAL' ||
          p.title.toLowerCase().includes('office') ||
          p.title.toLowerCase().includes('business') ||
          p.title.toLowerCase().includes('tower') ||
          p.title.toLowerCase().includes('commercial') ||
          p.description.toLowerCase().includes('commercial') ||
          p.description.toLowerCase().includes('office')
      );
    }
    if (featuredTypeFilter === 'VILLA') {
      return featuredProjectsList.filter(
        (p) =>
          p.title.toLowerCase().includes('villa') ||
          p.title.toLowerCase().includes('estate') ||
          p.configurations.some((c) => c.toLowerCase().includes('villa')) ||
          p.description.toLowerCase().includes('villa')
      );
    }
    if (featuredTypeFilter === 'APARTMENT') {
      return featuredProjectsList.filter(
        (p) =>
          p.projectType === 'RESIDENTIAL' ||
          p.title.toLowerCase().includes('apartment') ||
          p.title.toLowerCase().includes('residence') ||
          p.title.toLowerCase().includes('suites') ||
          p.configurations.some(
            (c) =>
              c.toLowerCase().includes('apartment') ||
              c.toLowerCase().includes('bhk') ||
              c.toLowerCase().includes('flat')
          ) ||
          p.description.toLowerCase().includes('apartment')
      );
    }
    return featuredProjectsList;
  }, [featuredProjectsList, featuredTypeFilter]);

  // 2. Exclusive Projects: strictly uses displaySections if set, else fallback
  const exclusiveList = useMemo(() => {
    const matchedProps = (properties || [])
      .filter((p) => {
        const isActive = p.status === 'ACTIVE' || (!p.status && p.isFeatured);
        if (!isActive) return false;
        if (p.displaySections && p.displaySections.length > 0) {
          return p.displaySections.includes('EXCLUSIVE');
        }
        return Boolean(p.isExclusive || p.projectType === 'EXCLUSIVE' || (p.id.startsWith('prop-') && p.isFeatured));
      })
      .map((p) => convertPropertyToProject(p, 'EXCLUSIVE'));

    const existingIds = new Set(matchedProps.map((p) => p.id));
    const matchedProjects = (projects || []).filter(
      (p) => (p.isExclusive || p.projectType === 'EXCLUSIVE') && !existingIds.has(p.id)
    );

    return [...matchedProps, ...matchedProjects];
  }, [properties, projects]);

  // 3. Commercial Projects: strictly uses displaySections if set, else fallback
  const commercialList = useMemo(() => {
    const matchedProps = (properties || [])
      .filter((p) => {
        const isActive = p.status === 'ACTIVE' || (!p.status && p.isFeatured);
        if (!isActive) return false;
        if (p.displaySections && p.displaySections.length > 0) {
          return p.displaySections.includes('COMMERCIAL');
        }
        return (
          p.projectType === 'COMMERCIAL' ||
          p.listingType === 'COMMERCIAL' ||
          p.propertyType === 'OFFICE' ||
          p.propertyType === 'RETAIL' ||
          p.propertyType === 'WAREHOUSE'
        );
      })
      .map((p) => convertPropertyToProject(p, 'COMMERCIAL'));

    const existingIds = new Set(matchedProps.map((p) => p.id));
    const matchedProjects = (projects || []).filter(
      (p) => p.projectType === 'COMMERCIAL' && !existingIds.has(p.id)
    );

    return [...matchedProps, ...matchedProjects];
  }, [properties, projects]);

  // 4. Residential Projects: strictly uses displaySections if set, else fallback
  const residentialList = useMemo(() => {
    const matchedProps = (properties || [])
      .filter((p) => {
        const isActive = p.status === 'ACTIVE' || (!p.status && p.isFeatured);
        if (!isActive) return false;
        if (p.displaySections && p.displaySections.length > 0) {
          return p.displaySections.includes('RESIDENTIAL');
        }
        return (
          p.projectType === 'RESIDENTIAL' ||
          (p.listingType !== 'COMMERCIAL' &&
            p.propertyType !== 'OFFICE' &&
            p.propertyType !== 'RETAIL' &&
            !p.isExclusive)
        );
      })
      .map((p) => convertPropertyToProject(p, 'RESIDENTIAL'));

    const existingIds = new Set(matchedProps.map((p) => p.id));
    const matchedProjects = (projects || []).filter(
      (p) => p.projectType === 'RESIDENTIAL' && !existingIds.has(p.id)
    );

    return [...matchedProps, ...matchedProjects];
  }, [properties, projects]);

  const handleItemClick = (project: Project) => {
    const originalProp = properties?.find((p) => p.id === project.id);
    if (originalProp && onSelectProperty) {
      onSelectProperty(originalProp);
    } else {
      onSelectProject(project);
    }
  };

  // Render FEATURED PROJECTS Grid (placed inside FEATURED & EXCLUSIVE PROJECTS directly at the top, before Exclusive Projects)
  const renderFeaturedProjectsBlock = () => {
    if (featuredProjectsList.length === 0) return null;

    const displayedList =
      filteredFeaturedProjects.length > 0 ? filteredFeaturedProjects : featuredProjectsList;

    return (
      <div className="mb-14 pb-12 border-b border-gray-100 last:border-b-0 last:pb-0" id="featured-projects-subsection">
        {/* Featured Projects Header with Sub-filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </span>
              <h3
                className="text-[20px] sm:text-[22px] font-extrabold text-[#222222] uppercase tracking-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                FEATURED PROJECTS
              </h3>
              <span className="w-10 h-[3.5px] bg-[#D61F26] rounded-full hidden sm:block" />
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                {featuredProjectsList.length} {featuredProjectsList.length === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Top handpicked landmark developments, luxury residential towers, and prime verified projects
            </p>
          </div>

          {/* Type Sub-filters and View All */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Featured' },
              { id: 'APARTMENT', label: 'Apartments' },
              { id: 'VILLA', label: 'Villas' },
              { id: 'COMMERCIAL', label: 'Commercial' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFeaturedTypeFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  featuredTypeFilter === f.id
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {f.label}
              </button>
            ))}

            <button
              onClick={() => onViewAllProjects('FEATURED')}
              className="inline-flex items-center gap-1 text-[#D61F26] hover:text-[#B01920] text-[13px] font-bold cursor-pointer group ml-2"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 4-column Responsive Grid for Featured Projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {displayedList.slice(0, 8).map((project) => {
            const isSaved = wishlist?.includes(project.id) ?? false;

            return (
              <div
                key={project.id}
                onClick={() => handleItemClick(project)}
                className="bg-white rounded-[18px] overflow-hidden border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Project Image */}
                <div className="relative h-[205px] overflow-hidden bg-gray-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10.5px] font-bold px-2.5 py-1 rounded-md shadow-sm truncate max-w-[150px]">
                    {project.builder}
                  </div>

                  {/* Badges and Wishlist on Image */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {(project.videoUrl || project.youtubeUrl) && (
                      <div className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>VIDEO</span>
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                      <span>FEATURED</span>
                    </div>

                    {onToggleWishlist && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(project.id);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer ${
                          isSaved
                            ? 'bg-white text-[#D61F26]'
                            : 'bg-white/80 hover:bg-white text-gray-700'
                        }`}
                        title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isSaved ? 'fill-[#D61F26] text-[#D61F26]' : 'text-gray-700'
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                    {project.city}
                  </div>

                  {((project.images && project.images.length > 1) || (properties?.find(p => p.id === project.id)?.images?.length || 0) > 1) && (
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                      <Camera className="w-3 h-3 text-amber-400" />
                      <span>{project.images?.length || properties?.find(p => p.id === project.id)?.images?.length} Photos</span>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4
                      className="text-[15.5px] font-bold text-[#222222] mb-1 line-clamp-1 group-hover:text-[#D61F26] transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {project.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-gray-500 mb-2 text-[12.5px]">
                      <MapPin className="w-3.5 h-3.5 text-[#D61F26] flex-shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>

                    <p
                      className="text-[18px] font-extrabold text-[#D61F26] mb-3"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {project.priceLabel}
                    </p>

                    {/* Configurations & Specs */}
                    <div className="space-y-1.5 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 text-[11.5px] mb-4">
                      {project.configurations.slice(0, 2).map((cfg) => (
                        <div key={cfg} className="flex items-center gap-1.5 text-gray-700 font-medium truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D61F26] flex-shrink-0" />
                          <span className="truncate">{cfg}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-gray-500 text-[11px]">
                        <span className="flex items-center gap-1 truncate max-w-[130px]">
                          <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{project.possession}</span>
                        </span>
                        {project.reraNumber && (
                          <span className="flex items-center gap-1 font-semibold text-emerald-700 shrink-0">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            RERA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {(project.videoUrl || project.youtubeUrl) ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(project);
                        }}
                        className="bg-[#111111] hover:bg-black text-white text-[12.5px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer text-center"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Explore Project
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(project);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white text-[12.5px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Property Video</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(project);
                      }}
                      className="w-full bg-[#111111] hover:bg-[#D61F26] text-white text-[13px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer text-center group-hover:shadow-md"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Explore Project
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Project Grid for Exclusive, Commercial, Residential
  const renderProjectGrid = (
    title: string,
    categoryBadge: string,
    projectItems: Project[],
    typeKey: string
  ) => {
    if (projectItems.length === 0) return null;

    return (
      <div className="mb-12 last:mb-0">
        {/* Category Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h3
              className="text-[20px] sm:text-[22px] font-extrabold text-[#222222] uppercase tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {title}
            </h3>
            <span className="w-10 h-[3.5px] bg-[#D61F26] rounded-full block" />
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {projectItems.length} {projectItems.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>

          <button
            onClick={() => onViewAllProjects(typeKey)}
            className="inline-flex items-center gap-1 text-[#D61F26] hover:text-[#B01920] text-[13px] font-bold cursor-pointer group self-start sm:self-auto"
          >
            <span>View All {title}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Responsive Grid - displays up to 8 projects in 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {projectItems.slice(0, 8).map((project) => (
            <div
              key={project.id}
              onClick={() => handleItemClick(project)}
              className="bg-white rounded-[18px] overflow-hidden border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Project Image */}
              <div className="relative h-[200px] overflow-hidden bg-gray-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10.5px] font-bold px-2.5 py-1 rounded-md shadow-sm truncate max-w-[160px]">
                  {project.builder}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {(project.videoUrl || project.youtubeUrl) && (
                    <div className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-white" />
                      <span>VIDEO</span>
                    </div>
                  )}
                  <div className="bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md flex items-center gap-1">
                    {project.isExclusive && <Sparkles className="w-2.5 h-2.5" />}
                    <span>{categoryBadge}</span>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                  {project.city}
                </div>

                {((project.images && project.images.length > 1) || (properties?.find(p => p.id === project.id)?.images?.length || 0) > 1) && (
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                    <Camera className="w-3 h-3 text-amber-400" />
                    <span>{project.images?.length || properties?.find(p => p.id === project.id)?.images?.length} Photos</span>
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4
                    className="text-[15.5px] font-bold text-[#222222] mb-1 line-clamp-1 group-hover:text-[#D61F26] transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {project.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-gray-500 mb-2 text-[12.5px]">
                    <MapPin className="w-3.5 h-3.5 text-[#D61F26] flex-shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </div>

                  <p
                    className="text-[18px] font-extrabold text-[#D61F26] mb-3"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {project.priceLabel}
                  </p>

                  {/* Configurations & Specs */}
                  <div className="space-y-1.5 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 text-[11.5px] mb-4">
                    {project.configurations.slice(0, 2).map((cfg) => (
                      <div key={cfg} className="flex items-center gap-1.5 text-gray-700 font-medium truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D61F26] flex-shrink-0" />
                        <span className="truncate">{cfg}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-gray-500 text-[11px]">
                      <span className="flex items-center gap-1 truncate max-w-[130px]">
                        <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{project.possession}</span>
                      </span>
                      {project.reraNumber && (
                        <span className="flex items-center gap-1 font-semibold text-emerald-700 shrink-0">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          RERA
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {(project.videoUrl || project.youtubeUrl) ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(project);
                      }}
                      className="bg-[#111111] hover:bg-black text-white text-[12.5px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer text-center"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Explore Project
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(project);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-[12.5px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Property Video</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(project);
                    }}
                    className="w-full bg-[#111111] hover:bg-[#D61F26] text-white text-[13px] font-bold py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer text-center group-hover:shadow-md"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Explore Project
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-14 bg-white border-b border-gray-100" id="featured-exclusive-section">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        {/* Section Main Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-red-50 text-[#D61F26] rounded-2xl flex items-center justify-center shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2
                className="text-[22px] sm:text-[26px] font-extrabold text-[#222222] tracking-tight uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                FEATURED &amp; EXCLUSIVE PROJECTS
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Explore handpicked landmark developments, luxury residential towers, and verified projects
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'ALL', label: 'All Showcase' },
              { id: 'FEATURED', label: 'Featured Projects' },
              { id: 'EXCLUSIVE', label: 'Exclusive Projects' },
              { id: 'COMMERCIAL', label: 'Commercial Projects' },
              { id: 'RESIDENTIAL', label: 'Residential Projects' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#D61F26] text-white shadow-md shadow-red-900/20'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content: FEATURED PROJECTS IS DIRECTLY BEFORE / ABOVE EXCLUSIVE PROJECTS */}
        {activeTab === 'ALL' && (
          <>
            {/* 1. FEATURED PROJECTS BLOCK (TOP OF SECTION, BEFORE EXCLUSIVE PROJECTS) */}
            {renderFeaturedProjectsBlock()}

            {/* 2. EXCLUSIVE PROJECTS SUBSECTION */}
            {renderProjectGrid('Exclusive Projects', 'EXCLUSIVE', exclusiveList, 'EXCLUSIVE')}

            {/* 3. COMMERCIAL PROJECTS SUBSECTION */}
            {renderProjectGrid('Commercial Projects', 'COMMERCIAL', commercialList, 'COMMERCIAL')}

            {/* 4. RESIDENTIAL PROJECTS SUBSECTION */}
            {renderProjectGrid('Residential Projects', 'RESIDENTIAL', residentialList, 'RESIDENTIAL')}
          </>
        )}

        {activeTab === 'FEATURED' && renderFeaturedProjectsBlock()}

        {activeTab === 'EXCLUSIVE' &&
          renderProjectGrid('Exclusive Projects', 'EXCLUSIVE', exclusiveList, 'EXCLUSIVE')}

        {activeTab === 'COMMERCIAL' &&
          renderProjectGrid('Commercial Projects', 'COMMERCIAL', commercialList, 'COMMERCIAL')}

        {activeTab === 'RESIDENTIAL' &&
          renderProjectGrid('Residential Projects', 'RESIDENTIAL', residentialList, 'RESIDENTIAL')}
      </div>
    </section>
  );
}
