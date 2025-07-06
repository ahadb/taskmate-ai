# Database Seeding

This directory contains database seeding scripts for the Task Manager application.

## 📁 Structure

```
seeds/
├── index.ts      # Main seeder orchestrator
├── users.ts      # User seed data and functions
├── tasks.ts      # Task seed data and functions
├── cleanup.ts    # Database cleanup functions
└── README.md     # This file
```

## 🚀 Usage

### Run All Seeds

```bash
npm run seed
```

### Clean Up Database

```bash
npm run seed:cleanup
```

### Reset Database (Clean + Seed)

```bash
npm run db:reset
```

## 👥 Sample Users

The seeding creates these test users:

| Email            | Password    | Name       |
| ---------------- | ----------- | ---------- |
| john@example.com | password123 | John Doe   |
| jane@example.com | password123 | Jane Smith |
| demo@example.com | demo123     | Demo User  |

## 📋 Sample Tasks

The seeding creates 8 sample tasks with:

- Various priorities (high, medium, low)
- Different due dates
- Mix of completed and active tasks
- Realistic task descriptions

## 🔧 Functions

### Users (`users.ts`)

- `seedUsers()` - Creates sample users
- `deleteUsers()` - Removes all users

### Tasks (`tasks.ts`)

- `seedTasks()` - Creates sample tasks
- `deleteTasks()` - Removes all tasks

### Cleanup (`cleanup.ts`)

- `cleanupDatabase()` - Removes all data from all tables

### Main (`index.ts`)

- `runSeeds()` - Runs all seeds in order
- `cleanupSeeds()` - Runs cleanup only

## ⚠️ Important Notes

1. **Dependencies**: Tasks depend on users existing first
2. **Cleanup Order**: Tasks are deleted before users (foreign key constraints)
3. **Conflict Handling**: Users use `ON CONFLICT DO NOTHING` to avoid duplicates
4. **Password Hashing**: User passwords are properly hashed with bcrypt

## 🎯 Development

To add more seed data:

1. Add data to the sample arrays in respective files
2. Update the functions if needed
3. Run `npm run seed` to test

To modify existing data:

1. Edit the sample arrays
2. Run `npm run db:reset` to apply changes
