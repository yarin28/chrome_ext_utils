import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Badge } from '@extension/ui';

// Define project type
interface Project {
  id: string;
  name: string;
  color?: string; // Optional color override
}

// Interface for our cell renderer props
interface ProjectBadgeCellRendererProps extends ICellRendererParams {
  value: Project[];
}

// Color palette for projects
const PROJECT_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-cyan-500',
];

// Main cell renderer component
export const ProjectBadgeCellRenderer = (props: ProjectBadgeCellRendererProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const projects = props.value || [];

  // No projects case
  if (!projects.length) {
    return <span className="text-gray-400 text-sm">No projects</span>;
  }

  // Generate consistent color for a project
  const getProjectColor = (project: Project): string => {
    if (project.color) return project.color;

    // Generate a consistent hash based on project ID
    const hashCode = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return PROJECT_COLORS[hashCode % PROJECT_COLORS.length];
  };

  // Define how many projects to show in collapsed state
  const DISPLAY_COUNT = 2;
  const shouldCollapse = projects.length > DISPLAY_COUNT;
  const visibleProjects = expanded || !shouldCollapse ? projects : projects.slice(0, DISPLAY_COUNT);

  return (
    <div className="flex flex-wrap gap-1 items-center max-w-full" onClick={e => e.stopPropagation()}>
      {visibleProjects.map(project => (
        <Badge
          key={project.id}
          className={`${getProjectColor(project)} text-white text-xs font-medium`}
          variant="secondary">
          {project.name}
        </Badge>
      ))}

      {shouldCollapse &&
        (expanded ? (
          <Badge
            variant="outline"
            className="cursor-pointer text-xs bg-gray-100"
            onClick={e => {
              setExpanded(false);
              e.stopPropagation();
            }}>
            Show less ↑
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="cursor-pointer text-xs bg-gray-100"
            onClick={e => {
              setExpanded(true);
              e.stopPropagation();
            }}
            title={projects.map(p => p.name).join(', ')}>
            +{projects.length - DISPLAY_COUNT} more ↓
          </Badge>
        ))}
    </div>
  );
};

// For ag-Grid registration - function component wrapper
export default ProjectBadgeCellRenderer;
