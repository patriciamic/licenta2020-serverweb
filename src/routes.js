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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addConversation = exports.addPatient = exports.associateConversationToPatient = exports.getConversations = exports.getConversation = exports.getPatients = exports.getTreatment = exports.getAllDiseases = exports.getAllDrugs = exports.addTreatment = exports.saveConversation = exports.getConversationStructure = exports.saveUserCode = exports.signIn = exports.message = exports.testPost = exports.testGet = void 0;
var db = __importStar(require("../dbneo"));
function testGet(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                console.log('test get');
                ctx.body = { data: 'test get' };
            }
            catch (e) {
                ctx.throw(e.status || 500, { message: e.message || e });
            }
            return [2 /*return*/];
        });
    });
}
exports.testGet = testGet;
function testPost(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                console.log('test post');
                ctx.body = { data: 'test post' };
            }
            catch (e) {
                ctx.throw(e.status || 500, { message: e.message || e });
            }
            return [2 /*return*/];
        });
    });
}
exports.testPost = testPost;
function message(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var dateArrived, body, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    dateArrived = (new Date()).getMilliseconds();
                    console.log('message POST body ' + JSON.stringify(ctx.request.body));
                    body = ctx.request.body;
                    return [4 /*yield*/, db.stepOne(body.id, body.text)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.stepTwo(body.id)];
                case 2:
                    res = _a.sent();
                    console.log("Message send " + ((new Date()).getMilliseconds() - dateArrived));
                    ctx.body = res;
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    ctx.throw(e_1.status || 500, { message: e_1.message || e_1 });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.message = message;
function signIn(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var body, res, obj, e_2, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = ctx.request.body;
                    if (!(body.from == "android")) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.signIn(Number(body.code))];
                case 2:
                    res = (_a.sent()).records[0]._fields[0];
                    obj = {
                        ok: true,
                        name: res.properties.name
                    };
                    ctx.body = obj;
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    obj = {
                        ok: false,
                    };
                    ctx.body = obj;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.signIn = signIn;
function saveUserCode(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var body, res, obj, e_3, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = ctx.request.body;
                    if (!(body.from == "android")) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.signIn(Number(body.code))];
                case 2:
                    res = (_a.sent()).records[0]._fields[0];
                    obj = {
                        ok: true,
                        name: res.properties.name
                    };
                    ctx.body = obj;
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    obj = {
                        ok: false,
                    };
                    ctx.body = obj;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.saveUserCode = saveUserCode;
function getConversationStructure(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        function getTree(root) {
            return __awaiter(this, void 0, void 0, function () {
                var tree, filteredFields;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, db.getAllNodesForRoot(root)];
                        case 1:
                            tree = (_a.sent()).records;
                            filteredFields = [];
                            tree.forEach(function (element) {
                                var arr = [];
                                element._fields.forEach(function (field) {
                                    arr.push({
                                        identity: field.identity.low,
                                        name: field.properties.name,
                                        question: field.properties.question,
                                        type: field.properties.type
                                    });
                                });
                                filteredFields.push({
                                    parent: arr[0],
                                    child: arr[1]
                                });
                            });
                            return [2 /*return*/, filteredFields];
                    }
                });
            });
        }
        function getConversation(conversation, filteredKeysAndFields) {
            conversation.forEach(function (element) {
                filteredKeysAndFields.push({ keys: element.keys, fields: element._fields });
            });
            var conv = {
                label: filteredKeysAndFields[0].fields[0].labels[0],
                properties: filteredKeysAndFields[0].fields[0].properties,
                identity: filteredKeysAndFields[0].fields[0].identity.low
            };
            return conv;
        }
        var userCode, conversation, filteredKeysAndFields, conv, root, filteredFields, result, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userCode = ctx.params.userCode;
                    console.log('getConversationStructure for ', userCode);
                    return [4 /*yield*/, db.getTreeHeads(userCode)];
                case 1:
                    conversation = (_a.sent()).records;
                    filteredKeysAndFields = [];
                    conv = getConversation(conversation, filteredKeysAndFields);
                    root = filteredKeysAndFields[0].fields[2].properties;
                    root.identity = filteredKeysAndFields[0].fields[2].identity.low;
                    return [4 /*yield*/, getTree(root)];
                case 2:
                    filteredFields = _a.sent();
                    result = {
                        conversation: conv,
                        root: root,
                        tree: filteredFields
                    };
                    ctx.body = result;
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    ctx.throw(e_4.status || 500, { message: e_4.message || e_4 });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getConversationStructure = getConversationStructure;
function saveConversation(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var body, userCode, list, firstNode, i, secondNode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = ctx.request.body;
                    if (!(body.from == "android")) return [3 /*break*/, 5];
                    userCode = ctx.params.userCode;
                    list = JSON.parse(body.conversation);
                    return [4 /*yield*/, db.saveConversation(userCode, body.localDateTime, list)];
                case 1:
                    firstNode = (_a.sent()).records[0]._fields[0];
                    i = 1;
                    _a.label = 2;
                case 2:
                    if (!(i < list.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, db.saveNextSentence(userCode, firstNode.properties, list[i])];
                case 3:
                    secondNode = (_a.sent()).records[0]._fields[0];
                    firstNode = secondNode;
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    ctx.body = "done";
                    return [2 /*return*/];
            }
        });
    });
}
exports.saveConversation = saveConversation;
function addTreatment(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var body, treatmentId;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('addTreatment');
                    body = ctx.request.body;
                    return [4 /*yield*/, db.createTreatment(body.patient, body.drug, body.treatment)];
                case 1:
                    treatmentId = (_a.sent()).records[0]._fields[0].low;
                    body.treatment.listHoursAndMinutes.forEach(function (element) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, db.addHoursAndMinutesToTreatment(treatmentId, element)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    ctx.body = 'done';
                    return [2 /*return*/];
            }
        });
    });
}
exports.addTreatment = addTreatment;
function getAllDrugs(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var records, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getAllDrugs()];
                case 1:
                    records = (_a.sent()).records;
                    response = [];
                    records.forEach(function (element) {
                        var obj = {
                            identity: element._fields[0].low,
                            name: element._fields[1]
                        };
                        response.push(obj);
                    });
                    console.log(response);
                    ctx.body = response;
                    return [2 /*return*/];
            }
        });
    });
}
exports.getAllDrugs = getAllDrugs;
function getAllDiseases(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var records, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getAllDiseases()];
                case 1:
                    records = (_a.sent()).records;
                    response = [];
                    records.forEach(function (element) {
                        var obj = {
                            identity: element._fields[0].low,
                            name: element._fields[1]
                        };
                        response.push(obj);
                    });
                    console.log(response);
                    ctx.body = response;
                    return [2 /*return*/];
            }
        });
    });
}
exports.getAllDiseases = getAllDiseases;
function getTreatment(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        function getMapStructure(res) {
            var mp = new Map();
            res.forEach(function (element) {
                var treatment = element._fields[0];
                var drug = element._fields[1];
                var obj = {
                    drug: {
                        id: drug.identity.low,
                        name: drug.properties.title
                    },
                    treatment: {
                        id: treatment.identity.low,
                        timesADay: treatment.properties.timesADay.low,
                        daysInterval: treatment.properties.daysInterval.low,
                        start: treatment.properties.start,
                        stop: treatment.properties.stop,
                        listHoursAndMinutes: []
                    }
                };
                mp.set(obj.treatment.id, obj);
            });
            mp.forEach(function (obj) {
                res.forEach(function (record) {
                    var treatment = record._fields[0];
                    var hoursAndMinutes = record._fields[2];
                    if (treatment.identity.low == obj.treatment.id) {
                        obj.treatment.listHoursAndMinutes.push({
                            id: hoursAndMinutes.identity.low,
                            hour: hoursAndMinutes.properties.hour.low,
                            minutes: hoursAndMinutes.properties.minutes.low
                        });
                    }
                });
            });
            return mp;
        }
        var body, res, map, array_1, res, map, array_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = ctx.request.body;
                    if (!(body.from == "android")) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.getTreatmentByCode(body.code)];
                case 1:
                    res = (_a.sent()).records;
                    map = getMapStructure(res);
                    array_1 = [];
                    map.forEach(function (element) {
                        array_1.push(element);
                    });
                    console.log(array_1);
                    ctx.body = array_1;
                    return [3 /*break*/, 4];
                case 2:
                    //get med by user id
                    console.log('getTreatment web', ctx.params.id);
                    return [4 /*yield*/, db.getTreatmentById(ctx.params.id)];
                case 3:
                    res = (_a.sent()).records;
                    map = getMapStructure(res);
                    array_2 = [];
                    map.forEach(function (element) {
                        array_2.push(element);
                    });
                    console.log(array_2);
                    ctx.body = array_2;
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getTreatment = getTreatment;
function getPatients(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        function find(element, list) {
            var found = false;
            list.forEach(function (item) {
                if (item.id == element.id) {
                    found = true;
                }
            });
            return found;
        }
        var records, map, setDiseases, setMedication, array;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('getPatients');
                    return [4 /*yield*/, db.GetPatients(ctx.params.id)];
                case 1:
                    records = (_a.sent()).records;
                    map = new Map();
                    setDiseases = new Set();
                    setMedication = new Set();
                    records.forEach(function (record) {
                        var patientId = record._fields[0].identity.low;
                        console.log(record._fields[0].properties);
                        var obj = {
                            patient: {
                                id: patientId,
                                name: record._fields[0].properties.name,
                                phoneNumber: record._fields[0].properties.phoneNumber,
                                address: record._fields[0].properties.Address,
                                birthDate: record._fields[0].properties.BirthDate,
                            },
                            diseases: [],
                            medication: []
                        };
                        console.log(obj);
                        map.set(patientId, obj);
                    });
                    //diseases & medication
                    map.forEach(function (mapObject) {
                        records.forEach(function (record) {
                            var idPatient = record._fields[0].identity.low;
                            if (mapObject.patient.id == idPatient) {
                                var disease = {
                                    id: record._fields[1].identity.low,
                                    name: record._fields[1].properties.title
                                };
                                if (!find(disease, mapObject.diseases)) {
                                    mapObject.diseases.push(disease);
                                }
                                var drug = {
                                    id: record._fields[3].identity.low,
                                    name: record._fields[3].properties.title
                                };
                                if (!find(drug, mapObject.medication)) {
                                    mapObject.medication.push(drug);
                                }
                            }
                        });
                    });
                    array = [];
                    map.forEach(function (element) {
                        array.push({
                            patient: element.patient,
                            diseases: element.diseases,
                            medication: element.medication
                        });
                    });
                    ctx.body = array;
                    return [2 /*return*/];
            }
        });
    });
}
exports.getPatients = getPatients;
function getConversation(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var patientId, conversastionStartList, filteredStartInfoList, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    patientId = ctx.params.id;
                    return [4 /*yield*/, db.getConversationsRoots(patientId)];
                case 1:
                    conversastionStartList = (_a.sent()).records;
                    filteredStartInfoList = getFilteredInfo(conversastionStartList);
                    _loop_1 = function (i) {
                        var convList, filteredFields;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, db.getConversationByRoot(filteredStartInfoList[i].root.id)];
                                case 1:
                                    convList = (_a.sent()).records;
                                    filteredFields = [];
                                    filteredFields.push(filteredStartInfoList[i].root);
                                    convList.forEach(function (element) {
                                        var obj = {
                                            id: element._fields[1].identity.low,
                                            properties: element._fields[1].properties
                                        };
                                        filteredFields.push(obj);
                                    });
                                    filteredStartInfoList[i].conversation = filteredFields;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < filteredStartInfoList.length)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1(i)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    ctx.body = filteredStartInfoList;
                    return [2 /*return*/];
            }
        });
    });
}
exports.getConversation = getConversation;
function getFilteredInfo(conversastionStartList) {
    var list = [];
    conversastionStartList.forEach(function (element) {
        var obj = {
            info: {
                id: element._fields[0].identity.low,
                dateTime: element._fields[0].properties.dateTime
            },
            root: {
                id: element._fields[1].identity.low,
                properties: element._fields[1].properties
            },
            conversation: []
        };
        list.push(obj);
    });
    return list;
}
function getConversations(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var conv, list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getConversations()];
                case 1:
                    conv = (_a.sent()).records;
                    list = [];
                    conv.forEach(function (element) {
                        var obj = {
                            id: element._fields[0].identity.low,
                            name: element._fields[0].properties.name
                        };
                        list.push(obj);
                    });
                    ctx.body = list;
                    return [2 /*return*/];
            }
        });
    });
}
exports.getConversations = getConversations;
function associateConversationToPatient(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var idPatient, idConversation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    idPatient = ctx.request.body.idPatient;
                    idConversation = ctx.request.body.idConversation;
                    console.log(idPatient, idConversation);
                    return [4 /*yield*/, db.deleteCurrentRelationForPatientWhichHasConversation(idPatient)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.addNewConversationRelationForPatient(idPatient, idConversation)];
                case 2:
                    _a.sent();
                    ctx.body = { response: 'done' };
                    return [2 /*return*/];
            }
        });
    });
}
exports.associateConversationToPatient = associateConversationToPatient;
function addPatient(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var data, idPatient, idDisease, med, drugId, obj, body, treatmentId;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(ctx.request.body);
                    data = ctx.request.body;
                    return [4 /*yield*/, db.addPatient(data.patient)];
                case 1:
                    idPatient = (_a.sent()).records[0]._fields[0].low;
                    idDisease = data.diseases[0].identity;
                    return [4 /*yield*/, db.AddDiseaseRelationToPatient(idPatient, idDisease)];
                case 2:
                    _a.sent();
                    med = data.medication[0];
                    drugId = med.identity;
                    console.log(med.listHourAndMinutes);
                    obj = { patient: idPatient,
                        drug: med.drug.identity, treatment: {
                            timesADay: med.timesPerDay,
                            daysInterval: med.daysInterval,
                            start: med.startDate,
                            stop: med.StopDate,
                            listHoursAndMinutes: []
                        }
                    };
                    med.listHourAndMinutes.forEach(function (element) {
                        var hm = {
                            hour: Number(element.split(':')[0]),
                            minutes: Number(element.split(':')[1])
                        };
                        obj.treatment.listHoursAndMinutes.push(hm);
                    });
                    body = obj;
                    console.log(body);
                    return [4 /*yield*/, db.createTreatment(body.patient, body.drug, body.treatment)];
                case 3:
                    treatmentId = (_a.sent()).records[0]._fields[0].low;
                    body.treatment.listHoursAndMinutes.forEach(function (element) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, db.addHoursAndMinutesToTreatment(treatmentId, element)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    ctx.body = { response: 'done' };
                    return [2 /*return*/];
            }
        });
    });
}
exports.addPatient = addPatient;
function addConversation(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var data, currentParentId, i, children, j;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(ctx.request.body);
                    data = ctx.request.body;
                    return [4 /*yield*/, db.createAndInitConversation(data.name, data.tree[0].properties)];
                case 1:
                    currentParentId = (_a.sent()).records[0]._fields[0].low;
                    console.log(currentParentId);
                    i = 1;
                    _a.label = 2;
                case 2:
                    if (!(i < data.tree.length)) return [3 /*break*/, 9];
                    children = getChildrenFor(data.tree, data.tree[i].parent.id);
                    console.log(children);
                    j = 0;
                    _a.label = 3;
                case 3:
                    if (!(j < children.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, db.addChild(currentParentId, children[j].properties)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    j++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, db.getNextParent(currentParentId, data.tree[i].properties.symptom)];
                case 7:
                    currentParentId = (_a.sent()).records[0]._fields[0].low;
                    _a.label = 8;
                case 8:
                    i += 3;
                    return [3 /*break*/, 2];
                case 9:
                    ctx.body = { response: 'done' };
                    return [2 /*return*/];
            }
        });
    });
}
exports.addConversation = addConversation;
function getChildrenFor(list, id) {
    var copyList = list.filter(function (e) { if (e.parent != null)
        return e.parent.id == id; });
    return copyList;
}
