
const bcrypt = require('bcryptjs');
const db = require('./db');

async function createOwner() {
    try {
        const full_name = 'Salon Owner';
        const email = 'salonconnect@gmail.com';
        const phone = '0730589541';
        const password = 'ChangeThisPassword123!';

        const [existingUser] = await db.query(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            console.log('An account with this email already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users
            (full_name, email, phone, password, role)
            VALUES (?, ?, ?, ?, 'OWNER')`,
            [full_name, email, phone, hashedPassword]
        );

        console.log('Owner account created successfully!');
    } catch (error) {
        console.error('Error creating owner:', error);
    } finally {
        await db.end();
    }
}

createOwner();
