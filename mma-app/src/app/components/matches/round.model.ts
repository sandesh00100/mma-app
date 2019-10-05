export class Round {
    public roundNumber: number;
    public roundMap: Map<String,{
        value:string, 
        isShared:boolean, 
        min:number,
        max:number|undefined
    }>;

    constructor(roundNumber:number) {
        this.roundNumber = roundNumber;
        this.roundMap = new Map<String,{
            value:string, 
            isShared:boolean, 
            min:number,
            max:number|undefined
        }>();
        this.addDefaultStats();

    }
    
    public addNewStat(statName: string, isShared:boolean, initialValue: any, min: number, max?:number){
        this.roundMap.set(statName,{
            value: initialValue,
            isShared: isShared,
            min:min,
            max:max
        });
    }
    
    public updateValue(statName: string, value: any) {
       const statObj = this.roundMap.get(statName);
        if (statObj != null){
            this.roundMap.set(statName, value);
       } else {
           throw new ReferenceError("Stat doesn't exist.");
       }
    }

    public addDefaultStats(){
        // TODO: need to add input validation on Score so user can't input more than 10
        this.addNewStat('Score', false, 0, 0, 10);
        this.addNewStat('Takedown Attempts', false , 0, 0);
        this.addNewStat('Submission Attempts', false, 0, 0);
        this.addNewStat('Octagon Control', true, .5, 0, 1);
        this.addNewStat('Damage Ratio', true, .5, 0, 1);
        this.addNewStat('Significant Strikes', false, 0, 0);
    }
}