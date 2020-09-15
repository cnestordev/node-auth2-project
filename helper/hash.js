const bcrypt = require('bcryptjs')

const hash = password => bcrypt.hashSync(password, salt = 4)

const compare = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    hash,
    compare
}