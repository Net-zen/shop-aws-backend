import {middyfy} from '@libs/lambda'
import {APIGatewayTokenAuthorizerHandler, APIGatewayAuthorizerResult} from 'aws-lambda'

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, _ctx, cb) => {
  console.log('basicAuthorizer, event: ', event)

  if (event['type'] !== 'TOKEN') cb('Unauthorized')

  try {
    const {authorizationToken} = event
    console.log('authorizationToken: ', authorizationToken)
    const [_type, encodedCreds] = authorizationToken.split(' ')
    const buff = Buffer.from(encodedCreds, 'base64')
    const [username, password] = buff.toString('utf-8').split(':')

    console.log(`Username: ${username}, password: ${password}`)

    const storedUserPassword = process.env[username]

    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow'

    const policy = generatePolicy(encodedCreds, event.methodArn, effect)

    cb(null, policy)

    return policy
  } catch (e) {
    cb(`Forbidden: e.message`)
  }
}

const generatePolicy = (principalId, Resource, Effect): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect,
          Resource
        }
      ]
    }
  }
}

export const main = middyfy(basicAuthorizer);
