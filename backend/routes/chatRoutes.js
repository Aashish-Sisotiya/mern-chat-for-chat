const express = require("express");
const { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroup } = require("../controllers/chatController");
const { protect } = require("../Middlewares/authMiddleware");

const router = express.Router();


router
    .route('/')
    .post(protect, accessChat)
    .get(protect, fetchChats);

router
    .route('/group')
    .post(protect, createGroupChat);


router
    .route('/rename')
    .put(protect, renameGroupChat);

router
    .route('/groupRemove')
    .put(protect, removeFromGroup);

router
    .route('/groupadd')
    .put(protect,addToGroup);


module.exports = router;