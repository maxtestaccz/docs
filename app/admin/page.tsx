'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, FileText, Folder, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Page, Category } from '@/types';
import { getStorageData, deletePage, deleteCategory } from '@/lib/storage';

export default function AdminPage() {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const appState = process.env.NEXT_PUBLIC_APP_STATE;
    if (appState !== 'edit') {
      router.push('/');
      return;
    }
    setIsEditMode(true);
    
    const data = getStorageData();
    setPages(data.pages);
    setCategories(data.categories);
  }, [router]);

  const handleDeletePage = (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deletePage(id);
      setPages(pages.filter(p => p.id !== id));
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  if (!isEditMode) {
    return null;
  }

  const stats = {
    totalPages: pages.length,
    totalCategories: categories.length,
    recentPages: pages.slice(0, 5),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isEditMode={isEditMode} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your documentation content and settings
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPages}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentPages.length}</div>
              <p className="text-xs text-muted-foreground">Recent pages</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pages</CardTitle>
                    <CardDescription>
                      Manage your documentation pages
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/pages/new">
                      <Plus className="h-4 w-4 mr-2" />
                      New Page
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{page.title}</h3>
                          <Badge variant="secondary">{page.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {page.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {page.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/pages/${page.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePage(page.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {pages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>No pages yet. Create your first page to get started!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                      Organize your content with categories
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
                        <h3 className="font-medium mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {pages.filter(p => p.category === category.slug).length} pages
                        </Badge>
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
          </TabsContent>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Pages</CardTitle>
                  <CardDescription>
                    Your latest documentation pages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentPages.map((page) => (
                      <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Link href={`/docs/${page.slug}`} className="font-medium hover:text-primary">
                            {page.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Updated {new Date(page.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">{page.category}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button asChild variant="outline">
                      <Link href="/admin/pages/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Page
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/admin/categories/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Category
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}