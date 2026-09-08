import { useState, useMemo } from 'react';
import { Project, Property } from '../types';
import { MapPin, Calendar, ShieldCheck, ChevronRight, CheckCircle2, Layers, Sparkles } from 'lucide-react';

interface ExclusiveProjectsProps {
  projects: Project[];
  properties?: Property[];
  onSelectProject: (project: Project) => void;
  onSelectProperty?: (property: Property) => void;
  onViewAllProjects: (type?: string) => void;
}

function convertPropertyToProject(prop: Property): Project {
  const isCommercial =
    prop.projectType === 'COMMERCIAL' ||
    prop.listingType === 'COMMERCIAL' ||
    prop.propertyType === 'OFFICE' ||
    prop.propertyType === 'RETAIL' ||
    prop.propertyType === 'WAREHOUSE';

  let pType: Project['projectType'] = 'RESIDENTIAL';
  if (prop.isExclusive || prop.projectType === 'EXCLUSIVE') {
    pType = 'EXCLUSIVE';
  } else if (isCommercial) {
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
    isExclusive: Boolean(prop.isExclusive || prop.isFeatured),
    isFeatured: Boolean(prop.isFeatured),
    createdAt: prop.createdAt || new Date().toISOString(),
  };
}

export default function ExclusiveProjects({
  projects,
  properties = [],
  onSelectProject,
  onSelectProperty,
  onViewAllProjects,
}: ExclusiveProjectsProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'EXCLUSIVE' | 'COMMERCIAL' | 'RESIDENTIAL'>('ALL');

  // Merge admin/user-added properties into projects list, placing newest properties FIRST
  const combinedProjects = useMemo(() => {
    const activeProps = (properties || []).filter(
      (p) => p.status === 'ACTIVE' || (!p.status && p.isFeatured)
    );

    // Any property with isExclusive, isFeatured, projectType EXCLUSIVE, or admin-created
    const propProjects = activeProps
      .filter((p) => p.isExclusive || p.isFeatured || p.projectType === 'EXCLUSIVE' || p.id.startsWith('prop-') || p.id.startsWith('mars-'))
      .map(convertPropertyToProject);

    const existingIds = new Set(propProjects.map((p) => p.id));
    const remainingProjects = (projects || []).filter((p) => !existingIds.has(p.id));

    // Put newly added properties at the very top so they are immediately visible
    return [...propProjects, ...remainingProjects];
  }, [projects, properties]);

  const exclusiveList = combinedProjects.filter((p) => p.isExclusive || p.projectType === 'EXCLUSIVE' || p.isFeatured);
  const commercialList = combinedProjects.filter((p) => p.projectType === 'COMMERCIAL');
  const residentialList = combinedProjects.filter((p) => p.projectType === 'RESIDENTIAL');

  const handleItemClick = (project: Project) => {
    const originalProp = properties?.find((p) => p.id === project.id);
    if (originalProp && onSelectProperty) {
      onSelectProperty(originalProp);
    } else {
      onSelectProject(project);
    }
  };

  const renderProjectGrid = (title: string, categoryBadge: string, projectItems: Project[], typeKey: string) => {
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
                <div className="absolute top-3 right-3 bg-[#D61F26] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md flex items-center gap-1">
                  {project.isExclusive && <Sparkles className="w-2.5 h-2.5" />}
                  <span>{categoryBadge}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                  {project.city}
                </div>
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

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(project);
                  }}
                  className="w-full bg-[#D61F26] hover:bg-[#B01920] text-white text-[12.5px] font-bold py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1 shadow-md shadow-red-900/15"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>Explore Project</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Layers className="w-7 h-7 text-[#D61F26]" />
            <div>
              <h2
                className="text-[22px] sm:text-[26px] font-extrabold text-[#222222] tracking-tight uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                FEATURED &amp; EXCLUSIVE PROJECTS
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Explore handpicked luxury residential towers, commercial corporate hubs, and exclusive villas
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'ALL', label: 'All Projects' },
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

        {/* Project Content Grids */}
        {activeTab === 'ALL' && (
          <>
            {renderProjectGrid('Exclusive Projects', 'EXCLUSIVE', exclusiveList, 'EXCLUSIVE')}
            {renderProjectGrid('Commercial Projects', 'COMMERCIAL', commercialList, 'COMMERCIAL')}
            {renderProjectGrid('Residential Projects', 'RESIDENTIAL', residentialList, 'RESIDENTIAL')}
          </>
        )}

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
