import { Client } from '@elastic/elasticsearch'
import { config } from './config'
import { winstonLogger } from '@ahadg/jobber-shared'
import { Logger } from 'winston'
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types'

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug')


const client = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
//   auth: {
//     username: 'elastic',
//     password: 'changeme'
//   },
})

export async function checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
        log.info(`AuthService connecting to ElasticSearch...`)
        try {
            const health : ClusterHealthResponse = await client.cluster.health({})
            log.info(`AuthService elasticSearch health status - ${health.status}`)
            isConnected = true
        } catch (error) {
            log.error("Connection to ElasticSearch failed. Retrying..")
            log.log("error","AuthService connectconnection() method:",error)
        }
    }
}