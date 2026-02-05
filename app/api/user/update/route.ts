import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// POST /api/user/update
// Unified update endpoint for user profile and social account
export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();

        const {
            firstName,
            lastName,
            phoneNumber,
            image,
            niche,
            subNiche,
            instagramUsername,
            automationSettings,
        } = body;

        // Build user update data
        const userUpdateData: Record<string, unknown> = {};

        if (firstName !== undefined || lastName !== undefined) {
            const newName = [firstName, lastName].filter(Boolean).join(" ");
            if (newName) {
                userUpdateData.name = newName;
            }
        }

        if (phoneNumber !== undefined) userUpdateData.phoneNumber = phoneNumber;
        if (image !== undefined) userUpdateData.image = image;
        if (niche !== undefined) userUpdateData.niche = niche;
        if (subNiche !== undefined) userUpdateData.subNiche = subNiche;

        // Update user if there's data to update
        if (Object.keys(userUpdateData).length > 0) {
            await prisma.user.update({
                where: { id: userId },
                data: userUpdateData,
            });
        }

        // Handle Instagram username -> SocialAccount upsert
        if (instagramUsername !== undefined) {
            const username = instagramUsername.replace(/^@/, "").trim();

            if (username) {
                // Find existing social account for this user
                const existingSocialAccount = await prisma.socialAccount.findFirst({
                    where: { userId },
                });

                if (existingSocialAccount) {
                    // Update existing
                    await prisma.socialAccount.update({
                        where: { id: existingSocialAccount.id },
                        data: { username },
                    });
                } else {
                    // Create new
                    await prisma.socialAccount.create({
                        data: {
                            userId,
                            username,
                        },
                    });
                }
            }
        }

        // Handle Automation Settings update
        if (automationSettings) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { subscriptions: { include: { plan: true } } }
            });

            const isPlatinum = user?.subscriptions?.some(
                sub => sub.status === 'ACTIVE' && sub.plan.name.toLowerCase().includes('platinum')
            );

            if (isPlatinum) {
                await prisma.automationSettings.upsert({
                    where: { userId },
                    create: {
                        userId,
                        competitors: automationSettings.competitors || [],
                        writingStyle: automationSettings.writingStyle || "let ai decide",
                        scriptLanguage: automationSettings.scriptLanguage || "English",
                        captionLanguage: automationSettings.captionLanguage || "English",
                    },
                    update: {
                        competitors: automationSettings.competitors,
                        writingStyle: automationSettings.writingStyle,
                        scriptLanguage: automationSettings.scriptLanguage,
                        captionLanguage: automationSettings.captionLanguage,
                    },
                });
            }
        }

        // Fetch updated user data to return
        const updatedUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                image: true,
                niche: true,
                subNiche: true,
                socialAccounts: {
                    select: {
                        id: true,
                        username: true,
                    },
                    take: 1,
                },
                automationSettings: true,
            },
        });

        return NextResponse.json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
