const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient() ;

class ContactService {
    validateContactData(data){
        const errors = {};

        if ( !data.name || !/^[A-Za-z\s]{2,}$/.test(data.name) ){

            errors.name = 'Full name is required and must contain only letters and spaces (min 2 chars).';
        }
// Email
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Please enter a valid email address.';
        }

        // Phone
        if (!data.phone || !/^\d{10}$/.test(data.phone)) {
            errors.phone = 'Phone number must be exactly 10 digits.';
        }

        // Message
        if (!data.message || data.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters long.';
        }
        return Object.keys(errors).length > 0 ? errors : null ;

    }
    async saveContact(data) {
        try {
            const contact = await prisma.contact.create({data});
            return contact
        } catch (error) {
            console.error('Error saving contact' , error);
            throw new Error('Failed to save contact details')
        }
    }
}

module.exports = new ContactService() ;
