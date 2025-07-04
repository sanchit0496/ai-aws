const express = require('express');
const router = express.Router();
const userController = require('../controllers/appUsersController');
const { createUserSchema } = require('../validations/appUsersValidation');
const multer = require('multer');
const { extractTextFromImage } = require('../utils/extractTextFromImage');
const { translateTextToAllLanguages } = require('../utils/translateText');
const { synthesizeToAudio } = require('../utils/synthesizeSpeech');

const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 *         email: johndoe@example.com
 * 
 * /users:
 *   get:
 *     summary: Returns a list of users
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

// Middleware for user validation
const validateUserCreation = (req, res, next) => {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

// Define the CRUD routes for users
router.post('/', validateUserCreation, userController.createAppUser);
router.get('/:id', userController.getAppUserById);
router.put('/:id', userController.updateAppUser);
router.delete('/:id', userController.deleteAppUser);
router.get('/', userController.getAllAppUsers);




router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Step 1: Textract
    const extractedText = await extractTextFromImage(filePath);

    // Step 2: Translate
    const translations = await translateTextToAllLanguages(extractedText);

    // Step 3: Polly
    const results = [];

    for (let i = 0; i < translations.length; i++) {
      const { language, text } = translations[i];

      const url = await synthesizeToAudio(text, language, i);
      results.push({ language, text, url });
    }

    res.json({
      message: 'Text extracted, translated & audio generated successfully',
      results,
    });

  } catch (err) {
    console.error('Full pipeline error:', err);
    res.status(500).json({ error: 'Textract/Translate/Polly failed' });
  }
});


module.exports = router;