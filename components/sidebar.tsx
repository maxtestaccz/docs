'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Folder, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Category, Page } from '@/types';
import { getStorageData } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isEditMode: boolean;
}

export function Sidebar({ isEditMode }: SidebarProps) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const data = getStorageData();
    setCategories(data.categories);
    setPages(data.pages);
  }, []);

  const groupedPages = categories.reduce((acc, category) => {
    acc[category.slug] = pages.filter(page => page.category === category.slug);
    return acc;
  }, {} as Record<string, Page[]>);

  const uncategorizedPages = pages.filter(page => 
    !categories.some(cat => cat.slug === page.category)
  );

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Documentation</h2>
        
        {isEditMode && (
          <div className="flex flex-col gap-2 mb-4">
            <Button asChild size="sm" className="w-full">
              <Link href="/admin/pages/new">
                <Plus className="h-4 w-4 mr-2" />
                New Page
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/admin/categories">
                <Settings className="h-4 w-4 mr-2" />
                Manage Categories
              </Link>
            </Button>
          </div>
        )}
        
        <Separator className="mb-4" />
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-2 mb-2">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {groupedPages[category.slug]?.length || 0}
                  </Badge>
                </div>
                
                <div className="ml-6 space-y-1">
                  {groupedPages[category.slug]?.map((page) => (
                    <Link
                      key={page.id}
                      href={`/docs/${page.slug}`}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-accent transition-colors",
                        pathname === `/docs/${page.slug}` ? "bg-accent" : ""
                      )}
                    >
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{page.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            {uncategorizedPages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm">Uncategorized</h3>
                  <Badge variant="secondary" className="text-xs">
                    {uncategorizedPages.length}
                  </Badge>
                </div>
                
                <div className="ml-6 space-y-1">
                  {uncategorizedPages.map((page) => (
                    <Link
                      key={page.id}
                      href={`/docs/${page.slug}`}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-accent transition-colors",
                        pathname === `/docs/${page.slug}` ? "bg-accent" : ""
                      )}
                    >
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{page.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}