// STATE of PROCESS
const RUNNING = 0       // in CPU
const READY = 1         // in MM, but not in CPU (CPU WAIT/Queue)
const IO = 2            // executing in IO device
const IO_WAIT = 3       // in IO DEVICE QUEUE 
const DONE = 4          // terminated
const NOT_ARR = 5       // not yet arrived

const processGanttCellWidth = 20    // 20px

const stateCodeMap = ["RUNNING", "READY", "IO", "IO_WAIT", "DONE", "NOT_ARR"]
// note: IO device always used FIFO/FCFS


let noOfCols = 6;   // FOR INPUT TABLE, button column not included
let inputTableRows = document.getElementById("input").getElementsByTagName('tbody')[0]

// get data from INPUT table in array and object form
let inputData = []
let tableDataObj = {}


// dummy data
let dataP =
    [
        [1, 0, 1, 0],
        [4, 5, 1, 2],
        [4, 2, 1, 1],
        [3, 3, 1, 2]
    ]
let dataC = [1, 2, 3, 1]
let dataI = [0, 1, 1, 0]


// RUNNING is const (=0) but inside object it's not changing
// to 0, rather 'RUNNING'
let stateColMap = {
    RUNNING: 'cyan',
    0: 'cyan',
    READY: 'lightblue',
    1: 'lightblue',
    IO: 'purple',
    2: 'purple',
    IO_WAIT: 'violet',
    3: 'violet',
    DONE: 'yellowgreen',
    4: 'yellowgreen',
    NOT_ARR: 'gray',
    5: 'gray'
}

// let processColMap = ["#0a565c", "#5c0065", "#202055", "#c01000"]
let processColMap = ["darkgreen", "indigo", "maroon", "purple"]
let processColMapL = ["lightgreen", "lightblue", "salmon", "violet"]
let processColNull = 'gray'

let stateStringMap = {
    RUNNING: 'Running(CPU)',
    0: 'Running(CPU)',
    READY: 'waiting CPU queue',
    1: 'waiting CPU queue',
    IO: 'I/O scheduled',
    2: 'I/O scheduled',
    IO_WAIT: 'waiting I/O queue',
    3: 'waiting I/O queue',
    DONE: 'completed',
    4: 'completed',
    NOT_ARR: 'not yet arrived',
    5: 'not yet arrived'
}

// ---------FUNCTIONS------------

// ----- make/plot table : graphics functions------

function makeGP(schedulingPolicy = "FCFS", data = dataP) {
    let context = document.getElementById(schedulingPolicy)
    let table = context.querySelector(".process")


    let usedStateSet = new Set();

    // clearing table first
    table.textContent = ""

    // adding time (table header)
    let header = document.createElement("tr")
    header.appendChild(document.createElement("th"))
    for (let t = 1; t <= data[0].length; ++t) {
        let colHeader = document.createElement("th")
        colHeader.textContent = `${t}`
        header.appendChild(colHeader)
    }
    table.appendChild(header)

    // generating table
    data.map((row, pno) => {
        pno++;
        let rowInTable = document.createElement('tr')

        let PnoElem = document.createElement('td')
        PnoElem.style.color = processColMap[pno - 1]
        PnoElem.textContent = `P${pno}`
        rowInTable.appendChild(PnoElem)

        row.map((entry) => {
            let entryElem = document.createElement('td')
            // entryElem.textContent = ' '
            entryElem.style.backgroundColor = stateColMap[entry]
            usedStateSet = usedStateSet.add(entry)

            rowInTable.appendChild(entryElem)
        })
        table.appendChild(rowInTable)
    })

    legendGP(usedStateSet, schedulingPolicy)
}

function legendGP(states, schedulingPolicy) {
    let context = document.getElementById(schedulingPolicy)
    let table = context.querySelector(".legend")


    let enterHere = table.querySelector("tr")
    enterHere.textContent = ''

    for (const state of states) {
        let colElem = document.createElement('td')
        let nameElem = document.createElement('td')

        colElem.style.width = `${processGanttCellWidth}px`
        colElem.style.backgroundColor = `${stateColMap[state]}`
        nameElem.textContent = stateStringMap[state]

        enterHere.appendChild(colElem)
        enterHere.appendChild(nameElem)
    }
    // console.log(states)
}

function makeGC(schedulingPolicy = "FCFS", data = dataC) {
    let context = document.getElementById(schedulingPolicy)
    let table = context.querySelector(".CPU")

    // clearing table first
    table.textContent = ""

    // adding time (table header)
    let header = document.createElement("tr")
    for (let t = 1; t <= data.length; ++t) {
        let colHeader = document.createElement("th")
        colHeader.textContent = `${t}`
        header.appendChild(colHeader)
    }
    table.appendChild(header)

    // generating table
    let rowInTable = document.createElement('tr')
    data.map((pno) => {
        let PnoElem = document.createElement('td')
        if (pno == null) {
            PnoElem.style.color = processColNull
            PnoElem.style.backgroundColor = processColNull
            PnoElem.textContent = `PX`
        } else {
            PnoElem.style.color = processColMap[pno - 1]
            PnoElem.style.backgroundColor = processColMapL[pno - 1]
            PnoElem.textContent = `P${pno}`
        }
        rowInTable.appendChild(PnoElem)
    })
    table.appendChild(rowInTable)

}



function makeGI(schedulingPolicy = "FCFS", data = dataI) {
    let context = document.getElementById(schedulingPolicy)
    let table = context.querySelector(".IO")

    // clearing table first
    table.textContent = ""

    // adding time (table header)
    let header = document.createElement("tr")
    for (let t = 1; t <= data.length; ++t) {
        let colHeader = document.createElement("th")
        colHeader.textContent = `${t}`
        header.appendChild(colHeader)
    }
    table.appendChild(header)

    // generating table
    let rowInTable = document.createElement('tr')
    data.map((pno) => {
        let PnoElem = document.createElement('td')
        if (pno == null) {
            PnoElem.style.color = processColNull
            PnoElem.style.backgroundColor = processColNull
            PnoElem.textContent = `PX`
        }
        else {
            PnoElem.style.color = processColMap[pno - 1]
            PnoElem.style.backgroundColor = processColMapL[pno - 1]
            PnoElem.textContent = `P${pno}`
        }
        rowInTable.appendChild(PnoElem)
    })
    table.appendChild(rowInTable)
}

// makeTable
function makeTT(schedulingPolicy, dataT) {
    let context = document.getElementById(schedulingPolicy)
    let table = context.querySelector(".output")

    let sTAt = 0, sWt = 0, sRt = 0

    let tBody = table.querySelector('tbody')
    //clearing
    tBody.textContent = ''
    // console.log(dataT)
    dataT.forEach((row, pno) => {
        let rowElem = document.createElement('tr')

        let pNoElem = document.createElement('td')
        let tTAElem = document.createElement('td')
        let tRElem = document.createElement('td')
        let tWElem = document.createElement('td')

        pNoElem.textContent = `P${pno + 1}`
        tTAElem.textContent = row[0]
        tRElem.textContent = row[1]
        tWElem.textContent = row[2]

        sWt += row[2]
        sRt += row[1]
        sTAt += row[0]

        rowElem.appendChild(pNoElem)
        rowElem.appendChild(tTAElem)
        rowElem.appendChild(tRElem)
        rowElem.appendChild(tWElem)

        tBody.appendChild(rowElem)
    })

    let tFoot = table.querySelector('tfoot > tr')
    let noOfProc = dataT.length

    // console.log(tFoot.children)
    let entries = [0, sTAt, sRt, sWt].map(x => x / noOfProc)

    for (let child = 1; child < 4; ++child) {
        let num = entries[child]
        tFoot.children[child].textContent = Math.round((num + Number.EPSILON) * 100) / 100
    }

}


// ---------------

// scheduling algo

function FCFS(tableData = tableDataObj) {
    let { arrTime: arrT, cpuBurst1: cpuB1, cpuBurst2: cpuB2, IOBurst: iob } = tableData

    // let PG = [], CG = [], IG = []

    // arrT.lenght = cpuB1.lenght = ... = iob.length = processWise.length
    let totalProcess = arrT.length
    let completedProcess = 0
    // let timeSlots = []
    let cpuQ = []
    let ioQ = []

    let dataCPU = []
    let dataIO = []


    // dataProcess is in the end after all computation


    let allProcessData = []
    let processState = []
    // let processCurState = arrT.map(() => NOT_ARR)

    for (let p_no = 1; p_no <= totalProcess; ++p_no) {
        allProcessData.push({
            pno: `${p_no}`,
            arrivalTime: arrT[p_no - 1],
            cpuB1rem: cpuB1[p_no - 1],
            ioBrem: iob[p_no - 1],
            cpuB2rem: cpuB2[p_no - 1],
            state: NOT_ARR,
            responsedAt: null,
            cpuUsed: 0,
            ioUsed: 0,
            completedAt: Infinity,
            lastIObN: 0,
            lastCPUbN: 0
        })
        // processState.push([])
    }

    // console.table(allProcessData)
    // console.log('state: ', processState)

    // console.log(processCurState)

    // initial step
    // let nextRunning = null
    let time = 0;



    for (const proc of allProcessData) {
        if (proc.arrivalTime == time) {
            // assuming first cpu burst is > 0
            proc.lastCPUbN++;
            cpuQ.push(proc.pno)
        }
    }

    // console.table(cpuQ)


    let isDataCPUinserted = false
    let isDataIOinserted = false
    // start looping
    while (completedProcess != totalProcess && time < 100) {
        isDataCPUinserted = false
        isDataIOinserted = false

        // console.log(`entry: @${time} cpuQ = `, JSON.stringify(cpuQ))
        for (let proc of allProcessData) {
            // check if process in cpuQ
            if (cpuQ.includes(proc.pno)) {
                // console.log(`>>> process${proc.pno} in cpuQ`)
                if (cpuQ[0] == proc.pno) {  // Q front
                    proc.state = RUNNING

                    proc.cpuUsed++;
                    if (proc.responsedAt == null)
                        proc.responsedAt = time;

                    dataCPU.push(proc.pno)
                    isDataCPUinserted = true;

                    if (proc.cpuB1rem == 0) proc.cpuB2rem--;
                    else proc.cpuB1rem--;

                } else {
                    proc.state = READY
                }
            }
            // check if procees in ioQ
            else if (ioQ.includes(proc.pno)) {
                // console.log(`>>> process${proc.pno} in ioQ`)

                if (ioQ[0] == proc.pno) { // io Q front
                    proc.state = IO;
                    proc.ioBrem--;
                    proc.ioUsed++

                    dataIO.push(proc.pno)
                    isDataIOinserted = true;

                } else {
                    proc.state = IO_WAIT
                }
            } else {
                // console.log(`>>> process${proc.pno} in NONE!`)
                // console.log("QUEUEs: cpu", cpuQ, "ioQ", ioQ)
            }

            // console.log(`P${proc.pno} ${stateCodeMap[parseInt(proc.state)]} @${time} rem: ${proc.cpuB1rem} ${proc.ioBrem} ${proc.cpuB2rem}`)
        }

        if (!isDataCPUinserted) dataCPU.push(null)
        if (!isDataIOinserted) dataIO.push(null)
        time++;

        // add data for table plotting here
        let addStateData = []
        for (let proc of allProcessData) {
            addStateData.push(stateCodeMap[proc.state])
        }

        // addStateData.push(cpuQ.toString())
        // addStateData.push(ioQ.toString())

        processState.push(addStateData)
        // console.log(`time: ${time}`, addStateData.map(x => x))


        // for next execution/iteration
        // done inside above loop: last if: check arrTime
        // NOOOOOOO . doing here:-
        // NO STATE CHANGE IS DONE HERE as time is not incremented
        //  (used in arrTIme).

        for (let proc of allProcessData) {
            if (proc.state == NOT_ARR && proc.arrivalTime == time) {
                // assuming first cpu burst is > 0
                proc.lastCPUbN++
                cpuQ.push(proc.pno)
            }
        }

        for (let proc of allProcessData) {

            if (proc.state != DONE) {
                // checking if any process arrived now


                if (proc.state == RUNNING && proc.cpuB1rem == 0 && proc.lastCPUbN == 1) {
                    cpuQ.shift();

                    if (proc.ioBrem > 0) {
                        ioQ.push(proc.pno)
                        proc.lastIObN++
                        proc.state = IO_WAIT
                    }
                    else {
                        proc.state = DONE
                        completedProcess++;
                    }
                    // console.table(cpuQ)
                } else if (proc.state == IO && proc.ioBrem == 0 && proc.lastIObN == 1) {
                    ioQ.shift(proc.pno)

                    let { cpuB2rem: time } = proc
                    if (time > 0) {
                        proc.lastCPUbN++
                        cpuQ.push(proc.pno)
                        proc.state = READY
                    } else {
                        proc.state = DONE
                        completedProcess++;
                    }
                    // console.table(cpuQ)
                }
                else if (proc.state == RUNNING && proc.cpuB2rem == 0 && proc.lastCPUbN == 2) {
                    cpuQ.shift();
                    proc.state = DONE;
                    proc.completedAt = time;
                    proc.lastIObN++
                    // console.log(`@${time}`, proc.state, proc.pno)
                    completedProcess++;

                }


            } else {
                // console.log("done", proc)
            }


        }

    }


    // console.table(processState)
    // making array from this data: 
    let dataProcess = []
    for (let i = 0; i < totalProcess; ++i)    dataProcess.push([])

    processState.forEach((pdata) => {
        dataProcess.forEach((proC, i) => proC.push(pdata[i]))
    })

    // console.table(dataProcess)

    let dataTime = []
    for (let proc of allProcessData) {
        // order: turnaroundTime, responseTime, waitingTime
        dataTime.push([
            proc.completedAt - proc.arrivalTime,
            proc.responsedAt - proc.arrivalTime,
            (proc.completedAt - proc.arrivalTime) - proc.cpuUsed - proc.ioUsed
        ])
    }

    // plotting Gantt charts
    makeGP("FCFS", dataProcess)
    makeGC("FCFS", dataCPU)
    makeGI("FCFS", dataIO)

    // making time-table
    makeTT("FCFS", dataTime)
}

function SJF(tableData = tableDataObj) {
    let { arrTime: arrT, cpuBurst1: cpuB1, cpuBurst2: cpuB2, IOBurst: iob } = tableData

    // let PG = [], CG = [], IG = []

    // arrT.lenght = cpuB1.lenght = ... = iob.length = processWise.length
    let totalProcess = arrT.length
    let completedProcess = 0
    // let timeSlots = []
    // in this cpuQ is an object
    // with {proN(str), timeRemaing(const int), curState}
    let cpuQ = []

    // Q would always be same : FIFO
    let ioQ = []

    let dataCPU = []
    let dataIO = []


    // dataProcess is in the end after all computation


    let allProcessData = []
    let processState = []
    // let processCurState = arrT.map(() => NOT_ARR)

    for (let p_no = 1; p_no <= totalProcess; ++p_no) {
        allProcessData.push({
            pno: `${p_no}`,
            arrivalTime: arrT[p_no - 1],
            cpuB1rem: cpuB1[p_no - 1],
            ioBrem: iob[p_no - 1],
            cpuB2rem: cpuB2[p_no - 1],
            state: NOT_ARR,
            responsedAt: null,
            cpuUsed: 0,
            ioUsed: 0,
            completedAt: Infinity,
            lastIObN: 0,
            lastCPUbN: 0
        })
        // processState.push([])
    }

    // console.table(allProcessData)
    // console.log('state: ', processState)

    // console.log(processCurState)

    // initial step
    // let nextRunning = null
    let time = 0;

    const sortCpuQ = (cQ) => {
        const len = cQ.length;
        let runningStateIndex = 0;
        // moving running state to top
        for (let i = 0; i < len; ++i) {
            if (cQ[i].state == RUNNING) {
                [cQ[runningStateIndex], cQ[i]] =
                    [cQ[i], cQ[runningStateIndex]]
                runningStateIndex++;
            }
        }

        if (runningStateIndex > 1) {
            alert('more than one process running')
        }

        // console.log(`runningStateIndex = ${runningStateIndex} len = ${len}`)
        // console.table(cpuQ.slice(runningStateIndex, len))

        // sorting rest [ insertion sort]
        for (let i = runningStateIndex; i < len; ++i) {
            let j = i - 1
            let insertedElem = cQ[i]
            for (; j >= runningStateIndex; --j) {
                if (cQ[j].time > insertedElem.time) {
                    cQ[j + 1] = cQ[j]
                } else break;
            }

            cQ[j + 1] = insertedElem
            // console.log(`i = ${i} j = ${j} insertedElem = `, insertedElem)
            // console.table(cpuQ.slice(runningStateIndex, len))
        }
        // console.table(cpuQ)
    }

    for (const proc of allProcessData) {
        if (proc.arrivalTime == time) {
            // assuming first cpu burst is > 0
            let { pno: pno, cpuB1rem: time, state: state } = proc
            // console.table(pno, time, state)
            cpuQ.push({ pno, time, state })
            proc.lastCPUbN++;
        }
    }


    // console.table(cpuQ)
    sortCpuQ(cpuQ)
    // console.table(cpuQ)
    // console.log('--------------------------')

    let cpuQpnoOnly = new Set()
    for (const proc of cpuQ) cpuQpnoOnly.add(proc.pno)

    let isDataCPUinserted = false
    let isDataIOinserted = false


    // for debugging purpose
    let logInNextItr = false

    // UNCOMMENT_SFJ
    // console.log(`INIT\n@${time} before comp cpuQ = `)
    // console.table(cpuQ)
    // console.log('allProcessData')
    // console.table(allProcessData)

    // start looping
    while (completedProcess != totalProcess && time < 30) {
        isDataCPUinserted = false
        isDataIOinserted = false

        // console.log(`On entry: time = ${time}`)
        // console.table(cpuQ)

        if (logInNextItr) {
            // console.log('time = ', time, 'cpuQpnoOnly', cpuQpnoOnly)
            // console.table(allProcessData)
        }
        for (let proc of allProcessData) {
            // check if process in cpuQ

            if (cpuQpnoOnly.has(proc.pno)) {
                // console.log(`>>> process${proc.pno} in cpuQ`)
                // console.log(time, cpuQ[0].pno)
                if (cpuQ[0].pno == proc.pno) {  // Q front
                    proc.state = RUNNING

                    cpuQ[0].state = RUNNING

                    proc.cpuUsed++;
                    if (proc.responsedAt == null)
                        proc.responsedAt = time;

                    dataCPU.push(proc.pno)
                    isDataCPUinserted = true;

                    if (proc.cpuB1rem == 0) proc.cpuB2rem--;
                    else proc.cpuB1rem--;

                } else {
                    proc.state = READY
                }
            }
            // check if procees in ioQ
            else if (ioQ.includes(proc.pno)) {
                // console.log(`>>> process${proc.pno} in ioQ`)

                if (ioQ[0] == proc.pno) { // io Q front
                    proc.state = IO;
                    proc.ioBrem--;
                    proc.ioUsed++

                    dataIO.push(proc.pno)
                    isDataIOinserted = true;

                } else {
                    proc.state = IO_WAIT
                }
            } else {
                // console.log(`>>> process${proc.pno} in NONE!`)
                // console.log("QUEUEs: cpu", cpuQ, "ioQ", ioQ)
            }

            // console.log(`P${proc.pno} ${stateCodeMap[parseInt(proc.state)]} @${time} rem: ${proc.cpuB1rem} ${proc.ioBrem} ${proc.cpuB2rem}`)
        }

        if (!isDataCPUinserted) dataCPU.push(null)
        if (!isDataIOinserted) dataIO.push(null)
        time++;

        // add data for table plotting here
        let addStateData = []
        for (let proc of allProcessData) {
            addStateData.push(stateCodeMap[proc.state])
        }

        // addStateData.push(cpuQ.toString())
        // addStateData.push(ioQ.toString())

        processState.push(addStateData)
        // console.log(`time: ${time}`, addStateData.map(x => x))


        // for next execution/iteration
        // done inside above loop: last if: check arrTime
        // NOOOOOOO . doing here:-
        // NO STATE CHANGE IS DONE HERE as time is not incremented
        //  (used in arrTIme).

        logInNextItr = false    // for debugging
        // console.log(`!!! @${time} after comp cpuQ = `)
        // console.table(cpuQ)
        // console.log('cpuQpnoOnly = ', [...cpuQpnoOnly].join(','), 'allProcessData')
        // console.table(allProcessData)


        // adding @ arrivalTime
        for (let proc of allProcessData) {
            if (proc.state == NOT_ARR && proc.arrivalTime == time) {
                // assuming first cpu burst is > 0
                let { pno: pno, cpuB1rem: time, state: state } = proc
                cpuQ.push({ pno, time, state })
                cpuQpnoOnly.add(pno)
                proc.lastCPUbN++;
            }
        }

        // queue change/state change
        for (let proc of allProcessData) {

            if (proc.state != DONE) {
                if (proc.state == RUNNING && proc.cpuB1rem == 0 && proc.lastCPUbN == 1) {
                    cpuQ.shift();
                    cpuQpnoOnly.delete(proc.pno)

                    // sortCpuQ(cpuQ)

                    if (proc.ioBrem > 0) {
                        ioQ.push(proc.pno)
                        proc.state = IO_WAIT
                        proc.lastIObN++;
                    }
                    else {
                        proc.state = DONE
                        completedProcess++;
                    }
                    // console.log(`time = ${time}`, cpuQpnoOnly)
                    // console.table(cpuQ)
                } else if (proc.state == IO && proc.ioBrem == 0 && proc.lastIObN == 1) {
                    ioQ.shift(proc.pno)
                    let { pno: pno, cpuB2rem: time, state: state } = proc
                    if (time > 0) {
                        cpuQ.push({ pno, time, state })
                        cpuQpnoOnly.add(pno)
                        proc.state = READY
                        proc.lastCPUbN++;
                    } else {
                        proc.state = DONE
                        completedProcess++;
                    }

                    // console.table(cpuQ)
                }
                else if (proc.state == RUNNING && proc.cpuB2rem == 0 && proc.lastCPUbN == 2) {
                    cpuQ.shift();
                    proc.state = DONE;
                    proc.completedAt = time;
                    cpuQpnoOnly.delete(proc.pno)
                    // console.log(`@${time}`, proc.state, proc.pno)
                    completedProcess++;
                    proc.lastIObN++;
                    logInNextItr = true;

                }




                // checking if any process arrived now

                // sortCpuQ(cpuQ)
            } else {
                // console.log("done", proc)
            }


        }

        sortCpuQ(cpuQ)

    }


    // console.table(processState)
    // making array from this data: 
    let dataProcess = []
    for (let i = 0; i < totalProcess; ++i)    dataProcess.push([])

    processState.forEach((pdata) => {
        dataProcess.forEach((proC, i) => proC.push(pdata[i]))
    })

    // console.table(dataProcess)

    let dataTime = []
    for (let proc of allProcessData) {
        // order: turnaroundTime, responseTime, waitingTime
        dataTime.push([
            proc.completedAt - proc.arrivalTime,
            proc.responsedAt - proc.arrivalTime,
            (proc.completedAt - proc.arrivalTime) - proc.cpuUsed - proc.ioUsed
        ])
    }


    let schedulingPolicy = "SJF"
    // plotting Gantt charts
    makeGP(schedulingPolicy, dataProcess)
    makeGC(schedulingPolicy, dataCPU)
    makeGI(schedulingPolicy, dataIO)

    // making time-table
    makeTT(schedulingPolicy, dataTime)
}

function SRTF(tableData = tableDataObj) {
    let { arrTime: arrT, cpuBurst1: cpuB1, cpuBurst2: cpuB2, IOBurst: iob } = tableData


    let totalProcess = arrT.length
    let completedProcess = 0

    // in this cpuQ is an object
    // with {proN(str), timeRemaing(int, not const)}
    let cpuQ = []

    // Q would always be same : FIFO
    let ioQ = []

    let dataCPU = []
    let dataIO = []
    // dataProcess is in the end after all computation


    let allProcessData = []
    let processState = []

    for (let p_no = 1; p_no <= totalProcess; ++p_no) {
        allProcessData.push({
            pno: `${p_no}`,
            arrivalTime: arrT[p_no - 1],
            cpuB1rem: cpuB1[p_no - 1],
            ioBrem: iob[p_no - 1],
            cpuB2rem: cpuB2[p_no - 1],
            state: NOT_ARR,
            responsedAt: null,
            cpuUsed: 0,
            ioUsed: 0,
            completedAt: Infinity,
            lastIObN: 0,
            lastCPUbN: 0
        })
    }

    // console.table(allProcessData)
    // console.log('state: ', processState)

    // console.log(processCurState)

    // initial step
    let time = 0;

    const sortCpuQ = (cQ) => {
        const len = cQ.length;

        // sorting rest [ insertion sort]
        for (let i = 0; i < len; ++i) {
            let j = i - 1
            let insertedElem = cQ[i]
            for (; j >= 0; --j) {
                if (cQ[j].time > insertedElem.time) {
                    cQ[j + 1] = cQ[j]
                } else break;
            }
            cQ[j + 1] = insertedElem
        }
    }

    for (const proc of allProcessData) {
        if (proc.arrivalTime == time) {
            // assuming first cpu burst is > 0
            let { pno: pno, cpuB1rem: time } = proc
            // console.table(pno, time, state)
            cpuQ.push({ pno, time })
            proc.lastCPUbN++
        }
    }


    // console.table(cpuQ)
    sortCpuQ(cpuQ)
    // console.table(cpuQ)
    // console.log('--------------------------')

    let cpuQpnoOnly = new Set()
    for (const proc of cpuQ) cpuQpnoOnly.add(proc.pno)

    let isDataCPUinserted = false
    let isDataIOinserted = false


    // for debugging purpose
    let logInNextItr = false

    // start looping
    while (completedProcess != totalProcess && time < 30) {
        isDataCPUinserted = false
        isDataIOinserted = false

        // console.log(`On entry: time = ${time} cpuQpnoOnly = {${[...cpuQpnoOnly].join(',')}}`)
        // console.table(cpuQ)

        if (logInNextItr) {
            // console.log('time = ', time, 'cpuQpnoOnly', cpuQpnoOnly)
            // console.table(allProcessData)
        }
        for (let proc of allProcessData) {
            // check if process in cpuQ

            if (cpuQpnoOnly.has(proc.pno)) {
                // console.log(`>>> process${proc.pno} in cpuQ`)
                // console.log(time, cpuQ[0].pno)
                if (cpuQ[0].pno == proc.pno) {  // Q front
                    proc.state = RUNNING
                    proc.cpuUsed++;

                    cpuQ[0].time--;     // remaining time decreased

                    if (proc.responsedAt == null)
                        proc.responsedAt = time;

                    dataCPU.push(proc.pno)
                    isDataCPUinserted = true;

                    if (proc.cpuB1rem == 0) proc.cpuB2rem--;
                    else proc.cpuB1rem--;

                } else {
                    proc.state = READY
                }
            }
            // check if procees in ioQ
            else if (ioQ.includes(proc.pno)) {
                // console.log(`>>> process${proc.pno} in ioQ`)

                if (ioQ[0] == proc.pno) { // io Q front
                    proc.state = IO;
                    proc.ioBrem--;
                    proc.ioUsed++

                    dataIO.push(proc.pno)
                    isDataIOinserted = true;

                } else {
                    proc.state = IO_WAIT
                }
            } else {
                // console.log(`>>> process${proc.pno} in NONE!`)
                // console.log("QUEUEs: cpu", cpuQ, "ioQ", ioQ)
            }

            // console.log(`P${proc.pno} ${stateCodeMap[parseInt(proc.state)]} @${time} rem: ${proc.cpuB1rem} ${proc.ioBrem} ${proc.cpuB2rem}`)
        }

        if (!isDataCPUinserted) dataCPU.push(null)
        if (!isDataIOinserted) dataIO.push(null)
        time++;

        // add data for table plotting here
        let addStateData = []
        for (let proc of allProcessData) {
            addStateData.push(stateCodeMap[proc.state])
        }

        // addStateData.push(cpuQ.toString())
        // addStateData.push(ioQ.toString())

        processState.push(addStateData)
        // console.log(`time: ${time}`, addStateData.map(x => x))


        // adding @arrtime
        for (let proc of allProcessData) {
            // checking if any process arrived now
            if (proc.state == NOT_ARR && proc.arrivalTime == time) {
                // assuming first cpu burst is > 0
                let { pno: pno, cpuB1rem: time } = proc
                cpuQ.push({ pno, time })
                cpuQpnoOnly.add(proc.pno)
                proc.lastCPUbN++
            }
        }

        // for next execution/iteration
        logInNextItr = false    // for debugging
        for (let proc of allProcessData) {

            if (proc.state != DONE) {
                if (proc.state == RUNNING && proc.cpuB1rem == 0 && proc.lastCPUbN == 1) {
                    cpuQ.shift();
                    cpuQpnoOnly.delete(proc.pno)


                    if (proc.ioBrem > 0) {
                        ioQ.push(proc.pno)
                        proc.state = IO_WAIT
                        proc.lastIObN++;
                    }
                    else {
                        proc.state = DONE
                        completedProcess++;
                    }
                    // console.log(`time = ${time}`, cpuQpnoOnly)
                    // console.table(cpuQ)
                } else if (proc.state == IO && proc.ioBrem == 0 && proc.lastIObN == 1) {
                    ioQ.shift(proc.pno)
                    let { pno: pno, cpuB2rem: time } = proc
                    if (time > 0) {
                        cpuQ.push({ pno, time })
                        cpuQpnoOnly.add(pno)
                        proc.state = READY
                        proc.lastCPUbN++;
                    } else {
                        proc.state = DONE
                        completedProcess++;
                    }

                    // console.table(cpuQ)
                }
                else if (proc.state == RUNNING && proc.cpuB2rem == 0 && proc.lastCPUbN == 2) {
                    cpuQ.shift();
                    proc.state = DONE;
                    proc.completedAt = time;
                    cpuQpnoOnly.delete(proc.pno)
                    // console.log(`@${time}`, proc.state, proc.pno)
                    completedProcess++;
                    proc.lastIObN++;
                }



            } else {
                // console.log("done", proc)
            }


        }

        sortCpuQ(cpuQ)

    }


    // console.table(processState)
    // making array from this data: 
    let dataProcess = []
    for (let i = 0; i < totalProcess; ++i)    dataProcess.push([])

    processState.forEach((pdata) => {
        dataProcess.forEach((proC, i) => proC.push(pdata[i]))
    })

    // console.table(dataProcess)

    let dataTime = []
    for (let proc of allProcessData) {
        // order: turnaroundTime, responseTime, waitingTime
        dataTime.push([
            proc.completedAt - proc.arrivalTime,
            proc.responsedAt - proc.arrivalTime,
            (proc.completedAt - proc.arrivalTime) - proc.cpuUsed - proc.ioUsed
        ])
    }


    let schedulingPolicy = "SRTF"
    // plotting Gantt charts
    makeGP(schedulingPolicy, dataProcess)
    makeGC(schedulingPolicy, dataCPU)
    makeGI(schedulingPolicy, dataIO)

    // making time-table
    makeTT(schedulingPolicy, dataTime)
}

function PSNP(tableData = tableDataObj) {
    let { arrTime: arrT, cpuBurst1: cpuB1, cpuBurst2: cpuB2, IOBurst: iob, priority: prt } = tableData

    let totalProcess = arrT.length
    let completedProcess = 0
    // with {proN(str), priority, curState}
    let cpuQ = []

    // Q would always be same : FIFO
    let ioQ = []

    let dataCPU = []
    let dataIO = []
    // dataProcess is in the end after all computation


    let allProcessData = []
    let processState = []

    for (let p_no = 1; p_no <= totalProcess; ++p_no) {
        allProcessData.push({
            pno: `${p_no}`,
            arrivalTime: arrT[p_no - 1],
            cpuB1rem: cpuB1[p_no - 1],
            ioBrem: iob[p_no - 1],
            cpuB2rem: cpuB2[p_no - 1],
            state: NOT_ARR,
            responsedAt: null,
            cpuUsed: 0,
            ioUsed: 0,
            completedAt: Infinity,
            lastIObN: 0,
            lastCPUbN: 0,
            priority: prt[p_no - 1]
        })
        // processState.push([])
    }

    // console.table(allProcessData)
    // console.log('state: ', processState)

    // console.log(processCurState)

    // initial step
    // let nextRunning = null
    let time = 0;

    const sortCpuQ = (cQ) => {
        const len = cQ.length;
        let runningStateIndex = 0;
        // moving running state to top
        for (let i = 0; i < len; ++i) {
            if (cQ[i].state == RUNNING) {
                [cQ[runningStateIndex], cQ[i]] =
                    [cQ[i], cQ[runningStateIndex]]
                runningStateIndex++;
            }
        }

        if (runningStateIndex > 1) {
            alert('more than one process running')
        }

        // console.log(`runningStateIndex = ${runningStateIndex} len = ${len}`)
        // console.table(cpuQ.slice(runningStateIndex, len))

        // sorting rest [ insertion sort]
        for (let i = runningStateIndex; i < len; ++i) {
            let j = i - 1
            let insertedElem = cQ[i]
            for (; j >= runningStateIndex; --j) {
                if (cQ[j].prt > insertedElem.prt) {
                    cQ[j + 1] = cQ[j]
                } else break;
            }

            cQ[j + 1] = insertedElem
            // console.log(`i = ${i} j = ${j} insertedElem = `, insertedElem)
            // console.table(cpuQ.slice(runningStateIndex, len))
        }
        // console.table(cpuQ)
    }

    for (const proc of allProcessData) {
        if (proc.arrivalTime == time) {
            // assuming first cpu burst is > 0
            let { pno: pno, priority: prt, state: state } = proc
            // console.table(pno, time, state)
            cpuQ.push({ pno, prt, state })
            proc.lastCPUbN++;
        }
    }


    // console.table(cpuQ)
    sortCpuQ(cpuQ)
    // console.table(cpuQ)
    // console.log('--------------------------')

    let cpuQpnoOnly = new Set()
    for (const proc of cpuQ) cpuQpnoOnly.add(proc.pno)

    let isDataCPUinserted = false
    let isDataIOinserted = false


    // for debugging purpose
    let logInNextItr = false

    // console.log(`INIT\n@${time} before comp cpuQ = `)
    // console.table(cpuQ)
    // console.log('allProcessData')
    // console.table(allProcessData)

    // start looping
    while (completedProcess != totalProcess && time < 30) {
        isDataCPUinserted = false
        isDataIOinserted = false

        // console.log(`On entry: time = ${time}`)
        // console.table(cpuQ)

        if (logInNextItr) {
        }

        for (let proc of allProcessData) {
            // check if process in cpuQ

            if (cpuQpnoOnly.has(proc.pno)) {
                // console.log(`>>> process${proc.pno} in cpuQ`)
                // console.log(time, cpuQ[0].pno)
                if (cpuQ[0].pno == proc.pno) {  // Q front
                    proc.state = RUNNING

                    cpuQ[0].state = RUNNING

                    proc.cpuUsed++;
                    if (proc.responsedAt == null)
                        proc.responsedAt = time;

                    dataCPU.push(proc.pno)
                    isDataCPUinserted = true;

                    if (proc.cpuB1rem == 0) proc.cpuB2rem--;
                    else proc.cpuB1rem--;

                } else {
                    proc.state = READY
                }
            }
            // check if procees in ioQ
            else if (ioQ.includes(proc.pno)) {
                // console.log(`>>> process${proc.pno} in ioQ`)

                if (ioQ[0] == proc.pno) { // io Q front
                    proc.state = IO;
                    proc.ioBrem--;
                    proc.ioUsed++

                    dataIO.push(proc.pno)
                    isDataIOinserted = true;

                } else {
                    proc.state = IO_WAIT
                }
            } else {
                // console.log(`>>> process${proc.pno} in NONE!`)
                // console.log("QUEUEs: cpu", cpuQ, "ioQ", ioQ)
            }

            // console.log(`P${proc.pno} ${stateCodeMap[parseInt(proc.state)]} @${time} rem: ${proc.cpuB1rem} ${proc.ioBrem} ${proc.cpuB2rem}`)
        }

        if (!isDataCPUinserted) dataCPU.push(null)
        if (!isDataIOinserted) dataIO.push(null)
        time++;

        // add data for table plotting here
        let addStateData = []
        for (let proc of allProcessData) {
            addStateData.push(stateCodeMap[proc.state])
        }
        processState.push(addStateData)

        logInNextItr = false    // for debugging

        // adding @ arrivalTime
        for (let proc of allProcessData) {
            if (proc.state == NOT_ARR && proc.arrivalTime == time) {
                // assuming first cpu burst is > 0
                let { pno: pno, priority: prt, state: state } = proc
                cpuQ.push({ pno, prt, state })
                cpuQpnoOnly.add(pno)
                proc.lastCPUbN++;
            }
        }

        // queue change/state change
        for (let proc of allProcessData) {

            if (proc.state != DONE) {
                if (proc.state == RUNNING && proc.cpuB1rem == 0 && proc.lastCPUbN == 1) {
                    cpuQ.shift();
                    cpuQpnoOnly.delete(proc.pno)

                    // sortCpuQ(cpuQ)

                    if (proc.ioBrem > 0) {
                        ioQ.push(proc.pno)
                        proc.state = IO_WAIT
                        proc.lastIObN++;
                    }
                    else {
                        proc.state = DONE
                        completedProcess++;
                    }
                    // console.log(`time = ${time}`, cpuQpnoOnly)
                    // console.table(cpuQ)
                } else if (proc.state == IO && proc.ioBrem == 0 && proc.lastIObN == 1) {
                    ioQ.shift(proc.pno)
                    let { pno: pno, priority: prt, state: state } = proc
                    if (time > 0) {
                        cpuQ.push({ pno, prt, state })
                        cpuQpnoOnly.add(pno)
                        proc.state = READY
                        proc.lastCPUbN++;
                    } else {
                        proc.state = DONE
                        completedProcess++;
                    }

                    // console.table(cpuQ)
                }
                else if (proc.state == RUNNING && proc.cpuB2rem == 0 && proc.lastCPUbN == 2) {
                    cpuQ.shift();
                    proc.state = DONE;
                    proc.completedAt = time;
                    cpuQpnoOnly.delete(proc.pno)
                    // console.log(`@${time}`, proc.state, proc.pno)
                    completedProcess++;
                    proc.lastIObN++;
                    logInNextItr = true;

                }




                // checking if any process arrived now

                // sortCpuQ(cpuQ)
            } else {
                // console.log("done", proc)
            }


        }

        sortCpuQ(cpuQ)

    }


    // console.table(processState)
    // making array from this data: 
    let dataProcess = []
    for (let i = 0; i < totalProcess; ++i)    dataProcess.push([])

    processState.forEach((pdata) => {
        dataProcess.forEach((proC, i) => proC.push(pdata[i]))
    })

    // console.table(dataProcess)

    let dataTime = []
    for (let proc of allProcessData) {
        // order: turnaroundTime, responseTime, waitingTime
        dataTime.push([
            proc.completedAt - proc.arrivalTime,
            proc.responsedAt - proc.arrivalTime,
            (proc.completedAt - proc.arrivalTime) - proc.cpuUsed - proc.ioUsed
        ])
    }


    let schedulingPolicy = "PSNP"
    // plotting Gantt charts
    makeGP(schedulingPolicy, dataProcess)
    makeGC(schedulingPolicy, dataCPU)
    makeGI(schedulingPolicy, dataIO)

    // making time-table
    makeTT(schedulingPolicy, dataTime)
}

function PSP(tableData = tableDataObj) {
    let { arrTime: arrT, cpuBurst1: cpuB1, cpuBurst2: cpuB2, IOBurst: iob, priority: prt } = tableData


    let totalProcess = arrT.length
    let completedProcess = 0

    // in this cpuQ is an object
    // with {proN(str), prt}
    let cpuQ = []

    // Q would always be same : FIFO
    let ioQ = []

    let dataCPU = []
    let dataIO = []
    // dataProcess is in the end after all computation


    let allProcessData = []
    let processState = []

    for (let p_no = 1; p_no <= totalProcess; ++p_no) {
        allProcessData.push({
            pno: `${p_no}`,
            arrivalTime: arrT[p_no - 1],
            cpuB1rem: cpuB1[p_no - 1],
            ioBrem: iob[p_no - 1],
            cpuB2rem: cpuB2[p_no - 1],
            state: NOT_ARR,
            responsedAt: null,
            cpuUsed: 0,
            ioUsed: 0,
            completedAt: Infinity,
            lastIObN: 0,
            lastCPUbN: 0,
            priority: prt[p_no - 1]
        })
    }

    // console.table(allProcessData)
    // console.log('state: ', processState)

    // console.log(processCurState)

    // initial step
    let time = 0;

    const sortCpuQ = (cQ) => {
        const len = cQ.length;

        // sorting rest [ insertion sort]
        for (let i = 0; i < len; ++i) {
            let j = i - 1
            let insertedElem = cQ[i]
            for (; j >= 0; --j) {
                if (cQ[j].prt > insertedElem.prt) {
                    cQ[j + 1] = cQ[j]
                } else break;
            }
            cQ[j + 1] = insertedElem
        }
    }

    for (const proc of allProcessData) {
        if (proc.arrivalTime == time) {
            // assuming first cpu burst is > 0
            let { pno: pno, priority: prt } = proc
            cpuQ.push({ pno, prt })
            proc.lastCPUbN++
        }
    }


    // console.table(cpuQ)
    sortCpuQ(cpuQ)
    // console.table(cpuQ)
    // console.log('--------------------------')

    let cpuQpnoOnly = new Set()
    for (const proc of cpuQ) cpuQpnoOnly.add(proc.pno)

    let isDataCPUinserted = false
    let isDataIOinserted = false


    // for debugging purpose
    let logInNextItr = false

    // start looping
    while (completedProcess != totalProcess && time < 40) {
        isDataCPUinserted = false
        isDataIOinserted = false

        // console.log(`On entry: time = ${time} cpuQpnoOnly = {${[...cpuQpnoOnly].join(',')}}`)
        // console.table(cpuQ)

        if (logInNextItr) {
            // console.log('time = ', time, 'cpuQpnoOnly', cpuQpnoOnly)
            // console.table(allProcessData)
        }
        for (let proc of allProcessData) {
            // check if process in cpuQ

            if (cpuQpnoOnly.has(proc.pno)) {
                // console.log(`>>> process${proc.pno} in cpuQ`)
                // console.log(time, cpuQ[0].pno)
                if (cpuQ[0].pno == proc.pno) {  // Q front
                    proc.state = RUNNING
                    proc.cpuUsed++;

                    cpuQ[0].time--;     // remaining time decreased

                    if (proc.responsedAt == null)
                        proc.responsedAt = time;

                    dataCPU.push(proc.pno)
                    isDataCPUinserted = true;

                    if (proc.cpuB1rem == 0) proc.cpuB2rem--;
                    else proc.cpuB1rem--;

                } else {
                    proc.state = READY
                }
            }
            // check if procees in ioQ
            else if (ioQ.includes(proc.pno)) {
                // console.log(`>>> process${proc.pno} in ioQ`)

                if (ioQ[0] == proc.pno) { // io Q front
                    proc.state = IO;
                    proc.ioBrem--;
                    proc.ioUsed++

                    dataIO.push(proc.pno)
                    isDataIOinserted = true;

                } else {
                    proc.state = IO_WAIT
                }
            } else {
                // console.log(`>>> process${proc.pno} in NONE!`)
                // console.log("QUEUEs: cpu", cpuQ, "ioQ", ioQ)
            }

            // console.log(`P${proc.pno} ${stateCodeMap[parseInt(proc.state)]} @${time} rem: ${proc.cpuB1rem} ${proc.ioBrem} ${proc.cpuB2rem}`)
        }

        if (!isDataCPUinserted) dataCPU.push(null)
        if (!isDataIOinserted) dataIO.push(null)
        time++;

        // add data for table plotting here
        let addStateData = []
        for (let proc of allProcessData) {
            addStateData.push(stateCodeMap[proc.state])
        }

        // addStateData.push(cpuQ.toString())
        // addStateData.push(ioQ.toString())

        processState.push(addStateData)
        // console.log(`time: ${time}`, addStateData.map(x => x))


        // adding @arrtime
        for (let proc of allProcessData) {
            // checking if any process arrived now
            if (proc.state == NOT_ARR && proc.arrivalTime == time) {
                // assuming first cpu burst is > 0
                let { pno: pno, priority: prt } = proc
                cpuQ.push({ pno, prt })
                cpuQpnoOnly.add(proc.pno)
                proc.lastCPUbN++
            }
        }

        // for next execution/iteration
        logInNextItr = false    // for debugging
        for (let proc of allProcessData) {

            if (proc.state != DONE) {
                if (proc.state == RUNNING && proc.cpuB1rem == 0 && proc.lastCPUbN == 1) {
                    cpuQ.shift();
                    cpuQpnoOnly.delete(proc.pno)


                    if (proc.ioBrem > 0) {
                        ioQ.push(proc.pno)
                        proc.state = IO_WAIT
                        proc.lastIObN++;
                    }
                    else {
                        proc.state = DONE
                        completedProcess++;
                    }
                    // console.log(`time = ${time}`, cpuQpnoOnly)
                    // console.table(cpuQ)
                } else if (proc.state == IO && proc.ioBrem == 0 && proc.lastIObN == 1) {
                    ioQ.shift(proc.pno)
                    let { pno: pno, priority: prt } = proc
                    if (time > 0) {
                        cpuQ.push({ pno, prt })
                        cpuQpnoOnly.add(pno)
                        proc.state = READY
                        proc.lastCPUbN++;
                    } else {
                        proc.state = DONE
                        completedProcess++;
                    }

                    // console.table(cpuQ)
                }
                else if (proc.state == RUNNING && proc.cpuB2rem == 0 && proc.lastCPUbN == 2) {
                    cpuQ.shift();
                    proc.state = DONE;
                    proc.completedAt = time;
                    cpuQpnoOnly.delete(proc.pno)
                    // console.log(`@${time}`, proc.state, proc.pno)
                    completedProcess++;
                    proc.lastIObN++;
                }



            } else {
                // console.log("done", proc)
            }


        }

        sortCpuQ(cpuQ)

    }


    // console.table(processState)
    // making array from this data: 
    let dataProcess = []
    for (let i = 0; i < totalProcess; ++i)    dataProcess.push([])

    processState.forEach((pdata) => {
        dataProcess.forEach((proC, i) => proC.push(pdata[i]))
    })

    // console.table(dataProcess)

    let dataTime = []
    for (let proc of allProcessData) {
        // order: turnaroundTime, responseTime, waitingTime
        dataTime.push([
            proc.completedAt - proc.arrivalTime,
            proc.responsedAt - proc.arrivalTime,
            (proc.completedAt - proc.arrivalTime) - proc.cpuUsed - proc.ioUsed
        ])
    }


    let schedulingPolicy = "PSP"
    // plotting Gantt charts
    makeGP(schedulingPolicy, dataProcess)
    makeGC(schedulingPolicy, dataCPU)
    makeGI(schedulingPolicy, dataIO)

    // making time-table
    makeTT(schedulingPolicy, dataTime)
}

function RR(tableData = tableDataObj) {
    let { arrTime: arrT, cpuBurst1: cpuB1, cpuBurst2: cpuB2, IOBurst: iob } = tableData


    let totalProcess = arrT.length
    let completedProcess = 0
    let cpuQ = []
    let ioQ = []

    let dataCPU = []
    let dataIO = []
    // dataProcess is in the end after all computation


    let allProcessData = []
    let processState = []

    for (let p_no = 1; p_no <= totalProcess; ++p_no) {
        allProcessData.push({
            pno: `${p_no}`,
            arrivalTime: arrT[p_no - 1],
            cpuB1rem: cpuB1[p_no - 1],
            ioBrem: iob[p_no - 1],
            cpuB2rem: cpuB2[p_no - 1],
            state: NOT_ARR,
            responsedAt: null,
            cpuUsed: 0,
            ioUsed: 0,
            completedAt: Infinity,
            lastIObN: 0,
            lastCPUbN: 0
        })
        // processState.push([])
    }

    // console.table(allProcessData)
    // console.log('state: ', processState)

    // console.log(processCurState)

    // initial step
    // let nextRunning = null
    let time = 0;



    for (const proc of allProcessData) {
        if (proc.arrivalTime == time) {
            // assuming first cpu burst is > 0
            proc.lastCPUbN++;
            cpuQ.push(proc.pno)
        }
    }

    // console.table(cpuQ)


    let isDataCPUinserted = false
    let isDataIOinserted = false
    // start looping
    while (completedProcess != totalProcess && time < 40) {
        isDataCPUinserted = false
        isDataIOinserted = false

        console.log(`entry: @${time} cpuQ = `, JSON.stringify(cpuQ),
            "ioQ = ", JSON.stringify(ioQ))
        for (let proc of allProcessData) {
            // check if process in cpuQ
            if (cpuQ.includes(proc.pno)) {
                // console.log(`>>> process${proc.pno} in cpuQ`)
                if (cpuQ[0] == proc.pno) {  // Q front
                    proc.state = RUNNING

                    proc.cpuUsed++;
                    if (proc.responsedAt == null)
                        proc.responsedAt = time;

                    dataCPU.push(proc.pno)
                    isDataCPUinserted = true;

                    if (proc.cpuB1rem == 0) proc.cpuB2rem--;
                    else proc.cpuB1rem--;

                } else {
                    proc.state = READY
                }
            }
            // check if procees in ioQ
            else if (ioQ.includes(proc.pno)) {
                // console.log(`>>> process${proc.pno} in ioQ`)

                if (ioQ[0] == proc.pno) { // io Q front
                    proc.state = IO;
                    proc.ioBrem--;
                    proc.ioUsed++

                    dataIO.push(proc.pno)
                    isDataIOinserted = true;

                } else {
                    proc.state = IO_WAIT
                }
            } else {
                // console.log(`>>> process${proc.pno} in NONE!`)
                // console.log("QUEUEs: cpu", cpuQ, "ioQ", ioQ)
            }

            // console.log(`P${proc.pno} ${stateCodeMap[parseInt(proc.state)]} @${time} rem: ${proc.cpuB1rem} ${proc.ioBrem} ${proc.cpuB2rem}`)
        }

        if (!isDataCPUinserted) dataCPU.push(null)
        if (!isDataIOinserted) dataIO.push(null)
        time++;

        // add data for table plotting here
        let addStateData = []
        for (let proc of allProcessData) {
            addStateData.push(stateCodeMap[proc.state])
        }


        processState.push(addStateData)


        for (let proc of allProcessData) {
            if (proc.state == NOT_ARR && proc.arrivalTime == time) {
                // assuming first cpu burst is > 0
                proc.lastCPUbN++
                cpuQ.push(proc.pno)
            }
        }

        if (ioQ.length != 0) {
            let frontProIO = ioQ[0]

            let proc = allProcessData[parseInt(frontProIO) - 1]

            if (time > 16) {
                console.log(`\t>> p${proc.pno} [${proc.state}] {${proc.ioBrem}} < ${proc.lastIObN}> (${proc.cpuB2rem})`);
            }
            if (proc.state == IO) {
                if (proc.lastIObN == 1 && proc.ioBrem == 0) {
                    ioQ.shift()
                    console.log(`\t\t HERE ${proc.cpuB2rem}`)
                    if (proc.cpuB2rem > 0) {
                        cpuQ.push(proc.pno)
                        console.log(`\t\t\t! ${proc.pno} cpuQ : ${JSON.stringify(cpuQ)}`)
                        proc.lastCPUbN++
                        proc.state = READY
                    } else {
                        completedProcess++
                        proc.completedAt = time
                        proc.state = DONE
                    }
                } else {
                    // nothing
                }
            }
        }

        if (cpuQ.length != 0) {
            let frontPro = cpuQ.shift();

            let proc = allProcessData[parseInt(frontPro) - 1]
            // console.log(proc.pno, typeof (proc.pno))
            if (time > 16 && ioQ.length > 0) {
                console.log("\tCPUQ: ", `proc.no = ${proc.pno} < ${proc.lastCPUbN}>`)
            }

            if (proc.state == RUNNING) {// to check when it entered(READY) if added by above if(ioQ.len...)
                if (proc.lastCPUbN == 1 && proc.cpuB1rem == 0) {
                    if (proc.ioBrem > 0) {
                        ioQ.push(proc.pno)
                        proc.lastIObN++
                        proc.state = IO_WAIT
                    } else {
                        proc.state = DONE
                        completedProcess++
                        proc.completedAt = time
                    }
                } else if (proc.cpuB1rem > 0) {
                    cpuQ.push(proc.pno)
                    proc.state = READY
                }
                else if (proc.cpuB2rem == 0) {
                    proc.state = DONE
                    completedProcess++
                    proc.completedAt = time
                } else if (proc.cpuB2rem > 0) {
                    cpuQ.push(proc.pno)
                    proc.state = READY
                }

                // console.log(proc.state, allProcessData[parseInt(frontPro) - 1].state)
            } else {
                cpuQ.push(proc.pno)
                proc.state = READY
            }
            // if(allProcessData[] frontPro)
        }


    }


    // console.table(processState)
    // making array from this data: 
    let dataProcess = []
    for (let i = 0; i < totalProcess; ++i)    dataProcess.push([])

    processState.forEach((pdata) => {
        dataProcess.forEach((proC, i) => proC.push(pdata[i]))
    })

    // console.table(dataProcess)

    let dataTime = []
    for (let proc of allProcessData) {
        // order: turnaroundTime, responseTime, waitingTime
        dataTime.push([
            proc.completedAt - proc.arrivalTime,
            proc.responsedAt - proc.arrivalTime,
            (proc.completedAt - proc.arrivalTime) - proc.cpuUsed - proc.ioUsed
        ])
    }

    // plotting Gantt charts
    makeGP("RR", dataProcess)
    makeGC("RR", dataCPU)
    makeGI("RR", dataIO)

    // making time-table
    makeTT("RR", dataTime)
}


function schedule() {
    // FCFS()
    // SJF()
    // SRTF()
    // PSNP()
    // PSP()
    RR()
}
// create input table : add/del rows

function newAddDelDiv() {
    let newDiv = document.createElement('div')
    let addB = document.createElement('button')
    let delB = document.createElement('button')
    addB.textContent = "add↓"
    delB.textContent = "del"
    addB.className = "add"
    delB.className = 'del'

    addB.onclick = () => addRowInInputTable(addB);
    delB.onclick = () => delRowFromInputTable(delB);

    newDiv.appendChild(addB)
    newDiv.appendChild(delB)

    return newDiv
}

function addRowInInputTable(btn) {
    let thisRow = btn.parentElement.parentElement.parentElement
    let tBodyOrHead = thisRow.parentElement


    let row = document.createElement('tr')

    let cols = []
    cols.push(document.createElement('td')) // process column
    while (cols.length < noOfCols) {
        let td = document.createElement('td')
        td.contentEditable = true;
        cols.push(td)
    }
    cols.push(document.createElement('td')) // button column
    cols[cols.length - 1].appendChild(newAddDelDiv())
    cols.map((col) => { row.appendChild(col) })

    // append to table
    if (tBodyOrHead.tagName == "THEAD") {
        if (inputTableRows.childElementCount == 0) inputTableRows.appendChild(row)
        else inputTableRows.insertBefore(row, inputTableRows.firstChild)
    } else {
        if (thisRow.nextSibling == null) inputTableRows.appendChild(row)
        else inputTableRows.insertBefore(row, thisRow.nextSibling)
    }

    reNumberProcess()
}

function delRowFromInputTable(btn) {
    let row = btn.parentElement.parentElement.parentElement
    row.remove();
    reNumberProcess()
}

function reNumberProcess() {
    Array.from(inputTableRows.children).forEach((row, pno) =>
        row.querySelector("td").textContent = `P${pno + 1}`
    )
}


// END INPUT table handling


// Extract Data from Input table

function extractInputData() {
    const isNormalInteger = s => /^\+?(0|[1-9]\d*)$/.test(s);

    innerData = Array.from(inputTableRows.children).map((row) => {
        let rowData = Array.from(row.children).map((elem) => elem.innerHTML).slice(1, noOfCols)

        let numRowData = rowData.map((str) => {
            let innerStrData = str.trim()
            let innerInt = -1;
            if (isNormalInteger(innerStrData)) innerInt = parseInt(innerStrData)
            return innerInt

        })
        return numRowData;
    })

    dataToObject()
}

// change data to Object
// get columns data/ property data
// for row wise/ process: array (innerData) is enough
function dataToObject() {
    let nRows = innerData.length;

    let arrT = []
    let cpuB1 = []
    let IOB = []
    let cpuB2 = []
    let prt = []

    for (let i = 0; i < nRows; i++) {
        arrT.push(innerData[i][0])
        cpuB1.push(innerData[i][1])
        IOB.push(innerData[i][2])
        cpuB2.push(innerData[i][3])
        prt.push(innerData[i][4])
    }

    tableDataObj = {
        arrTime: arrT,
        cpuBurst1: cpuB1,
        IOBurst: IOB,
        cpuBurst2: cpuB2,
        priority: prt
    }
}


function loadDataFromJSON() {
    fetch("ques2.json")
        .then(response => response.json())
        .then(json => {
            innerData = []
            json.forEach(row => innerData.push(row))
            updateInputTable()
        });
}

function updateInputTable(dataInput = innerData) {
    // clearing first
    inputTableRows.textContent = ''

    // this is indepent
    // does not depent upon addRowInInputTable, delRowFromInputTable,
    // reNumberProcess (renumbering would make it O(n^2) )
    // HOWEVER, it uses newAddDelDiv
    dataInput.forEach((row, pno) => {
        let rowElem = document.createElement('tr')

        let procElem = document.createElement('td')
        procElem.textContent = `P${pno + 1}`

        let cols = [procElem]
        for (let col = 1; col < noOfCols; ++col) {
            cols.push(document.createElement('td'))
            if (col - 1 < row.length)
                cols[col].textContent = row[col - 1]
            else cols[col].textContent = '-'
            cols[col].contentEditable = true
        }
        let btnCol = document.createElement('td')
        btnCol.appendChild(newAddDelDiv())
        cols.push(btnCol)
        cols.forEach(col => {
            // console.log(col)
            rowElem.appendChild(col)
        })
        inputTableRows.appendChild(rowElem)
    })
}