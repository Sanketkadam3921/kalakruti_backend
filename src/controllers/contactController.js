const contactService = require('../services/contactService');
const ContactService = require('../services/contactService')
class ContactController {
    async submitContactForm(req , res , next  ){
        try {
            const data = req.body ;

            const validationErrors = contactService.validateContactData(data);
            if (validationErrors){
                return res.status(400).json({
                    success : false ,
                    errors : validationErrors
                })
            }

            await contactService.saveContact(data);

            return res.status(200).json({
                success : true ,
                message: 'Your message has been received. Our team will contact you soon.'
            })
        } catch (error) {
            console.error('Contact form error : ' , error);
            return res.status(500).json({
                success : false ,
                message: 'Failed to send your message. Please try again later.'
            })
        }
    }
}

module.exports = new ContactController();