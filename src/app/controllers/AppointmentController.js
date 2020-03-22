import * as Yup from 'yup';
import { parseISO, startOfHour, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import Notifications from '../Shemas/Notifications';

import Mail from '../../lib/Mail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validations fails' });
    }

    const { date, provider_id } = req.body;

    // checar se o usuario e provedor de serviços
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Date is not available' });
    }

    const provider = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    // notificar prestador de serviço
    const user = await User.findOne({ where: { id: req.userId } });
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM, 'ás' H:mm'h", {
      locale: pt,
    });

    await Notifications.create({
      content: `Novo agendamento feito por ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(provider);
  }

  async delete(req, res) {
    const appointments = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (appointments.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't heve permission to cancel this appointment",
      });
    }

    const dateWithSub = subHours(appointments.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can only appoitments 2 hours advance' });
    }

    appointments.canceled_at = new Date();

    appointments.save();

    await Mail.sendMail({
      to: `${appointments.provider.name} <${appointments.provider.email}>`,
      subject: 'agendamento cancelado',
      text: 'Um agendamento foi cancelado',
    });

    return res.json(appointments);
  }
}

export default new AppointmentController();
