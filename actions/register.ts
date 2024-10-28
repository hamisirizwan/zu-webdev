'use server';

import dbConnect from "@/db/connect";
import Registration from "@/db/model"
import { sendMessage } from "@/helpers/sendWaMessage";


type FormData = {
    name: string;
    admissionNumber: string;
    email: string;
    whatsappNumber: string;
    category: string;
};

export async function register(formData: FormData) {
    const { name, admissionNumber, email, whatsappNumber, category } = formData;

    try {
        // Basic validation
        if (!name || !admissionNumber || !email || !whatsappNumber || !category) {
            return { error: 'All fields are required' };
        }

        // Validate Kenyan phone number format
        const phoneRegex = /^(\+254|0|254)?(7|1)([0-9]{8})$/;
        if (!phoneRegex.test(whatsappNumber)) {
            return { error: 'Invalid WhatsApp number format' };
        }

        // Connect to the database
        await dbConnect();

        // Check if email, admission number, or WhatsApp number already exists
        const existingUser = await Registration.findOne({
            $or: [
                { email },
                { admissionNumber },
                { whatsappNumber }
            ]
        });

        if (existingUser) {
            const existingFields = [];
            if (existingUser.email === email) existingFields.push('Email');
            if (existingUser.admissionNumber === admissionNumber) existingFields.push('Admission Number');
            if (existingUser.whatsappNumber === whatsappNumber) existingFields.push('WhatsApp Number');

            return { error: `${existingFields.join(', ')} already in use` };
        }

        // Create and save the new user
        const newUser = new Registration({
            name,
            admissionNumber,
            email,
            whatsappNumber,
            category
        });

        await newUser.save();

        // send a whatsapp message 

        const message = `Hello ${name}(${admissionNumber})\n\nYour registration request to join ZU web dev has been received for level: *${category}.*\n\n More communications will be given in the Web dev group under Itech Community`
        sendMessage(whatsappNumber , message )

        return { message: 'Registration successful' };

    } catch (error) {
        console.error(error);
        return { error: 'An error occurred during registration' };
    }
}