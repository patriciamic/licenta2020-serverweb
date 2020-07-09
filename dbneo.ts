import * as neo4j from 'neo4j-driver';

var driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', '3333')
);

export async function stepOne(id: string, text: string) {
  return new Promise<string>((resolve, reject) => {
    var session = driver.session();
    let cypher = 'CALL ga.nlp.annotate({text:"' + text + '", id:"' + id + '", pipeline:"mypipeline", checkLanguage:false}) ' +
      'YIELD result ' +
      'RETURN result';

    let res = session.run(cypher);

    res.then(r => {
      let record = (r.records[0] as any)._fields[0];
      session.close();
      resolve(record.labels[1]);
    }).catch(e => {
      console.log('err step one' + e);
      reject('err');
    });
  });
}

export async function stepTwo(id: string) {
  const idModified = id + "_0";
  return new Promise<string>((resolve, reject) => {

    var session = driver.session();
    let cypher = 'MATCH(n) where n.id = "' + idModified + '" return n';
    let res = session.run(cypher);

    res.then(r => {
      let record = (r.records[0] as any)._fields[0];
      console.log('text: ' + record.properties.text + ' is ' + record.labels[1]);
      session.close();
      resolve(record.labels[1]);
    }).catch(e => {
      console.log('err step two ' + e);
      reject('err');
    });
  });
}

export function signIn(myCode: Number) {
  console.log("arrived in signIn db ", myCode);
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = 'Match(p:Patient) where p.code =' + myCode + ' return p';
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err sign in ' + e);
      reject('err');
    });
  });
}

export async function getSymptomsRelations() {
  console.log("arrived in getSymptomsRelations ");
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = 'MATCH (fromSymptom:Symptom )-[relation:imply]-(toSymptom:Symptom) RETURN fromSymptom,relation,toSymptom';
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err get symptom ' + e);
      reject('err');
    });
  });
}


export async function getTreeHeads(userCode: Number) {
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = 'MATCH (n:Patient )-[r:hasConversation]-(c:Conversation)-[relation:hasRootConversation]-(node:Node) where n.code =' + userCode 
    + ' RETURN c, relation, node';
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      reject('err');
    });
  });
}

export async function getAllNodesForRoot(root: any) {
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = 'MATCH p=(a:Node {name: "' + root.name + '"})-[:hasChild*1..]->(otherThing) '
      + 'WITH nodes(p) as nodes '
      + 'RETURN nodes[size(nodes)-2] as Parent, '
      + 'nodes[size(nodes)-1] as Child;';

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      reject(e);
    });
  });
}

export function saveConversation(myCode: Number, dateTime: any, list: any) {

  return new Promise<any>((resolve, reject) => {

    var session = driver.session();
    let cypher = "Match(p:Patient) where p.code =" + myCode +
      "\n CREATE (a:StoredConversation {dateTime: '" + dateTime + "'}) " +
      "\n CREATE(n:ConversationSentence {question: '" + list[0].question 
      + "', answer: '" + list[0].answer 
      + "', type: '" + list[0].type + "'}) " +
      "\n CREATE (p)-[r:hasStoredConversation { name: 'patient->storedConversation'}]->(a) " +
      "\n CREATE (a)-[rel:hasNextSentence { name: 'question->answer'}]->(n) " +
      "\n RETURN n"
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}

export function saveNextSentence(myCode: Number, firstNode: any, secondNode: any) {

  return new Promise<any>((resolve, reject) => {

    var session = driver.session();
    let cypher = "Match(p:Patient), (firstNode:ConversationSentence) " +
      "\n where p.code = " + myCode +
      "\n and firstNode.question = '" + firstNode.question + "'" +
      "\n and firstNode.answer = '" + firstNode.answer + "'" +
      "\n and firstNode.type = '" + firstNode.type + "'" +
      "\n CREATE(secondNode:ConversationSentence {question: '" + secondNode.question 
      + "', answer: '" + secondNode.answer 
      + "', type: '" + secondNode.type + "'})" +
      "\n CREATE (firstNode)-[rel:hasNextSentence { name: 'question->answer'}]->(secondNode)" +
      "\n RETURN secondNode";

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject(e);
    });
  });
}


export function getRootByDateTime(username: any, dateTime: any) {

  return new Promise<any>((resolve, reject) => {

    var session = driver.session();
    let cypher = "Match(p:Patient),(c:StoredConversation)-[r:hasNextSentence]-(cs:ConversationSentence) " +
      " where p.code = " + username + " and c.dateTime >= '" + dateTime + "' " +
      " RETURN cs"
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}


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

export function getConversation(id: any) {

  return new Promise<any>((resolve, reject) => {

    var session = driver.session();
    let cypher = "Match(p:Patient)-[:hasStoredConversation]->(c:StoredConversation) Match (c)-[r:hasNextSentence]-(cs:ConversationSentence) " +
      " where ID(p) = " + id  +
      " RETURN c, cs"
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}

export function getAllDrugs() {

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "Match(drug:Drug) return ID(drug)as identity, drug.title as name";

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}

export function getAllDiseases() {

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "Match(d:Disease) return ID(d)as identity, d.title as name";

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}

export function createTreatment(patientId: any, drugId: any, treatment: any) {

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "MATCH(p:Patient), (d:Drug) where ID(p) = " + patientId + " and ID(d) = " + drugId
      + " CREATE(t:Treatment {timesADay:" + treatment.timesADay
      + ", daysInterval: " + treatment.daysInterval
      + ", start: '" + treatment.start
      + "', stop: '" + treatment.stop
      + "'}) CREATE (p)-[r:hasTreatment { name: ID(p) +'->'+ID(t)}]->(t)"
      + "  CREATE (t)-[rel:hasDrug { name: ID(t) +'->'+ID(d)}]->(d)"
      + " return ID(t)";

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}

export function addHoursAndMinutesToTreatment(treatmentId: any, element: any) {

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher =
      " MATCH (t:Treatment)" +
      " WHERE ID(t) =" + treatmentId +
      " Create (h:HoursAndMinutes {hour: " + element.hour + ", minutes: " + element.minutes + "})" +
      " CREATE (t)-[r:hasTime { name: ID(t) +'->'+ID(h)}]->(h)" +
      " RETURN type(r), r.name"


    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}


export function getTreatmentByCode(code:Number) {

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher =
    " MATCH (p:Patient {code:" + code +" })-[:hasTreatment]->(t:Treatment)-[:hasDrug]-(d:Drug)" + 
    " MATCH (t)-[:hasTime]-(h:HoursAndMinutes) return t as treatment, d as drug, h as hourAndMinutes"

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}

export function getTreatmentById(id:Number) {

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher =
    " MATCH (p:Patient)-[:hasTreatment]->(t:Treatment)-[:hasDrug]-(d:Drug)" + 
    " MATCH (t)-[:hasTime]-(h:HoursAndMinutes)  where ID(p) = " + id + " return t as treatment, d as drug, h as hourAndMinutes"

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}


export function GetPatients(id:Number) {

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "Match(patient:Patient)-[:hasDisease]->(disease:Disease)" + 
     " Match(patient)-[:hasTreatment]->(treatment:Treatment)" + 
     " Match(treatment)-[:hasDrug]->(drug:Drug)" + 
     " return patient, disease, treatment, drug";

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}


export function getConversationsRoots(id: Number){

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "  Match(p:Patient)-[:hasStoredConversation]-(sc:StoredConversation) MATCH(sc)-[:hasNextSentence]-(cs:ConversationSentence) where ID(p) = " +id+ " return sc,cs";

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}

export function getConversationByRoot(id: Number){

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "MATCH p=(a:ConversationSentence)-[:hasNextSentence*1..]->(otherThing) where ID(a) = " +id+ 
    " WITH nodes(p) as nodes " +
    " RETURN nodes[size(nodes)-2] as Parent, " +
          " nodes[size(nodes)-1] as Child;"
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}


export async function getConversations() {
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = 'Match(n:Conversation)return n'

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      reject(e);
    });
  });
}


export async function deleteCurrentRelationForPatientWhichHasConversation(idPatient:number) {
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = 'Match(p:Patient)-[r:hasConversation]-(c:Conversation) where ID(p)=' + idPatient +' delete r';
    let res = session.run(cypher);
    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      reject(e);
    });
  });
}


export async function addNewConversationRelationForPatient(idPatient:number, idConversation: number) {
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "MATCH (p:Patient),(c:Conversation)"
    + " WHERE ID(p)=" + idPatient +" and ID(c)=" + idConversation + 
    " CREATE (p)-[r:hasConversation { name: p.name +'->'+c.name}]->(c)" + 
    " RETURN type(r), r.name";
    let res = session.run(cypher);
    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      reject(e);
    });
  });
}

export async function addPatient(data:any) {
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "CREATE (p:Patient {name:'" + data.name 
    + "', Address: '"+ data.address 
    + "', BirthDate:'" + data.birthDate 
    + "', code:'none', phoneNumber:'" + data.phoneNumber 
    + "'}) return ID(p)";
    let res = session.run(cypher);
    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      reject(e);
    });
  });
}


export function AddDiseaseRelationToPatient(idPatient:Number, idDisease:Number) {

  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "MATCH (a:Patient),(b:Disease)" +
    " WHERE ID(a) = " + idPatient +" AND ID(b) =" + idDisease + 
    " CREATE (a)-[r:hasDisease { name: ID(a) +'->'+ID(b)}]->(b)" + 
    " RETURN type(r), r.name";

    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}

// CREATE (c:Conversation {name: 'AAA'})-[r:hasRootConversation { name: ID(c) +'->'+ID(root)}]->(root:Node {name: 'A', question: 'QA', type: 'positive'}) return ID(root)

export function createAndInitConversation(name:any, data: any) {
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "CREATE (c:Conversation {name: '" + name + "'})-[r:hasRootConversation { name: ID(c) +'->'+ID(root)}]->" + 
    "(root:Node {name: '" +data.symptom+ "', question: '"+data.question+"', type: '"+data.type+"'}) return ID(root)";
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}



export function getNextParent(currentParentId:any, name: any) {
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    console.log(name);
    let cypher = "MATCH (n:Node )-[r:hasChild]-(c:Node) where ID(n) = " + currentParentId + " and c.name = '"+name+"' " +
    " RETURN ID(c)";
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}


export function addChild(idParent:any, data: any) {
  return new Promise<any>((resolve, reject) => {
    var session = driver.session();
    let cypher = "MATCH (n:Node ) " + 
    " where ID(n)=" +  idParent +
    " CREATE (c:Node {name: '"+data.symptom+"', question:'"+data.question+"', type:'"+data.type+"'})" + 
    " CREATE (n)-[r:hasChild]->(c)" + 
    " RETURN n, c";
    let res = session.run(cypher);

    res.then(r => {
      session.close();
      resolve(r);
    }).catch(e => {
      console.log('err ' + e);
      reject('err');
    });
  });
}