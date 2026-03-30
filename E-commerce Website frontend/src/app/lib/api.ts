const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const request = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  console.log(`[API] ${options.method || "GET"} ${url}`);
  console.log("[API] TOKEN:", token);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  //  Always attach token if exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    console.error("[API ERROR]", data);

    //  Handle auth errors globally
    if (res.status === 401) {
      localStorage.removeItem("token"); // logout user
    }

    throw new Error(data.message || `Server error: ${res.status}`);
  }

  return {
    data: data.data,
    success: data.success,
    pagination: data.pagination || null,
    token: data.token || null,
    message: data.message || null,
  };
};


// ==========================
// PRODUCTS API
// ==========================
export const productsApi = {
  getAll: async (
    page = 1,
    limit = 12,
    filters: any = {},
    sort?: string,
    search?: string
  ) => {
    let query = `?page=${page}&limit=${limit}`;

    if (search) query += `&search=${search}`;
    if (sort) query += `&sort=${sort}`;

    if (filters) {
      if (filters.categories?.length)
        query += `&category=${filters.categories[0]}`;

      if (filters.brands?.length)
        query += `&brand=${filters.brands[0]}`;

      if (filters.priceRange) {
        query += `&minPrice=${filters.priceRange[0]}`;
        query += `&maxPrice=${filters.priceRange[1]}`;
      }

      if (filters.rating) query += `&rating=${filters.rating}`;

      if (filters.inStock) query += `&inStock=true`;
    }

    return request(`/products${query}`);
  },

  getById: async (id: string) => {
    return request(`/products/${id}`);
  },

  create: async (productData: any, token?: string) => {
    // We pass 'token' for type safety, but 'request' will override it with localStorage token if needed.
    return request(`/products`, {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  update: async (id: string, productData: any, token?: string) => {
    return request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: string, token?: string) => {
    return request(`/products/${id}`, {
      method: "DELETE",
    });
  },

  getBestSellers: async (limit = 6) => {
    return request(`/products/featured/best-sellers?limit=${limit}`);
  },

  getNewArrivals: async (limit = 6) => {
    return request(`/products/featured/new-arrivals?limit=${limit}`);
  },

  getFeatured: async (limit = 4) => {
    return request(`/products/featured/featured?limit=${limit}`);
  },

  getRelated: async (id: string) => {
    return request(`/products/${id}/related`);
  },
};

// ==========================
// CATEGORIES API
// ==========================
export const categoriesApi = {
  getAll: async () => {
    return request(`/categories`);
  },

  getById: async (id: string) => {
    return request(`/categories/${id}`);
  },

  getBySlug: async (slug: string) => {
    return request(`/categories/slug/${slug}`);
  },
};

// ==========================
// BRANDS API
// ==========================
export const brandsApi = {
  getAll: async () => {
    return request(`/brands`);
  },
};

// ==========================
// REVIEWS API
// ==========================
export const reviewsApi = {
  getByProduct: async (productId: string) => {
    return request(`/reviews/product/${productId}`);
  },

  create: async (body: any, token: string) => {
    return request(`/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  },
};

// ==========================
// SEARCH API
// ==========================
export const searchApi = {
  search: async (query: string) => {
    return request(`/search?q=${query}`);
  },
};

// ==========================
// AUTH / USERS API
// ==========================
export const usersApi = {
 login: async (body: { email: string; password: string }) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  //  SAVE TOKEN 
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
},

  register: async (body: any) => {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
    }

    return res.json();
  },

  getAll: async () => {
    return request(`/users`);
  },
};

// ==========================
// ORDERS API 
// ==========================
export const ordersApi = {
  create: async (body: any) => {
    return request(`/orders`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  getUserOrders: async (userId: string) => {
    return request(`/orders/user/${userId}`);
  },

  getAll: async () => {
    return request(`/orders`);
  },

  getById: async (id: string) => {
    return request(`/orders/${id}`);
  }
};

// ==========================
// WISHLIST API
// ==========================
export const wishlistApi = {
  get: async (userId: string) => {
    return request(`/wishlist/${userId}`);
  },

  add: async (userId: string, productId: string) => {
    return request(`/wishlist/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
  },

  remove: async (userId: string, productId: string) => {
    return request(`/wishlist/${userId}/${productId}`, {
      method: "DELETE",
    });
  },
};

export const getProductById = (id: string) => {
  return productsApi.getById(id);
};

export const getOrders = (userId: string) => {
  return ordersApi.getUserOrders(userId);
};