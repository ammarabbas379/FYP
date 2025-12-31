import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // Nodemailer is a tool used to send emails from code

// This function handles "POST" requests (sending information) to this API route
export async function POST(req: Request) {
    try {
        // Read the information sent from the contact form
        const body = await req.json();
        const { firstName, lastName, email, subject, message } = body;

        // Step 1: Check if any part of the form is empty
        if (!firstName || !lastName || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Step 2: Get our email credentials (email address and special app password)
        // These are stored in a hidden file (.env.local) for security
        let contactEmail = process.env.CONTACT_EMAIL;
        let contactPassword = process.env.CONTACT_PASSWORD;

        // If the system can't find them normally, we try to find the hidden file manually
        if (!contactEmail || !contactPassword) {
            console.log('Env vars missing from process.env, attempting manual load...');

            try {
                const fs = await import('fs');
                const path = await import('path');

                // Look for the .env.local file in different places
                const possiblePaths = [
                    path.resolve(process.cwd(), '.env.local'),
                    path.resolve(process.cwd(), 'story-ai', 'app', '.env.local'),
                    path.resolve(process.cwd(), 'app', '.env.local'),
                    'c:\\Users\\walee\\story-ai\\app\\.env.local'
                ];

                for (const envPath of possiblePaths) {
                    if (fs.existsSync(envPath)) {
                        const envFile = fs.readFileSync(envPath, 'utf-8');
                        const lines = envFile.split('\n');
                        for (const line of lines) {
                            const trimmedLine = line.trim();
                            if (!trimmedLine || trimmedLine.startsWith('#')) continue;

                            const [key, ...valueParts] = trimmedLine.split('=');
                            if (key && valueParts.length > 0) {
                                const cleanKey = key.trim();
                                let cleanValue = valueParts.join('=').trim();
                                // Clean up the text if it has quotes around it
                                if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) ||
                                    (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
                                    cleanValue = cleanValue.slice(1, -1);
                                }

                                if (cleanKey === 'CONTACT_EMAIL') contactEmail = cleanValue;
                                if (cleanKey === 'CONTACT_PASSWORD') contactPassword = cleanValue;
                            }
                        }
                        if (contactEmail && contactPassword) break;
                    }
                }
            } catch (err) {
                console.error('Failed to manually load .env.local:', err);
            }
        }

        // Step 3: Stop if we still can't find the email setup info
        if (!contactEmail || !contactPassword) {
            return NextResponse.json(
                { error: 'Sorry!!! Try Again' },
                { status: 500 }
            );
        }

        // Step 4: Set up the official "mailing service" (using Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: contactEmail,
                pass: contactPassword,
            },
        });

        // Step 5: Design how the email looks when it arrives in your inbox
        const mailOptions = {
            from: contactEmail,
            to: contactEmail, // The message is sent TO you
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

        // Step 6: Actually send the email
        await transporter.sendMail(mailOptions);

        // Tell the user "Successfully Sent!"
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
