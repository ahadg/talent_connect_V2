import { Health } from "../controllers/health";
import express, { Router } from "express"

class HealthRoutes {
    private router : Router;

    constructor() {
        this.router = express.Router();
    }

    public routes() : Router {
        this.router.get("/gateway-health", new Health().health)
        return this.router
    }
}

export const healthRoutes : HealthRoutes =  new HealthRoutes()