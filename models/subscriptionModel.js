import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'Each subscription plan name should be unique'],
        required : [true, 'Each subscripiton must have a name field']
    },
    price: {
        type: Number,
        required: [true, 'Subscription plan must have price field'],
    }
})

export default mongoose.model('Subscription', subscriptionSchema);