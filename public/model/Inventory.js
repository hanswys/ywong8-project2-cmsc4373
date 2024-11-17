export class Inventory{
    constructor(data, docId){
        this.title = data.title;
        this.uid = data.uid;
        this.quantity = data.quantity;
        this.createdBy = data.createdBy; 
        this.timestamp = data.timestamp;
        this.docId = docId;
    }

    set_docId(id){
        this.docId = id;
    }

    toFirestore(){
        return {
            title: this.title,
            uid: this.uid,
            quantity: this.quantity,
            createdBy: this.createdBy,
            timestamp: this.timestamp,
        };
    }
}