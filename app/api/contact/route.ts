import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, subject, message } = body;

        // Validation
        if (!firstName || !lastName || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Manual env loading fallback
        let contactEmail = process.env.CONTACT_EMAIL;
        let contactPassword = process.env.CONTACT_PASSWORD;

        if (!contactEmail || !contactPassword) {
            console.log('Env vars missing from process.env, attempting manual load...');
            console.log('Current working directory:', process.cwd());

            try {
                const fs = await import('fs');
                const path = await import('path');

                // Try multiple possible paths for .env.local
                const possiblePaths = [
                    path.resolve(process.cwd(), '.env.local'),
                    path.resolve(process.cwd(), 'story-ai', 'app', '.env.local'),
                    path.resolve(process.cwd(), 'app', '.env.local'),
                    'c:\\Users\\walee\\story-ai\\app\\.env.local' // Absolute fallback
                ];

                for (const envPath of possiblePaths) {
                    console.log('Checking path:', envPath);
                    if (fs.existsSync(envPath)) {
                        console.log('Found .env.local at:', envPath);
                        const envFile = fs.readFileSync(envPath, 'utf-8');
                        const lines = envFile.split('\n');
                        for (const line of lines) {
                            const trimmedLine = line.trim();
                            if (!trimmedLine || trimmedLine.startsWith('#')) continue;

                            const [key, ...valueParts] = trimmedLine.split('=');
                            if (key && valueParts.length > 0) {
                                const cleanKey = key.trim();
                                let cleanValue = valueParts.join('=').trim();
                                // Remove quotes if present
                                if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) ||
                                    (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
                                    cleanValue = cleanValue.slice(1, -1);
                                }

                                if (cleanKey === 'CONTACT_EMAIL') contactEmail = cleanValue;
                                if (cleanKey === 'CONTACT_PASSWORD') contactPassword = cleanValue;
                            }
                        }
                        // If we found the file and parsed it, stop searching
                        if (contactEmail && contactPassword) break;
                    }
                }
            } catch (err) {
                console.error('Failed to manually load .env.local:', err);
            }
        }

        console.log('Final CONTACT_EMAIL:', contactEmail);
        console.log('Final CONTACT_PASSWORD:', contactPassword ? '******' : 'MISSING');

        if (!contactEmail || !contactPassword) {
            return NextResponse.json(
                { error: 'Sorry!!! Try Again' },
                { status: 500 }
            );
        }

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: contactEmail,
                pass: contactPassword,
            },
        });

        // Email content
        const mailOptions = {
            from: contactEmail,
            to: contactEmail, // Sending to admin
            subject: `New Message - ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <br/>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { success: true, message: 'Message sent!' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
