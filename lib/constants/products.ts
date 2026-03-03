export const STELLA_BUNDLES = [
    { id: 'pdt_0NYX9YTBs6fGfgQZ1QEqV', name: 'Small', stellas: 100, price: 2900, color: 'blue' },
    { id: 'pdt_0NYXLzQV6aDge61zFrYPR', name: 'Growth', stellas: 300, price: 6900, bestValue: true, color: 'amber' },
    { id: 'pdt_0NYXM8vYpVLlqWFkQFYRH', name: 'Pro', stellas: 600, price: 11900, color: 'purple' }
];

export const getStellaBundleById = (id: string) => STELLA_BUNDLES.find((bundle) => bundle.id === id);

export const SUBSCRIPTION_PLANS = [
    { productId: "pdt_0NYX9Hku5nJpfOzfHLFHj", slug: "silver-monthly", name: "Silver Plan" },
    { productId: "pdt_0NYX9N6jog8v4RUjAkf30", slug: "gold-monthly", name: "Gold Plan" },
    { productId: "pdt_0NYX9SABZjH20bE0GAy9U", slug: "platinum-monthly", name: "Platinum Plan" },
];

export const AUTH_PRODUCTS = [
    ...SUBSCRIPTION_PLANS.map(p => ({ productId: p.productId, slug: p.slug })),
    ...STELLA_BUNDLES.map(b => ({ productId: b.id, slug: `bundle-${b.name.toLowerCase()}` }))
];
