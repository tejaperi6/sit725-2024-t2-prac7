import mongoose from 'mongoose';

export default () => {
    mongoose.connect("mongodb+srv://saitejaphani:Periteja123@cluster0.vntccsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useNewURLParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("MongoDB connected");
    }).catch((e) => {
        console.log("Error", e);
    });
};
