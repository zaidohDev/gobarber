import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from './../models/Appointment';
import File from './../models/File';
import User from './../models/User';
import * as Yup from 'yup'; 

class AppointmentController {
  async index(req, res){

    const appointments = await Appointment.findAll({
      where: {user_id: req.userId, canceled_at: null},
      order: ['date'],
      attributes: ['id', 'date'],
      include: [{
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [{
          model:File,
          as: 'avatar',
          attributes: ['id', 'path','url'],
        }]
      }]
    })

    if(!appointments) return res.status(400).json({erro: 'Appointment not found'})
    
    return res.json(appointments)
  }
  async store(req, res){
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if(!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({error: 'Validation fails'});
    }
    
    const { provider_id, date } = req.body;
    
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    console.log('checando '+ checkIsProvider)

    if (!checkIsProvider) {
      return res
      .status(401)
      .json({error:'You can only create appointments with providers'});
    }
    
    const hourStart = startOfHour(parseISO(date));

    console.log('hora: -->', hourStart)

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({erro:'Past dates are not permitted'});
    }
    /*
      check date 
    */ 
    const checkAvailability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart },
    });  

    console.log('check: -->', checkAvailability)

    if (checkAvailability) {
      return res.status(400).json({erro:'Appointment date is not availability'});
    } 

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();