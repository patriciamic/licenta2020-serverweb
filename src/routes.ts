import Koa from 'koa';
import * as db from '../dbneo';

export async function testGet(ctx: Koa.Context) {
    try {
        console.log('test get');
        ctx.body = { data: 'test get' };
    } catch (e) {
        ctx.throw(e.status || 500, { message: e.message || e });
    }
}

export async function testPost(ctx: Koa.Context) {
    try {
        console.log('test post');
        ctx.body = { data: 'test post' };
    } catch (e) {
        ctx.throw(e.status || 500, { message: e.message || e });
    }
}


export async function message(ctx: Koa.Context) {
    try {
        const dateArrived = (new Date()).getMilliseconds();
        console.log('message POST body ' + JSON.stringify(ctx.request.body));
        const body = ctx.request.body;
        await db.stepOne(body.id, body.text);
        const res = await db.stepTwo(body.id);
        console.log("Message send " +  ((new Date()).getMilliseconds() - dateArrived));
        ctx.body = res;
    } catch (e) {
        ctx.throw(e.status || 500, { message: e.message || e });
    }
}

export async function signIn(ctx: Koa.Context) {
    const body = ctx.request.body;
    if (body.from == "android") {
        try {
            let res = (await db.signIn(Number(body.code))).records[0]._fields[0]
            let obj = {
                ok: true,
                name: res.properties.name
            }
            ctx.body = obj
        } catch (e) {
            let obj = {
                ok: false,
            }
            ctx.body = obj;
        }
    }
}

export async function saveUserCode(ctx: Koa.Context) {
    const body = ctx.request.body;
    if (body.from == "android") {
        try {
            let res = (await db.signIn(Number(body.code))).records[0]._fields[0]
            let obj = {
                ok: true,
                name: res.properties.name
            }
            ctx.body = obj
        } catch (e) {
            let obj = {
                ok: false,
            }
            ctx.body = obj;
        }
    }
}


export async function getConversationStructure(ctx: Koa.Context) {
    try {
        let userCode = ctx.params.userCode
        console.log('getConversationStructure for ', userCode);

        //get conversation type and root
        const conversation = (await db.getTreeHeads(userCode)).records;
        let filteredKeysAndFields: { keys: any; fields: any; }[] = [];
        const conv = getConversation(conversation, filteredKeysAndFields);

        // get tree based on root
        let root = filteredKeysAndFields[0].fields[2].properties;
        root.identity = filteredKeysAndFields[0].fields[2].identity.low;

        let filteredFields: any = await getTree(root);

        const result = {
            conversation: conv,
            root: root,
            tree: filteredFields
        };

        ctx.body = result;

    } catch (e) {
        ctx.throw(e.status || 500, { message: e.message || e });
    }

    async function getTree(root: any) {
        const tree = (await db.getAllNodesForRoot(root)).records;
        let filteredFields: any = [];
        tree.forEach((element: any) => {
            let arr: any = [];
            element._fields.forEach((field: any) => {
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
        return filteredFields;
    }

    function getConversation(conversation: any, filteredKeysAndFields: { keys: any; fields: any; }[]) {
        conversation.forEach((element: any) => {
            filteredKeysAndFields.push({ keys: element.keys, fields: element._fields });
        });
        const conv = {
            label: filteredKeysAndFields[0].fields[0].labels[0],
            properties: filteredKeysAndFields[0].fields[0].properties,
            identity: filteredKeysAndFields[0].fields[0].identity.low
        };
        return conv;
    }
}

export async function saveConversation(ctx: Koa.Context) {
    const body = ctx.request.body;
    if (body.from == "android") {
        let userCode = ctx.params.userCode
        let list = JSON.parse(body.conversation)
        let firstNode = (await db.saveConversation(userCode, body.localDateTime, list)).records[0]._fields[0]

        for (let i = 1; i < list.length; i++) {
            let secondNode = (await db.saveNextSentence(userCode, firstNode.properties, list[i])).records[0]._fields[0]
            firstNode = secondNode
        }
    }
    ctx.body = "done"
}



export async function addTreatment(ctx: Koa.Context) {
    console.log('addTreatment')
    const body = ctx.request.body;
    let treatmentId = (await db.createTreatment(body.patient, body.drug, body.treatment)).records[0]._fields[0].low
    body.treatment.listHoursAndMinutes.forEach(async (element: any) => {
        await db.addHoursAndMinutesToTreatment(treatmentId, element)
    });
    ctx.body = 'done'
}


export async function getAllDrugs(ctx: Koa.Context) {
    let records = (await db.getAllDrugs()).records
    let response: any = []
    records.forEach((element: any) => {
        let obj = {
            identity: element._fields[0].low,
            name: element._fields[1]
        }
        response.push(obj)
    });

    console.log(response)
    ctx.body = response
}


export async function getAllDiseases(ctx: Koa.Context) {
    let records = (await db.getAllDiseases()).records
    let response: any = []
    records.forEach((element: any) => {
        let obj = {
            identity: element._fields[0].low,
            name: element._fields[1]
        }
        response.push(obj)
    });

    console.log(response)
    ctx.body = response
}

export async function getTreatment(ctx: Koa.Context) {
    const body = ctx.request.body
    if (body.from == "android") { //get med by user code
        let res = (await db.getTreatmentByCode(body.code)).records
        let map = getMapStructure(res)
        let array : any =  []
        map.forEach(element => {
           array.push(element) 
        });
        console.log(array)
        ctx.body = array
    } else {
        //get med by user id
        console.log('getTreatment web', ctx.params.id)
        let res = (await db.getTreatmentById(ctx.params.id)).records
        let map = getMapStructure(res)
        let array : any =  []
        map.forEach(element => {
           array.push(element) 
        });
        console.log(array)
        ctx.body = array
        // ctx.body = { data: "hello web client"}
    }

    function getMapStructure(res: any) {
        let mp = new Map();
        res.forEach((element: any) => {
            let treatment = element._fields[0];
            let drug = element._fields[1];
            let obj = {
                
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
        mp.forEach((obj: any) => {
            res.forEach((record: any) => {
                let treatment = record._fields[0];
                let hoursAndMinutes = record._fields[2];
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
}

export async function getPatients(ctx: Koa.Context) {
    console.log('getPatients')
    let records = (await db.GetPatients(ctx.params.id)).records
    let map = new Map()
    let setDiseases = new Set();
    let setMedication = new Set();
    records.forEach((record:any) => {
        let patientId = record._fields[0].identity.low
        console.log(record._fields[0].properties)
        let obj = {
            patient:{
                id: patientId,
                name: record._fields[0].properties.name,
                phoneNumber: record._fields[0].properties.phoneNumber,
                address: record._fields[0].properties.Address,
                birthDate: record._fields[0].properties.BirthDate,
            },
            diseases: [],
            medication: []
        }
        console.log(obj)
        map.set(patientId, obj)
    });

    //diseases & medication
    map.forEach((mapObject:any)=>{
        records.forEach((record:any) => {
            let idPatient = record._fields[0].identity.low
            if(mapObject.patient.id == idPatient){
                let disease = {
                    id: record._fields[1].identity.low, 
                    name: record._fields[1].properties.title
                }
                if(!find(disease, mapObject.diseases)){
                    mapObject.diseases.push(disease)
                }

                let drug = {
                    id: record._fields[3].identity.low, 
                    name: record._fields[3].properties.title
                }
                if(!find(drug, mapObject.medication)){
                    mapObject.medication.push(drug)
                }
            }
        });
    })

    function find(element: any , list: any[]){
        let found = false;
        list.forEach((item: any) =>{
                    if(item.id == element.id){
                        found = true;
                    }
        })
        return found;
    
    }
    let array : any =  []
    map.forEach(element => {
       array.push({
           patient: element.patient,
           diseases: element.diseases,
           medication: element.medication
       }) 
    });
    ctx.body = array
}



export async function getConversation(ctx: Koa.Context) {

    let patientId = ctx.params.id;
    let conversastionStartList = (await db.getConversationsRoots(patientId)).records

    let filteredStartInfoList: any = getFilteredInfo(conversastionStartList);

    for(let i=0;i <filteredStartInfoList.length; i++){
        let convList = (await db.getConversationByRoot(filteredStartInfoList[i].root.id)).records
        let filteredFields: any = [];
        filteredFields.push(filteredStartInfoList[i].root)
        convList.forEach((element: any) => {
            let obj =  {
                id: element._fields[1].identity.low,
                properties: element._fields[1].properties
            }
           filteredFields.push(obj)
        });

        filteredStartInfoList[i].conversation = filteredFields;
    }
    ctx.body = filteredStartInfoList
    //TODO fix it
}

function getFilteredInfo(conversastionStartList: any) {
    let list: any = [];
    conversastionStartList.forEach((element: any) => {
        let obj = {
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

export async function getConversations(ctx: Koa.Context) {
    let conv = (await db.getConversations()).records
    const list : any =  [];

    conv.forEach((element:any) => {
        const obj = {
            id: element._fields[0].identity.low,
            name: element._fields[0].properties.name
        }
        list.push(obj);
    });

    ctx.body = list
}

export async function associateConversationToPatient(ctx: Koa.Context) {
    const idPatient = ctx.request.body.idPatient;
    const idConversation = ctx.request.body.idConversation;
    console.log(idPatient, idConversation);
    await db.deleteCurrentRelationForPatientWhichHasConversation(idPatient);
    await db.addNewConversationRelationForPatient(idPatient, idConversation);
    ctx.body = { response: 'done'};
}

export async function addPatient(ctx: Koa.Context) {
   console.log(ctx.request.body)
   const data = ctx.request.body;
   let idPatient = (await db.addPatient(data.patient)).records[0]._fields[0].low;
   const idDisease = data.diseases[0].identity;
   await db.AddDiseaseRelationToPatient(idPatient, idDisease);

   let med = data.medication[0];
   const drugId = med.identity;
   console.log(med.listHourAndMinutes);
   const obj = { patient: idPatient,
    drug: med.drug.identity,
    treatment: {
             timesADay:med.timesPerDay,
             daysInterval: med.daysInterval,
             start: med.startDate,
             stop: med.StopDate,
             listHoursAndMinutes:[] as any
         }
    }

    med.listHourAndMinutes.forEach((element:any) => {
        const hm = {
            hour: Number(element.split(':')[0]),
            minutes:Number(element.split(':')[1])
        }
        obj.treatment.listHoursAndMinutes.push(hm)
    });

    const body = obj;
    console.log(body);
    let treatmentId = (await db.createTreatment(body.patient, body.drug, body.treatment)).records[0]._fields[0].low
    body.treatment.listHoursAndMinutes.forEach(async (element: any) => {
        await db.addHoursAndMinutesToTreatment(treatmentId, element)
    });
   
    ctx.body = { response: 'done'};
}


export async function addConversation(ctx: Koa.Context) {
    console.log(ctx.request.body);
    const data = ctx.request.body;
    let currentParentId = (await db.createAndInitConversation(data.name, data.tree[0].properties)).records[0]._fields[0].low;
    console.log(currentParentId);
    
    for (let i=1; i< data.tree.length; i+=3){
            const children = getChildrenFor(data.tree, data.tree[i].parent.id) as any;
            console.log(children);
            for(let j=0; j< children.length; j++){
                await db.addChild(currentParentId, children[j].properties);
            }
            currentParentId = (await db.getNextParent(currentParentId, data.tree[i].properties.symptom)).records[0]._fields[0].low;
    }

    ctx.body = { response: 'done'};
}


function getChildrenFor(list:[], id:Number) {
    const copyList = list.filter((e:any)=> { if(e.parent != null ) return e.parent.id == id});
    return copyList;
}






