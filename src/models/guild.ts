import { Schema, Document, model } from 'mongoose'

interface Guild extends Document {
    idS: string;
    prefix: string;
}

const guild = new Schema({
    idS: { type: String, required: true },
    prefix: { type: String }
})

export default model<Guild>("Guild", guild)