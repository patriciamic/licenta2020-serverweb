import Koa from 'koa';
import Router from 'koa-router';
import Body from 'koa-bodyparser'
import cors from "@koa/cors";

import { error, bodyParserError } from './src/error';
import * as routes from './src/routes';

const app = new Koa();
const router = new Router();
const port = 3000;

router.get('/testGet', routes.testGet);
router.post('/testPost', routes.testPost);
router.post('/signIn', routes.signIn);
router.post('/saveUserCode', routes.saveUserCode);

//conversation
router.post('/message', routes.message);
router.get('/getConversationStructure/:userCode', routes.getConversationStructure);
router.post('/saveConversation/:userCode', routes.saveConversation);

//medication
router.get('/getDrugs', routes.getAllDrugs);
router.get('/getDiseases', routes.getAllDiseases);
router.post('/addTreatment', routes.addTreatment);
router.get('/getTreatment/:id', routes.getTreatment);
router.post('/getTreatment/', routes.getTreatment);


//web
router.get('/getPatients/:id', routes.getPatients);
router.get('/getConversation/:id', routes.getConversation);
router.get('/getConversations', routes.getConversations);
router.post('/associateConversation/:id', routes.associateConversationToPatient);
router.post('/addPatient/:id', routes.addPatient);
router.post('/addConversation/', routes.addConversation);


app
    .on('error', error)
    .use(cors())
    .use(Body({ onerror: bodyParserError, jsonLimit: '10mb' }))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(port);


console.log('Server running on port 3000');