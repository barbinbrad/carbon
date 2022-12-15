# Carbon ERP

Carbon is a high permformance, open-source, single tenant (incomplete) ERP written in Typescript. It allows customers, suppliers, and employees to share a common platform for manufacturing.

It includes:

- Magic link authentication
- Role-based access control (RBAC)
- Row-level security (RLS)
- Realtime database subscriptions
- Composable user groups
- Full-stack type safety (Datbase → UI)

## Project Status

- [x] Pre-Alpha: Developing foundation
- [ ] Alpha: Heavy feature development
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
| `docs`       | Documentation   |

### `/packages`

| Package Name           | Description                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `eslint-config-carbon` | Shared, extendable eslint configuration for apps and packages           |
| `@carbon/database`     | Database migrations and types                                           |
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
- [Turborepo](https://turbo.build)
- [Prisma](https://prisma.io/)

## Local Development

Make sure that you have [Docker installed](https://docs.docker.com/desktop/install/mac-install/) and [yarn installed](https://yarnpkg.com/lang/en/docs/install/#debian-stable)
on your system since this monorepo uses the yarn package manager.

Then download and initialize the repository dependencies.

```bash
$ yarn           # install dependencies
$ yarn db:start  # pull and start the containers
```

Copy the environment variables from the initialization script to an `.env` file:

```
$ cp ./.env.example ./.env
```

After you've set the enviroment variables to the output of `db:start` you can run

```bash
$ yarn setup     # run db migrations and seed script
```

Finally, start the apps and packages:

```bash
yarn dev         # yarn dev in all apps & packages
```

To kill the database containers in a non-recoverable way, you can run:

```bash
$ yarn db:kill   # stop and delete all database containers
```

To restart and reseed the database, you can run:

```bash
$ yarn db:rebuild # runs db:kill, db:start, and setup
```

To run a particular application, use the `yarn workspace` command.

For example, to run the `carbon` app you can run:

```
$ yarn workspace carbon dev
```

The generalized command for workspaces is:

```
$ yarn workspace <package name> <dev|build|lint|test>
```

In order to import a package from the repo into another package/app from
the repo, use the convention of using `"*"` for the version number.

For example, in order to include the `@carbon/react` package, add this line
to the `package.json`:

```
{
"@carbon/react": "*"
}
```
