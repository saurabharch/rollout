const express = require("express");
const router = express.Router();
import * as organizationCtrl from "../controllers/organization";
import { authJwt } from "../middlewares";
router.get("/", organizationCtrl.getOrgs);

router.get("/:organizationId", organizationCtrl.getOrgById);

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isModerator],
  organizationCtrl.createOrganization
);

router.put(
  "/:organizationId",
  [authJwt.verifyToken, authJwt.isModerator],
  organizationCtrl.updateOrgId
);

router.delete(
  "/:organizationId",
  [authJwt.verifyToken, authJwt.isAdmin],
  organizationCtrl.deleteOrgById
);

module.exports = router;
