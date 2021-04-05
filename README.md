# Belajarsip

## Contents

- [Description](#description)
- [Requirements](#requirements)
- [Installation](#installation)
- [Available Scripts](#available-scripts)

## Description

**Belajarsip** is a platform to bring together instructors with students or knowledge seekers. Instructors can create classes and a schedule for delivery of materials. Meanwhile, student can find the class that suits what he wants.

**Belajarsip Backend** is a part of belajarsip that serve API for **Belajarsip Front End**

## Requirements

- [Node.js](https://nodejs.org/en/download/)
- MySql
- Bcrypt
- JWT
- Express

## Installation

1. Open your terminal or command prompt
2. Clone the project

```bash
git clone https://github.com/sipamungkas/belajarsip-backend.git
```

3. Move to the belajarsip-backend directory

```bash
cd belajarsip-backend
```

4. Install required dependencies

```bash
yarn install
```

or

```bash
npm install
```

5. Set Up environtment variables
   - Copy .env.example to .env
   - change the configuration inside .env based on machine configuration

```bash
cp .env.example .env
```

6. Run development server

```bash
yarn dev
```

or

```bash
npm dev
```

## Available Scripts

`start` to run the program on production mode
`dev` to run the program on development mode
