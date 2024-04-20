const mongoose = require('mongoose')

const Schema = mongoose.Schema

const articleSchema = new Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: validateEmptyField
        }
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    title: {
        type: String,
        required: true,
        maxLength: 20,
        validate: {
            validator: validateEmptyField
        }
    },
    subTitle: {
        type: String,
        required: false,
        maxLength: 30
    },
    content: {
        type: String,
        required: true,
        maxLength: 200,
        validate: {
            validator: validateEmptyField
        }
    },
    slug: {
        type: String,
        required: true,
        maxLength: 10
    },
    status: {
        type: String,
        required: true,
        enum: ['Published', 'Scheduled', 'Draft']
    },
    showAuthor: {
        type: Boolean,
        required: true
    },
    authorName: {
        type: String,
        required: false
    },
    publishDate: {
        type: String,
        required: false
    },
    publishTime: {
        type: String,
        required: false
    },
    publishTaskReference: {
        type: String,
        required: false
    },
    mailTaskReference: {
        type: String,
        required: false
    },
    accessSlug: {
        type: Boolean,
        required: true
    },
    attachments: {
        type: String,
        required: false
    }
  }, {
      timestamps: true
  })

  async function validateEmptyField(value) {
    if (!value) {
        throw Error('All fields must be filled')
    }
  }

  const Article = mongoose.model('Article', articleSchema);

  module.exports = Article;
