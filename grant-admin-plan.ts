import { prisma } from './lib/prisma'

async function main() {
    console.log("Granting Platinum plan to admin user...");

    // 1. Find the admin user
    const admin = await prisma.user.findFirst({
        where: { role: 'admin' }
    });

    if (!admin) {
        console.error("❌ No admin user found! Please promote a user to admin first.");
        process.exit(1);
    }

    console.log(`Found admin: ${admin.email}`);

    // 2. Find Platinum plan
    const platinumPlan = await prisma.plan.findUnique({
        where: { name: 'platinum-monthly' }
    });

    if (!platinumPlan) {
        console.error("❌ Platinum plan not found. Did you run the seed script?");
        process.exit(1);
    }

    // 3. Create or update Subscription
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 10); // 10 years free

    await prisma.subscription.upsert({
        where: { 
            // We don't have a unique constraint on userId alone in Subscription,
            // but we need to find it by providerSubscriptionId.
            // Actually, wait, providerSubscriptionId is unique.
            providerSubscriptionId: `admin-grant-${admin.id}`
        },
        update: {
            planId: platinumPlan.id,
            status: "ACTIVE",
            currentPeriodEnd: futureDate,
        },
        create: {
            userId: admin.id,
            planId: platinumPlan.id,
            providerName: "manual",
            providerSubscriptionId: `admin-grant-${admin.id}`,
            status: "ACTIVE",
            currentPeriodEnd: futureDate,
        }
    });

    // 4. Update Wallet with credits
    await prisma.wallet.upsert({
        where: { userId: admin.id },
        update: {
            monthlyBalance: platinumPlan.monthlyStellasGrant
        },
        create: {
            userId: admin.id,
            monthlyBalance: platinumPlan.monthlyStellasGrant,
            topupBalance: 0
        }
    });

    // 5. Create a transaction record for audit
    await prisma.stellaTransaction.create({
        data: {
            userId: admin.id,
            amount: platinumPlan.monthlyStellasGrant,
            bucket: "MONTHLY",
            reason: "ADMIN_ADJUSTMENT",
            referenceId: `admin-grant-${admin.id}`,
            status: "SETTLED"
        }
    });

    console.log("✅ Successfully granted Platinum Plan (10 years) and initialized wallet for admin!");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    });
