import express, { Handler, Router } from "express";
const router: Router = express.Router();

import { projectValidation } from "../validations";
const {
  coreProjectValidation,
  assignmentValidation,
  meetingPointValidation,
  updateCoreValidation,
} = projectValidation;

import { projectController } from "../controllers";
const {
  addProject,
  requestAssignment,
  addMeetingPoint,
  getProjectList,
  getProject,
  getProjectMeetingPoints,
  getProjectCollaborators,
  updateProject,
  deleteProject,
  removeCollaborator
} = projectController;

import isAuth from "../middlewares/isAuth.middleware";

router.post("/", [isAuth, coreProjectValidation as any], addProject);
router.post(
  "/assign/:projectId",
  [isAuth, assignmentValidation as any],
  requestAssignment
);
router.post(
  "/meeting/:projectId",
  [isAuth, meetingPointValidation as any],
  addMeetingPoint
);

router.get("/", isAuth, getProjectList);
router.get("/:projectId", isAuth, getProject);
router.get("/meeting/:projectId", isAuth, getProjectMeetingPoints);
router.get("/collaborators/:projectId", isAuth, getProjectCollaborators);

router.put("/:projectId", [isAuth, updateCoreValidation as any], updateProject);

router.delete("/:projectId", [isAuth, updateCoreValidation as any], deleteProject);
router.delete("/collaborators/:projectId", isAuth, removeCollaborator);

export default router;
