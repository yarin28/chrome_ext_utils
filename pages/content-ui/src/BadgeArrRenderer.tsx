import React, { useEffect } from 'react';
import { Package } from 'lucide-react';
import { Badge } from '@extension/ui';

interface BadgeItem {
  id: string;
  name: string;
}

interface BadgeArrRendererProps {
  value: BadgeItem[];
}

const generateBadgeColor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Extract RGB components from the hash
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  // Helper to convert a number to a two-digit hex string
  const toHex = (num: number): string => {
    const hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const BadgeArrRenderer: React.FC<BadgeArrRendererProps> = props => {
  useEffect(() => {
    console.log(props);
  }, [props]);

  // Ensure props.value is an array of BadgeItem objects
  if (!Array.isArray(props.value)) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap', // Allow badges to wrap onto the next line
        gap: '8px',
        width: '100%', // Ensures the container takes the full available width
        boxSizing: 'border-box',
      }}>
      {props.value.map((item, index) => (
        <div
          key={item.id || index}
          style={{
            flexShrink: 1,
            flexGrow: 0,
            flexBasis: 'auto',
            minWidth: 0,
          }}>
          <Badge
            key={item.id || index}
            style={{
              backgroundColor: generateBadgeColor(item.id),
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px',
              flexShrink: 1,
              whiteSpace: 'nowrap', // prevent badge content from wrapping internally
              overflow: 'hidden',
              textOverflow: 'ellipsis', // truncate text if it overflows
            }}>
            {/* <Package style={{ marginRight: '4px' }} /> */}
            {`${item.name} (${item.id})`}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default BadgeArrRenderer;
