import cookieSession from "cookie-session";
import { 
  //CustomError, IErrorResponse, 
  winstonLogger } from "@ahadg/jobber-shared";
import { Application, json, NextFunction, Request, Response, urlencoded } from "express";
import hpp from "hpp";
import helmet from 'helmet'
import cors from 'cors';
import compression from "compression";
import { Logger } from "winston";
import { StatusCodes } from 'http-status-codes';
import http from 'http';
import { config } from "./config";
import { elasticSearch } from "./elasticsearch";
import { appRoutes } from "./routes";
import { axiosAuthInstance } from "./services/api/auth.service";
import { axiosBuyerInstance } from "./services/api/buyer.service";
import { axiosSellerInstance } from "./services/api/seller.service";

const SERVER_PORT = 4000;
//const DEFAULT_ERROR_CODE = 500;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');

export class GatewayServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app
    }

    public start(): void {
      this.securityMiddleware(this.app);
      this.standardMiddleware(this.app);
      this.routesMiddleware(this.app);
      this.startElasticSearch();
      this.errorHandler(this.app);
      this.startServer(this.app)
    }

    private securityMiddleware(app: Application): void {
        app.set('trust proxy', 1);
        app.use(
          cookieSession({
            name: 'session',
            keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
            maxAge: 24 * 7 * 3600000,
            //secure : false
            secure: config.NODE_ENV !== 'development',
            ...(config.NODE_ENV !== 'development' && {
              sameSite: 'none'
            })
          })
        );
        app.use(hpp());
        app.use(helmet());
        app.use(cors({
          origin: config.CLIENT_URL,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        })) 

        app.use((req : Request, _res : Response, next : NextFunction) => {
          if(req.session?.jwt) {
            axiosAuthInstance.defaults.headers["Authorization"] = `Bearer ${req.session.jwt}`
            axiosBuyerInstance.defaults.headers["Authorization"] = `Bearer ${req.session.jwt}`
            axiosSellerInstance.defaults.headers["Authorization"] = `Bearer ${req.session.jwt}`
          }
          next()
        })
    }
    private standardMiddleware(app: Application): void {
      app.use(compression());
      app.use(json({ limit: '200mb' }));
      app.use(urlencoded({ extended: true, limit: '200mb' }));
    }
  
    private routesMiddleware(app : Application): void {
      appRoutes(app);
    }
  
    private startElasticSearch(): void {
      elasticSearch.checkConnection();
    }
  
    private errorHandler(app: Application): void {
      app.use('*', (req: Request, res: Response, next: NextFunction) => {
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        log.log('error', `${fullUrl} endpoint does not exist.`, '');
        res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist.'});
        next();
      });
  
      app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
        if (error) {
          log.log('error', `GatewayService ${error.comingFrom}:`, error);
          res.status(error.statusCode).json(error.serializeErrors());
        }
  
        // if (isAxiosError(error)) {
        //   log.log('error', `GatewayService Axios Error - ${error?.response?.data?.comingFrom}:`, error);
        //   res.status(error?.response?.data?.statusCode ?? DEFAULT_ERROR_CODE).json({ message: error?.response?.data?.message ?? 'Error occurred.' });
        // }
  
        next();
      });
    }


  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      //const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      //this.socketIOConnections(socketIO);
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      log.info(`Gateway server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(`Gateway server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }
}