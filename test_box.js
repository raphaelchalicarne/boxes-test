/*
According to the debugging, my results seem acceptable.
However, there might be a syntax error that I missed for the requested output
and I can't see the instructions again so I'm stuck
*/

function rec(clawPos, boxes, boxInClaw, ideal_nb_box_per_pos, instructions) {
    var all_pos_have_same_nb_boxes = are_boxes_equal(boxes, ideal_nb_box_per_pos);
    if (!all_pos_have_same_nb_boxes) {
        // Actions
        if (boxInClaw) {
            if (boxes[clawPos] < ideal_nb_box_per_pos) {
                // PLACE
                instructions += '|PLACE';
                boxInClaw = false;
                boxes[clawPos] += 1;
            } else {
                // Move to place a box
                var placeDirection = moveToPlace(clawPos, boxes, ideal_nb_box_per_pos, instructions);
                instructions += placeDirection;
                clawPos = (placeDirection == '|RIGHT') ? clawPos + 1 : clawPos - 1;
            }
        } else { //No box in claw
            if (boxes[clawPos] > ideal_nb_box_per_pos) {
                // PICK
                instructions += '|PICK';
                boxInClaw = true;
                boxes[clawPos] -= 1;
            } else {
                // Move to pick a box
                var pickDirection = moveToPick(clawPos, boxes, ideal_nb_box_per_pos, instructions);
                instructions += pickDirection;
                clawPos = (pickDirection == '|RIGHT') ? clawPos + 1 : clawPos - 1;
            }
        }
        instructions = rec(clawPos, boxes, boxInClaw, ideal_nb_box_per_pos, instructions);
    }
    return instructions;
}

function are_boxes_equal(boxes, ideal_nb_box_per_pos) {
    var all_pos_have_same_nb_boxes = true;
    var n = boxes.length;
    for (let i=0; i<n; i++) {
        if (boxes[i] != ideal_nb_box_per_pos) {
            all_pos_have_same_nb_boxes = false;
        }
    }
    return all_pos_have_same_nb_boxes;
}

function moveToPick(clawPos, boxes, ideal_nb_box_per_pos, instructions) {
    // We suppose that we have no box in the claw
    var n = boxes.length;
    // The arm will try to go to the right by default.
    var pos_to_pick = n;
    for (let i=0; i<n; i++) {
        if (boxes[i] > ideal_nb_box_per_pos) {
            pos_to_pick = i;
        }
    }
    var direction = (pos_to_pick > clawPos) ? '|RIGHT' : '|LEFT';
    return direction;
}

function moveToPlace(clawPos, boxes, ideal_nb_box_per_pos, instructions) {
    // We suppose that we have a box in the claw
    var n = boxes.length;
    // The arm will try to go to the right by default.
    var pos_to_place = n;
    for (let i=0; i<n; i++) {
        if (boxes[i] < ideal_nb_box_per_pos) {
            pos_to_place = i;
        }
    }
    var direction = (pos_to_place > clawPos) ? '|RIGHT' : '|LEFT';
    return direction;
}


function solve(clawPos, boxes, boxInClaw) {
    // Write your code here
    // To debug: console.error('Debug messages...');

    // Initialisation
    var sum_boxes = boxes.reduce((somme, nb_box_in_cell) => somme + nb_box_in_cell);
    if (boxInClaw) {
        sum_boxes += 1;
    }
    var ideal_nb_box_per_pos = sum_boxes/boxes.length;
    var instructions = '';

    console.error("Initial boxes", boxes);

    instructions = rec(clawPos, boxes, boxInClaw, ideal_nb_box_per_pos, instructions);
    instructions = instructions.slice(1);

    console.error("clawPos", clawPos);
    console.error("Boxes", boxes);
    console.error("boxInClaw", boxInClaw);
    return instructions;
}

/* Ignore and do not change the code below */
// #region main

// game loop
while (true) {
    const clawPos = parseInt(readline());
    const boxInClaw = readline() !== '0';
    const stacks = parseInt(readline());
    const boxes = readline().split(' ').map(j => parseInt(j)).slice(0, stacks);
    const oldWrite = process.stdout.write;
    process.stdout.write = chunk => console.error(chunk);
    var action = solve(clawPos, boxes, boxInClaw);
    process.stdout.write = oldWrite;
    console.log(action);
}
// #endregion

