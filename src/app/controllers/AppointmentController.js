import { startOfHour, parseISO, isBefore, format} from 'date-fns';
import Appointment from './../models/Appointment';
import File from './../models/File';
import User from './../models/User';
import * as Yup from 'yup'; 
import Notification from '../schemas/Notification';


class AppointmentController {
  async index(req, res){
    const { page = 1 } = req.query
    const appointments = await Appointment.findAll({
      where: {user_id: req.userId, canceled_at: null},
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,    
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

    if (checkAvailability) {
      return res.status(400).json({erro:'Appointment date is not availability'});
    } 

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    });

    /*
      notify appointment provider
    */
    const user = await User.findByPk(req.userId)
    const formatedDate = format( hourStart, "'Dia' dd 'de' MMMM, 'às' H:mm'h'")
    
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id
    })
    return res.json(appointment);
  }
}

export default new AppointmentController();