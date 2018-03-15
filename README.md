# AMPasService (serverless)

Using aws lambdas function we can provide an AMP versión of any page


## Install

Clone the repo and inside `packages/serverless` run `$ npm install`

## Development

To start to develop run `npm start` that will put a server listen in at the port 300 by default o any port setting in the `process.env.PORT` variable.

The server will response to GET request with the format:

```
http://localhost:3000/amp/[URL_CANONICAL_ORIGINAL]?package=[AMP_PACKAGE_TEMPLATE]&organization=[ORG_AMP_PACKAGE_TEMPLATE]&version=[VERSION]
```

Url example:

```
http://localhost:3000/amp/https://www.fotocasa.es/vivienda/malaga-capital/parking-terraza-trastero-zona-comunitaria-piscina-panorama-142784244?package=amp-generator-alpha-basic&organization=schibstedspain&version=beta
```

Version is the uniq param dont require, and by default we will search for the `latest` version.

### Deploy

To deploy this package you must have install globally the [up](https://github.com/apex/up) package.

To deploy to staging: `$up deploy`
to deploy to production: `up deploy production`

More up command in the up documentation

### AMP parser pacakges

Is regular npm packages, with two files in the root of the project.

- queries.js
- index.tpl


