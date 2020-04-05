export function flatObjectsAreEqual(object1, object2): boolean{
    if (Object.keys(object1).length != Object.keys(object2).length){
        return false;
    }
    for (const key in object1){
        if (object2[key] != object1[key]){
            return false;
        }
    }
    return true;
}