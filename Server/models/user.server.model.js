import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

// User Model
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Player"],
    required: true,
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);    
  }  
  next();  
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
