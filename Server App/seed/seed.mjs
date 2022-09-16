import { createTables, dropTables, initialRecords } from './sql.mjs'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
dotenv.config()

const connection = await mysql.createConnection(process.env.DATABASE_URL)

const loadAndSaveData = async () => {
  try {
    //drop all Tables
    console.log('Querying:')
    for (const [key, value] of Object.entries(dropTables)) {
      await connection.query(value)
      console.log(key)
    }
    console.log('ALL TABLES HAS BEEN DROPPED')

    // Create all Tables
    for (const [key, value] of Object.entries(createTables)) {
      await connection.query(value)
      console.log(key)
    }
    console.log('ALL TABLES HAS BEEN CREATED')

    // Seed all Tables
    for (const [key, value] of Object.entries(initialRecords)) {
      await connection.query(value)
      console.log(key)
    }
    // Seed Users
    await seedUsers()
    console.log('ALL TABLES HAS BEEN SEEDED')
  } catch (err) {
    console.error(err)
  }
}

const seedUsers = async () => {
  let initialUserSQL = `INSERT INTO user (user_id, user_name, user_username, user_password, user_create_id, user_create_date, user_create_ip, user_update_id, user_update_date, user_update_ip, user_note, user_status) VALUES `
  const users = [
    { name: 'Admin', username: 'admin', password: 'admin' },
    { name: 'User 1', username: 'user1', password: 'user1' },
    { name: 'User 2', username: 'user2', password: 'user2' },
    { name: 'User 3', username: 'user3', password: 'user3' },
  ]
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    try {
      const hash = await bcrypt.hash(user.password, 10)
      const userNumber = (i + 1).toString()
      initialUserSQL += `('U120922${userNumber.padStart(4, '0')}', '${
        user.name
      }','${user.username}', '${hash}', 'U120922${userNumber.padStart(
        3,
        '0'
      )}', '2022-09-12', '::1', NULL, '2022-09-12', NULL, 'dummy data', 1),`
    } catch (err) {
      console.log('ERROR', err)
    }
  }
  initialUserSQL = initialUserSQL.slice(0, -1)
  await connection.query(initialUserSQL)
  console.log('initialUserSQL')
}

await loadAndSaveData()
process.exit(0)
