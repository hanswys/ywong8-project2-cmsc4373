export class Inventory{
    constructor(data){
        if(!data) return;
        this.name = data.name;
        this.uid = data.uid;
        this.quantity = data.quantity;
        this.createdBy = data.createdBy; //email
        this.timestamp = data.timestamp;
    }

    set_docId(id){
        this.docId = id;
    }

    toFirestore(){
        return {
            name: this.name,
            uid: this.uid,
            quantity: this.quantity,
            createdBy: this.createdBy,
            timestamp: this.timestamp,
        };
    }
}