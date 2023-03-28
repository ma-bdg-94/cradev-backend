import { Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "http-status";
import { Project, User } from "../models";
import sendAssignmentMail from "../utilities/helpers/sendAssignmentMail.helper";
import { signToken } from "../utilities/helpers/signToken.helper";

export default class ProjectController {
  async addProject(req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const {
      title,
      beginDate,
      endDate,
      baseCost,
      totalCost,
      database,
      projectType,
      technologies,
      client,
    } = (req as any).body;

    try {
      let user = await User.findOne({ _id: (req as any).user.id });

      if (user?.userType !== "Admin") {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: "Forbidden Operation!" }],
        });
      }

      let project = new Project({
        title,
        beginDate,
        endDate,
        duration: Math.ceil(
          (endDate.getTime() - beginDate.getTime()) / (1000 * 3600 * 24)
        ),
        baseCost,
        totalCost,
        database,
        projectType,
        technologies,
        client,
      });

      await project.save();
      res.status(CREATED).json({ project });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async requestAssignment(req: Request, res: Response): Promise<any> {
    const { email } = (req as any).body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find user with those credentials!" }],
        });
      }

      const currentUser = await User.findOne({ _id: (req as any).user.id });
      if (currentUser?.userType !== "Admin") {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: "Forbidden Operation!" }],
        });
      }

      const project = await Project.findOne({
        _id: req.params.projectId,
      }).populate("client");
      if (!project) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find project!" }],
        });
      }

      const payload: any = {
        user: {
          id: user.id,
        },
      };
      const token = await signToken(payload);
      await sendAssignmentMail(
        email,
        token,
        user?.firstName,
        project?._id,
        project?.title,
        project?.client?.fullName
      );
      res.status(CREATED).json({ msg: "Email sent!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async addMeetingPoint(req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { meetingPoint } = (req as any).body;

    try {
      const currentUser = await User.findOne({ _id: (req as any).user.id });
      const project = await Project.findOne({ _id: req.params.projectId });

      if (!project) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find project!" }],
        });
      }

      if (
        currentUser?.userType !== "Admin" &&
        !project?.users?.includes(currentUser?._id)
      ) {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: "Forbidden Operation!" }],
        });
      }

      project?.meetingPoints?.push(meetingPoint);
      await project.save();
      res.status(CREATED).json({ project });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async getProjectList(req: Request, res: Response): Promise<any> {
    try {
      const projectList = await Project.find();

      if (projectList?.length > 0) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find project!" }],
        });
      }

      res.status(OK).json({ projectList });
    } catch (error: any) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async getProject(req: Request, res: Response): Promise<any> {
    try {
      const project = await Project.find({ _id: req.params.projectId });

      if (!project) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find project!" }],
        });
      }

      res.status(OK).json({ project });
    } catch (error: any) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async getProjectMeetingPoints(req: Request, res: Response): Promise<any> {
    try {
      const project = await Project.find({ _id: req.params.projectId });

      if (!project) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find project!" }],
        });
      }

      const meetingPoints = (project as any).meetingPoints;

      res.status(OK).json({ meetingPoints });
    } catch (error: any) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async getProjectCollaborators(req: Request, res: Response): Promise<any> {
    try {
      const project = await Project.find({ _id: req.params.projectId });

      if (!project) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find project!" }],
        });
      }

      const collaborators = (project as any).users;

      res.status(OK).json({ collaborators });
    } catch (error: any) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async updateProject(req: Request, res: Response): Promise<any> {
    const {
      title,
      beginDate,
      endDate,
      baseCost,
      database,
      projectType,
      technologies,
    } = (req as any).body;

    const projectFields: any = {};
    if (title) projectFields.title = title;
    if (beginDate) projectFields.beginDate = beginDate;
    if (endDate) projectFields.endDate = endDate;
    if (beginDate && endDate)
      projectFields.duration = Math.ceil(
        (endDate.getTime() - beginDate.getTime()) / (1000 * 3600 * 24)
      );
    if (baseCost) projectFields.baseCost = baseCost;
    if (database) projectFields.database = database;
    if (projectType) projectFields.projectType = projectType;
    if (technologies) projectFields.technologies = technologies;

    try {
      const currentUser = await User.findOne({ _id: (req as any).user.id });
      let project = await Project.findOne({ _id: req.params.projectId });

      if (
        currentUser?.userType !== "Admin" &&
        !project?.users?.includes(currentUser?._id)
      ) {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: "Forbidden Operation!" }],
        });
      }

      if (!project) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find project!" }],
        });
      }

      project = await Project.findOneAndUpdate(
        { _id: req.params.projectId },
        { $set: projectFields },
        { new: true }
      );

      res.status(OK).json({ project });
    } catch (error: any) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async deleteProject(req: Request, res: Response): Promise<any> {
    try {
      const currentUser = await User.findOne({ _id: (req as any).user.id });
      let project = await Project.findOne({ _id: req.params.projectId });

      if (currentUser?.userType !== "Admin") {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: "Forbidden Operation!" }],
        });
      }

      if (!project) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find project!" }],
        });
      }

      await Project.findOneAndDelete({ _id: req.params.projectId });

      res.status(OK).json({
        messages: [{ msg: "Project Deleted!" }],
      });
    } catch (error: any) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async removeCollaborator(req: Request, res: Response): Promise<any> {
    try {
      const currentUser = await User.findOne({ _id: (req as any).user.id });
      let project = await Project.findOne({ _id: req.params.projectId });

      if (currentUser?.userType !== "Admin") {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: "Forbidden Operation!" }],
        });
      }

      if (!project) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find project!" }],
        });
      }

      const index = await project?.users?.findIndex(req.params.collaboratorId);
      await project?.users?.splice(index, 1);

      res.status(OK).json({
        project,
      });
    } catch (error: any) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }
}
