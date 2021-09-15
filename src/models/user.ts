import { Schema, Document, model } from 'mongoose'

interface Daily {
    cooldown: number
}

interface Profile {
    theme: string,
    aboutme: string,
    background: string
}

interface UserDB extends Document {
    idU: string
    raios: number
    daily: Daily,
    profile: Profile
}

const user = new Schema({
    idU: { type: String, required: true },
    raios: { type: Number, default: 0 },
    wallpapers: { type: Array },
    daily: { 
        cooldown: { type: Number, default: 0 }
    },
    profile: {
        theme: { type: String }, 
        aboutme: { type: String },
        background: { type: String }
    }
})

export default model<UserDB>("User", user)