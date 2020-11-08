const express = require("express");
const router = express.Router();
import { authJwt, verifySignup } from "../middlewares";
import { UserController } from "../jobs/controllers/UserController";
import BullBoard from "bull-board";
import { pQueue } from "../lib/Queue";

BullBoard.setQueues(pQueue.queues.map(queue => queue.bull));
router.post("/queues", [authJwt.verifyToken], UserController.store);
router.get("/a/queues", [authJwt.verifyToken], BullBoard.UI);

module.exports = router;
