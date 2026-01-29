import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PaymentType, BillingPeriod } from "../generated/prisma";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...\n");

    // ============================================
    // 1. SUBSCRIPTION PLANS
    // ============================================
    console.log("📦 Creating Plans...");

    const basicPlan = await prisma.plan.upsert({
        where: { name: "Basic" },
        update: {},
        create: {
            name: "Basic",
            tier: 1,
            monthlyStellasGrant: 100,
            paymentType: PaymentType.SUBSCRIPTION,
            competitorAnalysisAccess: false,
            aiConsultantAccess: false,
            dailyAutoAnalysisEnabled: false,
        },
    });
    console.log(`  ✅ Basic Plan: ${basicPlan.id}`);

    const creatorPlan = await prisma.plan.upsert({
        where: { name: "Creator" },
        update: {},
        create: {
            name: "Creator",
            tier: 2,
            monthlyStellasGrant: 200,
            paymentType: PaymentType.SUBSCRIPTION,
            competitorAnalysisAccess: true,
            aiConsultantAccess: false,
            dailyAutoAnalysisEnabled: false,
        },
    });
    console.log(`  ✅ Creator Plan: ${creatorPlan.id}`);

    const proPlan = await prisma.plan.upsert({
        where: { name: "Pro" },
        update: {},
        create: {
            name: "Pro",
            tier: 3,
            monthlyStellasGrant: 400,
            paymentType: PaymentType.SUBSCRIPTION,
            competitorAnalysisAccess: true,
            aiConsultantAccess: true,
            dailyAutoAnalysisEnabled: true,
        },
    });
    console.log(`  ✅ Pro Plan: ${proPlan.id}`);

    // ============================================
    // 2. STELLA BUNDLE (One-time purchase)
    // ============================================
    console.log("\n💎 Creating Stella Bundle...");

    const starterBundle = await prisma.stellaBundle.upsert({
        where: { id: "00000000-0000-0000-0000-000000000001" }, // Use a fixed ID for upsert
        update: {
            name: "100 Stellas Pack",
            stellaAmount: 100,
            isActive: true,
        },
        create: {
            name: "100 Stellas Pack",
            stellaAmount: 100,
            isActive: true,
        },
    });
    console.log(`  ✅ 100 Stellas Pack: ${starterBundle.id}`);

    // ============================================
    // 3. PAYMENT PRODUCTS (Dodo mappings)
    // ============================================
    console.log("\n💳 Creating Payment Products...");

    // Basic Plan - Monthly
    await prisma.paymentProduct.upsert({
        where: { providerProductId: "pdt_0NWyeKym8LDKoNKB9E7do" },
        update: {
            price: 2500, // $25.00
            currency: "USD",
        },
        create: {
            type: PaymentType.SUBSCRIPTION,
            planId: basicPlan.id,
            bundleId: null,
            providerName: "dodo",
            providerProductId: "pdt_0NWyeKym8LDKoNKB9E7do",
            billingPeriod: BillingPeriod.MONTHLY,
            price: 2500, // $25.00 in cents
            currency: "USD",
        },
    });
    console.log("  ✅ Basic Monthly (pdt_0NWyeKym8LDKoNKB9E7do)");

    // Creator Plan - Monthly
    await prisma.paymentProduct.upsert({
        where: { providerProductId: "pdt_0NXHnRHE2WZEePYoiQlyI" },
        update: {
            price: 4500, // $45.00
            currency: "USD",
        },
        create: {
            type: PaymentType.SUBSCRIPTION,
            planId: creatorPlan.id,
            bundleId: null,
            providerName: "dodo",
            providerProductId: "pdt_0NXHnRHE2WZEePYoiQlyI",
            billingPeriod: BillingPeriod.MONTHLY,
            price: 4500, // $45.00 in cents
            currency: "USD",
        },
    });
    console.log("  ✅ Creator Monthly (pdt_0NXHnRHE2WZEePYoiQlyI)");

    // Pro Plan - Monthly
    await prisma.paymentProduct.upsert({
        where: { providerProductId: "pdt_0NXHnX4Wd2XdAz47FRiof" },
        update: {
            price: 9900, // $99.00
            currency: "USD",
        },
        create: {
            type: PaymentType.SUBSCRIPTION,
            planId: proPlan.id,
            bundleId: null,
            providerName: "dodo",
            providerProductId: "pdt_0NXHnX4Wd2XdAz47FRiof",
            billingPeriod: BillingPeriod.MONTHLY,
            price: 9900, // $99.00 in cents
            currency: "USD",
        },
    });
    console.log("  ✅ Pro Monthly (pdt_0NXHnX4Wd2XdAz47FRiof)");

    // 100 Stellas Pack - One-time
    await prisma.paymentProduct.upsert({
        where: { providerProductId: "pdt_0NWvdNgnGXCcADDk4MJDH" },
        update: {
            price: 5000, // $50.00
            currency: "USD",
        },
        create: {
            type: PaymentType.ONE_TIME,
            planId: null,
            bundleId: starterBundle.id,
            providerName: "dodo",
            providerProductId: "pdt_0NWvdNgnGXCcADDk4MJDH",
            billingPeriod: null, // Not applicable for one-time
            price: 5000, // $50.00 in cents
            currency: "USD",
        },
    });
    console.log("  ✅ 100 Stellas Pack (pdt_0NWvdNgnGXCcADDk4MJDH)");

    console.log("\n✨ Seeding complete!\n");

    // Summary
    console.log("📊 Summary:");
    console.log("─────────────────────────────────────────");
    console.log("Plans:");
    console.log("  • Basic:   $25/mo, 100 stellas, no features");
    console.log("  • Creator: $45/mo, 200 stellas, competitor analysis");
    console.log("  • Pro:     $99/mo, 400 stellas, all features");
    console.log("\nBundles:");
    console.log("  • 100 Stellas Pack: $50 one-time");
    console.log("─────────────────────────────────────────\n");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
