import express from "express";
import {UserValidator} from "#validator/index.js";
import {authMiddleware} from "#middlewares/http/index.js";
import { Roles } from "#root/contants/roles.js";
import { Ticket } from "#root/model/index.js";

const router = express.Router();


router.get('/', UserValidator.validateRememberMe,(req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
},authMiddleware.requireRole([Roles.ADMIN]),async (req, res) => {
    // get all ticket with populate user and exlude password and order by created date desc
    const filter = req.query?.filter || 'all';

    let tickets = [];
    if (!filter) {
        tickets = await Ticket.find({}).populate('createdBy', '-password').sort({createdAt: -1});
    } else {
        switch (filter) {
            case 'approved':
                tickets = await Ticket.find({status: 'approved'}).populate('createdBy', '-password').sort({createdAt: -1});
                break;
            case 'rejected':
                tickets = await Ticket.find({status: 'rejected'}).populate('createdBy', '-password').sort({createdAt: -1});
                break;
            case 'pending':
                tickets = await Ticket.find({status: 'pending'}).populate('createdBy', '-password').sort({createdAt: -1});
                break;
            default:
                tickets = await Ticket.find({}).populate('createdBy', '-password').sort({createdAt: -1});
        }
    }

    res.render('layouts/admin/tickets.ejs',
        {
            tickets: tickets,
            user: req.user,
            filter: filter || 'all'
        });
})

router.get('/approve/:id', UserValidator.validateRememberMe,(req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, authMiddleware.requireRole([Roles.ADMIN]),async (req, res) => {
    const ticket = await Ticket.findById(req.params.id).populate('createdBy', '-password');
    ticket.status = 'approved';
    // change role of user to supplier
    if (ticket.createdBy.role !== Roles.ADMIN) {
        ticket.createdBy.role = Roles.SUPPlIER;
        ticket.createdBy.save();
    }
    ticket.save();
    // redirect to original url
    res.redirect(req.get('referer'));
});

router.get('/reject/:id', UserValidator.validateRememberMe,(req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, authMiddleware.requireRole([Roles.ADMIN]),async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    ticket.status = 'rejected';
    ticket.save();
    // redirect to original url
    res.redirect(req.get('referer'));
});

export default router;