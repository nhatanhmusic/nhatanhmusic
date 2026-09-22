import type {
  BrandRow,
  BrandView,
  CategoryRow,
  CategoryView,
  ItemCard,
  ItemDetail,
  ItemFilters,
  ModelOption,
  ModelView,
  PageResponse,
  SettingView,
  TemplatePoint,
} from './types';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080/api/v1';

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: Record<string, string>,
  ) {
    super(message);
  }
}

type FetchOptions = RequestInit & { token?: string | null };

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // Đang ở trang quản trị mà backend nói "không có quyền" thì gần như chắc là
    // token hết hạn. Đưa về đăng nhập, nhớ đường dẫn để quay lại đúng chỗ đang làm.
    if ((res.status === 401 || res.status === 403) && token && typeof window !== 'undefined') {
      const here = window.location.pathname + window.location.search;
      if (here.startsWith('/admin')) {
        document.cookie = 'na_token=; path=/; max-age=0; samesite=lax';
        document.cookie = 'na_role=; path=/; max-age=0; samesite=lax';
        window.location.href = `/dang-nhap?next=${encodeURIComponent(here)}&expired=1`;
      }
    }
    throw new ApiRequestError(
      res.status,
      body?.code ?? 'UNKNOWN',
      body?.message ??
        (res.status === 401 || res.status === 403
          ? 'Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục.'
          : 'Không gọi được máy chủ.'),
      body?.fields,
    );
  }
  return body as T;
}

function qs(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      value.filter((v) => v !== '' && v !== undefined).forEach((v) => sp.append(key, String(v)));
    } else {
      sp.set(key, String(value));
    }
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/** Trang khách render ở server; dữ liệu tươi lại mỗi 60 giây. */
const publicCache: RequestInit = { next: { revalidate: 60 } } as RequestInit;

export const catalogApi = {
  items(params: Record<string, unknown>) {
    return request<PageResponse<ItemCard>>(`/catalog/items${qs(params)}`, publicCache);
  },
  item(slug: string) {
    return request<ItemDetail>(`/catalog/items/${encodeURIComponent(slug)}`, publicCache);
  },
  related(id: number, limit = 4) {
    return request<ItemCard[]>(`/catalog/items/${id}/related${qs({ limit })}`, publicCache);
  },
  filters() {
    return request<ItemFilters>('/catalog/filters', publicCache);
  },
  brands() {
    return request<BrandView[]>('/catalog/brands', publicCache);
  },
  categories() {
    return request<CategoryView[]>('/catalog/categories', publicCache);
  },
};

export const authApi = {
  changePassword(token: string, currentPassword: string, newPassword: string) {
    return request<{ email: string; fullName: string; role: string }>('/auth/change-password', {
      token,
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
  login(email: string, password: string) {
    return request<{ accessToken: string; expiresIn: number; fullName: string; role: string }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }), cache: 'no-store' },
    );
  },
};

export const adminApi = {
  items(token: string, params: Record<string, unknown>) {
    return request<PageResponse<ItemCard>>(`/admin/items${qs(params)}`, { token, cache: 'no-store' });
  },
  item(token: string, id: number) {
    return request<ItemDetail>(`/admin/items/${id}`, { token, cache: 'no-store' });
  },
  create(token: string, body: unknown) {
    return request<ItemDetail>('/admin/items', {
      token,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  update(token: string, id: number, body: unknown) {
    return request<ItemDetail>(`/admin/items/${id}`, {
      token,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  changeStatus(token: string, id: number, status: string) {
    return request<ItemDetail>(`/admin/items/${id}/status`, {
      token,
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  remove(token: string, id: number) {
    return request<void>(`/admin/items/${id}`, { token, method: 'DELETE' });
  },
  models(token: string) {
    return request<ModelOption[]>('/admin/product-models', { token, cache: 'no-store' });
  },

  // ---- Phiếu kiểm tra 32 điểm ----
  inspectionTemplate(token: string) {
    return request<TemplatePoint[]>('/admin/inspection-template', { token, next: { revalidate: 3600 } } as FetchOptions);
  },
  saveInspection(token: string, itemId: number, body: unknown) {
    return request<ItemDetail>(`/admin/items/${itemId}/inspection`, {
      token,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  deleteInspection(token: string, itemId: number) {
    return request<void>(`/admin/items/${itemId}/inspection`, { token, method: 'DELETE' });
  },

  // ---- Hãng, danh mục, model ----
  brands(token: string) {
    return request<BrandRow[]>('/admin/brands', { token, cache: 'no-store' });
  },
  saveBrand(token: string, id: number | null, body: unknown) {
    return request<BrandRow>(id ? `/admin/brands/${id}` : '/admin/brands', {
      token,
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(body),
    });
  },
  deleteBrand(token: string, id: number) {
    return request<void>(`/admin/brands/${id}`, { token, method: 'DELETE' });
  },

  categories(token: string) {
    return request<CategoryRow[]>('/admin/categories', { token, cache: 'no-store' });
  },
  saveCategory(token: string, id: number | null, body: unknown) {
    return request<CategoryRow>(id ? `/admin/categories/${id}` : '/admin/categories', {
      token,
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(body),
    });
  },
  deleteCategory(token: string, id: number) {
    return request<void>(`/admin/categories/${id}`, { token, method: 'DELETE' });
  },

  modelRows(token: string) {
    return request<ModelView[]>('/admin/models', { token, cache: 'no-store' });
  },
  saveModel(token: string, id: number | null, body: unknown) {
    return request<ModelView>(id ? `/admin/models/${id}` : '/admin/models', {
      token,
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(body),
    });
  },
  deleteModel(token: string, id: number) {
    return request<void>(`/admin/models/${id}`, { token, method: 'DELETE' });
  },

  // ---- Ảnh (mục 5) ----
  presign(
    token: string,
    itemId: number,
    body: { kind: string; index: number; variant: 'display' | 'thumb' | 'original'; contentType?: string; extension?: string },
  ) {
    return request<{ uploadUrl: string; key: string; publicUrl: string; expiresInSeconds: number }>(
      `/admin/items/${itemId}/photos/presign`,
      { token, method: 'POST', body: JSON.stringify(body) },
    );
  },
  mediaStatus(token: string) {
    return request<{ configured: boolean; publicBaseUrl: string }>('/admin/media/status', {
      token,
      cache: 'no-store',
    });
  },

  // ---- Nội dung web ----
  settings(token: string) {
    return request<SettingView[]>('/admin/settings', { token, cache: 'no-store' });
  },
  saveSetting(token: string, key: string, value: unknown) {
    return request<SettingView>(`/admin/settings/${key}`, {
      token,
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  },
};

/** Backend chết hoặc chưa chạy — trang khách phải hiện được trạng thái lỗi, không vỡ. */
export async function safe<T>(promise: Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try {
    return { data: await promise, error: null };
  } catch (err) {
    const message =
      err instanceof ApiRequestError
        ? err.message
        : 'Không kết nối được máy chủ. Kiểm tra backend đã chạy ở cổng 8080 chưa.';
    return { data: null, error: message };
  }
}
