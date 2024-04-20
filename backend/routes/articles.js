const router = require('express').Router();
const { getAllArticle, setArticle, getArticle, deleteArticle, editArticle, fetchArticle }  = require('../controllers/articles.js');
const { verifyJWT } = require('../middleware/jwtAuth.js');
const { upload } = require("../utils/multerConfig.js");

router.use(verifyJWT);

router.route('/').get(getAllArticle);
router.route('/').post(upload.single("attachments"), setArticle);
router.route('/:id').get(getArticle);
router.route('/articles/:id').get(fetchArticle);
router.route('/').delete(deleteArticle);
router.route('/').patch(upload.single("attachments"), editArticle);

module.exports = router;
