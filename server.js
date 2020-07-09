"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var koa_router_1 = __importDefault(require("koa-router"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var cors_1 = __importDefault(require("@koa/cors"));
var error_1 = require("./src/error");
var routes = __importStar(require("./src/routes"));
var app = new koa_1.default();
var router = new koa_router_1.default();
var port = 3000;
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
    .on('error', error_1.error)
    .use(cors_1.default())
    .use(koa_bodyparser_1.default({ onerror: error_1.bodyParserError, jsonLimit: '10mb' }))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(port);
console.log('Server running on port 3000');
