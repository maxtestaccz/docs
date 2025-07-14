'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Folder, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Category } from '@/types';
import { getStorageData, deleteCategory } from '@/lib/storage';

export default function CategoriesPage() {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    const appState = process.env.NEXT_PUBLIC_APP_STATE;
    if (appState !== 'edit') {
      router.push('/');
      return;
    }
    setIsEditMode(true);
    
    const data = getStorageData();
    setCategories(data.categories);
    setPages(data.pages);
  }, [router]);

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  if (!isEditMode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isEditMode={isEditMode} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Categories</h1>
              <p className="text-muted-foreground">
                Manage your content categories
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Categories</CardTitle>
                  <CardDescription>
                    Organize your documentation with categories
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/admin/categories/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{category.name}</h3>
                        <Badge variant="secondary">
                          {pages.filter(p => p.category === category.slug).length} pages
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Slug: {category.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {categories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Folder className="h-8 w-8 mx-auto mb-2" />
                    <p>No categories yet. Create your first category to organize content!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}