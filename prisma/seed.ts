import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create courses
  const courses = [
    {
      name: 'Artificial Intelligence and Data Science',
      code: 'AIDS',
      semester: 7,
      subjects: {
        create: [
          { name: 'Machine Learning', code: 'ML101' },
          { name: 'Data Mining', code: 'DM101' },
          { name: 'Big Data Analytics', code: 'BDA101' },
        ],
      },
    },
    {
      name: 'Artificial Intelligence and Machine Learning',
      code: 'AIML',
      semester: 7,
      subjects: {
        create: [
          { name: 'Deep Learning', code: 'DL101' },
          { name: 'Natural Language Processing', code: 'NLP101' },
          { name: 'Computer Vision', code: 'CV101' },
        ],
      },
    },
    {
      name: 'Industrial Internet of Things',
      code: 'IIOT',
      semester: 7,
      subjects: {
        create: [
          { name: 'IoT Architecture', code: 'IOT101' },
          { name: 'Sensor Networks', code: 'SN101' },
          { name: 'Edge Computing', code: 'EC101' },
        ],
      },
    },
    {
      name: 'Automation and Robotics',
      code: 'AR',
      semester: 7,
      subjects: {
        create: [
          { name: 'Robotics Engineering', code: 'RE101' },
          { name: 'Control Systems', code: 'CS101' },
          { name: 'Industrial Automation', code: 'IA101' },
        ],
      },
    },
  ]

  for (const course of courses) {
    await prisma.course.create({
      data: course,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 