import { Client } from '@elastic/elasticsearch'
import { config } from './config'
import { winstonLogger } from '@ahadg/jobber-shared'
import { Logger } from 'winston'
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types'

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug')

export class ElasticSearch {
    private elasticSearchClient: Client;
    constructor() {
        this.elasticSearchClient = new Client({
            node: `${config.ELASTIC_SEARCH_URL}`,
          //   auth: {
          //     username: 'elastic',
          //     password: 'changeme'
          //   },
          })
    }

    public async checkConnection(): Promise<void> {
        let isConnected = false;
        while (!isConnected) {
            try {
                const health : ClusterHealthResponse = await this.elasticSearchClient.cluster.health({})
                log.info(`Notification service elasticSearch health status - ${health.status}`)
                isConnected = true
            } catch (error) {
                log.error("Connection to ElasticSearch failed. Retrying..")
                log.log("error","Notification server check connectconnection() method:",error)
            }
        }
    }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();

