import React, { useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Badge } from '@extension/ui';
import { Button } from '@extension/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@extension/ui';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@extension/ui';

// Interface for cell renderer props
interface JsonCellRendererParams extends ICellRendererParams {
  value: Record<string, any>; // The JSON data
}

export const JsonCellRenderer = (props: JsonCellRendererParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const jsonData = props.data || {};

  useEffect(() => {
    // Log the JSON data
    console.log('props', props);
  }, []);
  // Count the number of keys in the JSON object
  const keyCount = Object.keys(jsonData).length;

  // Function to format JSON values for display
  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') return Array.isArray(value) ? `[Array(${value.length})]` : '{...}';
    if (typeof value === 'string') {
      // Truncate long strings
      return value.length > 30 ? `${value.substring(0, 30)}...` : value;
    }
    return String(value);
  };

  // Filter for important keys to show in preview (customize as needed)
  const importantKeys = ['id', 'type', 'status', 'lastUpdated'];
  const previewData = Object.entries(jsonData)
    .filter(([key]) => importantKeys.includes(key))
    .slice(0, 3); // Limit to 3 items

  // Create a preview string
  const previewText =
    previewData.length > 0
      ? previewData.map(([key, value]) => `${key}: ${formatValue(value)}`).join(', ')
      : `${keyCount} field${keyCount !== 1 ? 's' : ''}`;

  return (
    <>
      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <Button
          variant="ghost"
          // size="sm"
          className="text-xs h-7 px-2"
          onClick={() => setIsOpen(true)}>
          <span className="mr-1">📋</span>
          {previewText}
        </Button>
        <Badge variant="outline" className="text-xs">
          {keyCount} field{keyCount !== 1 ? 's' : ''}
        </Badge>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Metadata</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {/* Grouped fields for better organization */}
              <AccordionItem value="important">
                <AccordionTrigger className="text-sm font-medium">Important Information</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Display important fields first */}
                    {Object.entries(jsonData)
                      .filter(([key]) => importantKeys.includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-start py-1 border-b border-gray-100">
                          <span className="text-sm font-medium w-1/3">{key}:</span>
                          <span className="text-sm truncate">{formatValue(value)}</span>
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="all">
                <AccordionTrigger className="text-sm font-medium">All Data</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(jsonData).map(([key, value]) => (
                      <div key={key} className="flex items-start py-1 border-b border-gray-100">
                        <span className="text-sm font-medium w-1/3">{key}:</span>
                        <span className="text-sm break-words">{formatValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="raw">
                <AccordionTrigger className="text-sm font-medium">Raw JSON</AccordionTrigger>
                <AccordionContent>
                  <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(jsonData, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JsonCellRenderer;
