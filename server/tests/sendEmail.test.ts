import { sendEmail } from '../utils/sendEmail';

jest.mock('nodemailer', () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: '123' });
    return {
        createTransport: jest.fn(() => ({
            sendMail,
        })),
        __mock__: { sendMail },
    };
});

const { __mock__ } = jest.requireMock('nodemailer');

describe('sendEmail', () => {
    beforeEach(() => {
        __mock__.sendMail.mockClear();
    });

    it('should send email with correct details', async () => {
        await sendEmail('test@example.com', 'Hello', 'This is a test');

        expect(__mock__.sendMail).toHaveBeenCalledWith({
            from: expect.any(String),
            to: 'test@example.com',
            subject: 'Hello',
            text: 'This is a test',
        });
    });

    it('should throw an error if sending fails', async () => {
        __mock__.sendMail.mockRejectedValueOnce(new Error('SMTP failed'));

        await expect(
            sendEmail('fail@example.com', 'Oops', 'Body')
        ).rejects.toThrow('SMTP failed');
    });
});
