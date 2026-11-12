import { companies } from './group';

// New editorial copy is separate from the preserved reference concepts.
// Service scope is derived from the existing Beamco portfolio; client approval is pending.
const profiles = [
  { id: 'beam-engineering', discipline: 'Building engineering', description: 'Mechanical, electrical and plumbing engineering for buildings, with contracting and maintenance services.', enquiry: 'Talk about engineering' },
  { id: 'beam-carpentry', discipline: 'Joinery & carpentry', description: 'Carpentry and bespoke woodwork for interior spaces, with a dedicated focus on joinery.', enquiry: 'Talk about joinery' },
  { id: 'fis-interiors', discipline: 'Interior fit-out', description: 'Interior fit-out and decoration for spaces being prepared for use or given a new purpose.', enquiry: 'Talk about an interior' },
  { id: 'superfine', discipline: 'Facilities services', description: 'Facilities management services for the ongoing care of buildings and the spaces within them.', enquiry: 'Talk about property care' },
  { id: 'mint', discipline: 'Business workspace', description: 'Business-centre and office solutions for teams looking for a place to work.', enquiry: 'Talk about workspace' },
  { id: 'eminent', discipline: 'Civil construction', description: 'Civil construction and maintenance services for building projects and existing properties.', enquiry: 'Talk about construction' },
];
export const directory = companies.map((company, index) => ({ ...company, ...profiles[index] }));

export const needs = [
  { id: 'build', short: 'Plan a build', title: 'Build or adapt a property', description: 'Bring the structure and building services into focus. Explore civil construction alongside the mechanical, electrical and plumbing work a property needs.', scope: ['Civil construction', 'MEP contracting', 'Building maintenance'], companyIds: ['eminent', 'beam-engineering'], image: '/images/beamco/webimg/innerbanner13.jpg', alt: 'Rooftop building services with a city skyline in the distance' },
  { id: 'interiors', short: 'Create an interior', title: 'Make a space your own', description: 'Prepare an interior for the way it will be used. Find fit-out and decoration expertise, together with carpentry and bespoke woodwork.', scope: ['Interior fit-out', 'Decoration', 'Joinery & woodwork'], companyIds: ['fis-interiors', 'beam-carpentry'], image: '/images/beamco/webimg/innerbanner05.jpg', alt: 'A completed interior with timber screens and seating' },
  { id: 'care', short: 'Care for a property', title: 'Look after what is already built', description: 'A completed building still needs attention. Explore facilities services, engineering maintenance and civil maintenance for an existing property.', scope: ['Facilities services', 'MEP maintenance', 'Civil maintenance'], companyIds: ['superfine', 'beam-engineering', 'eminent'], image: '/images/beamco/webimg/innerbanner08.jpg', alt: 'A rope-access worker maintaining a glass building façade' },
  { id: 'workspace', short: 'Find a workspace', title: 'Give your business a base', description: 'For a business looking for office space, Mint Business Center provides business-centre and office solutions. Contact the team to discuss your requirements.', scope: ['Business centre', 'Office solutions'], companyIds: ['mint'], image: '/images/beamco/webimg/innerbanner07.jpg', alt: 'The reception area at Mint Business Center' },
];
