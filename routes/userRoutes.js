const express = require('express');
const router = express.Router();

const { getAllUsers, getUserById, createUser, updateUser, deleteUser }=require('../controllers/userController');

// const {authenticateUser}=require('../middlewares/userMiddleware');

router.get('/',getAllUsers);

router.get('/:id', getUserById);

router.post('/',createUser);

router.put('/:id', updateUser);

router.patch('/:id',updateUser);

router.delete('/:id',deleteUser);

module.exports = router;