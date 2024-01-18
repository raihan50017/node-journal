import nodemailer from "nodemailer";
import config from "config";
import path from "path";
import mongoose from "mongoose";
import logger from "../logger/logger";
import { ROLES, ROUTES } from "./constants";
import { IArticle, IReviewer } from "../modules/article/article.interface";
import { IJournal } from "../modules/journal/journal.interface";
import { IUserDoc } from "../modules/users/user.interface";

interface IMail {
    to: string;
    subject: string;
    data?: any;
    message?: string;
    template?: string;
}
interface IMailConfig {
    email: string;
    password: string;
}

class MailSender {
    private mailConfig = config.get<IMailConfig>("nodemailer.gmail");

    textMailSender = (mailObj: IMail) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',                              // the service used
            auth: {
                user: this.mailConfig.email,              // authentication details of sender, here the details are coming from .env file
                pass: this.mailConfig.password,
            },
        });

        const mailOptions = {
            from: this.mailConfig.email,
            to: mailObj.to,
            subject: mailObj.subject,
            text: mailObj.message,
        };

        return transporter.sendMail(mailOptions);
    };

    htmlMailSender = (mailObj: IMail) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',                              // the service used
            auth: {
                user: this.mailConfig.email,              // authentication details of sender, here the details are coming from .env file
                pass: this.mailConfig.password,
            },
        });

        const mailOptions = {
            from: this.mailConfig.email,
            to: mailObj.to,
            subject: mailObj.subject,
            html: mailObj.message,
        };

        return transporter.sendMail(mailOptions);
    };

    /**
     * send confirmation email
     * @param to 
     * @param data 
     * @returns 
     */
    sendConfimationMail = async (to: string, title: string, token: string) => {
        try {
            const origin = config.get<string>('server.origin');
            const url = `${origin}${ROUTES.mailVerify.path}/${token}`;
            const message = `Thank you for registering at ${title}. Please click on the following link to verify your email account. ${url}`;

            const payload = {
                to: to,
                subject: "Account Confirmation",
                message: message,
            };
            return await this.textMailSender(payload);
        } catch (error: any) {
            logger.error(`${error.message} from mail sender`);
        }
    };

    sendUserCreationMail = async (credentials: { journal: string, email: string, password?: string, role: string }) => {
        try {
            const origin = config.get<string>('server.origin');
            const url = `${origin}/auth/login`;

            const message = `You are invited as an ${credentials.role} for ${credentials.journal}. Please click on the following link to login your account. <br/><br/>URL: ${url} <br/>Email: ${credentials.email}<br/>` + (credentials.password ? `Password: ${credentials.password}` : '');

            const payload = {
                to: credentials.email,
                subject: `Invitation as an ${credentials.role}`,
                message: message,
            };
            return await this.htmlMailSender(payload);
        } catch (error: any) {
            logger.error(`${error.message} from mail sender`);
        }
    };

    sendReviewerInvitationMail = async (journal: IJournal, article: IArticle, reviewer: IUserDoc) => {
        try {
            const origin = config.get<string>('server.origin');
            const url = `${origin}/auth/login`;

            const message = `You are invited as a ${ROLES.reviewer} for ${journal.title}. Please click on the following link to login your account. <br/><br/>URL: ${url} <br/>Article Name: ${article.article_title}<br/>Manuscript Id: ${article.manuscript_id}<br/>`;

            const payload = {
                to: reviewer.email,
                subject: `Invitation as a ${ROLES.reviewer}`,
                message: message,
            };
            return await this.htmlMailSender(payload);
        } catch (error: any) {
            logger.error(`${error.message} from mail sender`);
        }
    };
}


export const mailSender = new MailSender();