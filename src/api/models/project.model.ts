import { Schema, model, Date } from 'mongoose'

type TimesheetType = {
  date: Date
  hijriDate?: string
  nbHoursByDay: number
  hourCost: number
  dayCost: number
}

interface ProjectInterface {
  users: Schema.Types.ObjectId[] | any
  client: Schema.Types.ObjectId | any
  title: string
  beginDate: Date
  endDate?: Date
  duration: number
  baseCost: number
  totalCost?: number
  database: string
  projectType: string
  technologies: string[]
  meetingPoints?: Schema.Types.ObjectId | any
  timesheets?: TimesheetType[]
}

const ProjectSchema = new Schema<ProjectInterface>(
  {
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client'
    },
    title: {
      type: String,
      required: true
    },
    beginDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
    },
    duration: {
      type: Number,
      required: true,
      default: 0
    },
    baseCost: {
      type: Number,
      required: true,
      default: 0
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0
    },
    database: {
      type: String,
      required: true
    },
    projectType: {
      type: String,
      required: true
    },
    technologies: [{
      type: String,
      required: true
    }],
    meetingPoints: [{
      type: Schema.Types.ObjectId,
      ref: 'MeetingPoint'
    }],
    timesheets: [
      {
        date: {
          type: Date,
          required: true
        },
        hijriDate: {
          type: String,
          required: true
        },
        nbHoursByDay: {
          type: Number,
          default: 0,
          required: true
        },
        hourCost: {
          type: Number,
          default: 0,
          required: true
        },
        dayCost: {
          type: Number,
          default: 0,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

const Project = model('Project', ProjectSchema)
export default Project

