<p align="center"><a href="https://carbon.us.org" target="_blank"><img src="https://raw.githubusercontent.com/barbinbrad/carbon/main/www/public/logo-full.png" width="500" alt="Carbon Logo"></a></p>

# Carbon ERP

Carbon is a high permformance, open-source, single tenant (incomplete) ERP written in Typescript. It allows customers, suppliers, and employees to share a common platform for manufacturing.

Some of the technical highlights/roadmap are:

- [x] Full-stack type safety (Datbase → UI)
- [x] Realtime database subscriptions
- [x] Attribute-based access control (ABAC)
- [x] Row-level security (RLS)
- [x] Composable user groups
- [x] Magic link authentication
- [x] File-based routing
- [ ] Third-party integrations for data
- [ ] Easy-to-use plugin system

Some of the product highlights/roadmap are:

- [x] Search
- [x] Customer and supplier access
- [ ] Double-entry accrual accounting
- [ ] Stochastic scheduling/planning

## Project Status

- [x] Pre-Alpha: Developing foundation
- [ ] Alpha: Heavy feature development and refinement
- [ ] Public Alpha: Ready for use. But go easy on us, there'll be bugs.
- [ ] Public Beta: Stable enough for most non-enterprise use-cases.
- [ ] Public: Production-ready

## Codebase

The monorepo follows the Turborepo covention of grouping packages into one of two folders.

1. `/apps` for applications
2. `/packages` for shared code

### `/apps`

| Package Name | Description     |
| ------------ | --------------- |
| `carbon`     | ERP Application |

### `/packages`

| Package Name           | Description                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `eslint-config-carbon` | Shared, extendable eslint configuration for apps and packages           |
| `@carbon/database`     | Database schema, migrations and types                                   |
| `@carbon/jest`         | Jest preset configuration shared across apps and packages               |
| `@carbon/logger`       | Shared logger used across apps                                          |
| `@carbon/react`        | Shared web-based UI components                                          |
| `@carbon/redis`        | Redis cache client                                                      |
| `@carbon/tsconfig`     | Shared, extendable tsconfig configuration used across apps and packages |
| `@carbon/utils`        | Shared utility functions used across apps and packages                  |

## Tech Stack

- [Remix](https://remix.run)
- [Chakra UI](https://chakra-ui.com/)
- [Supabase](https://supabase.com/)
- [Postgres](https://postgresql.org/)
- [Redis](https://redis.io)
- [BullMQ](https://docs.bullmq.io)
- [Turborepo](https://turbo.build)

## Local Development

Make sure that you have [Docker installed](https://docs.docker.com/desktop/install/mac-install/) and [yarn installed](https://yarnpkg.com/lang/en/docs/install/#debian-stable)
on your system since this monorepo uses the yarn package manager.

After running the steps below you should be able to access the following apps/containers locally:

| Application     | URL                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| Carbon ERP      | [http://localhost:3000](http://localhost:3000)                                                                     |
| Postgres        | [postgresql://postgres:postgres@localhost:54322/postgres](postgresql://postgres:postgres@localhost:54322/postgres) |
| Supabase Studio | [http://localhost:54323/project/default](http://localhost:54323/project/default)                                   |
| Inbucket        | [http://localhost:54324/monitor](http://localhost:54324/monitor)                                                   |
| Redis           | [redis://localhost:6379](redis://localhost:6379)                                                                   |
| Edge Functions  | [http://localhost:54321/functions/v1/<function-name>](http://localhost:54321/functions/v1/<function-name>)         |

First download and initialize the repository dependencies.

```bash
$ nvm use          # use node v18
$ yarn             # install dependencies
$ yarn db:start    # pull and run the containers
```

Copy the environment variables from the initialization script to an `.env` file:

```
$ cp ./.env.example ./.env
```

After you've set the enviroment variables to the output of `yarn db:start` you can run

```bash
$ yarn db:build     # run db migrations and seed script
$ yarn build        # build the packages
```

Finally, start the apps and packages:

```bash
$ yarn dev         # yarn dev in all apps & packages
```

To kill the database containers in a non-recoverable way, you can run:

```bash
$ yarn db:kill   # stop and delete all database containers
```

To restart and reseed the database, you can run:

```bash
$ yarn db:build # runs db:kill, db:start, and setup
```

To run a particular application, use the `yarn workspace` command.

For example, to run the `carbon` app you can run:

```
$ yarn workspace carbon dev
```
