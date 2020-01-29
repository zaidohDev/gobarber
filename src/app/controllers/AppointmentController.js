import Appointment from './../models/Appointment'
import * as Yup from 'yup' 


class AppointmentController {

  async store(req, res){
    const schema = Yup.object().shape({
      provider_id: Yup.string().required(),
      date: Yup.string().required(),
    });

    if(! await schema.isValid(req.body)) {
      return res.status(400).json({error: 'Validation fails'})}

    const app = await Appointment.create(req.body)
    return res.json(app)
  }
}

export default new AppointmentController()