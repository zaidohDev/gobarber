import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';
class ScheduleController {
  async index(req, res){
    /* checks if the user is a provider */
    const checkUserProvider = await User
      .findOne({
        where:{
          id:req.userId, 
          provider:true}
        }) 
    /* if the user is not a provider it returns an error handling */
    if (!checkUserProvider) {
      return res.status(401).json({error: 'User in not a provider'})
    }

    const {date} = req.query

    const parseDate = parseISO(date)

    /* list all registered provider appointments */
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });
    return res.json(appointments)
  }
}

export default new ScheduleController()