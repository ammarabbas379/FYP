import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '../../db';
import { Subscribers } from '../../db/schema';
import { eq } from 'drizzle-orm';

// This API handles newsletter subscriptions
export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // 1. Robust email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Please provide a valid email address (e.g., user@gmail.com).' },
                { status: 400 }
            );
        }

        // 2. Check if already subscribed
        const existingSubscriber = await db.select().from(Subscribers).where(eq(Subscribers.email, email)).limit(1);
        
        if (existingSubscriber.length > 0) {
            return NextResponse.json(
                { success: false, message: 'This email is already subscribed!' },
                { status: 400 }
            );
        }

        // 3. Save to database
        await db.insert(Subscribers).values({
            email: email,
        });

        // 4. Send Emails (Using existing Nodemailer config)
        const contactEmail = process.env.CONTACT_EMAIL;
        const contactPassword = process.env.CONTACT_PASSWORD;

        if (contactEmail && contactPassword) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                    user: contactEmail,
                    pass: contactPassword,
                },
            });

            // Welcome email to the subscriber
            const welcomeMailOptions = {
                from: `"StoryNest AI" <${contactEmail}>`,
                to: email,
                subject: 'Welcome to the Magic! ✨ You are Subscribed',
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                        
                        <!-- Header Banner -->
                        <div style="background: linear-gradient(135deg, #9D4EDD 0%, #6B21A8 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 8px 0; letter-spacing: -0.5px;">✨ StoryNest AI</h1>
                            <p style="color: rgba(255,255,255,0.85); font-size: 15px; margin: 0;">Where Imagination Becomes a Story</p>
                        </div>

                        <!-- Body -->
                        <div style="padding: 40px 36px;">
                            <h2 style="color: #1a1a2e; font-size: 24px; margin: 0 0 16px 0;">Welcome to the Magic! 🪄</h2>
                            <p style="color: #555; font-size: 16px; line-height: 1.7; margin: 0 0 16px 0;">
                                Hi there,
                            </p>
                            <p style="color: #555; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
                                Thank you for subscribing to the <strong>StoryNest AI</strong> newsletter! 🎉 You're now part of a magical community dedicated to creating unforgettable AI-powered stories for children.
                            </p>

                            <!-- What you get box -->
                            <div style="background: #f9f5ff; border-left: 4px solid #9D4EDD; border-radius: 8px; padding: 20px 24px; margin-bottom: 32px;">
                                <p style="color: #6B21A8; font-weight: bold; font-size: 15px; margin: 0 0 12px 0;">From now on, you'll be the first to hear about:</p>
                                <ul style="color: #555; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
                                    <li>✨ New magical story themes & characters</li>
                                    <li>🤖 Exciting AI feature updates</li>
                                    <li>📖 Special parenting & storytelling tips</li>
                                    <li>🎁 Exclusive offers and credit bonuses</li>
                                </ul>
                            </div>

                            <!-- CTA Button -->
                            <div style="text-align: center; margin-bottom: 32px;">
                                <a href="https://storynest-ai.xyz/create-story" style="display: inline-block; background: linear-gradient(135deg, #9D4EDD, #6B21A8); color: #ffffff; text-decoration: none; font-size: 17px; font-weight: bold; padding: 16px 40px; border-radius: 50px; box-shadow: 0 4px 15px rgba(157,78,221,0.4);">
                                    Create Your First Story 📖
                                </a>
                            </div>

                            <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 8px 0;">
                                Or explore magical stories from our community at:
                            </p>
                            <p style="margin: 0 0 32px 0;">
                                <a href="https://storynest-ai.xyz/" style="color: #9D4EDD; font-weight: bold; font-size: 15px; text-decoration: none;">🌐 storynest-ai.xyz</a>
                            </p>

                            <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0;">
                                Stay magical,<br/>
                                <strong style="color: #1a1a2e;">The StoryNest AI Team</strong>
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background: #f4f4f8; padding: 24px 36px; text-align: center; border-top: 1px solid #e8e8f0;">
                            <p style="color: #999; font-size: 13px; margin: 0 0 8px 0;">
                                Follow us on social media
                            </p>
                            <p style="margin: 0 0 16px 0;">
                                <a href="https://www.facebook.com/profile.php?id=61591690550142" style="color: #9D4EDD; text-decoration: none; margin: 0 8px; font-size: 13px;">Facebook</a> •
                                <a href="https://www.instagram.com/storyainest/" style="color: #9D4EDD; text-decoration: none; margin: 0 8px; font-size: 13px;">Instagram</a> •
                                <a href="https://www.youtube.com/@StoryNest_Ai-fyp" style="color: #9D4EDD; text-decoration: none; margin: 0 8px; font-size: 13px;">YouTube</a>
                            </p>
                            <p style="color: #bbb; font-size: 12px; margin: 0;">
                                © 2025 StoryNest AI • <a href="https://storynest-ai.xyz/" style="color: #bbb;">storynest-ai.xyz</a>
                            </p>
                        </div>
                    </div>
                `,
            };

            // Notification email to the admin
            const adminMailOptions = {
                from: contactEmail,
                to: contactEmail,
                subject: 'New Newsletter Subscriber! 📧',
                html: `
                    <h3>New Subscriber Alert</h3>
                    <p>Good news! A new user has subscribed to the StoryNest newsletter.</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                `,
            };

            // Send both emails
            await Promise.all([
                transporter.sendMail(welcomeMailOptions),
                transporter.sendMail(adminMailOptions)
            ]);
        }

        return NextResponse.json(
            { success: true, message: 'Successfully subscribed! Check your inbox for magic. ✨' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong. Please try again later.' },
            { status: 500 }
        );
    }
}
