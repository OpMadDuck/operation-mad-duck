# Operation Mad Duck
A CTF exercise designed to help UCWT students plan and execute a tactical operation.

## Production Resources and Links
- A [live scoreboard](https://operation.madduck.workers.dev/board) can be viewed online. Please note that you must refresh the page in order to see newly captured flags. The total score for each team is updated automatically.
- By performing a [game reset](https://operation.madduck.workers.dev/reset), all contract and flag capture data will be erased.
- Refer to the `qr codes` folder of this repository for flag information.
- The `points.csv` file lists each flag's point values, unique identifier, and name.

## Tools
### Cloudflare Workers
This project is coded in JavaScript and is built using Cloudflare technologies. Cloudflare Workers provides a [serverless](https://www.cloudflare.com/learning/serverless/what-is-serverless/) execution environment that allows you to create entire web applications without configuring, maintaining or paying for infrastructure.

### Local Development
When developing this project locally, [Miniflare](https://miniflare.dev) is the preferred method of testing new code/features. Clone this repository and run `npm run-script run` to stage a local copy of the project. Changes made locally will not affect the production instance of the code.