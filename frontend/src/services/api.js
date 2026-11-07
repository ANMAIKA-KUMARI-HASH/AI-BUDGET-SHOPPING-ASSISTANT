/**
 * Frontend API Service
 * Handles communication with Express backend
 */

const API_BASE = '/api';

export async function fetchProducts({ category = 'all', maxBudget = null, search = '', sortBy = 'score' } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (maxBudget) params.append('maxBudget', maxBudget);
  if (search) params.append('search', search);
  if (sortBy) params.append('sortBy', sortBy);

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchRecommendations({ budget, category = 'all', search = '', topN = 5, sortBy = 'score' }) {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ budget, category, search, topN, sortBy })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch recommendations: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/products/categories`);
  if (!res.ok) {
    throw new Error('Failed to load categories');
  }
  return await res.json();
}

export async function fetchComparison(productIds, budget = null) {
  const res = await fetch(`${API_BASE}/products/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productIds, budget })
  });
  if (!res.ok) {
    throw new Error('Failed to load comparison data');
  }
  return await res.json();
}

export async function scanProduct({ image, productName, imageHint, detectedCategory, demoId, budget }) {
  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image, productName, imageHint, detectedCategory, demoId, budget })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to scan product: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchScanSamples() {
  const res = await fetch(`${API_BASE}/scan/samples`);
  if (!res.ok) {
    throw new Error('Failed to load scan samples');
  }
  return await res.json();
}

export async function fetchTracker() {
  const res = await fetch(`${API_BASE}/tracker`);
  if (!res.ok) {
    throw new Error('Failed to fetch tracker data');
  }
  return await res.json();
}

export async function addTrackerExpense(expenseData) {
  const res = await fetch(`${API_BASE}/tracker/expense`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add expense');
  }
  return await res.json();
}

export async function deleteTrackerExpense(id) {
  const res = await fetch(`${API_BASE}/tracker/expense/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Failed to delete expense');
  }
  return await res.json();
}

export async function updateTrackerBudget(totalBudget) {
  const res = await fetch(`${API_BASE}/tracker/budget`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ totalBudget })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update budget');
  }
  return await res.json();
}

export async function resetTracker() {
  const res = await fetch(`${API_BASE}/tracker/reset`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('Failed to reset tracker');
  }
  return await res.json();
}

export async function syncProductsAPI() {
  const res = await fetch(`${API_BASE}/products/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to sync products from API');
  }
  return await res.json();
}

export async function fetchSyncStatusAPI() {
  const res = await fetch(`${API_BASE}/products/sync-status`);
  if (!res.ok) {
    throw new Error('Failed to fetch sync status');
  }
  return await res.json();
}


