import { prisma } from '../lib/prisma'


async function main() {
    console.log("🌱 Starting database seeding...")

    // ============================================
    // 1. SUBSCRIPTION PLANS
    // ============================================
    console.log("Creating/Updating Plans...")

    const silver = await prisma.plan.upsert({
        where: { name: 'silver-monthly' },
        update: {
            tier: 1,
            monthlyStellasGrant: 100, // Customize these grants as you see fit
            paymentType: 'SUBSCRIPTION',
            competitorAnalysisAccess: false,
            aiConsultantAccess: false,
            dailyAutoAnalysisEnabled: false
        },
        create: {
            name: 'silver-monthly',
            tier: 1,
            monthlyStellasGrant: 100,
            paymentType: 'SUBSCRIPTION',
            competitorAnalysisAccess: false,
            aiConsultantAccess: false,
            dailyAutoAnalysisEnabled: false
        }
    })

    const gold = await prisma.plan.upsert({
        where: { name: 'gold-monthly' },
        update: {
            tier: 2,
            monthlyStellasGrant: 300,
            paymentType: 'SUBSCRIPTION',
            competitorAnalysisAccess: true,
            aiConsultantAccess: false,
            dailyAutoAnalysisEnabled: false
        },
        create: {
            name: 'gold-monthly',
            tier: 2,
            monthlyStellasGrant: 300,
            paymentType: 'SUBSCRIPTION',
            competitorAnalysisAccess: true,
            aiConsultantAccess: false,
            dailyAutoAnalysisEnabled: false
        }
    })

    const platinum = await prisma.plan.upsert({
        where: { name: 'platinum-monthly' },
        update: {
            tier: 3,
            monthlyStellasGrant: 600,
            paymentType: 'SUBSCRIPTION',
            competitorAnalysisAccess: true,
            aiConsultantAccess: true,
            dailyAutoAnalysisEnabled: true
        },
        create: {
            name: 'platinum-monthly',
            tier: 3,
            monthlyStellasGrant: 600,
            paymentType: 'SUBSCRIPTION',
            competitorAnalysisAccess: true,
            aiConsultantAccess: true,
            dailyAutoAnalysisEnabled: true
        }
    })

    // ============================================
    // 2. STELLA BUNDLES (One-Time Top-ups)
    // ============================================
    console.log("Creating/Updating Stella Bundles...")

    // Helper for idempotent bundle creation (since bundle name isn't inherently @unique)
    async function upsertBundle(name: string, amount: number) {
        let bundle = await prisma.stellaBundle.findFirst({ where: { name } })
        if (bundle) {
            bundle = await prisma.stellaBundle.update({
                where: { id: bundle.id },
                data: { stellaAmount: amount, isActive: true }
            })
        } else {
            bundle = await prisma.stellaBundle.create({
                data: { name, stellaAmount: amount, isActive: true }
            })
        }
        return bundle
    }

    const smallBundle = await upsertBundle('Small', 100)
    const growthBundle = await upsertBundle('Growth', 300)
    const proBundle = await upsertBundle('Pro', 600)

    // ============================================
    // 3. PAYMENT PRODUCTS (Dodo Payments Mappings)
    // ============================================
    // These IDs are sourced from lib/constants/products.ts
    console.log("Creating/Updating Payment Products...")

    // Subscription Products
    const subscriptionMappings = [
        { providerId: 'pdt_0NYX9Hku5nJpfOzfHLFHj', planId: silver.id, price: 2500 },
        { providerId: 'pdt_0NYX9N6jog8v4RUjAkf30', planId: gold.id, price: 4500 },
        { providerId: 'pdt_0NYX9SABZjH20bE0GAy9U', planId: platinum.id, price: 9900 },
    ]

    for (const mapping of subscriptionMappings) {
        await prisma.paymentProduct.upsert({
            where: { providerProductId: mapping.providerId },
            update: {
                planId: mapping.planId,
                price: mapping.price,
            },
            create: {
                type: 'SUBSCRIPTION',
                planId: mapping.planId,
                providerName: 'dodo',
                providerProductId: mapping.providerId,
                billingPeriod: 'MONTHLY',
                price: mapping.price,
                currency: 'USD', // Update this to USD if you are charging in US Dollars
            }
        })
    }

    // Stella Bundle Products
    const bundleMappings = [
        { providerId: 'pdt_0NYX9YTBs6fGfgQZ1QEqV', bundleId: smallBundle.id, price: 2400 },
        { providerId: 'pdt_0NYXLzQV6aDge61zFrYPR', bundleId: growthBundle.id, price: 3900 },
        { providerId: 'pdt_0NYXM8vYpVLlqWFkQFYRH', bundleId: proBundle.id, price: 5900 },
    ]

    for (const mapping of bundleMappings) {
        await prisma.paymentProduct.upsert({
            where: { providerProductId: mapping.providerId },
            update: {
                bundleId: mapping.bundleId,
                price: mapping.price,
            },
            create: {
                type: 'ONE_TIME',
                bundleId: mapping.bundleId,
                providerName: 'dodo',
                providerProductId: mapping.providerId,
                price: mapping.price,
                currency: 'USD', // Update this to USD if you are charging in US Dollars
            }
        })
    }

    console.log("✅ Database seeded successfully!")
}

main()
    .catch((e) => {
        console.error("❌ Failed to seed database:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
