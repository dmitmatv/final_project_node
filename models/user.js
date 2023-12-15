import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
                                           title: String,
                                           author: String,
                                           // ... other book-related fields based on the Google Books API response
                                       });

const reviewSchema = new mongoose.Schema({
                                            rating: Number,
                                            body: String,
                                            bookTitle: String,
                                         })

const userSchema = new mongoose.Schema({
                                           firstName: {
                                               type: String,
                                               required: true,
                                           },
                                           lastName: {
                                               type: String,
                                               required: true,
                                           },
                                           email: {
                                               type: String,
                                               required: true,
                                               unique: true,
                                               trim: true,
                                               lowercase: true,
                                           },
                                           password: {
                                               type: String,
                                               required: true,
                                           },
                                           role: {
                                               type: String,
                                               enum: ['Reader', 'Author', 'Admin'],
                                               default: 'Reader',
                                           },
                                           readingList: [
                                               {
                                                   //_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
                                                   book: {type: String, ref: 'Book' },
                                                   // ...other fields specific to the readingList
                                               },
                                           ],
                                           writtenList: [
                                               {
                                                   book: { type: String, ref: 'Book' },
                                                   // ...other fields specific to the writtenList
                                               },
                                           ],
                                           reviewList: [
                                               {
                                                   review: {type: String, ref: 'review'},
                                               }
                                           ],
                                       });

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Review = mongoose.model('Review', reviewSchema);

export { User, Book, Review };