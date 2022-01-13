const calcular = (query) => {
    console.log("mensage",query.cant)
    let total
    (query.cant)? total=query.cant:  total=1000;
    console.log(total)
    let arrnum = []
    let arraux = []
    for (let i = 0; i < total; i++) {
        arrnum[i] = Math.floor(Math.random() * (total - 1)) + 1;
        arraux[i] = 0;
    }

    function logArrayElements(element, index, arrnum) {
        for (let i = 0; i < total; i++) {
            if (element === i) {
                arraux[i]++
            }
        }
        //console.log("[" + index + "] = " + element);
        // console.log(arrOrdenado[index])
    }
    arrnum.forEach(logArrayElements)
    const obj = Object.assign({}, arraux);

    Object.filter = function (mainObject, filterFunction) {
        return Object.keys(mainObject)
            .filter(function (ObjectKey) {
                return filterFunction(mainObject[ObjectKey])
            })
            .reduce(function (result, ObjectKey) {
                result[ObjectKey] = mainObject[ObjectKey];
                return result;
            }, {});
    }
    var objReducido = Object.filter(obj, function (obj) {
        return obj != 0;
    });


    return objReducido
}

process.on("message", (message) => {
        console.log("Calculo", message)
        let sum = calcular(message);
        process.send(sum);
});