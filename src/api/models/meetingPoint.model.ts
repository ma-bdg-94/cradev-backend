import { Schema, model, Date } from 'mongoose'

interface MeetingPointInterface {
  users: Schema.Types.ObjectId[] | any
  project: Schema.Types.ObjectId | any
  from: Date
  to: Date
  title: string
  duration?: number
}

const MeetingPointSchema = new Schema<MeetingPointInterface>(
  {
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    title: {
      type: String,
      required: true
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const MeetingPoint = model('MeetingPoint', MeetingPointSchema)
export default MeetingPoint

