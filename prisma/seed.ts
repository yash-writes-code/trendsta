import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import path from "path";
import fs from "fs";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    // ============================================
    // 2. SEED STELLA BUNDLES (ONE-TIME)
    // ============================================
    console.log("\n💎 Seeding Stella Bundles...");

    const bundles = [
        {
            name: "Small",
            stellaAmount: 100,
            price: 2900, // $29.00
            providerProductId: "pdt_0NXuwtHgh0yJWU85Rye2P"
        },
        {
            name: "Growth",
            stellaAmount: 300,
            price: 6900, // $69.00
            providerProductId: "pdt_0NXuxbMQsgY22ZezqfDDL"
        },
        {
            name: "Pro",
            stellaAmount: 600,
            price: 11900, // $119.00
            providerProductId: "pdt_0NXuxfPPKAUuiQqNOgr7H"
        }
    ];

    for (const b of bundles) {
        console.log(`  ↳ Upserting Stella Bundle: ${b.name}`);

        let bundle = await prisma.stellaBundle.findFirst({
            where: { name: b.name }
        });

        if (bundle) {
            bundle = await prisma.stellaBundle.update({
                where: { id: bundle.id },
                data: {
                    stellaAmount: b.stellaAmount,
                    isActive: true
                }
            });
        } else {
            bundle = await prisma.stellaBundle.create({
                data: {
                    name: b.name,
                    stellaAmount: b.stellaAmount,
                    isActive: true
                }
            });
        }

        await prisma.paymentProduct.upsert({
            where: { providerProductId: b.providerProductId },
            update: {
                bundleId: bundle.id,
                price: b.price,
                currency: "USD",
                type: "ONE_TIME",
                providerName: "dodo"
            },
            create: {
                bundleId: bundle.id,
                price: b.price,
                currency: "USD",
                type: "ONE_TIME",
                providerName: "dodo",
                providerProductId: b.providerProductId,
            }
        });
    }

}

console.log("\n✅ Seeding complete!");

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
