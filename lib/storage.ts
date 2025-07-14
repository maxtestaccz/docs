import { AppState, Page, Category } from '@/types';

const STORAGE_KEY = 'docs-app-state';

export const getStorageData = (): AppState => {
  if (typeof window === 'undefined') {
    return { pages: [], categories: [] };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaultState: AppState = {
      pages: [
        {
          id: '1',
          title: 'Getting Started',
          slug: 'getting-started',
          description: 'Learn how to get started with our documentation system',
          category: 'guides',
          tags: ['beginner', 'setup'],
          content: '<h1>Getting Started</h1><p>Welcome to our documentation system! This guide will help you understand how to use and navigate through our documentation.</p><h2>Features</h2><ul><li>Rich text editing</li><li>Category organization</li><li>Search functionality</li><li>Dark/light mode</li></ul>',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      categories: [
        {
          id: '1',
          name: 'Guides',
          slug: 'guides',
          description: 'Step-by-step guides and tutorials',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'API Reference',
          slug: 'api-reference',
          description: 'Complete API documentation',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return defaultState;
  }
  
  return JSON.parse(stored);
};

export const saveStorageData = (data: AppState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const savePage = (page: Page): void => {
  const data = getStorageData();
  const existingIndex = data.pages.findIndex(p => p.id === page.id);
  
  if (existingIndex >= 0) {
    data.pages[existingIndex] = { ...page, updatedAt: new Date().toISOString() };
  } else {
    data.pages.push({ ...page, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  
  saveStorageData(data);
};

export const deletePage = (id: string): void => {
  const data = getStorageData();
  data.pages = data.pages.filter(p => p.id !== id);
  saveStorageData(data);
};

export const saveCategory = (category: Category): void => {
  const data = getStorageData();
  const existingIndex = data.categories.findIndex(c => c.id === category.id);
  
  if (existingIndex >= 0) {
    data.categories[existingIndex] = category;
  } else {
    data.categories.push({ ...category, createdAt: new Date().toISOString() });
  }
  
  saveStorageData(data);
};

export const deleteCategory = (id: string): void => {
  const data = getStorageData();
  data.categories = data.categories.filter(c => c.id !== id);
  saveStorageData(data);
};