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
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
                        <h2 style="color: #9D4EDD; text-align: center;">Welcome to StoryNest!</h2>
                        <p>Hi there,</p>
                        <p>Thank you for subscribing to our newsletter! You're now part of a magical community dedicated to creating unforgettable stories for children.</p>
                        <p>From now on, you'll be the first to hear about:</p>
                        <ul>
                            <li>New magical story themes</li>
                            <li>Exciting AI feature updates</li>
                            <li>Special parenting and storytelling tips</li>
                        </ul>
                        <p>Ready to create your first story? <a href="https://storynest-ai.vercel.app/create-story" style="color: #9D4EDD; font-weight: bold;">Click here to start!</a></p>
                        <br/>
                        <p>Stay magical,<br/>The StoryNest Team</p>
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
