const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'Your tour name is too long'],
            // validate: [validator.isAlpha, 'A name has to contain only letters'],
            minlength: [7, 'Your tour name is too short']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty has to be easy, medium or difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [0.0, 'Rating has to be higher'],
            max: [5.0, 'Rating has to be lower']
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
            min: [0, 'Quantity has to be higher']
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
            min: [0, 'Quantity has to be higher']
        },
        priceDiscount: {
            type: Number,
            min: [0, 'Quantity has to be higher'],
            validate: {
                validator: function(val) {
                    // This only points to the current document on new
                    return val < this.price;
                },
                message:
                    'Price discount ({VALUE}) has to be lower than the original price'
            }
        },
        summary: {
            type: String,
            trim: true
        },
        theme: {
            type: String,
            trim: true,
            lowercase: true,
            default: 'green',
            select: false
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description']
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        secretTour: {
            type: Boolean,
            default: false
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

tourSchema.virtual('durationWeeks').get(function() {
    return Math.floor((this.duration / 7) * 10) / 10;
});

tourSchema.virtual('endDates').get(function() {
    const that = this;
    const endCalc = function(el) {
        el.setDate(el.getDate() + that.duration);
        return el;
    };
    const endDates = this.startDates.map(endCalc);
    return endDates;
});

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function(next) {
//     console.log('Will Save');
//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });

tourSchema.pre(/^find/, function(next) {
    // tourSchema.pre('find', function(next) {
    this.find({ secretTour: { $ne: true } });
    // this.start = Date.now();
    next();
});

// tourSchema.post(/^find/, function(docs, next) {
//     console.log(
//         `Query took ${(Date.now() - this.start) / 1000} seconds to run`
//     );
//     next();
// });

tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
