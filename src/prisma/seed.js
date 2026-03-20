require('dotenv').config()

const bcrypt = require('bcrypt')
const prisma = require('./client')

async function main() {
  const email = process.env.SEED_EMAIL || 'demo@taskflow.dev'
  const name = process.env.SEED_NAME || 'Demo User'
  const password = process.env.SEED_PASSWORD || 'password1234'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  })

  await prisma.task.createMany({
    data: [
      {
        title: 'Complete project documentation',
        completed: false,
        userId: user.id,
      },
      {
        title: 'Review pull requests',
        completed: true,
        userId: user.id,
      },
      {
        title: 'Set up CI/CD pipeline',
        completed: false,
        userId: user.id,
      },
      {
        title: 'Design system components',
        completed: true,
        userId: user.id,
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

