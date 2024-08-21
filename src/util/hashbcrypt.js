import bycript from "bcrypt"

const createHash = (password) => bycript.hashSync(password, bycript.genSaltSync(10))

const isValidPassword = (password, user) => bycript.compareSync(password, user.password)

export {createHash, isValidPassword}