const { PrismaClient } = require('@prisma/client')

// PrismaClient is meant to be reused across requests.
const prisma = new PrismaClient()

module.exports = prisma

