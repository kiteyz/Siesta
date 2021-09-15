import { Schema, Document, model } from 'mongoose'

interface Command extends Document {
    idC: string;
    maintenance: boolean;
}

const command = new Schema({
    idC: { type: String, required: true },
    maintenance: { type: Boolean, default: false }
})

export default model<Command>("Command", command)