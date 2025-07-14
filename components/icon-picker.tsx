'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconPickerProps {
  selectedIcon?: string;
  onIconSelect: (iconName: string) => void;
}

// Get all available Lucide icons
const getAllIcons = () => {
  const icons: { [key: string]: React.ComponentType } = {};
  Object.keys(LucideIcons).forEach((key) => {
    const icon = (LucideIcons as any)[key];
    if (typeof icon === 'function' && key !== 'createLucideIcon') {
      icons[key] = icon;
    }
  });
  return icons;
};

const allIcons = getAllIcons();
const iconNames = Object.keys(allIcons);

export function IconPicker({ selectedIcon, onIconSelect }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = iconNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName);
    setOpen(false);
    setSearchQuery('');
  };

  const clearIcon = () => {
    onIconSelect('');
  };

  const SelectedIcon = selectedIcon ? (allIcons as any)[selectedIcon] : null;

  return (
    <div className="space-y-2">
      <Label>Icon (Optional)</Label>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {SelectedIcon ? (
                <>
                  <SelectedIcon className="h-4 w-4 mr-2" />
                  {selectedIcon}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Select an icon...
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <ScrollArea className="h-64">
              <div className="grid grid-cols-6 gap-1 p-2">
                {filteredIcons.slice(0, 120).map((iconName) => {
                  const IconComponent = (allIcons as any)[iconName];
                  return (
                    <Button
                      key={iconName}
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => handleIconSelect(iconName)}
                      title={iconName}
                    >
                      <IconComponent className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>
              {filteredIcons.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No icons found
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
        
        {selectedIcon && (
          <Button variant="outline" size="icon" onClick={clearIcon}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {selectedIcon && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            {SelectedIcon && <SelectedIcon className="h-3 w-3" />}
            {selectedIcon}
          </Badge>
        </div>
      )}
    </div>
  );
}