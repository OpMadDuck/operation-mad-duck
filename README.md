# Operation Mad Duck
A CTF exercise designed to help UCWT students plan and execute a tactical operation.

## Production
- A [live scoreboard](https://operation.madduck.workers.dev/board) can be viewed online. Please note that you must refresh the page in order to see newly captured flags. The total score for each team is updated automatically.
- By performing a [game reset](https://operation.madduck.workers.dev/reset), all contract and flag capture data will be erased.
- The `codes` folder of this repository has a QR code for each flag.
- The `points.csv` file lists each flag's unique identifier, name, and point values for each team.

## Development
### Cloudflare
This project is written in JavaScript and is built using two free Cloudflare products. Cloudflare Workers provides a [serverless](https://www.cloudflare.com/learning/serverless/what-is-serverless/) execution environment that allows you to create entire web applications without configuring, maintaining or paying for infrastructure. Scoreboard data is stored in [Workers KV](https://developers.cloudflare.com/workers/learning/how-kv-works/) - a global, low-latency, key-value data store.

### Environment
When developing this project locally, [Miniflare](https://miniflare.dev) is the preferred method of testing new code/features. You must have Node Package Manager (NPM) and the latest version of NodeJS installed on your system. If you would prefer not to configure a local development environment, check out [GitHub Codespaces](https://github.com/features/codespaces).  Clone this repository and run `npm run-script run` to stage a local copy of the project. Changes made locally will not affect the production instance of the code.