/*const firstJob = () => {
    return new Promise((res, rej) => {
        setTimeout(() => res("Hello World"), 2000);
    });
}

firstJob()
.then((str) => console.log(str))
.catch((err) => console.log(err));

const test1 = async () => {
    try {
        const res = await firstJob();
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}
test1();

//2
const secoundJob = () => {
    return new Promise((res, rej) => {
        setTimeout(() => rej("errr"), 3000);
    });
}

secoundJob()
.then((str) => console.log(str))
.catch((err) => console.log(err));

const test2 = async () => {
    try {
        const res = await secoundJob();
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}
test2();

//3
const thirdJob = (data) => {
    return new Promise((res, rej) => {
        if (typeof data != 'number') rej('error');
        if (data % 2 == 1) setTimeout(() => res("odd"), 1000);
        else setTimeout(() => rej("even"), 2000);
    });
}

thirdJob(10)
.then((str) => console.log(str))
.catch((err) => console.log(err));

const test3 = async () => {
    try {
        const res = await thirdJob("12");
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}
test3();
*/
//4
/*const {v4} = require('uuid');

const createOrder = (numCard) => {
    return new Promise((res,rej) => {
        if (!validateCard(numCard)) rej("Card is not valid");
        const uuid = v4();
        setTimeout(() => {
            res(uuid)
        }, 5000)
    })
}

const validateCard = (numCard) => {
    console.log("Card number:" + Number(numCard).toString().replace(/\d{4}(?=\d)/g, '$& '));
    return Boolean(Math.round(Math.random()));
}

const proceedToPayment = (uuid) => {
    return new Promise((res,rej) => {
        console.log("Order ID:" + uuid);
        const b = Boolean(Math.round(Math.random()));
        if (b) res("Payment successful")
        rej("Payment Failed")
})
}

createOrder(123456789123456)
.then( (result)=> {
    return proceedToPayment(result)
})
.then((payRes) => {
    console.log(payRes)
})
.catch((error) => {
    console.log(error);
})
.finally(() => {
    test4();
})

const test4 = async () => {
    try {
        const res = await createOrder(123456789123456);
        const pay = await proceedToPayment(res);
        console.log(pay);
    } catch (error) {
        console.log(error);
    }
}*/

//5 
/*const sq = (num) => new Promise((res, rej) => {
    if (Number.isInteger(num)) res(Math.pow(num, 2))
    rej("NaN")
})
const cub = (num) => new Promise((res, rej) => {
    if (Number.isInteger(num)) res(Math.pow(num, 3))
    rej("NaN")
})
const fop = (num) => new Promise((res, rej) => {
    if (Number.isInteger(num)) res(Math.pow(num, 4))
    rej("NaN")
})

Promise.all([sq(2), cub(2), fop(2)])
.then((res) => {
    console.log(res);
})
.catch((err)=> {
    console.log(err)
})*/

//6
/*const sq = (num) => new Promise((res, rej) => {
    if (Number.isInteger(num)) setTimeout(() => res(Math.pow(num, 2)), 1200);
    else rej("NaN")
})
const cub = (num) => new Promise((res, rej) => {
    if (Number.isInteger(num)) setTimeout(() => res(Math.pow(num, 3)), 700)
    else rej("NaN")
})
const fop = (num) => new Promise((res, rej) => {
    if (Number.isInteger(num)) setTimeout(() => res(Math.pow(num, 4)), 800)
    else rej("NaN")
})

Promise.race([sq(2), cub('2'), fop(2)])
.then((res) => {
    console.log(res);
})
.catch((err)=> {
    console.log(err)
})

Promise.any([sq(2), cub('2'), fop(2)])
.then((res) => {
    console.log(res);
})
.catch((err)=> {
    console.log(err)
})*/

function f1() {
    console.log('f1');
}

function f2() {
    console.log('f2');
}

function f3() {
    console.log('f3');
}

function main() {
    console.log('main');

    setTimeout(f1, 50);
    setTimeout(f3, 30);

    new Promise((res, rej) => {
        res('I am a Promise, right after f1 and f3! Really?')
    }).then(resolve => console.log(resolve))

    new Promise((res, rej) => {
        res('I am a Promise after Promise!')
    }).then(resolve => console.log(resolve))

    f2()
}

main();