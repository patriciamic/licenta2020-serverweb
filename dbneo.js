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
exports.addChild = exports.getNextParent = exports.createAndInitConversation = exports.AddDiseaseRelationToPatient = exports.addPatient = exports.addNewConversationRelationForPatient = exports.deleteCurrentRelationForPatientWhichHasConversation = exports.getConversations = exports.getConversationByRoot = exports.getConversationsRoots = exports.GetPatients = exports.getTreatmentById = exports.getTreatmentByCode = exports.addHoursAndMinutesToTreatment = exports.createTreatment = exports.getAllDiseases = exports.getAllDrugs = exports.getConversation = exports.getRootByDateTime = exports.saveNextSentence = exports.saveConversation = exports.getAllNodesForRoot = exports.getTreeHeads = exports.getSymptomsRelations = exports.signIn = exports.stepTwo = exports.stepOne = void 0;
var neo4j = __importStar(require("neo4j-driver"));
var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '3333'));
function stepOne(id, text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var session = driver.session();
                    var cypher = 'CALL ga.nlp.annotate({text:"' + text + '", id:"' + id + '", pipeline:"mypipeline", checkLanguage:false}) ' +
                        'YIELD result ' +
                        'RETURN result';
                    var res = session.run(cypher);
                    res.then(function (r) {
                        var record = r.records[0]._fields[0];
                        session.close();
                        resolve(record.labels[1]);
                    }).catch(function (e) {
                        console.log('err step one' + e);
                        reject('err');
                    });
                })];
        });
    });
}
exports.stepOne = stepOne;
function stepTwo(id) {
    return __awaiter(this, void 0, void 0, function () {
        var idModified;
        return __generator(this, function (_a) {
            idModified = id + "_0";
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var session = driver.session();
                    var cypher = 'MATCH(n) where n.id = "' + idModified + '" return n';
                    var res = session.run(cypher);
                    res.then(function (r) {
                        var record = r.records[0]._fields[0];
                        console.log('text: ' + record.properties.text + ' is ' + record.labels[1]);
                        session.close();
                        resolve(record.labels[1]);
                    }).catch(function (e) {
                        console.log('err step two ' + e);
                        reject('err');
                    });
                })];
        });
    });
}
exports.stepTwo = stepTwo;
function signIn(myCode) {
    console.log("arrived in signIn db ", myCode);
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = 'Match(p:Patient) where p.code =' + myCode + ' return p';
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err sign in ' + e);
            reject('err');
        });
    });
}
exports.signIn = signIn;
function getSymptomsRelations() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("arrived in getSymptomsRelations ");
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var session = driver.session();
                    var cypher = 'MATCH (fromSymptom:Symptom )-[relation:imply]-(toSymptom:Symptom) RETURN fromSymptom,relation,toSymptom';
                    var res = session.run(cypher);
                    res.then(function (r) {
                        session.close();
                        resolve(r);
                    }).catch(function (e) {
                        console.log('err get symptom ' + e);
                        reject('err');
                    });
                })];
        });
    });
}
exports.getSymptomsRelations = getSymptomsRelations;
function getTreeHeads(userCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var session = driver.session();
                    var cypher = 'MATCH (n:Patient )-[r:hasConversation]-(c:Conversation)-[relation:hasRootConversation]-(node:Node) where n.code =' + userCode
                        + ' RETURN c, relation, node';
                    var res = session.run(cypher);
                    res.then(function (r) {
                        session.close();
                        resolve(r);
                    }).catch(function (e) {
                        reject('err');
                    });
                })];
        });
    });
}
exports.getTreeHeads = getTreeHeads;
function getAllNodesForRoot(root) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var session = driver.session();
                    var cypher = 'MATCH p=(a:Node {name: "' + root.name + '"})-[:hasChild*1..]->(otherThing) '
                        + 'WITH nodes(p) as nodes '
                        + 'RETURN nodes[size(nodes)-2] as Parent, '
                        + 'nodes[size(nodes)-1] as Child;';
                    var res = session.run(cypher);
                    res.then(function (r) {
                        session.close();
                        resolve(r);
                    }).catch(function (e) {
                        reject(e);
                    });
                })];
        });
    });
}
exports.getAllNodesForRoot = getAllNodesForRoot;
function saveConversation(myCode, dateTime, list) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "Match(p:Patient) where p.code =" + myCode +
            "\n CREATE (a:StoredConversation {dateTime: '" + dateTime + "'}) " +
            "\n CREATE(n:ConversationSentence {question: '" + list[0].question
            + "', answer: '" + list[0].answer
            + "', type: '" + list[0].type + "'}) " +
            "\n CREATE (p)-[r:hasStoredConversation { name: 'patient->storedConversation'}]->(a) " +
            "\n CREATE (a)-[rel:hasNextSentence { name: 'question->answer'}]->(n) " +
            "\n RETURN n";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.saveConversation = saveConversation;
function saveNextSentence(myCode, firstNode, secondNode) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "Match(p:Patient), (firstNode:ConversationSentence) " +
            "\n where p.code = " + myCode +
            "\n and firstNode.question = '" + firstNode.question + "'" +
            "\n and firstNode.answer = '" + firstNode.answer + "'" +
            "\n and firstNode.type = '" + firstNode.type + "'" +
            "\n CREATE(secondNode:ConversationSentence {question: '" + secondNode.question
            + "', answer: '" + secondNode.answer
            + "', type: '" + secondNode.type + "'})" +
            "\n CREATE (firstNode)-[rel:hasNextSentence { name: 'question->answer'}]->(secondNode)" +
            "\n RETURN secondNode";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject(e);
        });
    });
}
exports.saveNextSentence = saveNextSentence;
function getRootByDateTime(username, dateTime) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "Match(p:Patient),(c:StoredConversation)-[r:hasNextSentence]-(cs:ConversationSentence) " +
            " where p.code = " + username + " and c.dateTime >= '" + dateTime + "' " +
            " RETURN cs";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.getRootByDateTime = getRootByDateTime;
// export function getConversationByRoot(root: any) {
//   return new Promise<any>((resolve, reject) => {
//     var session = driver.session();
//     let cypher = "MATCH p=(a:ConversationSentence {question: '" + root.question
//       + "', answer: '" + root.answer
//       + "', type: '" + root.type
//       + "'})-[:hasNextSentence*1..]->(otherThing) " +
//       "WITH nodes(p) as nodes " +
//       "RETURN nodes[size(nodes)-2] as Parent, " +
//       "nodes[size(nodes)-1] as Child ";
//     let res = session.run(cypher);
//     res.then(r => {
//       session.close();
//       resolve(r);
//     }).catch(e => {
//       console.log('err ' + e);
//       reject('err');
//     });
//   });
// }
function getConversation(id) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "Match(p:Patient)-[:hasStoredConversation]->(c:StoredConversation) Match (c)-[r:hasNextSentence]-(cs:ConversationSentence) " +
            " where ID(p) = " + id +
            " RETURN c, cs";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.getConversation = getConversation;
function getAllDrugs() {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "Match(drug:Drug) return ID(drug)as identity, drug.title as name";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.getAllDrugs = getAllDrugs;
function getAllDiseases() {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "Match(d:Disease) return ID(d)as identity, d.title as name";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.getAllDiseases = getAllDiseases;
function createTreatment(patientId, drugId, treatment) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "MATCH(p:Patient), (d:Drug) where ID(p) = " + patientId + " and ID(d) = " + drugId
            + " CREATE(t:Treatment {timesADay:" + treatment.timesADay
            + ", daysInterval: " + treatment.daysInterval
            + ", start: '" + treatment.start
            + "', stop: '" + treatment.stop
            + "'}) CREATE (p)-[r:hasTreatment { name: ID(p) +'->'+ID(t)}]->(t)"
            + "  CREATE (t)-[rel:hasDrug { name: ID(t) +'->'+ID(d)}]->(d)"
            + " return ID(t)";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.createTreatment = createTreatment;
function addHoursAndMinutesToTreatment(treatmentId, element) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = " MATCH (t:Treatment)" +
            " WHERE ID(t) =" + treatmentId +
            " Create (h:HoursAndMinutes {hour: " + element.hour + ", minutes: " + element.minutes + "})" +
            " CREATE (t)-[r:hasTime { name: ID(t) +'->'+ID(h)}]->(h)" +
            " RETURN type(r), r.name";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.addHoursAndMinutesToTreatment = addHoursAndMinutesToTreatment;
function getTreatmentByCode(code) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = " MATCH (p:Patient {code:" + code + " })-[:hasTreatment]->(t:Treatment)-[:hasDrug]-(d:Drug)" +
            " MATCH (t)-[:hasTime]-(h:HoursAndMinutes) return t as treatment, d as drug, h as hourAndMinutes";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.getTreatmentByCode = getTreatmentByCode;
function getTreatmentById(id) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = " MATCH (p:Patient)-[:hasTreatment]->(t:Treatment)-[:hasDrug]-(d:Drug)" +
            " MATCH (t)-[:hasTime]-(h:HoursAndMinutes)  where ID(p) = " + id + " return t as treatment, d as drug, h as hourAndMinutes";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.getTreatmentById = getTreatmentById;
function GetPatients(id) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "Match(patient:Patient)-[:hasDisease]->(disease:Disease)" +
            " Match(patient)-[:hasTreatment]->(treatment:Treatment)" +
            " Match(treatment)-[:hasDrug]->(drug:Drug)" +
            " return patient, disease, treatment, drug";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.GetPatients = GetPatients;
function getConversationsRoots(id) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "  Match(p:Patient)-[:hasStoredConversation]-(sc:StoredConversation) MATCH(sc)-[:hasNextSentence]-(cs:ConversationSentence) where ID(p) = " + id + " return sc,cs";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.getConversationsRoots = getConversationsRoots;
function getConversationByRoot(id) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "MATCH p=(a:ConversationSentence)-[:hasNextSentence*1..]->(otherThing) where ID(a) = " + id +
            " WITH nodes(p) as nodes " +
            " RETURN nodes[size(nodes)-2] as Parent, " +
            " nodes[size(nodes)-1] as Child;";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.getConversationByRoot = getConversationByRoot;
function getConversations() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var session = driver.session();
                    var cypher = 'Match(n:Conversation)return n';
                    var res = session.run(cypher);
                    res.then(function (r) {
                        session.close();
                        resolve(r);
                    }).catch(function (e) {
                        reject(e);
                    });
                })];
        });
    });
}
exports.getConversations = getConversations;
function deleteCurrentRelationForPatientWhichHasConversation(idPatient) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var session = driver.session();
                    var cypher = 'Match(p:Patient)-[r:hasConversation]-(c:Conversation) where ID(p)=' + idPatient + ' delete r';
                    var res = session.run(cypher);
                    res.then(function (r) {
                        session.close();
                        resolve(r);
                    }).catch(function (e) {
                        reject(e);
                    });
                })];
        });
    });
}
exports.deleteCurrentRelationForPatientWhichHasConversation = deleteCurrentRelationForPatientWhichHasConversation;
function addNewConversationRelationForPatient(idPatient, idConversation) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var session = driver.session();
                    var cypher = "MATCH (p:Patient),(c:Conversation)"
                        + " WHERE ID(p)=" + idPatient + " and ID(c)=" + idConversation +
                        " CREATE (p)-[r:hasConversation { name: p.name +'->'+c.name}]->(c)" +
                        " RETURN type(r), r.name";
                    var res = session.run(cypher);
                    res.then(function (r) {
                        session.close();
                        resolve(r);
                    }).catch(function (e) {
                        reject(e);
                    });
                })];
        });
    });
}
exports.addNewConversationRelationForPatient = addNewConversationRelationForPatient;
function addPatient(data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var session = driver.session();
                    var cypher = "CREATE (p:Patient {name:'" + data.name
                        + "', Address: '" + data.address
                        + "', BirthDate:'" + data.birthDate
                        + "', code:'none', phoneNumber:'" + data.phoneNumber
                        + "'}) return ID(p)";
                    var res = session.run(cypher);
                    res.then(function (r) {
                        session.close();
                        resolve(r);
                    }).catch(function (e) {
                        reject(e);
                    });
                })];
        });
    });
}
exports.addPatient = addPatient;
function AddDiseaseRelationToPatient(idPatient, idDisease) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "MATCH (a:Patient),(b:Disease)" +
            " WHERE ID(a) = " + idPatient + " AND ID(b) =" + idDisease +
            " CREATE (a)-[r:hasDisease { name: ID(a) +'->'+ID(b)}]->(b)" +
            " RETURN type(r), r.name";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.AddDiseaseRelationToPatient = AddDiseaseRelationToPatient;
// CREATE (c:Conversation {name: 'AAA'})-[r:hasRootConversation { name: ID(c) +'->'+ID(root)}]->(root:Node {name: 'A', question: 'QA', type: 'positive'}) return ID(root)
function createAndInitConversation(name, data) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "CREATE (c:Conversation {name: '" + name + "'})-[r:hasRootConversation { name: ID(c) +'->'+ID(root)}]->" +
            "(root:Node {name: '" + data.symptom + "', question: '" + data.question + "', type: '" + data.type + "'}) return ID(root)";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.createAndInitConversation = createAndInitConversation;
function getNextParent(currentParentId, name) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        console.log(name);
        var cypher = "MATCH (n:Node )-[r:hasChild]-(c:Node) where ID(n) = " + currentParentId + " and c.name = '" + name + "' " +
            " RETURN ID(c)";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.getNextParent = getNextParent;
function addChild(idParent, data) {
    return new Promise(function (resolve, reject) {
        var session = driver.session();
        var cypher = "MATCH (n:Node ) " +
            " where ID(n)=" + idParent +
            " CREATE (c:Node {name: '" + data.symptom + "', question:'" + data.question + "', type:'" + data.type + "'})" +
            " CREATE (n)-[r:hasChild]->(c)" +
            " RETURN n, c";
        var res = session.run(cypher);
        res.then(function (r) {
            session.close();
            resolve(r);
        }).catch(function (e) {
            console.log('err ' + e);
            reject('err');
        });
    });
}
exports.addChild = addChild;
